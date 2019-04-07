---
title: "Nomad on Alpine"
date: 2019-04-06T20:35:03-07:00
---

Recently at work I've been setting up a Nomad cluster to take over the
production workload in our primary serving cluster.  This process has
taken several months at this point to prototype and develop, and along
the way I've learned a lot about cluster operations with Nomad.
Coming from the world of Google and Borg I had a pretty good handle on
how cluster level schedulers work, but I'm still amazed at some of the
things that are either dramatically more elegant in the HashiCorp
stack, or less enthusiastically, things that make me want to pull my
hair out.

## What is Nomad?

Nomad is a cluster level task scheduler, which means that it is able
to transmute your datacenter of servers into an amorphous pile of CPU,
disk, memory, and network.  It can then figure out the most efficient
way to put your tasks into this pile, and can repair your tasks if the
pile becomes unstable.

A Nomad cluster is made up of 3 main parts that serve specific
functions:

### Nomad

Nomad itself is obviously part of a Nomad cluster.  It is involved
with talking to "drivers" on machines such as docker, kvm, rkt, and
others to actually launch and run workloads.  Nomad has a web-based
user interface, and an RPC style API.

### Consul

Consul is the service discovery and communication layer of the
cluster.  It is responsible for providing the surface that allows
Nomad to setup its highly available masters as well as setup the
storage layer for Vault.

### Vault

Vault is the key management solution and authentication layer of a
Nomad cluster.  Vault is a combination key management and key granting
system, as well as an authentication broker that allows you to convert
between authentication factors that your organization already has, and
authentication factors that HashiCorp products understand.

## What is Alpine

Alpine Linux is an independent linux distribution built on the APK
package manager and has rapidly become a favorite in the containerized
world.  Alpine is small, fast, and has a focus on security.  Alpine
uses the musl C library which focuses on correctness and compliance
with standards documents.

Alpine also OpenRC and s6 as as the service supervision and init
system.  The system is usually available within a few seconds on a
reasonably fast system, or within several minutes when the kernel
randomness subsystem is instructed to distrust the CPU (in the case
you are running on Intel hardware and are suspicious of more bugs
usually).

## Bootstraping a Cluster

My organization has footprints with many different providers, but for
commodity computing infrastructure, we use AWS.  To get the system up
we need to be able to boot up Alpine, then to install the various
cluster software on it, and finally to get it all running at the same
time.

### Getting an AMI

As you may be aware, Amazon EC2 uses a specialized image format called
an Amazon Machine Image (AMI).  Perhaps unsurprisingly Alpine does not
have an official AMI, so its necessary to build one.  Given that this
is production infrastructure, as much as possible needs to be tracked
in git and subject to the 2 man rule.

To this end I selected HashiCorp Packer to pragmatically build
images.  It is here that I have two major complaints with the setup.
First, Alpine doesn't have an autoinstall system, so its necessary to
abuse the boot_command feature in Packer to drive the first part of
the install.  While I recognize that the target is systems that do
have the capability to autoinstall, even on those there are reasons I
might not want to use the autoinstaller.  If packer had a second
configuration value, perhaps autokey, that would use the same logic as
boot_command, I would be much happier with this setup.

The second problem is that Packer templates don't have a notion of
includes.  This means that I have to either use some kind of external
templating system to make the 2 templates I need, or I have to keep up
with changes between my two templates and copy/paste the changes.
Neither of these are optimal.

Why do I need two different AMI's in the first place?  This is a good
question, and has to do with deficiencies in Packer and in AWS.  The
problem on the packer side is that I really want to have a provisioner
chain for each post-processor chain.  For one chain I spit out a
Vagrant Box which is used locally to simulate changes to the real
cluster.  For the other I need to perform the AWS magic to upload the
image, which should not include the [Vagrant Insecure
Keypair](https://github.com/hashicorp/vagrant/tree/master/keys).

Of course these problems are entirely moot since AWS fails to accept
the uploaded image, despite the documentation around image uploading
strongly implying it will work with any modern linux.  Instead its
necessary to use Packer's EBS Surrogate flow to side-load Alpine into
an EBS volume that can then be converted to an AMI.  This is
non-obvious and non-optimal for sure, but once you get it figured out,
it can be done without too much trouble and can be highly automated
(we have an automated task that spits out new AMIs with updates baked
in every month).

Once the image for Alpine is created, its useful to be able to test
things locally before spending money at Amazon.  While its debatable
exactly how much "cluster" can be simulated locally, with 16GB RAM you
can fit a reasonable sized cluster on a laptop to play with.

My tool of choice for doing this simulation work is Vagrant, which is
the only HashiCorp product written in Ruby.  This use of Ruby means
that it has a completely different community around it and a
completely different style.  Once you wrap your head around this, its
quite pleasant to use.  The only real bug I ran into here is an old
one that I ran into along with phy1729,
[hashicorp/vagrant@2779](https://github.com/hashicorp/vagrant/issues/2779).
This bug was closed years ago as `wontfix`, but meant that my local
test cluster needed to have 2 adapters on every machine with two
different addressing spaces.  The first adapter has an address in
10.0.2.0/24, and the second is an address in a host network.  Its host
accessible in order to cheat the number of VMs needed to run a local
cluster, but if you had a sufficiently large machine you could make
this a VM only network and use a machine with a 3rd adapter to be your
proxy.

Now that I was reasonably confident that I could get a number of
machines with Alpine running, it was time to get the rest of the stack
running on it.

## Getting Nomad & Friends

Nomad, Consul, and Vault are all developed in Golang, which is a
statically compiled language.  HashiCorp even helpfully provides
compiled versions of the binaries on each project's GitHub page, but
these aren't usable here.  You see, the statement that Golang is
statically linked is a bit of a white lie.  For performance reasons,
the resolver is actually [linked to libc on the
host](https://dominik.honnef.co/posts/2015/06/statically_compiled_go_programs__always__even_with_cgo__using_musl/),
as that will generally be faster in all cases.  Ok, no problem we can
just compile the daemons on a musl enabled system to ensure the link
is to musl, not glibc.  There are official golang images on Docker Hub
that use Alpine as the base, and we can build with these.  At the time
of this writing, you'll need at least two different build containers
as the various HashiCorp products can't agree on a single Go release
to target.

Each binary also has a web interface that can be included if you like,
which will require some additional tools to be installed during the
build.  I personally don't care much for web interfaces, but they look
slick and are easier for people outside of ops to understand, so I've
gone ahead and built them in to all the daemons that support this,
with the exception of Vault.

Once built, you should now have a musl linked version of Nomad,
Consul, and Vault.  If you look at these files you'll realize they're
massive, so now is a good time to repack them with
[upx](https://upx.github.io/).  This is one of those tools that people
either love or hate with no in-between.  I personally have not had any
problems with it, and it improves the speed at which I can spin up
boxes by reducing copy times.  This step isn't required, but in my
case it had a repack savings of over 80% when combined with a pass of
the standard symbol stripper.

## Deploying

At this point, things take on a pretty standard turn.  A handful of
calls to Packer get me a small armada of VMs, and then a handful of
Ansible pushes later services come up.

Of note is perhaps the situation surrounding DNS.  On Alpine you get a
maximum of 3 resolvers in `/etc/resolvconf`.  This isn't a big deal, I
expect most production clusters to run an internal resolver for a
myriad of reasons.  Currently I'm using
[Unbound](https://www.nlnetlabs.nl/projects/unbound/about/) for this,
but I'm inclined to change this to [CoreDNS](https://coredns.io/) for
a number of reasons related to a project that's still in the "shower
thought" stage.  Its very important to remember when switching around
DNS that it absolutely, no possibility for errors, must exist at the
time you switch or you can get yourself into a world of hurt with SSH
timeouts and the timeouts of your provisioning solution.  This means
that bootstrapping a cluster involves pushing to install things, then
once DNS is up and running changing some magic variables in Ansible
and pushing again to reconfigure the resolvers.

## Living With It

So far I've only had a few problems that were properly annoying.  The
first of these has to do with the way that Nomad handles its logging.
During some bootstrapping I noticed that Ansible would request the
Nomad service to start and it would do so, but then it would not come
up on the next boot.  It took me a while to realize that this was
happening because it was expecting to be attached to a terminal.
This was really not obvious, I haven't found anywhere that its
documented, and it caused Nomad to just fail to start.  Even more
confusingly, you can `$ service nomad start` and it will work.  The
solution is easy enough, just configure logging.

Consul on the other hand has been a ton of fun.  So far its died
several times and at least once its eaten my cluster whole, requiring
a rebuild.  Fortunately this infrastructure is still in QA, so no
production tasks were harmed.  At the time of this writing my
suspicion is that the task runs out of memory and just dies, or
perhaps is OOM-Killed.  I have not read sufficiently many log entries
yet to confirm either way.

Another issue I've run into which I have yet to fully track down has
to do with both Nomad and Consul occasionally detaching themselves
from s6.  They're still running, but s6 reports the task missing and
attempts to restart it.  In the best case this fails because the ports
are already bound.  In the worst case I have a machine split-brained
with two copies of the same daemon running on it.  I've had this
happen with a Nomad master and it proved to be unrecoverable and
required master replacement to get out of.

I'm not convinced that this is an s6 or HashiCorp bug, and I intend to
switch to cluster services running under runit which I am
significantly more familiar with to see if this problem continues.

To date, I've only encountered one other issue, which I'm not sure if
its from running on Alpine or not.  Sometimes, Nomad won't be able to
restart because the state has become corrupt.  Usually this is after
I've done something horrible to a machine, but I've also seen it
happen after a worker reboots cleanly, so I'm inclined to think that
Nomad's state directory is just inherently unstable and/or fragile.
I've fortunately never had this happen to a master, but those are raft
backed anyway so it wouldn't be hard to recover.  Helpfully the error
message in the log very clearly says to remove the `alloc/` and
`client/` directories and restart the process.  Unhelpfully Nomad
doesn't deconfigure docker on its way down so these directories are
un-killable.  You have to move the directories out of the way, bounce
the box, and then when Nomad has recreated the directories the old
ones will be removable.

## Reflections to Date

So far, this cluster has been running through an exhausting and
exhaustive burn in and QA process.  I've been asked by a few close
friends if I had to build it over again if I'd change things, and I
think the answer is probably yes.

For one, I'm not sure I'd do so much provisioning on-line with
Ansible.  I might be more inclined to bake things in and go the
"immutable infrastructure" route, but I'm very unhappy with this from
a secrets management standpoint.

One of the biggest questions I've been asked is if I'd still run on
top of Alpine given how much time and effort I've had to sink into
making things run reasonably smoothly.  The answer to this question is
yes.  I would still pick Alpine.  If I were not in the specific
environment I'm in, I might consider switching Alpine for Void, but
that's a philosophical debate for another time.  Why I would pick
either of these though is that I believe it is fundamentally very
important to be able to fit large chunks of the system, if not the
entire thing, in one's head.  As a former SRE, I can say with
conviction that my ability to solve problems under high stress hinged
on my ability to conceptualize incredibly large and complex systems on
the fly, and reason out what might be wrong in them.

In the case of a Nomad cluster, I need the Linux kernel, a docker
daemon, and a handful of statically compiled go executables running.
Anything else beyond that is wasted machine cycles that don't
contribute to the business goals that led to running the cluster in
the first place.  Worse, these extra tasks may impact the critical
functions of the cluster, or represent security problems that
compromise low levels of the security pyramid that tends to form in
systems of this scale.

## Where from Here?

The QA phase for this cluster is nearing its end, and soon I expect it
will join the production fleet.  After that there are other projects
that will take my focus, but I intend to continue refining the art of
running a Nomad cluster on Alpine.

This make take the form of a machine supervisor, but only time will
tell about this project.

---

If you've enjoyed this post, the author idles in `#voidlinux` on
freenode as `maldridge`, and can be reached via email as
`maldridge@michaelwashere.net`.
