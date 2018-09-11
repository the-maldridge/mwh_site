---
title: Faster Than Light - Ansible Mitogen
date: "2018-07-10 18:00:00"
---

Ansible is a configuration and systems management tool from RedHat.
The general idea is that you express in Ansible the state you would
like the machine to be in, and then when you run Ansible against a
host the state will be applied.  For example, you don't say you want
to restart a service, you define its state as "restarted" and then
Ansible will ensure that this happens at some point.  Indeed, most
people who've worked with me know that before too much time passes
that I've been around a computer it has files scattered across it with
an Ansible comment at the top of them.

There's just one problem: Ansible is painfully slow.

I regularly push Ansible playbooks from my home network in the heart
of Silicon Valley to machines in Germany owned by the [Void Linux
Distribution](https://voidlinux.org).  On a good day, these machines
are 16 hops away and just over 200ms from my desk.  A feat of modern
engineering to be sure, but pushing configuration to one of these
machines takes almost 15 minutes per run.  This makes me very
reluctant to push changes all the time via Ansible which defeats the
point.  Instead I find myself making a ton of manual edits to remote
platforms because that's faster, then I run Ansible to ensure that
there's no diff to its idea of the state.

This is not a good way to run Ansible, and for a while I've considered
building something like AWX to instead push Ansible git repos to all
the hosts I need to manage, then run it locally and report back the
results.  There's a few huge problems with this though.  First, its
yet more infrastructure that I need to write and maintain, even though
it would likely wind up being fairly popular among people that dislike
the AWX-in-a-magic-docker-container "solution".  The second problem,
and one that's less obvious, is that when you switch from Push to
Pull, you suddenly trust your infrastructure a lot more.  The machines
within the Void fleet have no outbound restrictions since they need to
fetch source archives from random hosts on the internet, but I still
dislike the idea that I need to let them have access to a Git repo.
Then there's the problem of secret management.  Those who've looked at
Void's configuration realize that there's a few key files missing.
Just small stuff, mind you, like the global repo signing keys, the SSL
certificates, and a few other small things.  If I switched to a pull
mechanism, I'd somehow have to get my entire secret store out to these
machines or come up with a machine readable way to partition the
secret store.  If I could push, then I could just maintain the secrets
on my machine in an encrypted folder on top of my already encrypted
disk.  This would be ideal since then the secrets are only available
during the playbook run.  Then even if I wanted to write an AWX like
thing, it could just do push strategies and keep secrets locally.
Even better, I could use deploy keys and cycle them periodically.

Today I was skimming my phone's messages and noticed that there was
one for this thing called 'mitogen'.  Normally I'm quite annoyed when
I get a notification on a story on my phone, since the recommendations
aren't very good for me.  But this one rung a bell.  When I clicked on
it I was reminded of reading of this system a few months earlier and
wondering if it would ever be released.

Mitogen is a strategy engine and connection system for Ansible, which
is better explained by its author
[here](https://sweetness.hmmz.org/2018-03-06-quadrupling-ansible-performance-with-mitogen.html).

After rolling back my Ansible version to a version that is compatible
with Ansible-Mitogen (and realizing that I should probably have all
this in a venv anyway) I ran a playbook and timed the execution.  For
a machine that's ~200ms away from me, the playbook completed in 14
minutes 53 seconds.  This is probably the longest playbook that I
have, and I dread everytime I have to re-run it.  I then ran it with
the strategy set to mitogen_linear and 1 minute 53 seconds later the
playbook was done.  To be clear, this wasn't done with the first
playbook doing stuff and the second run not doing anything.  Both runs
were fully green.  So this on its own is impressive and is a ~7.9x
speedup.  I suspect that if I was running from a faster or better
connected control host it would go even faster, but that will have to
wait for another day to test.

So to those wondering if its worth rolling back your Ansible version
to support Mitogen, the answer is yes.  Absolutely yes.
