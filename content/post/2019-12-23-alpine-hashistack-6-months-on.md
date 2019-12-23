---
title: "Alpine Hashistack 6 Months On"
date: 2019-12-23T13:15:02-08:00
---

Just over 8 months ago I wrote about running the complete HashiCorp
stack on top of Alpine Linux.  Since then, the entire production
workload of my work has moved over to this cluster, and through a
handful of upgrades we've learned a lot about how it works and how to
maintain it.  This article is a followup to the original, which if you
haven't read, you should take a break and do so.  The original article
is [here](/post/2019-04-06-hashicorp-on-alpine/).

Some things have changed dramatically in my cluster architecture since
then.  The most notable is that I now run `unbound` on every machine
in the fleet to provide better resiliancy in the case of a failure of
any one DNS server.  Another major change was to ditch packer for a
lot of docker containers and use it only for VM builds.  Its better
suited to this, and it allowed us to use more specialized tooling in
both places for cleaner results.

Some things have not changed in the last 8 months.  We still run with
a dedicated pool of colocated servers.  We also take the hard stance
that anything running will run in Nomad, not on the metal.  Most
importantly, we still run Alpine Linux as our preferred operating
system.

## Upgrades People, Upgrades!

The biggest challenge myself and my team learned this year was the
overhead and how to upgrade the cluster without downtime.  We learned
this the hard way.

HashiCorp releases new builds regularly enough that we had to spend
some serious time polishing this process and ensuring it was as smooth
as possible.  Part of this meant using actual Alpine APK's for Nomad,
Consul, and Vault as this made distribution much easier.  It also
makes upgrades on our long lived master servers easier.  Since
HashiCorp doesn't ship fully static binaries, we also invested time in
setting up more advanced tooling to build the static musl binaries
internally.  This tooling made it much easier to do upgrades, but
still not foolproof.

To make upgrades safer, we needed to pool machines and scale them more
cleanly and with less human oversight (as it turns out, humans like to
"fix" problems during rollouts).

Using AWS ASG's to contain the actual nomad clients makes it easier to
scale them and dynamically replace machines, but also makes it harder
to reason about the state of machines that may have been spun up
dynamically to replace lost capacity.  The biggest draw to using an
ASG for upgrade safety is the ability to scale it up, deploy a new
version of all the workers, and then scale it back down after removing
the old machines.  This enables an upgrade to happen at a slower pace
that is set by the rate at which applications in the cluster are
upgraded, rather than causing a lot of churn during a machine
replacement.  We still need a drain pass over machines that are
terminating to cleanly remove system jobs, but this is largely
unavoidable.

## Pull, Don't Push

For most machines now we pull the configuration rather than pushing
it.  Since we still use Ansible this makes it easier to ignore scaling
limits, since new machines just copy down a tarball of all the base
configuration they need during startup.

Pulling config also helps push closer to the world of immutable
infrastructure, in which we don't manage tons of machines, and instead
replace and reload appliances as needed.  We do however still maintain
the capability to push by using the Ansible EC2 dynamic inventory
plugin.

## Growing Pains

One of the first things to go was the statically defined machines from
Terraform.  Using statically defined pools like this doesn't work very
well in the long term and means that special care has to be taken to
not accidentally introduce changes to a single machine.  Using launch
templates and ASGs helped to make sure that machines came up clean
every time.

Another growing pain we're still dealing with is to release the
remaining static addresses.  These are a holdover from migrating a
workload that was used to a physical DC, and so static addressing was
one of the things we allowed into the new cluster rather than trying
to fix all issues during the migration.

## The Future

Some ideas that existed back in April still exist now as goals for the
future, and some new goals have shown up as well.

I'm still unhappy with Ansible as a provisioner as it requires Python
on every machine, something which is otherwise not required for the
machines on the cluster.  Initially, I'd hoped to replace this with
some other technology written in Go, but unfortunately the 2 most
promising options are not really usable (`mgmt` is not production
ready, and `converge` has been discontinued).  Right now my thought is
to use a set of dedicated tools to pull binaries, supervise daemons,
and pull config files with a *very* limited template scope.  This
could then be baked into a machine image and run without needing to
has Python on every machine.

Another idea that I've tossed around is to replace Alpine altogether.
Using a tool like
[`distri`](https://michael.stapelberg.ch/posts/2019-08-17-introducing-distri/)
would enable packing an entire OS without needing to modify packages
on boot at all.  The idea is that if all the rest of your
infrastructure is checked into git and updated via automation, why not
the OS itself.

The final major idea I have had over the last few months is to build a
proper set of modules for building base infrastructure in AWS.  Right
now my HashiCorp cluster terraform is very tightly coupled to my
product infrastructure terraform.  This isn't a good place to be, and
means that small changes in one can make huge problems in the other.
I think the best path forward is to split out the HashiCorp bits to an
external, Open Source project and to become a downstream consumer of
it.  In this way I can also maintain a test cluster, and hopefully
entice better support of musl from HashiCorp by providing an
easy-onboarding path for running a cluster that isn't as fragile as
other cluster schedulers.

This level of automation and magic is close to what I think the ill
fated HashiCorp Otto project was striving for, the ability to type
`make prod` and have a datacenter spring forth from the ether.  I
think that Otto failed because it tried to do too much stuff without
clear focus, whereas this idea has the clear focus of "run nomad
somewhere".  That *somewhere* point is important since it might be
AWS, it might be GCP, or it might be on a shiny new rack of [Oxide
computers](https://oxide.computer).  The goal is more that its quick
and easy to spin up a reference Nomad cluster that can be arbitrarily
large.

---

Hopefully you enjoyed this article.  If you did, feel free to send me
an email at maldridge[@]michaelwashere.net, or send me a ping on
freenode (I idle as `maldridge`).
