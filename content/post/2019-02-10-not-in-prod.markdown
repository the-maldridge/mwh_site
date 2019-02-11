---
title: "Not in Prod - Or - Why I Won't Put a Compiler on a Webserver"
date: 2019-02-10T22:25:58-08:00
---

I was recently asked by a few different people about why I have such
strong feelings about Python in production on Void's infrastructure.
I've also been asked at work about why I'm unhappy with using Ansible
even though it ticks all the boxes for being a pretty good host
management tool.  I figure its high time to look at why I care about
languages in production.

So at first this doesn't seem like it should matter.  Applications are
written in some language, and that language will be able to run in
production, otherwise it would have never been approved to write an
application in it.

So why do I care?

Well, in short its because I'm usually the person that has to run the
*_Super Widget 2000 Turbo_* service in production, and that usually
means putting up with whatever esoteric requirements it has.

## A Constellation of Problems

One of the languages that at first seems great but on reflection
really isn't is Python.  I used to love it, it was clean, relatively
easy to understand, and the library support was insane.  Still nowhere
near as good as Perl, but there were libraries and tool-kits for
everything.  Python for me fell out of favor when I started to live
with an application that my team had built.  It was one of the first
non-internal tools we'd built, and the design shows this in spades.

We chose to build on top of Django, and this allowed us to move at a
blistering pace, something that I'm sure was critical to the success
of the project, since we were doing this entire thing in our free time
rather than on the clock.  Well, the project was built up and was
ready to go, but it had a few critical problems that we encountered
when we went to prod.  First off, we needed Python.  Now because we
were using Ansible in that environment, we already had Python on the
hosts, but had our hosts been running something more minimal such as
Alpine, this would have been an extra dependency.  So we went to
install our application and very quickly realized that the versions of
certain libraries to run our application and to run other things on
the host were incompatible.

No problem, this is something that Python sorted out long ago in
development environments.  We could just have a virtual environment
and run our application in there.  Since it consisted of multiple eggs
all loaded into a single server this would give us the most
flexibility at seemingly no cost.  For those playing along at home,
the more correct answer to something like this is hermetic python, or
something like it.

So far so good.

Well now the Ansible runs for this server crash out while trying to
create the virtualenv.  The logs aren't helpful (Ansible has some of
the worst logging of any tool I have ever used, and somehow still
manages to be better than its competitors).  After SSH'ing into the
server and trying to install the eggs by hand, this is when I
discovered that some transitive dependency needed to build a native
extension, for which it needed the C compiler, and for which it needed
to have the development headers for python and several other packages
present.

At the time, we forged on and installed what the build wanted on a
frontend webserver and then kept going.  If I were doing this today,
we would have been using hermetic python or we wouldn't have made it
that far in the first place.

So what were the problems with Python?  The first really big problem
is that there were conflicts between the so called "system python"
- the one needed to run management tools and parts of the site
infrastructure - and the "application python" - the one that was to
run the application itself.

The second major problem was that python needed to build artifacts on
the host, these artifacts required the availability of development
headers and a C compiler, and they subsequently broke when libraries
got upgraded out from under the applications that wanted them.

As near as I can determine, there is no good way around this second
one.  The way around it would require Google levels of static linking,
and wouldn't be practical for most places to run.  It certainly
wouldn't have been practical in the organization that this application
was running in.  Even if you solve this problem, you still have the
GIL to contend with, and that's not something you can get around in
Python no matter how hard you try.  It requires fundamental changes to
the application design to resolve GIL related woes, and that's a
discussion for another time.

## Shiny Gems and Fool's Gold

The next case we'll look into is Ruby.  Ruby is in the same vein as
Python, its an interpreted language with a specific package manager
and internal ecosystem.  Like Python, it has a mechanism for making a
chroot-like place to have application level components, though I
shudder to think of an environment where "system-ruby" is a thing.

Ruby runs into a slightly different and extra problem than Python.
While ruby still needs a system C compiler, extra packages, and can
conflict with other things, ruby applications tend to be heavy.  This
is really a problem for many applications since it means that they
can't be co-located with other services, and that they tend to fail in
a kind of grind-to-a-halt-then-fall-over way.  Once the slowing down
starts, it tends to be hard to prevent since its a kind of S-Curve
phenomenon.

Those who have used Void Linux may remember that at one time it had a
Discourse forum.  Discourse is pretty slick software, and while PHPBB3
will always hold a special place in my heart, I have to admit I kind
of liked the look and feel of Discourse.  What I did not like was how
slow it was or how expensive it was to host.  It needed a massive
dedicated machine and when it had to go down for maintenance or
upgrades, it was always a bit of a tense experience.

Ruby applications, as near as I am able to tell, all have this problem
of being massive lumbering hulks.  They require a large amount of
resources to run, and once running they don't like to slow down again.
At least they run and work at all, unlike the next language on my "do
not write production services in this".

## Coffee Anyone?

I'll freely admit I have a somewhat unhealthy fascination with Sun
Microsystems.  I think if there was any company in the last 40 years
I'd like to have worked for, it would have been Sun (or maybe SGI, but
that's mainly because the SGI guys at VCF West are so persuasive).  Of
all the amazing technologies and fantastic futures that Sun promised
the world that never quite came true, Java is perhaps the one I'm most
frustrated about.

On the surface Java promised to be this fantastic and amazing
solution.  It was going to be the one language to rule them all, to
run on every CPU architecture, to do so with a single file deployment,
and to do so in a clean and repeatable build.

And then it didn't.

Its 2019 and its still unbelievably painful to manage a large Java
pipeline.  For one thing the amount of infrastructure needed to make
Java builds happen in a reasonable time scale is insane.  Even if you
manage to get your builds running reasonably fast, you now have a
number of JAR files that you need to distribute and run, or if you
truly hate yourself, you have WAR files to distribute and load into
your Tomcat/JBoss/etc environment before wondering why you bothered in
the first place.

When you factor in the insane memory usage of java applications on top
of the slow build times, the absurd infrastructure, and the impossible
to debug errors you get out of it, its a wonder that Java is still
alive today when there are better alternatives that will do the same
thing.  Its really an oddity when you consider how commercially
unfriendly running the Oracle JVM is.

It is my opinion that the Java lives on at this point because there
are companies that continue to have large java investments, and so
American schools look at this and believe that java is important.  As
a result this means that there are constantly new batches of people
that "know" java, but have neither the experience nor the knowledge
of what it takes to build Java at scale.  Thus the cycle is formed.

## A False Hope

I can hear you saying right now that you have a solution to this
problem and it will be great.  You as the developer can solve this
problem for my entire operations team and make our lives great!  All
you need to do is wrap up these prickly dependencies into a single
package and then we can just install that package.  All it really
amounts to is just *containing* the dependencies, right?

STOP.

While this is a well intention-ed maneuver, there's a reason that devs
are devs and ops are ops.  The SREs in the room are glaring at me, but
even then there's a difference between an SRE and a product engineer.

While shoving things in containers seems like a great idea at first,
it sidesteps the problems that led to this situation.  Once things go
into a container, now that process of checking what goes into
production needs to move up the chain a few steps.  No longer is it
operations and security looking at what libraries are being installed
and where they came from, but instead developers pulling in whatever
library is convenient.  This is the kind of situation that leads to
leftpad eventually.

I of course don't mean to imply the developers aren't able to make
good decisions, quite to the contrary I always seek the opinions of
trusted peers when selecting a technology to recommend to the rest of
the team.  I however will always assert that there is a separation of
skills between dev and ops, and that a lot of the skills on both sides
are hard earned from slamming face first into the wall a few times.

## A New Horizon

A bit earlier I mentioned that I had such high hopes and an unhealthy
fascination with Sun systems and the future they promised.  Ideas don't
just die, so that future is still out there somewhere.

I think one of the major things that Sun got right was the idea of IPC
via the network.  By doing everything with RPC you can separate out
things that logically should be done in different languages.  C for
really fast things, Python for things that need nice data processing,
Java for the business logic that will never be ported and so on.  This
allows great flexibility to use each language where it is strongest,
but still maintaining good edges between your many components.

The problem that I don't think Sun really ever solve is the one that
opened this article, and that is that I will not put a compiler on a
webserver.  This sprawl of dependencies is something that really
frustrates me and makes me wish I was not dealing with computers on
some days because in truth it should have been solved long ago.

I tend to write a lot of Go these days, and the Rust Evangelism Strike
Force visits my living room about once a week, but rewriting the
world's code in languages that designed around these problems is a
tough sell to the world's middle managers.  Rewriting also suffers
from the well studied 2nd system problem, and even languages like Go
and Rust which were designed to go to production still have problems.
Even Erlang, the language designed to survive some of the most
catastrophic failures imaginable, still has flaws that make it
unsuitable for a great number of problems.

---

So what should you run in production?  I have no idea!  It depends on
your specific problem, and what amount of tire fire your operations
team is willing to put up with.  At this point I'm reasonably
convinced that there is no production landscape in existence that I
can be truly happy with, only ones that I will tolerate more than
others.  To truly create a functional production landscape that I'd be
happy with would involve an unbelievable amount of design work up
front, which is not commercially viable for most projects, and not
ultimately worth it in the end.

While this article turned into more of a rant than I would usually
publish, I think that's part of the territory here.  The point I'm
raising is that there really isn't a good way to do any of this, and
it all involves a lot of discussion with your team to decide what
you're willing to trade off to get your project done.

If you've enjoyed this article or would like to just say hi, I idle in
`#voidlinux` on freenode, or I get mail at
maldridge[at]michaelwashere.net.

