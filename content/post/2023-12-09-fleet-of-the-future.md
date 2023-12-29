---
title: "The Fleet of the Future"
date: 2023-12-09T14:08:31-06:00
---

I was recently asked at my day-job to think about what the global fleet
would look like if I had the powers of Star Trek's Q and could snap my
fingers with a flourish and re-form prod into what I think would be
better.  Without the restrictions of design documents, dozens of
project management strategies and more meetings than I can shake a
stick at, I've put a lot of idle time into thinking about this.  While
I have more specific recommendations about that specific fleet, I
think some of the themes are worth discussing more broadly, and its
worth publishing to get other people to think in those broad terms as
well.

To be clear, every fleet is different and it depends on what you're
designing for.  In this article, I'll be talking about the developer
and operator experience framed in the context of a bare-metal fleet in
multiple physical datacenters which hosts highly stateful applications
that make use of vast arrays of storage.  This is quite a different
fleet than many places will work with by virtue of not being in a
cloud and composed almost entirely out of not only stateful
applications that we run, but everyone else's state they've pushed
into a "someone else's problem" field.  Surrounding a problem with a
SEP field doesn't make it go away, just makes it the subject of
someone else's blog post.

Lets talk about what the developer experience should be, since its
often easy to forget when working as an infrastructure engineer that
the product you provide internally is developer experience.
Developers often work with pretty bad analogs of production, and then
are totally lost when suddenly getting pulled into an outage call that
requires debugging of their portion of a large scale system that may
be scaled out horizontally beyond the boundaries of your average
conference room whiteboard.  In my experience, we can divide the
developer experience broadly into 2 parts: how you deploy and maintain
software into an environment (potentially via some indirection with
automation) and how you troubleshoot faults in a deployed application
or complete service stack.

Deploying an application shouldn't require a developer to think about
what endpoint they're connecting to, you shouldn't need a wiki page
that says what regions are serviced by what controllers, and you
shouldn't have to keep track of what endpoint is for staging or
production.  If you submit a job to the production environment, it
should go to the right place without a developer needing to think
about it.  "The production environment" deserves some discussion here,
since I use a more expansive definition for that than is in common
use.  The production environment for a service is any service or
system that people care about if it goes down.  Since developers are
customers of infrastructure, all staging environments are production
*to them* since an outage of a staging cluster will cost productivity,
slow down releases, and potentially jeopardize a production release if
testing can't be performed in a timely manner.  Operations may chose
to have its own staging or testing systems to play with, but the
clusters that are maintained for use by internal customers in the
company are for all intents and purposes production clusters, just not
necessarily holding data or providing services to external entities.

Its also important to make sure that accessing operations resources is
a low friction experience.  You shouldn't need to talk to 5 different
departments to get access to something and then connect to 2 different
VPNs in the name of "security" just to check CI status on a patch.
This goes doubly so for interacting with systems during outages.
While consoles are insanely fast and efficient for people who work
with systems every day, getting a big picture quickly is often
communicated better graphically.  Think in terms of web pages that
show at a single glance how many shards of a replicated service are
healthy, if there's a global deployment in flight that hasn't
completed successfully, or if there's a problem with accessing a
resource in an external system that's preventing an update from going
through.  These are common tasks that are much more quickly expressed
by a big red/green indicator than something that a console interface
can present for dozens of services at once.

Developers may be the customers, but a system that's hostile to those
maintaining it is not likely to be efficient, performant, or cost
effective.  For this I like to think in terms of pizza-teams.  Jeff
Bezos is credited with the 2-pizza team rule, and I think its a pretty
good way of trying to keep a lid on how complicated systems get.  At
the point your system needs more people than can be fed by 2 pizzas
your system has become too complicated.  This reveals itself at the
worst possible times when you need to make a change and have to track
down too many people to get it approved and rolled out.  Small teams
are able to quickly share understanding, work through problems, and
maintain strong working relationships with each other to reach high
performing states that are unavailable to larger more fragmented
teams.  Do note though that even a one-pizza team encumbered by
management who can't stand aside and let SMEs work won't be
successful.  Fancier titles are always a trade-off that atrophies
technical knowledge, and the mark of truly skilled management is
knowing when to sit down and be quiet.

Operators want services with predictable failure states, no security
theater, and the appropriate amount of complexity for the job at hand.
If you were to come to me and tell me that your fleet's update system
has multiple academic whitepapers published about it, I'd be very
impressed and interested to read them, and then looking for something
simpler and more stable to run in my own environment.  Some day I'll
get `cfengine` working, but that day has yet to happen.  There's
rarely a need for the most complicated systems down at the lower
levels of system infrastructure.  I primarily work in the region from
the bare metal up through the operating system and configuration
tools, and then hand off to other teams for business applications.
Those are cool things, but they have no business in a system that
needs to power on, receive work, and then do that work until I reboot
it or do something else.

To this end, I often deal with people who forget that containers do
actually need to run on something.  I deal with a lot of kubernetes
hype, and this hype has no place in the fleet of the future.  Don't
get me wrong, I believe the developer experience a motivated team can
provide on top of kubernetes is impressive, but its the wrong tool for
the bottom levels.  At the baremetal layer I need simpler and more
scale-able primitives.  Its nice if I can then use those primitives to
orchestrate containers, but its not nice if that comes at the cost of
doing privilege isolated baremetal things as real unix users, or the
extensibility to drive specialized supervisors on bespoke hardware.
The value of an orchestrator is amortization of mental cost associated
with the systems it orchestrates and if your orchestrator handles less
than half the fleet its less than useless due to the pure cost it
adds.  It should come as no surprise then that I think Nomad is
probably the best orchestrator on the market today for managing large
fleets.  There has been some really interesting work lately around
running single tenant kubernetes clusters on top of nomad, and since
that's how most k8s clusters I've encountered in the wild are
deployed, this seems to provide a good balance of functionality and
tooling.

Likewise to managing services, the experience of managing the network
is important.  From provisioning machine to provisioning services, its
important to have a clean and automated process.  If your process
involves talking to a human for an IP or DNS name, your process is
unworkable at scale and is at best going to frustrate people, and at
worst going to double issue resources that you're probably asserting
uniqueness on elsewhere.  Make heavy use of the automation the rest of
the world has built for you here.  Some of my favorites in this
category include link local addressing, DHCP, and link-scoped BGP
peers.  These technologies mean you don't have to care about moving
packets from A to B and can get on with actually using the network to
do work.

In actually using the network, always remember that you need to be
able to simplify it for a developer workstation.  I've so far only
worked at one place where my desktop was running routing daemons and
participating in an MPLS fabric, and while entertaining, you could see
it in the ping times that this was a slow and clunky solution.  Most
of the time it should be possible to remove the network entirely and
bind services to a loopback adapter in order to simulate things
locally.  I'm a huge fan of Consul Connect and being able to shuttle
this experience to production where you just keep everything bound to
localhost and then can make use of an external service for network
ACL-ing and traffic engineering.  Since these are concepts that need
to happen in absolute lock step with any orchestration they must be
automated.  If your network security posture depends on me not
changing port numbers or IPs, you don't have a security posture, you
have an exercise in directing a river with road signs.

Its been over 10 years now since the Phoenix Project was published,
and while some things have changed dramatically in that time, a lot
has stayed the same.  We still run large fleets of compute to back
increasingly complicated and dubiously architect-ed applications.
There's still the hype framework of the month that every CTO is going
to want, and there's still the never ending game of whack-a-mole with
byzantine security theater that various clients are going to demand.
What has changed though are the timelines people expect you to deliver
the moon on the silver platter, and the number of moons per engineer
that are now demanded.  Its only possible to deliver on these
expectations by leveraging automation that didn't exist 10 years ago
and looking critically at the problem you have rather than the
solution some blog says you need (including this one).

This is a snapshot of how I think about production systems today, and
like an essay I wrote some years ago that remains unpublished, it is a
frozen checkpoint in my understanding of the state of the art.  I'm
sure that in the next decade the world of production fleet management
will continue to advance, but I also think that we're broadly homing
in on certain archetypes that are proving to be not quite as limitless
as we may have originally thought.  Just as the end of Moore's Law has
spurred new and unconventional improvements to semiconductor design,
I'm sure that as we start to bump into the limits of current paradigms
we'll find new and unconventional ways to push them out again.  What I
don't think will change is the need to run more systems with fewer
people all the while running every datacenter hotter and denser.  When
I started at Google I was shocked to see that the target fleet usage
was just shy of 80%; now though I think this figure is almost too low,
especially at the margins that Google operates at.  It would not
surprise me to learn in 10 years that the highest performing
infrastructure shops are reaching 90% sustained utilization or higher.

---

I sincerely hope that this post has been interesting and spurred you to
think about the way infrastructure is delivered.  If you want to send
me an angry rant telling me I got it all wrong, or just want to start
a thread discussing some of the thoughts here, feel free to email me
at maldridge[at]michaelwashere.net.
