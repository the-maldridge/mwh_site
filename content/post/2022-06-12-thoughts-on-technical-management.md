---
title: "Thoughts on Technical Management"
date: 2022-06-12T23:23:54-05:00
draft: true
---

I was recently chatting with some friends who commented that I seem to
possibly be frustrated by institutional problems, regardless of what
organization I work for.  This led me to think about the technical
management I've had over the last 10 years and how things have gone.
For the purposes of this discussion I define "technical management" to
be a manager who has a deep understanding of the tasks I am working
on, and has, though potentially not recently used, the knowledge to
immediately jump in and replace my work should it become necessary.
This is in contrast to HR management who typically have no functional
knowledge of the employee's given domain.

## The Good

I've been fortunate to have 3 really good managers through my career,
each for different reasons.  In one of the first bases I had an
extremely technical manager who was able to be a pretty amazing
mentor.  They were what could easily be described as a UNIX Wizard and
had the beard to match.  Some of the qualities that made their
management so good were that they knew what to let me flounder on and
when to step in and lead projects that could not be allowed to delay.
The team they worked with was a broad architectural design unit within
a software development company, and this team had broad latitude to
make choices that would impact lots of other projects.  This meant
that I worked usually on a spread of projects that were both extremely
time critical (select a technology that another team will begin
working with next quarter) and very abstract/leisurely (evaluate these
5 technologies and write up an opinion on each).  Though I worked
under this manager for only a short time, they rank very highly ove
the last 10 years.

Another great manager I have had was one of the most hands off, but
still had a relatively deep understanding of what I did.  In that
environment, they were the only dot between myself and the CFO (a
strange reporting structure in its own right) and served as my go
between in budget and schedule.  One of the things that made them so
great was that they would lay out broad goals of what they wanted to
do with a pretty good idea it was possible and then I'd go off and
build something that could do what they wanted without further
conversation or interaction.  I take very high levels of technical
ownership of projects I am assigned to, and it worked well to have a
management chain that was okay having extremely low levels of
technical ownership.  Unfortunately this manager left the company
after a few months, lets see if their replacement shows up elsewhere
in this list...

The one notable exception to my rule of "technical management" is
probably the best management I have ever had to date.  This was an
extremely distinguished faculty member in an academic environment who
was, in the nicest way possible, constantly challenged by technology.
They could handle e-mail, and with some analogies, they could usually
grasp the broad concepts of what I did, but when it came to direction,
they had only one mandate: "make sure the end users are able to
perform the tasks they need to perform, as much as is reasonably
achievable."  This was the level of their mandate, and their
administrative assistants were able to help in limited context,
usually by rubber stamping purchase orders or obtaining signatures
from remote departments.  One of the things that I liked most about
this particular post and management style was that it was the most
direct style of goal setting.  They set the goal in terms of user
happiness, and with the caveat that it should be to the level
reasonable and then left my team to decide what both of those values
meant.  On extremely rare occasions I might need to justify a "no"
back to my management and on one occasion justify a "yes", but in
almost every occasion myself and my team met our mandate.

## The Bad

I've had 2 managers over the years that really dropped the ball, but
were at least still passable; i.e. I didn't quit as a direct result of
them.  Each of these managers had somewhat dysfunctional management
chains around them, but I can only speak to their specific
shortcomings.

The first was a manager who was a great person, and people generally
found them pleasant to be around, but they were an extremely poor
culture fit for the organization to the point that I don't
realistically think they should have been hired.  They preferred a
much more hands-on and at times distrustful management approach than
their peers managing other teams performing identical work (management
being fractured to keep the reports to managers ratio at something
realistic).  This predictably led to distrust from the staff back to
them.  I know tears were shed by both manager and reports on this
team, and a number of people did choose not to return and cited the
manager specifically in their exit interview.  While I mentioned that
management and their dysfunctional interpersonal relationships were a
reason I was leaving the department as a whole, I ultimately left for
another part of the organization that had offered me better pay and
better hours.  This earned some raised eyebrows and a longer
conversation, but ultimately the division director decided that they
weren't unhappy with the way things had been run, just not
particularly happy with it either.  Last I checked in on that
organization the entire management team had left shortly after myself,
and the division was under much more direct oversight as a result of
the events that led to the turnover.

The second "bad" manager I have had was the first of 2 managers I've
had that were promoted to management out of necessity.  They were an
individual contributor with a strong grasp of the goals of the team,
and when a manager was required, they were elevated to lead.  This
almost never works out, and I must recommend that if you find this
happening to you you begin working out your escape strategy.  This
manager ultimately had no prior experience in management, and so
didn't know how to go to bat for their reports.  This was
dissapointing, and their counterpart in the other half of my
geographically distributed team didn't exactly help things by being
such a massively more experienced manager and not realy interceding
when things became messy.  I don't know what the politics were between
those two individuals, but I think a large part of it was that my very
technical manager didn't quite know that when you are supposed to be
responsible for a team, you can't flounder and figure things out, you
have to ask for help much earlier.


## The Ugly

I have had 2 managers through my career that I have left the
organization as a direct result of.  Both cases were managers who had
very little understanding of what I did, and who very shortly after I
left got to answer some extremely uncomfortable questions during a
massive outage about why they didn't know how to fix things.  Though I
make every effort to document what I do, infrastructure engineering is
still an artform that is different from application development.  Its
not for everyone and you have to know what you're doing, something
that managers who manage both appdev and infra teams rarely do.

The first of these was a manager who had been promoted to management
from being a senior developer with the company from an early time.
They had slowly grown the team over the years far past the sane 2
pizza limit, and when my team got added on with a security team
adjacent to me, this particular manager had no idea what my group or
the security folks actually did, only that we were needed to scale the
company.  This led to many head-butting moments during my tenure with
things like "you need to handle the case where a cache server might be
unavailable", followed by a vague pointed statement from them that I
should ensure the cache servers stayed available.  No amount of
infrastructure can make up for poorly written application code, and
this was a manager who just didn't seem to understand this.  Likewise,
no amount of security scanning can make up for inherently insecure
design choices, and my counterparts were constantly pulling their hair
out over issues with gaping holes in the application's security story.
I ultimately left the company due to this manager's unprofessional
conduct.  For me, they were an example of someone who was great to
hang out with, but was not skilled at management, and didn't know when
to divest their authority to multiple managers and move up the ladder
-- you can't have 30 direct reports and still do a good job of
managing all of them.  I left the company without really telling them
that, and that's part of what prompted me to write this blog post.
They were genuinely fun to hang out with and be around, but as a
manager they were rude to both my group and to other employees outside
of engineering, and generally were unpleasant to be around.  Overall
this is probably the saddest entry in the list since it was the exact
case of not leaving a bad company, but leaving bad management.

The second of the ugly management environments I've been in brings us
back to the successor of one of the best managers I've ever had.
After a lengthy search while the company tried to find a successor to
a very high-on-the-org-chart engineering manager they eventually
filled the position with a project manager.  This is one of the few
cases where I bring up the titles because they are important.
Engineering managers and project managers handle problems in extremely
different ways.  Project managers tend to handle big picture
sequencing and making sure that goals of all stakeholders are being
effectively prioritized and enqueued for delivery.  Engineering
managers work entirely in the realm of what is possible and how to
defend their team from the queue that project managers generate.  It
is vital that engineering teams be managed by engineering managers, as
these are the leaders who protect the team from burn-out, make sure
that the workload is reasonable, and ensure that the team will be
sustainable long term.  This manager was none of these at all, having
an extremely limited grasp of the technology, no grasp whatsoever of
the problem domain that the company did business in, and very little
acknowledgement that the team was wildly understaffed and burnt out.
To make matters worse, this is the only manager I've ever had who
would openly question the skill or intelligence of people on their
team when in vendor meetings.  The extreme lack of professionalism and
even connection to what the reality of our capabilities were led to me
leaving the company just to get away from them.

## In Summary

Like most people I've had a spread in managers over the years.  I
fully expected this, but I'm surprised that the distribution is
currently weighted towards the negative.  I'm hopeful that as the
years go on I can trend to bring the average more positive.  As a
closing thought if you the reader are one of my past managers, don't
think too hard if you think you appear on this list.  Like all things
management is a skill that is learned.  I have been a manager once,
learned I didn't like it, and left that part of the profession behind
me.  If you appear in the uggly or bad heading, that doesn't mean you
are an inherently bad manager, just that you didn't present a skill
level that I was expecting based on the environment and the
organization.
