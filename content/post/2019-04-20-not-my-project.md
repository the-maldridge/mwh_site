---
title: "Not my project anymore"
date: 2019-04-20T22:51:42-07:00
---

I was recently talking with some people from the open source world
about what it means to own a project and this got me thinking about
some of my own projects.  What is my stake in them at this point?

Really for me the question is less of "is this my project" and more
"do I need to take this more seriously now".  Let me explain.  For my
own projects, they are things that I do that are really just for me
and if they fail or die its not an issue because after all they were
just my own projects.  My attempt at a Void Linux installer written in
Go is a good example of this.  It was a project that I played with to
see what it might be like, but it isn't something that I really
intended to release and support.  Certainly not on my own at any rate.

On the other hand, projects that are definitely not "mine" are things
like Void Ansible Roles.  I am in many cases the sole maintainer of
the roles, but there are people besides me that expect them to work.
This means handling bug reports, maintaining releases, and generally
keeping the project going.  These project have users, and users are
one way I distinguish project life cycle stages.

From my time at Google it has been forever burned into my memory that
user trust is sacred and absolute.  Users have a nearly infinite
collective memory, and once you lose the trust of the collective, it
is almost impossible to regain it.  I suspect that for many
organizations it is fully impossible to regain such trust due to the
sheer resources needed to backpedal to a bad choice and keep the
organization going during that time.  For this reason I'm very careful
with what I do with projects once they've been released out into the
wild.  NetAuth is a good example of a project I'm careful with.  Its a
project that is all about security and authentication.  That image
means being careful how I handle releases, the quality of the code I
write, and how I handle bugs.

So who owns any of these projects?  That's a really tricky question.
For things like vInstaller, I haven't licensed it so I'm still a clear
owner.  For most of my projects though I want other people to work on
them with me and to enjoy the work that myself and others have done.
For these projects, I suppose I still "own" them for purposes of the
Bourne Convention, but in all practical terms they have long left my
sphere of influence.  I sit and watch on in a supervisory role, but
these projects own themselves and now have lives of their own.

Obviously though, this doesn't happen overnight.  So when then do
these projects get their own lives?  For me, it happens in 3 clear
stages.  The first stage, and second most dramatic, is when the second
contributor attaches copyright to a project.  This is a major
milestone, and it means I am no longer alone in making project
decisions.  I can still propose the majority of changes, and in many
cases I can still overrule other choices, but I still need to keep the
other contributor in mind.

The second key stage is when the first users adopt the project.  At
this point someone besides me and my immediate circle has thought the
project was good enough to use.  At this point, I now must think of
users as well as contributors when making project decisions.  This is
the point at which breaking changes usually become impossible, or at
least very impractical, to ship.

The final stage is when I get the first bug report from someone I
don't know.  At this point the project has grown large enough to have
users that I've never even heard of, and they've used it enough to
find something that I myself didn't know.  At the time that first
issue is opened by someone foreign, the project truly has a life on
its own and without me.

So what is my role in each of these stages?  Well at first I'm
everything, I have to write the code, handle the bugs, and ship the
releases.  After a while though I become more an executive direction
finder, pointing the project in a direction to keep things moving, or
looking at the high level and finding systematic problems.  Towards
the end of the life cycle, I'm just another contributor, sure, one with
a longer history than anyone else, but just another contributor.

---

If you've enjoyed this article feel free to drop me a line at
maldridge[at]michaelwashere.net.
