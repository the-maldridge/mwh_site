---
title: "What Is Production Grade?"
date: 2019-01-20T15:35:03-08:00
---

I recently decided to try the Caddy webserver project's implementation
of a webserver written in Golang.  It had many interesting things
going for it, including automagic certificate renewal via ACME and
Let's Encrypt; "plugins" written in a sane language; dramatically
simplified configuration; and perhaps in one of the most boastful
statements I've seen of any software recently, it claims to be
"Production-Ready" (features page, right hand side).  Given that it
took me the better part of a day to get a functional Caddy role for
Ansible, I really question this claim.

So that's what this article is about.  I'm putting down here what I
think production grade software should be, and some of the problems
with what software is out there.

## What is Production?

To answer the original question, we have to first look into what is
production.  In general agreement of operations staff I know,
production is the environment of a software system that is either
directly or transitively involved in serving end-users.  These
end-users can be internal or external to an organization, but the
defining characteristic that makes someone an end user is that they
can be unhappy about the status of a system and their unhappiness
directly translates into a need to act for some team responsible for
the system.  This is in contrast to dev or QA environments where
unhappiness about the system state does not demand immediate action.

Put more simply and more directly: if it is important enough to wake
some one up and put a keyboard in front of them, it's part of
production.

With a reasonable definition of what production is, lets now look at
what production grade means.

## What is Production Grade?

Like lumber, meat, and equipment, it's not unreasonable to say that
software comes in various grades.  In many cases these terms are
legally protected.  For example the United States Department of
Agriculture governs the use of specific terms for grades of meat.
Similarly the Western Wood Products Association provides grading
criteria for lumber.  It is interesting then that no such set of
standards exists for software.  Anyone can claim at any time that any
software is production grade, or is of sufficient quality to wake
someone up at night.

It's at this point that I'm going to clearly state that for the
purposes of this article, I'm glossing over the complexity of software
fitness for a particular purpose, such as life or safety critical
systems.  These systems usually require the review and certification
of a Professional Engineer, whose title and license are part of a
regulated profession in most parts of the world.  I am not a
Professional Engineer, and so I can't speak to the kinds of things
that one would look for in certifying software.  I can only speak to
what I look for in softare systems that I allow to wake me up at
night.

Like most things, this is a sliding scale.  Let's start at the huge end
and work our way down.

### Insane Scale

During my tenure at Google, I had a very specific definition of
something being in production since I was an SRE.  This definition
boiled down to "can it page me?"  Since I was part of a Tier 1
rotation, by definition we would only be on call for things that were
in production, and by definition they should have been production
grade (whether or not this was true is a debate for another time).

In this environment, I personally held the definition that production
grade wasn't something I could write down.  It was something I knew
when I saw it, and was greater than the sum of its parts.  Those
familiar with US Supreme Court decisions might find this equivalently
infuriating to Justice Potter Stewart's test for obscenity.  When a
developer wanted me to OK a feature to push to the many many tasks we
had running around the world I had a checklist for certain, but I also
had to ask myself what my gut feeling was on the change.  Was it safe?
Would it cause downtime?  How might this affect disaster response if
we needed to shut off the new widget?  All of these are important
questions to ask when looking for "Production Grade" at insane scales.

Some of the biggest things I looked for had to do with startup and
shutdown.  In anything I was expected to be responsible for I really
wanted to see that the boundary conditions were well thought out.
This includes things like "what happens if the config file isn't
available when the binary starts?"  Well written software would either
wait in an unhealthy state for the config, or would bail out early
with a failure message.  Mass task death would really quickly make it
obvious that something was wrong, as would an entire pool sitting in
unhealthy state.

Another significant point I always looked for had to do with upgrades.
The question to always ask here is what happens at the balance point
when 50% of the fleet is on version N and 50% is on N+1.  In the best
case nothing happens, in the worst case you can get persisted data
corruption.

These are all very important things to look at in defining the problem
at an insane scale, but few if any places run software the way Google
does, and so few if any places will run into or ask these same
questions.

### Moderate Scale

For me moderate scale is the size of a medium sized company.  While at
The University of Texas at Dallas, I was responsible for a computer
network serving roughly 1400 people on a daily basis in both local
computer lab format, and in remote terminal services format.

In this environment, my team built a lot of our own operations
software, but the software we ran to provide services was almost all
off the shelf.  We generally looked for a few specific features when
selecting software.

First and foremost it had to be maintained.  This seems obvious, but
I've seen a lot of places get into terribly deep trouble over the
years by hinging some critical process on legacy infrastructure that
couldn't be kept up.  As a direct extension of this, it's really
important that there's a path between versions.  Breaking changes at
major releases are all good and well, but in contrast to too few
releases if there's a major release every few months, that's a good
sign that the project isn't stable and therefore isn't ready to be run
in production yet.

Another key point that I'm looking for at this scale is how to get
redundancy.  I need some way to stand up multiple copies of a service.
First I need to be able to upgrade them one at a time, and second I
need to be able to scale horizontally as the load exceeds what a
single task can serve.

I also look at software at this scale to be debuggable.  For me this
is one thing that Caddy didn't have.  I lost several hours trying to
figure out what was wrong as the server would just hang on startup.  I
eventually was able to isolate the fault to a single domain for a
single virtualhost.  Several more hours of debugging isolated this to
a lock that had been set in Caddy's state directory which needed to be
manually cleared.  This could have been reduced to a 10 minute
troubleshooting session if only Caddy had printed out that there was a
lock being held during startup.  Instead, I had fumble my way through
the startup process until I realized it had a lock.

### At the small scale

The small scale for me is things like Void Linux.  I look for software
that has very specific qualities before I allow it to run in
production for Void.  First and foremost, I need the software to be
basically single-instance fire and forget.  I need to be able to
launch a task, have it serve the world and only bug me if the world is
burning down around it.  Anything less than this and I expect that the
software will keep going.  This is in contrast to the way that
software can work at much larger scales where a single task dying for
no readily explained reason is ignored.

For software running on Void, I also look for a minimal height
dependency tree.  This is something that is somewhat specific to the
software needed to support a distribution, but the practical reason is
easy to understand.  I need the shortest list of software needed to
run the infrastructure that has to un-break all the rest of the
software.  This is incidentally why the majority of Void's
infrastructure software is written in Golang, as it has minimal
assumptions about how much of the rest of the world around it is
functional.

### Subminiature

Choosing software that runs on my home network is perhaps the most
picky I can be.

In many cases, this is software running without redundancy on
non-redundant hardware.  Add to this that its running in what most
people would consider to be a "privileged" environment and it's easy
to understand why I would be so picky.

For example, my home network is powered by OpenBSD.  I use OpenBSD
here because it has a history of being incredibly robust, very well
built and documented, and it has a thriving community around it for if
I ever do manage to find a real bug in it.  The only bits of my home
router that are even remotely specialized are a pair of well supported
network cards, and an IDE disk on module with industrial flash to keep
the system quieter and lower power draw than a proper spinning disk
would be.

Another thing I'm looking for at this scale is that the software works
without too much input.  Running OpenLDAP at a medium scale and above
justifies its upkeep requirement by the features it provies, but
running it in smaller environments doesn't make sense because of the
mental complexity that it takes to operate.  At the subminiature scale
of my home network, I'm truly looking for the system to be as low
maintenence as possible.


## To the Other Side

"But wait!" I hear you say to your monitor, "I write software, not run
other people's software like you!  How do I know that what I've
written is ready to hand off to an operations team to deploy it and
run it!?"

This is a question to which I have no answer.

For over a year now, I've been working on a project called NetAuth.
Right now it satisfies all the requirements I have for running in the
small to medium production system, but I'm still uncomfortable
deploying it in prod.  Partially because it hasn't satisfied the
many-eyes component that makes open source security softare good, but
partially because I'm just not confident enough in my own software to
say "yes, this is good, you should run it".

Personally if you ever find an engineer that has this kind of
my-software-is-so-good-it-will-never-break attitude towards softare
you should think very carefully about the claims they make, and find
out whose head is on a platter if they're wrong.

Interestingly, I would have no problems running Void Linux in prod.
I've actually done this in the past, and my reasoning from then stands
now.  I believe firmly that it is better to run a less battle hardened
system that you can fit in entirely in your head rather than an
"industry standard" one that you can't.  Anyone who's had to
troubleshoot a large complex system during an outage will know exactly
why this is the case.


## TL;DR

I think posts like this always need a takeaway that you can think on
later.

  * Good logging.  You can always throw away log entries later, but
    getting entries that the software never wrote is impossible.
  * Instrumentation.  Like logging, production grade software was
    designed with the intention that it might need to be looked at,
    and so it should export metrics that tell you what's working, or
    more importantly what isn't.
  * Good documentation.  While I love talking to people on IRC, I
    prefer if the problems that I might face are well documented, and
    that the documentation is easy to find.  If the documentation is
    "Read the Source," that's not the end of the world; but the source
    had better be incredibly well commented in that case.

<br />
Some of the more ethereal qualities revolve around the development
process.  I might look into how many open issues there are, when they
were last touched, and if it looks like the team is open to criticism
towards problems in the software they've written (consequently this is
one of the many reasons I don't believe systemd is production grade).

If you're writing software and want to know if it's production grade,
the easiest way to find out is to go ask an operations team member.
Either in your own organization or on the internet.  Most of us are
more than happy to take a look at software if its interesting, solves
some problem, or forwards the goals of the company.

---

Thanks for reading my wall of text.  If you found this interesting,
please feel free to email me or reach out on IRC.  I idle in
#voidlinux on freenode as `maldridge`.
