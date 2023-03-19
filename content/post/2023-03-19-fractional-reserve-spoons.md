---
title: "How I Manage My Time: Fractional Reserve Spoons"
date: 2023-03-19T15:15:18-05:00
---

I'm involved in a lot of projects both in and out of work, and people
have often asked how I keep it all running at once.  The simple answer
is I don't.  This post came to me as I was driving back from a fast
food place and thinking about where my time management strategy has
broken down.

First off, the phrase "out of spoons" is one that my parents and grand
parents have said before, but I have to give credit to my manager at
work who used it recently to describe the situation our operations
group was near with the number of projects we were committing to.  In
general the idea is that you have some pool of spoons for the day and
you dip into this balance as you do things.

I work from a slightly different version of this where the spoons are
a token pool in much the same way as a counting semaphore.  Counting
semaphores allow multiple workers to spin off and perform some amount
of work, but only up to some maximum number.  If more workers want to
spin off than the semaphore's maximum value, they will start start
backing up.  In well written systems this results in a smooth queuing
of work.  In less well written systems this results in an exciting few
seconds as the system slows to a crawl, then an exciting failure as
the stack explodes and the application falls over.

I tend to take this one step further, and go ahead and issue out more
spoons than I have in a calculated risk that not all the people having
a claim to a spoon will come knocking at the same time.  In general
this works well because I am involved in enough projects across enough
groups of people that there shouldn't normally be any kind of
synchronizing factor to people needing things from my time.  This is
similarly how fractional reserve banking works, which is where I pull
that term in.  In the steady state case, there's no synchronizing
factor that would require 100% of outstanding claims to be satisfied
simultaneously.

So why am I writing this post today?  Something, somewhere has gone
wrong and I have more people calling in their spoon claims than I have
spoons to give.  Foolishly, I'm still trying to honor all claims in
the order they were received, which you should not attempt to
duplicate at home (trained idiot on a closed course, etc).  I do still
think this is a good solution for managing time, because it allows me
to dramatically over-commit and then maintain a relatively constant
level of effort even as various projects are spinning up and down,
which works well for me.

I think though I'm going to start actually tracking all outstanding
commit on paper somewhere as I think that got me into trouble here
just doing the accounting in my head.  If you have any recommendations
for project tracking and management software that isn't Asana and
isn't in any way shape or form made by Atlassian, let me know.
