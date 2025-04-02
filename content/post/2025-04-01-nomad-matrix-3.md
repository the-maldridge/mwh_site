---
title: "Building a Nomad Cluster: Traffic Ingress"
date: 2025-04-01T18:10:55-05:00
---

In the last post I showed how my cluster is maintained day to day and
using various industry standard tools.  This is a fairly robust
process as I build out the cluster, but just having a cluster isn't
particularly useful.  To build upon this we need to put up a means for
outside network traffic to come into the cluster and become inside
network traffic.  This traffic might be HTTP destined for a service,
TCP as a lower level application protocol, or some kind of UDP ingress
to a specialized application.

There are three key themes that we'll go through in this post to
manage this traffic ingress. First we'll look at the architectural
considerations for bringing external traffic into the cluster, then
we'll look at the mechanics of directing that traffic inwards, and
finally we'll look at the security of the traffic, managing encryption
and security keys, and making sure that these systems are just as
robust and reliable as the underlying cluster.

## Designing Traffic Ingress

Managing traffic ingress to the cluster requires two main choices to
be made.  The first is how will the layer 3 IP traffic reach the
cluster, and the second is how will that traffic then be directed
within the cluster to reach a service that will then be Nomad-aware.

Getting the traffic into the cluster as base layer-3 IP traffic is
fairly conventional networking.  The cluster has a router that defines
the edge of its network, and this router maintains BGP peerings with
the rest of my network.  From there, the traffic needs to be routed to
at least one machine that will be running software to make a
protocol-level decision about what application in Nomad is going to
actually service the request.  In an ideal world, this would be
managed using a BGP Anycast service IP so that wherever the
Nomad-aware layer is running the service IP is present and the network
would just transparently send data where it needs to go.

If my cluster was also Consul enabled, I could use GoCast to make
these service IPs show up anywhere that a service is running.  As it
sits right now, GoCast doesn't know how to use Nomad's services, but I
may contribute this support as I get time available.  The other way I
could provide this service would be to just use a Nomad group
containing two tasks to move a conventional GoBGP instance around to
announce the service IP rather than running the BGP daemon on every
host.  If you take one thing away from this entire post, its that
learning how BGP works is a really useful skill, and once you
understand it lots of new capability opens up.

In my case, because the cluster is reasonably small, and because
there's not a huge amount of dynamic machine life cycling going on, I
can use DNS to steer most traffic directly to a nominated machine that
will then host the Nomad aware proxy.

## Directing Traffic inside of Nomad

Moving traffic around inside of Nomad is the next phase once data
arrives to a physical client node.  This can be accomplished in many
ways.  In Void Linux, for example, there are NGINX servers that use
templated config files to manage ingress and direction.  This works
extremely well, since Void's entire service portfolio is comprised of
HTTP processes.  For the Nomad clusters that run my home network, I
make use of CNI to provision `macvlan` adapters to directly make each
Nomad group visible to the network in the correct VLAN.  This solution
works well for my home because I usually want to manage my inbound
firewalls based on origin VLAN, not necessarily a particular service
destination.

For this cluster I want to run something different not only to improve
my own knowledge, but to show a slightly more all-in-one approach.
When I first started using Nomad in 2016, the two front-runner proxies
were `fabio` and a new player to the market called Traefik.  Time has
shown that Traefik is a capable and sophisticated reverse proxy
solution, and I've recently learned that it is capable of far more
than just HTTP proxying now.  Given this advanced new feature-set, it
made sense for me to run this proxy with Traefik.  Also since I last
used it, Traefik is now natively aware of Nomad's built-in service
catalog, so this felt like a good choice given my goal of keeping this
cluster mostly self contained.

To configure Traefik to talk to Nomad, I needed to provision a policy
that allows it to read the service catalog.  This policy is, as you
might imagine, very short:

```hcl
namespace "*" {
  capabilities = ["list-jobs"]
}
```

This policy is attached to the proxy job in Nomad, so that it claims
these capabilities, but they are not otherwise broadly available.

Lets look now at the Nomad job file for Traefik, and see how it is
configured:

```hcl
job "proxy" {
  name        = "proxy"
  datacenters = ["MATRIX-CONTROL"]
  type        = "system"

  group "traefik" {
    network {
      mode = "bridge"
      port "http" { static = 80 }
      port "https" { static = 443 }
      port "metrics" { static = 8080 }
    }

    service {
      port     = "http"
      provider = "nomad"
      tags = [
        "traefik.http.routers.dashboard.rule=Host(`proxy.matrix.michaelwashere.net`)",
        "traefik.http.routers.dashboard.service=api@internal",
      ]
    }

    task "traefik" {
      driver = "docker"

      identity {
        env         = true
        change_mode = "restart"
      }

      config {
        image = "traefik:v3.3.4"

        args = [
          "--accesslog=false",
          "--api.dashboard",
          "--entrypoints.http.address=:80",
          "--entrypoints.https.address=:443",
          "--entryPoints.https.http.tls.certResolver=default",
          "--entryPoints.https.asDefault=true",
          "--entryPoints.http.http.redirections.entryPoint.to=https",
          "--entryPoints.http.http.redirections.entryPoint.scheme=https",
          "--metrics.prometheus",
          "--ping=true",
          "--providers.nomad.refreshInterval=30s",
          "--providers.nomad.endpoint.address=unix://${NOMAD_SECRETS_DIR}/api.sock",
          "--providers.nomad.defaultRule=Host(`{{ .Name }}.matrix.michaelwashere.net`)",
          "--providers.file.filename=/local/config.yaml",
        ]
      }

      template {
        data = yamlencode({
          tls = {
            stores = {
              default = {
                defaultCertificate = {
                  certFile = "/secrets/cert.pem"
                  keyFile = "/secrets/cert.key"
                }
              }
            }
          }
          http = {
            services = {
              nomad = {
                loadBalancer = {
                  servers = [
                    { url = "http://172.26.64.1:4646" },
                  ]
                }
              }
            }
            routers = {
              nomad = {
                rule    = "Host(`nomad.matrix.michaelwashere.net`)"
                service = "nomad"
              }
            }
          }
        })
        destination = "local/config.yaml"
      }

      template {
        data = <<EOT
{{- with nomadVar "nomad/jobs/proxy" -}}
{{ .certificate }}
{{- end }}
EOT
        destination = "secrets/cert.pem"
      }

      template {
        data = <<EOT
{{- with nomadVar "nomad/jobs/proxy" -}}
{{ .key }}
{{- end }}
EOT
        destination = "secrets/cert.key"
      }
    }
  }
}
```

Traefik has two kinds of configuration.  You can learn more in general
about its configuration in the [Traefik
Documentation](https://doc.traefik.io/traefik/) but for our purposes,
there are static configuration values, and dynamic configuration
values.  Static configuration files are handled either by a static
config file, or in this case by command line arguments.  Changing
these values requires restarting Traefik is by default a disruptive
operation, though there are ways of mitigating this disruption.

Dynamic configuration is handled by what Traefik refers to as
"providers".  To make the configuration for the cluster work, I've
enabled the `nomad` provider and the `file` provider.  The Nomad
provider's requirement is self explanatory, we want to pull services
from Nomad.  The file provider is needed to add some configuration
data as well as a static load balancer entry for Nomad itself, as
Traefik doesn't support proxying directly to the Nomad Unix socket (or
any Unix socket for that matter).

The identity required to access the Nomad API is provided in an
environment token:

```hcl
identity {
  env         = true
  change_mode = "restart"
}
```

This is an ephemeral service identity that is managed automatically.
The task has to be restarted when it changes because the value is
being fetched from the environment.  Its possible to pick this value
up from a file, but the restart is extremely fast, and for my purposes
the time taken to restart the proxy is acceptable.

Enabling the Nomad provider is very straightforward with Traefik, all
that's necessary is to tell it how frequently to check for changes in
the catalog, where to check those changes from, and though not
required I also like to set a default rule because all of my services
follow a common DNS naming convention for their access routes.

```
args = [
  [...]
  "--providers.nomad.refreshInterval=30s",
  "--providers.nomad.endpoint.address=unix://${NOMAD_SECRETS_DIR}/api.sock",
  "--providers.nomad.defaultRule=Host(`{{ .Name }}.matrix.michaelwashere.net`)",
]
```

The path at `${NOMAD_SECRETS_DIR}/api.sock` is extremely useful, and
allows you to access the Nomad API from tasks that don't otherwise
have any network connectivity.  As you can see, I also have a rule
that uses the service name to provide a service URL underneath the
main `matrix.michaelwashere.net` namespace.

The file provider is also interesting, though for a different reason.
The HCL2 configuration language that Nomad uses for its job
specifications is capable of expressing many different complex formats
by shoving them inside a Heredoc, though this has limitations.  In
most editors, heredocs are opaque strings that don't get nice features
like automatic indentation or syntax highlighting.  They also just do
not look that nice in my opinion.  To solve this, I use one of the
really cool features of HCL2 where I can author the config as an HCL2
object, and then have it render out as a format that Traefik
understands, in this case yaml.

This template:

```hcl
      template {
        data = yamlencode({
          tls = {
            stores = {
              default = {
                defaultCertificate = {
                  certFile = "/secrets/cert.pem"
                  keyFile = "/secrets/cert.key"
                }
              }
            }
          }
          http = {
            services = {
              nomad = {
                loadBalancer = {
                  servers = [
                    { url = "http://172.26.64.1:4646" },
                  ]
                }
              }
            }
            routers = {
              nomad = {
                rule    = "Host(`nomad.matrix.michaelwashere.net`)"
                service = "nomad"
              }
            }
          }
        })
        destination = "local/config.yaml"
      }
```

Becomes this yaml structure:

```yaml
"http":
  "routers":
    "nomad":
      "rule": "Host(`nomad.matrix.michaelwashere.net`)"
      "service": "nomad"
  "services":
    "nomad":
      "loadBalancer":
        "servers":
        - "url": "http://172.26.64.1:4646"
"tls":
  "stores":
    "default":
      "defaultCertificate":
        "certFile": "/secrets/cert.pem"
        "keyFile": "/secrets/cert.key"
```

This file looks a little funky because everything is quoted.  This is
an artifact of the machine generated nature of this file, but all the
contents are just fine.  The file sets up the default certificate
since we don't want Traefik trying to issue certs on its own, and sets
up a service with corresponding route for Nomad.  There may be a way
to setup this service using a purely tag-based approach and shimming
it in, but this approach also works well.

Adding services to Traefik is trivial with Nomad service
registrations, here's an example of a complete registration from
another service:

```hcl
service {
  name     = "registry"
  port     = "http"
  provider = "nomad"
  tags     = ["traefik.enable=true"]
}
```

The name is pulled from the service block, so this will be resolvable
as `registry.matrix.michaelwashere.net`, and the service is made
active by adding the `traefik.enable=true` tag to it.

Now that we have traffic making it to Traefik and then being
dispatched to other points in the cluster, lets make this a secure
connection back to the browser by issuing the certificate that's
referenced above.

## Managing LetsEncrypt Certificates with Nomad and Terraform

The last part of this entire process is perhaps the most interesting.
To securely manage flows between a browser and services hosted on the
cluster, I need to have access to a TLS certificate that has a
wildcard for `*.matrix.michaelwashere.net`.  There are many ways to
get this certificate.  I could use Lego, and shell scripts, I could
use certbot and then some custom logic to escrow the data into the
Nomad variables, or I could write some fully custom code to handle
this.  My goal though is to not introduce more tools to the system if
they are not absolutely required, so I elected to go with Terraform.

My entire Terraform configuration to retrieve the certificates and
escrow them into the Nomad variables looks like this:

```hcl
terraform {
  required_providers {
    acme = {
      source  = "vancluever/acme"
      version = "2.31.0"
    }
    nomad = {
      source  = "hashicorp/nomad"
      version = "2.4.0"
    }
  }

  backend "http" {
    address        = "http://terrastate.matrix.michaelwashere.net/state/tls/main"
    lock_address   = "http://terrastate.matrix.michaelwashere.net/state/tls/main"
    unlock_address = "http://terrastate.matrix.michaelwashere.net/state/tls/main"
  }
}

provider "acme" {
  server_url = "https://acme-v02.api.letsencrypt.org/directory"
}

provider "nomad" {}

resource "acme_registration" "reg" {
  email_address = "maldridge@michaelwashere.net"
}

resource "acme_certificate" "cert" {
  account_key_pem           = acme_registration.reg.account_key_pem
  pre_check_delay           = 30
  common_name               = "matrix.michaelwashere.net"
  subject_alternative_names = ["*.matrix.michaelwashere.net"]

  dns_challenge {
    provider = "namecheap"
  }

  recursive_nameservers = ["1.1.1.1"]
}

resource "nomad_variable" "tls" {
  for_each = {
    "nomad/jobs/proxy" = "default"
  }

  path      = each.key
  namespace = each.value

  items = {
    certificate = "${acme_certificate.cert.certificate_pem}${acme_certificate.cert.issuer_pem}"
    key         = acme_certificate.cert.private_key_pem
  }
}
```

I have to give a huge shout-out to [Chris
Marchesi](https://www.vancluevertech.com/) who maintains the Terraform
ACME provider that makes this possible.  This provider is a layer of
Terraform API on top of the popular Lego ACME client, and so anything
that Lego can do Terraform can do using this provider.

This enables me to fetch a certificate, provision it into the Nomad
variables (which in turn restart any services consuming them) and
deprovision challenge records all from a single tool.  Terraform
requires state storage, and this is escrowed to the
[TerraState](https://github.com/the-maldridge/terrastate) instance
that's running on the Nomad server.

One of the benefits of using Terraform for this application, beyond
that it meant I didn't need to introduce yet another tool, is that I
was able to test and validate the configuration worked before running
it autonomously as a Nomad job.  For day to day maintenance, a
batch/periodic job spins up weekly to evaluate if the certificate
needs a reload:

```hcl
job "cert-renew" {
  datacenters = ["MATRIX-CONTROL", "MATRIX"]
  type = "batch"

  periodic {
    crons = ["@weekly"]
  }

  group "terraform" {
    count = 1

    network { mode = "bridge" }

    task "terraform" {
      driver = "docker"

      config {
        image = "registry.matrix.michaelwashere.net:5000/terraform/tls:e744e60"
      }

      identity { env = true }

      env {
        TF_HTTP_USERNAME="_terraform"
        NOMAD_ADDR="unix://${NOMAD_SECRETS_DIR}/api.sock"
      }

      template {
        data = <<EOT
{{ with nomadVar "nomad/jobs/cert-renew" }}
TF_HTTP_PASSWORD="{{ .terraform_password }}"
NAMECHEAP_API_USER="{{ .namecheap_api_user }}"
NAMECHEAP_API_KEY="{{ .namecheap_api_key }}"
{{ end }}
EOT
        destination = "${NOMAD_SECRETS_DIR}/env"
        env = true
      }
    }
  }
}
```

This job can run anywhere in the cluster and maintains no local state.
It also consumes no resources when its not actively renewing a
certificate, which is very nice from a resource management
perspective.

## Wrapping Up

This post covered a single specific aspect of the cluster: routing
traffic from outside the cluster to inside the cluster.  As you can
see its not terribly complicated, but its important to think through
the choices made to ingress traffic, how to engineer the actual
network flows, and how to maintain a secure path along the way.
Remember that this is the solution that works for my cluster, and you
might have different workflows that you need to support, or different
limitations that will inform your technology choices.  I've used the
Terraform certificate workflow elsewhere with very large counts of
certificates, but past a certain point renewals do become a problem
with this approach.  Perhaps the biggest improvement I can make to
this approach is to use BGP to make the Traefik tasks more portable to
other nodes in my cluster, something that if implemented I'll detail
in a future post.
