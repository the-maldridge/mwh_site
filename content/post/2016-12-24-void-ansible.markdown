---
layout: post
title: Void on Ansible
date: 2016-12-24 23:00:00
categories: Void Linux Ansible
---

Twas the night before christmas and not a creature was stirring save
an infrastructure engineer.

The rest of my family has gone to sleep, the tree is nicely lit and
tomorrow will come early.  But we're burning SLO and the contract will
expire for Void's current build machine on the 31st of December.  I'm
capturing all the state with Ansible to stand up the new build server
on the 26th so that it will be ready to go in the next few days.

A few months ago I realized that for CV I'd built up a collection of
modules and tooling for managing Void.  I also realized that I had
some skill in terms of systems operations that not all developers
have.  To this end I offered to manage the Void fleet with Ansible.
At this point I manage pretty much all of it with a series of dense
playbooks.  It works well and I wouldn't be surprised at all if Void
is the only distribution that is fully Ansible managed.

---

Update January 2017: Cutover succesful!  Even after a disk array took
out the entire build system it was only a quick push with Ansible to
set everything up again.  Mission accomplished!
