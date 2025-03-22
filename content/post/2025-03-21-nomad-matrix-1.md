---
title: "Building a Nomad Cluster: Foundations"
date: 2025-03-21T19:38:46-05:00
---

I recently decided to rebuild my development cluster so that I can
finally nail down a few services that I've wanted to understand better
for some years now.  To get to the point that I have a working cluster
meant setting out some requirements, rebuilding the entire software
stack, and then finally making physical changes to the cluster itself.
This will be a series of posts detailing the adventure to build a
private cloud with actual cloud-like functionality, namely
multi-chassis scale-out and the ability to treat arbitrarily many
computers as one large resource pool.

Lets start out by answering a question probably many of you will be
asking: why Nomad?

The shortest possible answer is because its my cluster and I get to
pick what technologies I want to use.  The longer answer is more
nuanced and more complicated, but it still boils down to my opinion as
an engineer what tools I want to use.  Nomad does more than just
containers, and I want to explore scheduling workloads that aren't
containers.  Nomad has robust support for integration with other
Hashicorp software, and I like the quality of this software.  I want
to focus less on the mechanics of the cluster scheduler layer and more
on the applications I want to deploy and how they fit together as a
whole.

Finally, while my own cluster is relatively small, one of the key
themes you'll see throughout my design and build phase is that the
entire cluster should be capable of largely automatic bootstrap and
recovery from power events.  This is part of my goal to simulate a
much larger datacenter environment with this project, and Nomad has
much better scaling performance out of the box than other cluster
orchestrators.  I could, with some tweaks, connect my small cluster to
a very large machine pool and orchestrate that with no other changes.

## Physical Hardware

Some years ago when I spun up the [ResinStack](https://resinstack.io/)
project, I purchased 10 Lenovo Thinkcenter m73 Tiny ultra-small form
factor workstations to use as my test cluster.  These machines are
pretty great for the price, and with some careful cable management, 2
can be fit into a 1U space in a standard 19" rack.  The smaller 10"
racks seem to be gaining popularity, but I have already largely
standardized around the 19" size, so this choice made sense to me.

Since this cluster is supposed to be self contained, it has its own
router.  Originally this was a Juniper Networks SRX 220.  This is a
capable but dated device that I was managing with Terraform.  It
worked well, but JunOS frustrates me with how slow everything is, and
I have run out of patience for trying to purchase updates and
entitlements directly from Juniper as an individual, so this router
needed to be replaced with something more usable, more secure, and
more maintainable.  My network vendor of choice has become Mikrotik,
and I selected an RB3011UAS+RM for this application.  This is a very
shallow depth Arm based router that is now discontinued, but is still
a fantastic device.

I modified this router to include an internal power supply, as I
really dislike rack-mount equipment with external power bricks.  The
router maintains a BGP peering session with the core router for my
house, so the cluster network shows up as a cleanly adjacent peer
network that I can transparently access.  Overall, its pretty great.

## Base Operating System

A large part of the point of containerization and cluster
orchestration is to make the base operating system not really matter
anymore.  If the OS matters, your abstractions are too leaky, and may
cause problems later since the ability to maintain portable workloads
between machines may be compromised.  The important thing to consider
is that the base OS should provide modern versions of software, a
stable foundation, and critically should include a process supervisor
for Nomad itself, so that if for any reason the orchestrator crashes
or is restarted, it will come back within a few seconds.

I chose Void Linux for this because I am a Void Linux maintainer, and
therefore I can reasonably ensure that modern versions of everything
I'm going to need are available, even if it means a few side quests.
I also chose Void because it has a straightforward network
installation capability, which is important when working with physical
hardware where you know in advance you'll want to re-provision machines
regularly.

I did have to take a side-quest here because I wanted to provision
these machines using UEFI rather than BIOS boot, which meant teaching
Void's autoinstaller how to identify if the machine was booted with
UEFI and then use an appropriate disk partitioning layout for each
boot mode.  This was about 2 days of work, but the autoinstaller now
knows a new trick.

## Solving the Bootstrap

Since I want my entire cluster to be provisioned using services
running on Nomad, I need to first have access to Nomad.  This leads to
a bit of a chicken and egg problem since I need to have Nomad to get
Nomad, but the solution is as simple as it is annoying.  I installed
a 0th node by hand, which serves as the head-node of the cluster.
This node is higher spec hardware, an HP Elitedesk 800 G3, which runs
most of the central services that are required to bring up the rest of
the cluster.

I installed this one machine by writing the Void autoinstaller to a
USB drive, and booting the machine up with a crash cart connected to
it.  This allowed me to get a clean install of the base OS, and then
proceed to configure the machine the rest of the way with Ansible.  I
use Ansible because its a tool that enables an extremely fast
iteration cycle so I can quickly work out issues with a design, make a
patch, and try it.  I've used some other systems as well and just
haven't found them as responsive as Ansible is.  In a future post,
you'll see how I solved Ansible's one big flaw relating to performance
in a push based architecture.

## Initializing the Cluster

Once I had Nomad up and running, I could then deploy a PXE server and
Shoelaces.  The PXE server would serve the `snponly.efi` boot
executable out to the machines, because I don't want to replace the
network controller firmware with iPXE just yet, so this phased boot
approach is necessary.  Once the machines could boot to iPXE, they'd
be looking for an iPXE boot URL, and my tool of choice for managing
these URLs is [Shoelaces](https://github.com/thousandeyes/shoelaces)
which provides several different means of mapping a boot request to an
actual iPXE script.  I do wish that it had webhook support, but
realistically I don't change my boot scripts frequently enough to need
that functionality.

With the PXE infrastructure in place, I could now boot up the
remaining 10 nodes in the cluster and provision them.  With everything
up and running, the cluster informs me that I have 48.92GiB of memory
and 131.2Ghz of schedulable CPU.

The only other service I needed to deploy before declaring victory was
a container registry, so that the custom PXE containers didn't need to
be side-loaded to the system.  I selected Zot for this, which works
reasonably well, but has very little useful documentation for figuring
out why it doesn't work.  For example, I still have no labels or
annotations on my containers, despite having filled out all the labels
that are documented and rebuilding everything.

In the next post, I'll talk about how I manage my ongoing machine
life cycle, and how I make Ansible work across this mess without
scaling problems in push mode.
