---
title: "What Is Open Source?"
date: 2019-05-02T22:11:20-07:00
---

Those who are near me for any length of time know that I like open
source.  To me it speaks of a kind of engineering purity that I don't
see in a lot of places.  I thought I'd take some time and write down
what open source means to me, and what I look for in projects that I
work on.

First, I think its important to define the two kinds of source that
there are and the degrees of openness I'm referring to.  The first,
and most open kind is that which is not associated with any corporate
entity.  The second kind is sponsored and answers to, either wholly
or in part, some corporation.  This is a very important difference and
comes out more often than you would think.

## Truly Open

Software that is truly open is rare.  For one thing not many skilled
developers go home and write code in their free time, so the pool of
people who can participate is fairly small to start.  Secondly, it is
rare for someone who is good at software development who is actually
free to develop software.  Of many things I disliked while working at
Google, the fact that my ability to participate in open source
projects was reduced was maddening.  There are reasons to keep a close
eye on your developers and what they work on in the off hours, but
when it comes at the cost of your employee happiness, something is
wrong.

Software written in this format of development is rare, but when it
happens its amazing what can be accomplished.  This is software that
exists beyond the control of a board of directors, legal, or HR, and
it can get into territory that is sometimes pretty gray.  BitTorrent
is a fine example of software like this.  Its amazing how complex both
the BitTorrent protocol is, and how complicated some of the client
software can get.  This is software that I would be surprised to see
ever exist under the host of a US based company, or with Article 13
any company in the EU.

Void Linux is another project that weirdly still exists in this space.
There is no legal entity behind Void, its just a group of developers
building a thing and sharing it with the world.  This has caused some
friction for sure, but for the most part people act like adults and we
are able to build amazing things.  Void is one of the only Linux
distributions I can name off the top of my head that answers to "no
one".  Debian has long answered to the companies that employ the
people who sit on the General Assembly and the Technical Committee,
and Cent-OS just does whatever RHEL does.  Void stands for its own
ideals, and this is something that I appreciate.

This gets to the first quality that I seek in a project: engineering
excellence above all else.  While it would be a stretch to put Void on a
pedestal and claim it as a paragon of engineering expertise, it is built
on strong foundations of building the most correct things possible.
This is also why I have a strong appreciation for software written in
Rust and Golang.  These are unforgiving languages that force the
author to think carefully about application design to build something
that fits together reasonably well.  There are many other unforgiving
languages, C for example, but many of these other languages will still
permit the author to make very poor choices without so much as a
warning.

Another thing I often seek in a project is engineering freedom.  While
I am painfully aware of the political landscape that often develops
around projects that are open source, I believe that even in many of
these projects there is still absolute engineering freedom.  Any
developer is free to work on any problem or feature they so desire,
and it allows people to work on what they truly care about.  I'm sure
anyone who's had to work on a feature they didn't care about, or worse
one that was known to be doomed will appreciate being able to have
complete autonomy when selecting tasks.

These qualities tend to exist solely in truly open source projects,
and there sadly aren't many of these left.  Given that there are so
few, lets look at what I refer to as "less open" projects and what
this means for them.

## Less Open, But Still Pretty Open

Projects in this category are still pretty open, you can contribute to
them as an outsider, but they're not as open as above.  Often times
features are restricted based on your relation to the project, and in
some cases its even restricted to what you can contribute to depending
on your relationship to the project.

This is where the vast majority of projects live.  In the case of many
open source projects, its because there is some company paying for
them, or some corporation that directly owns the project.  In the case
of Debian there is the foundation which governs the project.  The
project is still mostly open, but there are more rules, there's
corporate bureaucracy, and there's often times some of the elements of
a job that I try to avoid when working on projects for fun.

Also in this range of projects are projects that have a core/licensed
split.  This is often made clear by the existence of a "community"
edition which has only the "core" features or some other arbitrary
restriction placed on it.  This tends to be the model that many
commercial open source projects run on, despite being maddening from
an engineering perspective.

From an engineering perspective, this leads to a compromise in quality
and design integrity to support a business goal.  Take for example the
desire to have a licensed enterprise edition of some project.  The
most obvious feature is the license which allows a company to obtain
software on terms they may find more preferable.  The problem with
this approach though is it requires the separation of the code that
drives these enterprise features.  This now needs to be silo-ed off and
maintained by a dramatically smaller, dedicated team who don't have
the resources of the main project.  It also needs to be integrated
periodically and there are tests that need to happen to ensure that
the "core" edition doesn't break any enterprise features, and that no
enterprise features break the core.

In my opinion this model is fundamentally flawed, but its still
workable.  It tends to lead to fractured code bases over time, and it
leads to enterprise software that has a poorer security review than
the "core" that it is built on.  It also leads to an agonizing
decision every time a new feature comes up as to whether or not this
is a core element of the project, or something that should be licensed
and provided only to the elite few.

While there are a great many things I think they've done wrong over
the years, one of the things that I think RedHat got absolutely right
was the way they handle software in this tier.  Every line of code for
every RedHat project is open source, or at least was the last time I
checked.  What RedHat sells is the experience.  I'll explain: If you
install CentOS, it will work, and it will work well.  But if you want
to have a fleet of CentOS machines and run them with Spacewalk it will
work, but you won't have the same experience you would have if you
were using RHEL and Satellite.  Similarly, the thing that RedHat sells
is the ability to offload your companies problems to someone else.
Got an un-googleable problem after an update?  No problem, just open a
ticket and a representative will help you sort it out.

This last bit is something I would absolutely pay for no questions
asked.  I consider myself to be a pretty resourceful person, and good
at solving most kinds of obscure system problems.  However, I would
still fork over a decent amount of my, and my employer's, cash to be
able to make problems go to the people that wrote the bugs directly.
As far as the "enterprise features" are concerned though, I couldn't
care less about them.  I will go to great lengths to find some other
way to do what they do, or in many cases I simply don't see the value
in them.

A great example of a project I wish I could do this with are the
various components of the Hashicorp stack.  My organization doesn't
need any of the enterprise features, so it makes no sense for us to
secure that kind of license, but if we could get support for the open
source edition that would be a major thing.  I suspect this is not a
unique situation, and I can easily come up with a dozen other projects
which are in a similar place of "wow I wish we could get support for
this without needing to buy licenses we have no intention of using."

These projects are often though still worth my time and I will happily
contribute to these projects if the terms are reasonable.  I
personally won't sign a CLA for anything, and I generally am not
inclined to work on projects that make me ack a policy outside of a
`git --sign-off`, but I will still send my patches to many projects.
Entertainingly I've also yet to see a project truly handle the CLA
situation correctly.  Strictly speaking such projects should be easily
breakable by waiting for some critical bug, fixing this critical bug
and posting the patches to the public source repo in an PR and then
refusing to sign the agreements.  This would by all rights present
poisoned knowledge to the project and its team, yet they'll still
gladly accept an identical patch from someone else who signs the
agreements.

## Open in Name Only

These are projects that are quite honestly a waste of time.  If I
think a project has fallen into this category, I won't send patches to
it, I won't try to get a package for it in any of my Linux
distributions of choice, and I won't even waste my time reviewing a PR
for such a package.

Projects that fall into this category are trying to present themselves
as Open Source, but really have no intentions of being open source.
They use the terms to present a feel good vibe for the project, but in
reality the free source code is really just to drive license sales.
Projects like this are fortunately easy to spot from a mile away.
Just look for licenses like AGPLv3 or SSPL.  These are licenses that
supposedly protect freedom, but if you read the fine print you'll
almost always find that the same code byte for byte is available under
another license if only you'll hand over some cold hard cash.

These alternate licenses usually just strip out the requirements from
the GPL and the network requirements around accessing the software
remotely, but they also can usually be built to suit with sufficiently
dense legalese that each side thinks they're winning.  These are also
projects that try to play the little guy in an argument of why the
source is licensed in such an unfriendly way.  As an example, I got
one such email earlier today in response to an inquiry about where I
could find some source: "We needed to be more strict as we have many
billion dollar companies that were using our software intensively
without contributing financially or technically."  Its a shame too
because I've actually written the code that they needed to make the
feature I wanted work, but I have no intentions of contributing it to
them if it won't be public.

I'll also spell out how I read that quote in my head as I think that's
important to discuss.  To me, I read that quote as "we weren't making
the boatloads of cash we thought we would off this open source thing,
so we decided to just screw everyone over to force more commercial
licenses."  It shows a complete and total lack of understanding about
what it means to release code under a permissive license, and it shows
a complete and total lack of understanding about what the point of
releasing the code was in the first place.  What they've done isn't
create an open source project, they've thrown some code at a web
server and said "here you go, but don't actually use this because
we'll sue you".

Of course, projects rarely start this way.  Almost always, they start
off as a proper open source project and grow over time.  At some
point, there is a decision to try and start a company around the
system that started out as little more than a sketch on a napkin.
This leads to a need to make money off things, investors that have no
idea what they're getting into or talking about, and engineers who
often with good intentions try to just make everyone as happy as
possible.  Its only over fairly large spans of time, and often only as
an outsider that one can truly observe the corruption of a projects
ideals.

## So What is Open Source?

Open source isn't about making money.  Its not about recognition
either.  Its about building high quality software with people that you
might not otherwise get to work with on projects that might not
otherwise exist.  One of the things I always enjoyed looking at at a
past job was the badge server.  On this server there was a badge that
would be awarded if you had more than 100 commits on your own and more
than ~90% of the blame in a single source package.  The badge was a
grainy picture of Iron Man with the text "Tony Stark built this in a
cave!"  It captured the determination of an engineer, albeit
fictional, to bring an idea to life no matter what the circumstances
were.

For me, this is what open source is all about.  Its about bringing
ideas to life and producing something amazing.  I don't care if I
never see my name in lights, and I certainly don't expect to make any
money off the things I build in my free time.  I want to take ideas
for things that will improve my life and the lives of other engineers,
and turn them into something you can download and compile.

This is what open source means to me.  Its taken me a number of years
to figure out where I stood on all of it, and my position continues to
evolve as I work on more projects and participate in more discussions
with other developers.  I challenge you now as the reader to sit
quietly for even just 5 minutes and think about what you believe the
purpose of open source to be.  When you truly sit down and think about
it, you might be surprised at what you actually believe.

---

I hope you found this article interesting.  Since this is one of the
more hot button issues I've written about, I'll spell out the obvious
for this one that the ideas I write about here on my personal site are
not necessarily those held by my employer or any of the projects I
contribute to.  They all have their own ideas and policies, which
fortunately are their own problems.
