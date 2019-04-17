---
title: "Technical Debt - or - Why 'Its just a Demo' is Bullshit"
date: 2019-04-16T19:40:13-07:00
---

I often get asked about why I am always so frustrated with the code
that people tend to write.  This discussion came up recently between
some friends about why NetAuth is both in production with Void, and
not 1.0 yet.  For me, this has to do with the expectations of quality
I subject most software to and my expectations for the risks an
organization should be willing to put up with.

So what is technical debt anyway?  Technical debt means many things to
many organizations, but to me it means knowledge that is lost to time
during the long running life of an application once it passes the
point that it can fit in the head of any sole developer.  Some might
argue that technical debt is the reason that applications exceed
mental limits, but that is a philosophical discussion for another
time.

So what this winds up meaning is that over time if you develop
software you will make choices along the way that are either not fully
documented, or perhaps not fully understood, which will cause problems
down the road.  Similar to how one must pay off debts before taking
out a new loan, it is necessary to pay down technical debt before
proceeding to a new and shiny project.  It is especially important to
pay down as much technical debt as possible before transitioning an
application to maintenance mode or handing off to another team.

So where does this technical debt actually come from?  In my
experience, it comes from people wanting to do things faster than is
reasonable.  Perhaps you've been in this situation where you have a
project manager breathing down your neck to get the demo up and
running before the big boss walks in, or maybe you've been putting
patches on quickly during a flight to a conference.  Even the great
Steve Wozniak has a great story about accidentally destroying the one
working copy of a floppy disk driver while at a conference due to
making a bad call under stress.

This kind of attitude has a name, and is a surprisingly well
understood phenomenon.  It's been the subject of several government
reports, and in the US space industry, its named "Go Fever".  This
kind of mindset is all about the next goal.  If the goal is to launch,
then a launch will happen whether or not its the right thing to do,
often with disastrous results.  This can come in the form of glaring
security faults, obvious edge cases, or even just core features that
simply don't work and have to be gutted and rebuilt later.  Go fever
in software can be even more dangerous and disastrous in other
industries because software engineers are used to being able to just
ship a new build if things don't work.  We often don't stop to think
about what the cost of the errors we're resolving truly is.

One of the biggest examples of this from my past came during my time
at the University of Texas at Dallas, where I worked as a Network
Administrator for the Honors College.  We had a need to be able to run
a secure ballot system to allow students to vote in a student council
election, and there was a desire to do so electronically to reduce the
turnaround time before declaring a result.

Finding that this should have been a really simple problem to solve
that no software satisfactorily solved at the time, my team wrote a
small python application that did this.  It presented a web interface
where you could select the candidates you wished to vote for, and
where you could read a small bit of information about each one.  We
build the initial version in about 2 weeks of off and on development
time that wasn't billed back to any particular project.  This was,
after all, just supposed to be a demo.  We then demoed the application
to the appropriate people within the department who thought this would
be a fantastic improvement as it would mean that they no longer needed
to manually tabulate ballots.

As you may have already guessed, we did not ever take the time to go
back and refactor the application to improve and resolve the obvious
deficiencies in it.  It wouldn't be until a year later when we were
building the Constellation Suite that we concluded the design was
fundamentally flawed and sought to fix it.  By this time, the damage
was done and Constellation itself had an irrevocably damaged design in
order to accommodate the voting application's inclusion.

I call this kind of debt inclusion "demo-syndrome".  You build
something that's only ever supposed to be a demo, and you show it off
and people like it.  Unfortunately, unless the people you show your
demo to are also software engineers, you will have a very hard time
explaining to them that what you've built isn't actually a sustainable
solution and will need to be rebuilt.  This discussion is one that as
an engineer you will almost always lose.  People look at it and say
that it clearly works, so they won't pay for engineering time to
rebuild it just because you think it needs to be rebuilt.

Technical debt, like real debt, can also be thought of to have an
interest payment.  This is roughly how much you pay to just keep your
system running without fixing any of its problems.  For small things
like a module that is implemented poorly, this is pretty safe low
interest debt.  For things like a demo that was just barely good
enough to stumble over the bar into production, this can be extremely
high interest in the long term, and for things like being on a
framework that is dead, the interest can be apocalyptic high.

So how do you get out from under a student loan sized technical debt?
Its a hard and unpopular road, and its a road that the business has to
commit to fully and completely.  You have to first stop shipping
anything that isn't a bug fix or a debt reduction.  Continuing to ship
features during a refactor will only serve to frustrate your
developers, frustrate the stakeholders, and to expose a project
manager who's never tried to reduce technical debt before.  Once
you've succeeded in making a project "read-only" as far as features
are concerned, you should figure out what it actually does.  See if
you can carve things off and move them out to different modules, or
see if there's common functionality you hadn't previously noticed.
This will allow you to make better decisions in the next part.

The next and hardest part is specifying what the different parts of
your application actually do.  This part is critical to bee able to
rewrite things without breaking thought-to-be-unrelated components.
You need to state in plain terms what various parts of your
application do, and what the promises are made by your interfaces.  If
you can do this, you're well on your way to being able to recover from
your loan shark of a code repo.

Just making one time lump payments to your debt isn't enough though.
You have to constantly keep on top of your technical credit score and
maintain it just as vigilantly as your monetary credit score.  In the
best organizations, this will manifest as some percentage of every
development cycle dedicated to maintenance, and a larger all-hands
cleanup roughly every quarter.  In lesser organizations, this will be
just one or two engineers fighting for cleanup, if any.

No matter what you do, remember to code responsibly and not leave a
disaster zone in your wake.

---

Does your organization have a high interest credit card of technical
debt?  Feel free to ping me with your thoughts on this article if you
found it interesting.  I can be reached at
`maldridge@michaelwashere.net`.
