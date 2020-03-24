---
title: "Early Config Binding"
date: 2020-03-23T22:46:02-07:00
---

Early and late binding are often discussed in terms of symbol
resolution in programs that have symbols loaded from shared objects
and static libraries, so what does this have to do with configuration?
It turns out that a lot of the pitfalls and concepts that have to do
with symbol resolution also apply to configuration management.

IN a traditional systems management environment, configuration binding
is typically performed very late.  The binding happens either by a
tool such as Ansible writing config files into place, or a package
containing configuration files being installed, or even an admin
logging into a machine and writing the config data.  This certainly
works, but it requires a fair amount of config handling to be in place
to reload services as configuration data changes, and to manage the
inevitable changes to this configuration.

How can I be so sure that there will be changes?  Easy: tooling that
supports changes invites them to be made.  This sounds great, but at
very large scales, this can be hard to track and hard to maintain.
Even at small scales its difficult to always reason about what the
state is of a given machine or chroot.

So what is the alternative?  Just like in linking together the symbols
in a program as early as possible, you can write the config very
early.  This is the basis of immutable infrastructure.  The basic idea
is to take a clean machine image, install everything to it, and then
snapshot it out to use again elsewhere.  This also includes the
configuration data.  This approach lets you do much more testing and
static analysis of your images prior to using them in a production
environment that matters.  Unfortunately, virtually no software can be
fully configured ahead of time, and this approach still requires you
to start with a base image that you need to keep up to date.  As it
turns out, keeping this base image up to date is quite a lot of work,
especially if you do not wish to use a base image that someone else
maintains.  You might want your own base image for security or
minimalist reasons, but at some point this becomes a race to the
bottom.

As Carl Sagan once said, "If you wish to make apple pie from scratch,
you must first create the universe."

What if rather than having a base image that was generic and later
specialized, you skipped the base image entirely and just evolved
images from nothing that had only what you required?  This idea has
been bouncing around in my head for the better part of a year of the
idea of how to make an appliance system.  Some really neat prior art
is out there in the form of [Go Krazy](https://gokrazy.org/) which
seeks to make raspberry pi appliances built with Go much more robust.
Go Krazy works by compiling everything into an image and then updating
the filesystem on a raspberry pi using an A/B swap style update where
the two copies are rotated during a reboot.

This is fantastic, but unfortunately its not the year of the ARM
server, so its unlikely that I'll get a server that's compatible with
the raspberry pi's boot image any time soon.  Even if I could, my
day-job uses code written in PHP, so its unlikely that I could use it
because as you may know PHP is in fact not Go.

So what I really want is something that's architecture independent,
and something that's capable of evolving a universe that already has
not only the application executables in it, but most of the
configuration data as well.  What I really want, is a docker file for
the entire machine.

It turns out that the docker folks wanted roughly the same thing, and
some very un-publicized tooling called LinuxKit allows you to
declaratively build machines.  These machines aren't running a distro
per-se, more they are filesystem images that are bootable and entirely
specified in advance.  For the last bits of configuration that are
needed, its possible to fetch it on-boot from a metadata service.
LinuxKit can work cross platform, and cross provider in terms of the
image output format.

If you're interested in seeing what a practical application of
LinuxKit looks like, I am running a project called ResinStack that
handles running the HashiCorp stack on a set of LinuxKit VMs.  The
idea is that the entire stack is specified at build time, and the last
few config files get loaded on boot.  In this way, the configuration
is loaded as early as possible, and is available to run tests against
and to validate.  Similar to Go Krazy I can also assert that
configuration data can only change at boot time, which is a major plus
for handling updates to the configuration.  Its only one example of
what you can do with super early configuration binding, but hopefully
it will spark your thoughts about how you could use a technology like
this in your environment.

---

Hopefully you enjoyed this article.  If you did, feel free to send me
an email at maldridge[@]michaelwashere.net, or send me a ping on
freenode (I idle as `maldridge`).
