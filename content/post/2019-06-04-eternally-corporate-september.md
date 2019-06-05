---
title: "Eternal September of the Corporate Open Source Project"
date: 2019-06-04T22:40:20-07:00
---

I am too young to remember the first day of eternal September
personally.  The idea goes like this though: in September 1993, an
engineer at AOL flipped a flag and granted UseNet access to all AOL
subscribers.  It was a clever marketing move, UseNet was easily the
largest online gathering at the time, spanning university and company
networks, and containing a wealth of knowledge.  If you've never used
the service before, try to imagine a web forum with every topic you
can possibly think of in a neatly arranged tree structure.

The resulting influx of AOL users quickly overwhelmed the ability of
the platform to assimilate them into its existing culture, and to
become a part of something larger.  Its all too entertaining then that
less than 15 years later AOL would end the service in favor of its own
newsgroup and chat system.  An engineer I highly respected while a
student once told me, "what's old will be new again" while installing
a thin client based system, gesturing to a vintage DEC console in his
office.  His words rattle around in my head from time to time.  Today
was one of those times.

I fear that this cycle of newcomers may have reached an over-balancing
point and that is what I am writing about tonight.  This will
undoubtedly come off as a rant, and that's ok.  This is my site, and
if I can't rant on my own site about things I care about, then
something has become seriously wrong with the internet, possibly
irrecoverably.

Lets start with a familiar face...

## irc.mozilla.org

As you may know, Mozilla has stated they are planning to sunset and
ultimately de-provision irc.mozilla.org.  In my opinion, this is one
more step down the ladder for Mozilla to fall.  They were once a
massive powerhouse of innovation, they were capable of things that no
other organization was.  There was even a time that they had Google's
own engineers working on Firefox, and now they've fallen to the point
of wanting to replace a freely open and available standard with a
product.  I'm not exaggerating here either, these are three direct
quotes from the notice that irc.mozilla.org would be shut down:

> We are not rolling our own. Whether we host it ourselves or pay for
> a service, we’re getting something off the shelf that best meets our
> needs.

> We are evaluating products, not protocols.

> While we’re investigating options for semi-anonymous or pseudonymous
> connections, we will require authentication, because: The Mozilla
> Community Participation Guidelines will apply, and they’ll be
> enforced.

The above statements come from the personal blog of a [Mozilla
employee](http://exple.tive.org/blarg/2019/04/26/synchronous-text/).

I honestly laughed out loud when I first read the statements above and
had to go verify that the author really did work for Mozilla.  Such
statements are so out of character for Mozilla, and have made it clear
to me that the high ideals the company once held have gone the same
way as Google's "Don't Be Evil".

First, they say that they don't want to build something.  I suppose
that's fine, but a bit odd for a company whose entire function is
building software that respects freedoms and that once pushed the
bounds of innovation.  But sure, whatever.  Then we get to the kicker:
Mozilla doesn't want to stay in the FOSS world, they want a product
that they can buy.  This pretty much pulls things down to slack, or
maybe gitter, though I don't see Mozilla going for gitter.

This is a pretty serious perversion of a company that once claimed to
stand on high and mighty ideals for freedom and integrity.  It seems
that these ideals are only touted when convenient though.  Neither
slack, nor gitter support the user's freedom.  As for integrity, I
think it says a lot when one of the giants of the open source movement
decides to just buy off the shelf rather than leverage their
considerable engineering resources.  However, this does makes sense to
me in the larger context of reports that Mozilla's internal culture is
deteriorating rapidly; they need to offload tasks via money as they no
longer have the raw engineering talent to solve themselves.

But why?  Well that's the last point that is in the above quote.  They
want a way to own the community.  IRC has never really provided strong
moderation tools as its largely antithetical to the beliefs of the
platform.  The intent is always that people can change and grow, this
is why you can connect with no identity.  Its almost a requirement for
permitting certain kinds of personal growth to allow someone to
completely throw away their old identity, and to allow this to happen
without anyone actually knowing its happened.  I fully expect that
Mozilla will go with a solution like Slack or Gitter where they will
have globally persistent sticky IDs on people that they can permaban
for all time or shadow-ban until individuals go away.  Its a shame, as
I expect over time it will lead to Mozilla drifting further into
irrelevancy.

Assuming that Mozilla is able to find a commercial product that does
what they want, which I find improbable, there still leaves the
question of why bother.  Given that IRC servers are fairly easy things
to run, the answer must not be technical.  The answer must therefore
have to do with that last point above, and that Mozilla doesn't
believe they have sufficient control over the project anymore.
Therein lies the rub, and what is in my opinion a core problem with
software projects today.

## Have Fun Storming the Castle!

Mob rule is a scary thing.  People stop acting rationally, decisions
don't get made on normal processes, and the outcome is almost never
pretty.  Unfortunately, this seems to be happening more and more in
the world of software development.  Similar to how UseNet couldn't
cope with the cultural influx of new members in that fateful fall of
1993, many open source projects can't cope with mobs descending on
them today.

I believe this is happening to a number of projects now, and it can be
concerning for a truly open project, or terrifying for a company.  In
the case of a truly open project where the option exists to just say
"No."  I have seen projects do this with great success, it just takes
a while for the drama to die down.  All you have to do is wait out the
mob, they'll lose interest, and they'll go harass someone else.

For a company though, the mob represents a threat.  They are an
adversary to be dealt with by any means necessary, and if caving to
the demands of the mob is the fastest way to do that, then often it
will happen.  In the case of a software project, this can look like
changing design components, altering road-maps based on features, or
even ramrod-ing unrelated breaking changes into a core spec if it will
make the mob go away.

The biggest danger of the mob should be obvious, its damage to the
appearance of the castle a company has built.  As a result of this
fear, many companies have chosen to try to buckle down and maintain
community through force and control, or in other words rules and
tools.  I truly believe that this is what is happening to Mozilla's
communities.  I also think this is what's happening to HashiCorp.
Today HashiCorp announced that they're consolidating their community
onto an owned platform, so lets take a look at that one.

## Stacked Laterally

At $work I run the HashiStack in all its glory.  We have
infrastructure provisioned with Terraform which we simulate with
Vagrant, we use immutable resources built with Packer, our secrets
live in Vault and all our services run on Nomad and interact via
Consul.  I remember when I left Google I was saddened that the tooling
would not be available anymore, but upon finding the HashiCorp suite I
was amazed, I was looking at tooling that worked similarly to a lot of
things I knew and had expertise with.

So why am I taking this tangent?  Well, I do something with the stack
that is not particularly common.  I run it all on Alpine Linux.  Not
in containers, my physical servers are running Alpine.  This has
caused friction between myself and the Nomad team who have now shipped
two bad releases that have hard dependencies on glibc (Alpine uses
Rich Felker's musl C library).  This is a unique point at all since
Nomad is built with Go, which means it should have no C library
dependencies at all.  Instead, Nomad is shipped as a binary which was
linked to glibc, which means it can't run on Alpine.  I find this
quite odd since within the Go community musl is a well known trick to
make sure your binaries actually work everywhere.  I've campaigned for
this now on GitHub, the Nomad Gitter, and a handful of other places.
Unfortunately I suspect I've gotten at least one HashiCorp engineer in
hot water doing this, since its not something that's "officially
supported" by HashiCorp.

Whatever this official support means is a bit dubious to me, since it
seems to imply that HashiCorp expects you to take a compiled binary
without provenance information and blindly run it as root on your
production infrastructure.  I recognize that the HashiCorp
headquarters are in Seattle, but that's a bit too mellow and trusting
even for me here in the Bay Area.  Funnily enough, I've been met with
some resistance every time I bring up that I build my Nomad from
source.  Nomad itself is licensed under a free license that is GPL
compatible.  It should be of no surprise then that the software is
downloaded and compiled by some users.  The fact that this seems to be
an unusual thing to HashiCorp says a lot about the way they view their
community, and unfortunately not in a good way.

Since the software can be freely downloaded and built by hand, I have
taken the time to build up some infrastructure around doing this.
Though I've never been told no explicitly for explaining how to run
Nomad on Alpine, I suspect that I would be told no outright on Nomad's
new community platform.

As I mentioned above, HashiCorp is pulling a Mozilla and is taking
their community in-house.  Unlike Mozilla, HashiCorp is currently on
Gitter, Google Groups, and a handful of other scattered places.  They
have the footprint I would expect a reasonably well funded open source
project to have, and the community size a reasonably long term project
to have.

HashiCorp cites that they find the expectations of many newcomers to
be wrong with respect to gitter and similar formats.  While I can
accept that there are problems of expectations with some newer
developers and the idea that a synchronous text platform could be
real-time, there is nothing inherently wrong with the technology that
provides this.  If anything is wrong, it is a failure of HashiCorp to
manage the expectations of the forums they provide.  Similar to
platforms and populations before it, what's happened here is a failure
of the project to assimilate newcomers.  And indeed, it seems that
instead of managing those expectations, they have chosen to cut lose
these forums and the communities with them much as AOL did in 2005.

## Splitting Hairs and Communities

I spend a great deal of time splitting hairs with [phy1729] about
projects that we've worked on in the past and mistakes that should
have been obvious to us.  One of the biggest disasters of my past were
my attempts to moderate an open source group chat room.  I held the
rank of president of the group, and I had gotten it into my head that
the topic in the channel should always be technical.  Over the course
of 2 years I managed to drive off some of the long standing members of
the community and to damage the culture of the forum by trying to
moderate by tools and rules.

There are very few decisions that I don't have to think about if I
would take them back, this is one of them.

What happened as a result of my actions was a split of the community.
Some people went to alternate channels, some people just left.
Ultimately by the time I stepped down there wasn't the momentum to
keep the group going, and its now become a much smaller group of
people that continue to hang out and chat as friends, rather than the
once quite large technical group we started as.

What's happening now with HashiCorp and Mozilla is what was happening
with my group some time ago.  I tried to moderate a group to suit my
ideals, not realizing that in the process I was destroying what made
it work in the first place.  I was splitting a community up.

In the case of Mozilla this has already happened.  There are numerous
people that converse on freenode, and many people that converse
exclusively via email lists.  In the case of HashiCorp, this is slowly
happening now.  Earlier today several of the most knowledgeable and
active voices in the Nomad Gitter room looked at where we would
re-convene if the room vanished.  We have no intention of joining the
new "social platform" that HashiCorp is trying to push, which is sad,
since amongst us we have a fairly significant amount of expertise.

Splitting communities is a dangerous thing, especially if your
community already can't assimilate newcomers.  Bending to the mob must
never be the default solution, as to do so is to betray the fact that
your project has no integrity and nothing it holds as sacred.  Change
must happen sometimes, but to change things at the cost of losing the
community that got you to where you are now is foolish.

## A Utopian Society

So how do you manage a community?  Simple answer, you don't.  There is
no magic bullet that will turn an unruly room of developers into a
Utopian society, and I'd really appreciate it if the stewards of many
projects would stop wasting time trying to make this happen.

A mentor who I highly respected, and who knew this, once bought my
lunch while I was fumbling for change as an effectively broke college
student.  I was frustrated with him as I had the money to pay for my
sandwich, and I had fully intended to do so.  He replied with an
answer that I did not expect: one day when he was a student, one of
his professors had bought his lunch, and then proceeded to talk about
interesting happenings in the field, not as teacher and student, but
as equals.  His professor had told him when confronted about paying
for lunch that when he was young, one of his professors had bought him
lunch one day, and someday it would be my mentor's turn to buy lunch.

I remember that during that particular lunch, we talked about
adventures in the early internet, the potential for [incendiary
pop-tarts](http://www.pmichaud.com/toast/), and what the world wide
web might look like in another 30 years.

As he told this story to me, he concluded with someday it would be my
turn to buy the lunch, to keep the cycle going.  I'm not sure how far
back this unbroken chain of lunch money goes, but I like to think it
goes back a long long ways.  I'm not sure who my mentee will be when I
someday buy lunch, but an important thing of that day for me, as it
will be for a mentee, is becoming part of a chain, part of a culture
of sharing knowledge, sharing resources, and making sure that others
could follow in your footsteps.  I didn't fully appreciate this until
much later, the idea of helping people bootstrap a path.  I think many
people who've had this experience didn't realize it at the time and
might not realize it now, and so might not realize what's happening,
or not happening, in communities around them.  I certainly think that
the average company stewarding a successful FOSS project into a huge
IPO doesn't realize this.

## Back to the Soap Box

So in closing I think I should make my stance plain.  I am a very
intense person and I do not yield easily.  I do not like the direction
that company sponsored projects seem to be going, retreating into
silos and having managed communities.  Such regressions stifle
innovation and reduce the enjoyment skilled developers get from the
projects.

I especially ask that any project that I've given my time to respect
my time.  I'm not just some downstream consumer you can brush aside,
I'm a contributor and I've found problems with your product, and I've
fixed them for free.

For now I'm taking a step back from my planned projects around the
HashiStack.  I'm going to wait for the dust to settle before I
continue investing time in it, even with the only alternative being
the unmitigated disaster that is Kubernetes.  I won't be joining their
managed community any time soon, that much is for sure.  I haven't
been a contributor to Firefox, though as the R.E.S.F. visits my living
room about once a week, I do have a lot of contact with Rust.  I'll
hold off on Rust as well until the dust settles on where they're going
to be a community.

My sadness at projects attempting to manage communities with tools and
rules rather than mentor-ship and growing a community organically
cannot be understated.  These are mistakes I've made personally and
would take back in an instant.  If you run a community, don't make the
same mistakes I made.

As far as places for communities for me?  Well, I have been a Staff
SysOp, a Senior SRE, I've worked on some of the largest production
fabrics in the world and a myriad of FOSS projects, and if you want my
expertise, I'll be where I've always been: idling on IRC.

---

Hopefully you've enjoyed or at least found this post informative.  It
should be obvious, but these words, concepts, and opinions are my own
and do not necessarily reflect those of my employer.  If you want to
get in touch with me, I can be reached via email at
maldridge[at]michaelwashere.net, or as `maldridge` in `#voidlinux` on
freenode.
