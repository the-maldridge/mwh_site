---
layout: post
title: Into The Void
date: 2017-09-18 22:00:00
categories: Void Linux Culture
---

Into the Void.  It sounds quite dramatic doesn't it?  These are the
words you see when you start up the Void Linux installer and I thought
it was quirky and different a few years ago when I installed Void for
the first time.  I still think its a little quirky now, but for
different reasons.  Enough people have asked me what I see in Void and
why I think its special that I decided to write it down, and here is
what I've come up with.  The publication date for this post is
completely arbitrary, the content here is collected from my notes,
lots of thinking, and asking some of the core maintainers for review.

### How did I get here?

When I first started using Void I'll fully admit I found it via a
website that listed distributions that don't use SystemD for init.  I
considered this enough to jump in even though I was very wary of the
rolling release nature of Void.  What kept me here was the community
and the things I have learned from it.  I enjoyed having the latest
software and things were generally pretty smooth.  After the initial
hurdle of switching over to a new OS I started looking around and
figuring out how things worked.

The first thing that impressed me was the package manager.  XBPS is,
as is explained on the website, not derived from any other package
manager's source code.  This may not sound like much, after all the
package manager is really just keeping a database of files and
unpacking archives onto the disk.  What makes this hard is doing it
correctly and reliably.  What happens when the file you want to unpack
already exists?  What happens if you need to update a library used by
multiple programs?  What happens when you need to change out parts of
the package manager itself?  The further I dove into Void the more
impressed I was with the design and the elegance of the tools that
managed it.

I came over from Debian.  Debian is a fine system and the .deb package
format is one of the most well known in the world alongside RPM.  What
both of these systems lack though is a sane build system.  For Debian
this involves a makefile for the package and then careful planning and
organization at the people level to not break things during a branch
cut.  For the RPM world this is generally the case as well, but with
the application of a large build farm to make things just a little
more uniform.  With XBPS this is all handled using xbps-src.  This
system is at first glance a binary file in a git repo, but on closer
inspection it gets much more clever then that.  You see, one of the
biggest problems with a Linux distro or any large system is
bootstrapping.  At some point you get to the point where you need a
previous version of your tooling to build the current version.  This
is not really desirable as it ultimately can become a very difficult
to break build loop.  Because of this, xbps-src is in fact not a
binary, it is a collection of very intricate shell scripts that use
standard tooling available on almost any Linux distribution to
bootstrap a compiler, build chroot, and XBPS itself.

Once the build chroot is up and running its a simple matter to build
the entire system.  When people ask how Void's build system works, it
usually takes them a few minutes to fully grasp that there are
actually just clones of void-packages being driven by automation to
produce the system.  The xbps-src system really is that good.  This
though is just the technical side of Void.  There are other components
that make a distro what it is.  Perhaps the most important are the
people.

If you look at the package statistics, you'll find that there are
several thousand packages across 4 major architectures supported with
2 C libraries.  How many people would you expect are responsible for
maintaining this and the associated build servers, websites, and other
infrastructure needed to keep it all running on a daily basis?  On a
daily basis there are around 15 people with commit access checking in
and keeping an eye on things.  Some are managing updates of the large
stacks such as Gnome and KDE, some are handling improvements to the
build system, some are handling upgrades to the core infrastructure
and some are handling PRs from users.  It takes all kinds to keep Void
running and we've been very fortunate to find people who are willing
to volunteer their time, money, and skill to keep this project alive.

## People

As you may have surmised, I'm slowly circling into what I think really
makes Void unique.  I think a lot of what Void is comes from its
people.  Our developers range from full time software engineers to old
time hackers to university students who want to get involved.  Void
has gone through explosive growth from about 2014 onward, and this
has been interesting to watch.  Distributions that have been around
often have the first two, but not often the last one.  I'll explain
why this is important by looking at each group of people and what they
bring to the table.

### The full time engineers.

This one is easy.  These are people who are professionals in writing
software, they can troubleshoot fast and have skills that allow them
to see problems quickly.  I put myself into this category as I'm not
old enough to consider myself an 'old time hacker'.  As an SRE I bring
to the table the [weird sense of duty](https://xkcd.com/705) involved
in keeping the fleet healthy and making sure that when you want to
install something, the nearest server responds promptly and serves up
the files you requested.  I focus on making sure that things are
managed using repeatable processes and generally make sure that we can
recover from anything.

Full time engineers also tend to bring their friends, this gets us
more engineers and eventually the process becomes self sustaining.
This works out really well and reminds engineers that just building
the software isn't enough, you have to actually deploy it somewhere.
Its a very symbiotic relationship and I have really enjoyed working
with the SE's who volunteer their time with Void.  I also find that
these people are always willing to share their knowledge and help a
newcomer along.  When I came to Void I didn't have a clue how cross
compiling worked within a large project and one of the people in IRC
explained it to me how autotools setup the build and ran it.  Moments
like that are part of the core culture of Void that I don't see in a
lot of other projects.  Being able to bootstrap knowledge that
contributors might not have yet is one of the most important things a
project can do, and a README file just doesn't cut it.

Another thing that FTE's tend to bring is a knowledge of the current
world and trends in it.  In FOSS projects that use the canonical
tooling its easy to get wrapped up in what was going on 10 years ago.
A lot of tooling exists from before the time that multiarch was
common, and a lot of code predates the so called "modern" practices
that we use today.  The people that work with software every day tend
to bring the knowledge but also the drive to modernize things.  At
times this is good, but sometimes we've had to take a step back and
look at what we're doing to see if it really is the best possible
choice.

### The Hackers

When I think of a hacker I don't think of a ski-mask wearing villain
from a 90s movie.  Instead I think of a phreaker or an op, a wheeler
if you get the reference.  Maybe even if we're really lucky, Void has
a wizard or two amongst the ranks (if you don't get the references,
maybe you should take a trip through the [Jargon
File](http://catb.org/jargon/html/).  These people bring certain
ethereal qualities to Void that other new distros don't have.  Its
hard to describe in words what these people bring but the best
summation is probably to say that they bring "memories".  These people
remember what once existed, what may have been lost, and what now must
be found again.  I cannot count the number of times I have been
talking to some of the people in Void who have casually mentioned
working on recognizable projects that I know of from the past.  I'm
sure that these people exist in other distributions, but I question if
they are as involved as they are with Void.

To give some quick examples:

Void's package manager XBPS stands for Xtraeme's Binary Package
System.  Xtraeme worked on NetBSD before coming over to the world of
Linux and building up XBPS.  Xtraeme has taken a step back from Void
right now to focus on life, but without his tenacity at the start Void
wouldn't exist.  He also still updates a considerable number of
packages per day and if you pick a random package there's a decent
chance he'll be listed as the maintainer.

If you got into Linux at a certain time you'll know what Suckless is.
They have a very unique philosophy and have run into a fair share of
arguments with the outside world at times.  The fact remains though
that software from Suckless is some of the highest quality software
available in terms of code quality in my opinion. Gottox worked with
Suckless and was a driving member behind the surf web browser and the
tabbed xembed frontend.  He was also a contributor to the dwm window
manager.  There are few things I've been able to stump Gottox with and
he's often been able to un-break even the most stuck of Void's builds.

Many people know of GitHub's contributions graph with the little green
squares.  This code was originally developed by leah2 along with many
ruby gems over the ages.  Those familiar with rack may even remember
leah2 from the mailing lists as an active contributor to the Rack and
Bacon projects.

Some of the people who've since moved on from Void have been involved
in building the Go programming languages' compilers, chunks of several
major Emacs modes, and a few other recognizable packages.  We've had
the good fortune to be able to attract these people and hang onto them
for a while.  Several have even chosen to call Void home.

One of the great phrases from history is one from Sir Isaac Newton:
_If I have seen further it is by standing on the shoulders of giants._
Void has made it so far by being able to build on the foundations
laid down by the experienced volunteers that have come to the project
over the years.

### The University Students

There's something undeniable about seeing something for the first
time.  You see it in a different way than the people who've been
working on it for a while and often attack it with a zeal that might
not be there otherwise.  Without the many Linux Users Groups around
the world at various Universities, I do not doubt that Linux would not
be as successful as it is today.

With Void we see the influence of students through packages for
software that has a distinctly "Academic" flavor.  These people also
see the system in a new way and have theoretical knowledge that is
often more complete than people working on Void for long periods of
time.  Such work is what led to dxpb, the Distributed XBPS Package
Builder.  This system came about from looking at Void's packages as a
tree and realizing that the way Void built packages was absurd.  This
idea was quickly picked up and is now in development by members of
Void's core team.

Students also bring the almost constant stream of "why?" questions.
These are at times trying, but without constantly re-evaluating the
processes by which we do things, we will never improve.

Thinking about the people who make up Void, Vaelatern gives an
interesting observation:

> All the people who make Void what it is are interested in continually
improving the ecosystem, and are aware not everything can be fixed at
the flick of a switch. We set policy for new contributions before we
set it on existing packages. Engineer types, hacker types, student
types, all continuously ask "Why?" and "Can this be better?" I think
this ethos definitely matters.

## The Tech

The people certainly make Void's culture what it is, but there's a few
bits of tech that really make Void.  I touched on this a little
earlier with XBPS, but there is more to it than just the build system.

### XBPS

To expand more from above, XBPS has a few notable features.  First,
every package in XBPS carries with it an RSA signature.  This is a
feature that Void had fairly early on before it became as widespread
as it is today.  You may ask what good this has in a world where you
can get SSL certificates for free and run SSL transit end to end.  The
answer lies in the complexities of key management and managing SSL
across many different endpoints.  With signed packages it is less
crucial to trust the transit because you can validate the signature to
ensure the package is correct and intact.

XBPS also ensures that packages that need to be rebuilt for a change
in a library actually get rebuilt.  This is something that other
rolling release distributions sometimes struggle with but that XBPS
and xbps-src handle gracefully.  This feature is what allows us to
quickly and reliably produce updates when they are available from
upstream.  This is also what allows us to manage a staggeringly large
package tree with very few people actively intervening.

### dxpb

The soon to be released dxpb system is another unique thing within
Void.  As it is not yet publicly available I will not talk in detail
about it, but it is decidedly unique in that it handles the
complexities of updating the entire package graph in real time as
updates are happening and schedules these updates to the finite
resources of the build infrastructure.  A later post will include more
detail on dxpb and the roll-out that cuts over from the existing
buildbot infrastructure.

### Ansible

Ansible is a RedHat product that is designed for system management.
Through a chain of events that isn't important here, I found myself
developing a lot of Ansible roles for Void and some tooling which was
very nice to use.  I offered this tooling to Void and I believe at
this time we are one of the only "small" distributions to have fully
reproduce-able systems that scale dynamically from a single config set.
For example if a generous donor were to offer us a mirror tomorrow, we
could have it up and running using Ansible in under an hour and ready
to serve as soon as the mirror file-system populated.

We are not the only distribution using Ansible, but I believe we are
one of very few rolling release distributions to use enterprise grade
tooling to manage the fleet and make sure that things are as reliable
as possible.

### LibreSSL

LibreSSL started out during the HeartBleed kerfuffle a few years ago.
The basic idea was that the OpenSSL code was unmaintainable and so the
fine folks at OpenBSD forked the code base and went on a so-called
"[valhalla rampage](http://opensslrampage.org/)" through the code
base.  What was left is a high quality portable C library that
implements that functions in an SSL library that people actually use
while still maintaining almost all of the API compatibility with
OpenSSL.

Incidentally, because of the release process for LibreSSL, its not
uncommon for Void to have it built and in the repos before the release
notes are finished being written.

### runit

At this time, Void is one of the only production distributions using
runit as the default init system.  runit is an init written in C that
occupies a surprisingly small amount of code.  When you think about it
init is a very simple program and so it is no surprise that the source
code for runit is so short.  The system has runlevels, and runit
provides supervision of daemons within those runlevels as well as the
appropriate infrastructure for a logging daemon of the administrator's
choice.  Overall runit is very simple and while many people have
commented over the years that runit is dead, I think many people
forget that a valid state for software is "feature complete".  When
you look at what runit says it will do and what it does, you find they
are the same lists.  This should be no surprise since runit is largely
considered to be stable and complete.

## The Organization

Having good people and good tech is one thing, but putting these
things together into a useable entity is quite another.  Void has a
somewhat unique approach to this in my opinion.  We have a set of
informal policies that allow us to adapt to changes as needed, but we
don't get bogged down in the bureaucracy of managing the organization.

You may notice that I've put this section at the bottom so that as
you'll have read the bits that I wanted you to read before zipping off
to try and find the comment section that I don't have.

### The Leadership

Some distributions have a plutocracy, some have corporate leadership,
some have a BDFL and some have a table on which they cast chicken
bones.  I like to think of our leadership as that of a ship.  A ship
you say?  Yes, a ship.  Here's what I mean:

At the top we have a captain, this is Xtraeme, he is the founder of
the project and has high level authority across many aspects of the
project.  No captain can be singularly aware and in charge of the ship
though, and so the rest of us act as a crew to keep the ship sailing
smoothly.

As a fine first mate and and, when needed an acting captain, Gottox
keeps the rest of the team moving forwards and clear on many of the
high level goals.  This leadership keeps us running on the day to day
basis when we may need a quick tie-breaker and also helps us find a
quick resolution to many problems.

Of course Gottox doesn't go it alone, with the help of Duncan, leah2,
ebfe, lemmi, Vaelatern and more, the day to day tasks are managed in
short order and usually without incident.  These team members help to
make sure that Void's core software stack is in good working order and
that we're moving along smoothly and efficiently.

As for myself, I like to think that in another life I would have been
a ship's chief engineer.  I busy myself with keeping the internal
machinery of Void in good working order and always ready for service.
I make sure that there are damage control plans in place and
mitigation strategies for most problems that can arise and if I do my
job well, most people will never realize I'm here.  I am able to do
this by being able to call on the others within the project and the
larger community to assist with specialized knowledge and manpower I
simply don't have as an individual.

### The Policy

Even though Void largely operates on a "do what you want" policy,
there are still a few things that perhaps deserve some explanation
here.  I didn't really understand this when I started using Void but
over time it makes sense.  Here's the explanations I've come up with
over a few years.

_I came from Arch and I installed stuff from the AUR, why isn't there
a VUR?_ Well simply put, Void isn't Arch.  A VUR is fundamentally
against the philosophy of having a single source of truth for high
quality packages that are all built within a unified build system.
Void also uses a signature system to authenticate packages that are
installed onto the system.  This only matters if the packages have
been reviewed before being signed.  There have been a few people
who've tried to "test" or "audit" this (note the quotes, there was
some very dubious quality there) by creating a brand new GitHub
account and trying to get something merged.  The whole point of the
review is that it won't destabilize the rest of the package tree, its
absurd to think about auditing every single piece of software that
makes it into a Linux distro with a team the size of Void's.  If you
are interested in a fully audited system I highly recommend OpenBSD.

_Why won't Void ship -git packages?_ This one has to do with a common
misconception that rolling release means bleeding edge.  I'll admit
that I thought this when I first installed Void.  It was confusing the
first time I tried to PR in a package that was a -git package and it
was rejected.  The concept though is simple and sound: the only hope
of stability is to run release builds of software, that's where the
author said it was stable.  This took me a while to really wrap my
head around but it makes a lot of sense; think about it for a while
and it will come to you.  Some more context is provided by Gottox:

> Actually in release oriented distributions it's easier to rely on
-git software. You pick a release, make everything work and you're
fine for the next release. In rolling release it's quite hard to
decide when to update. Is the -git package stable? Is a refactoring
going on? Is the API stable? - Those are questions that need to be
answered before we can safely add and even more important: safely
update.

> We used to allow unstable packages and we noticed that this won't
scale if Void gets more popular. This is why there are still some
leftover packages in our repository. Contributors started posting PRs
with bleeding edge features that were just implemented a few days ago
and nearly untested. We had no polite way to telling them "bad idea,
lets wait for a release" because there where already dozens of
packages with the same stability issues merged. So we decided to
disallow them.

## In Closing

You've made it to the bottom of my wall of text, congratulations!  I
tried to come up with what makes Void different and I'd like to think
that if you've read the whole thing you'll have a bit more of an idea
of this.

Finally I'd like to leave some quotes that are from other projects
that I think sum up concisely the ideals of Void and the team behind
it:
  * "Of course it runs Net BSD!" - The Net BSD Project
  * "Secure by default." - The OpenBSD Project
  * "Use and encourage the incorporation of secure programming interfaces in operating systems." - The LibreSSL Project
  * "[...] focus on simplicity, clarity, and frugality." - Suckless Tools

If you found this article interesting or even just a good read or
maybe you just want to complain, feel free to reach out to me at
maldridge[at]voidlinux.eu.

