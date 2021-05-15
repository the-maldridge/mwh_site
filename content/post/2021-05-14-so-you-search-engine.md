---
title: "So you want to build a search engine"
date: 2021-05-14T04:25:22-07:00
draft: true
---

Its been a topic of discussion in my circles recently that the quality
of web search engines has degraded fairly significantly in the last 2
years.  Its no secret that some of the big players have very serious
problems such as the documented Google memory loss.  In many cases the
communities I'm in represent the 80% of high-completion indices that
are only served to 20% of the effective user base.  Being in the long
tail means that the sites I care about are at a higher risk of
dropping out of the index.  I honestly couldn't care less about
twitter being indexed, or many blogging platforms, or even sites like
Amazon which have their own high quality search implementations.  I
care deeply about being able to find the web-rings from 2004, the
plain-text page that is in someone's personal web directory on some
long forgotten server, or the site where half the links don't work
anymore but was an exact hit for some obscure phrase.

Fortunately, being in this category also puts me in the company of
others who have the same frustrations, and who as a group have the
capability to build our own search platform.  I thought I'd write down
my ideas for a search engine here in case anyone else is thinking
about this.

First off I think trying to index the entire web is possibly a lost
cause at this point.  Maintaining such an index quickly gets into
Google's level of hardware cost, and as Google's business paradigm
seems to become less and less serviceable by the day I don't think
that's a good approach to start with.  Instead I think its a good idea
to build a high quality technology stack and then create many
federated indexes.  In this way you could have index collections, and
potentially one or more large front-ends that would allow you to query
multiple search collections at once maintained by different entities.
As long as the protocol is well understood I see no reason this
wouldn't work.  If you build a constrained index you now need some way
to constrain it.  I think this is best done with seed URLs and depth
limits.  Start with some arbitrary set of URLs for the desired
collection you want to index.  These URLs are to be decided on by a
mechanism beyond the scope of this article.  For the record, I like my
bike sheds to the color of old green character LCDs with the back-light
on.

Once you have your set of URLs its fairly easy to perform a recursive
crawl on them, but to keep the goal of an index constraint in mind we
need some way to make sure the set doesn't grow without bound.  I
think that the best way to do this is a concept of domain depth.  You
keep track of how deep in the crawl a particular domain was first
seen, using the value of the parent domain for any subdomains.
Setting this to a relatively small value, 10 for the sake of argument,
allows you to set a "bottom" to the crawl.  This still doesn't solve
the problem of your crawl never finishing, because new content could
be added/updated at a rate faster than you can crawl and index it, but
it does at least give you a fighting chance.  I'd like to point out
that this idea isn't new, Drew DeVault published a post with a similar
post some time ago.  Where I'd add something different though is in
how you maintain the crawl corpus.  Though I don't think user tracking
is particularly valuable as a metric, I do think that click-through
tracking is.  If you keep track of what domains are clicked on you can
start to come up with a feel for what sites are more preferred
resources.  If you know this, you can move them higher in the crawl
stratification, and allow the links that come off of these higher
preference domains to be indexed deeper.  This also lets you cheat
certain simplifications in the index strategy below.

Now that you have a crawl system you need to solve certain problems.
Some of the key ones off the top of my head are making sure you don't
get stuck in infinite spaces such as 404 pages that return 200 as the
status code, or more classic examples like calendars with 'next-month'
links.  Some of these are easier solved than others, but they're still
problems that you'd have to solve even at this small scale.  As such a
site grows you also have to care about how much bandwidth you're
pointing at the sites you're indexing.  Since most of the sites of
interest to me are small and/or old, its likely they're not sitting
behind CDNs, so running a distributed download of the entire site has
a very real chance of taking it offline.  There are many well
understood approaches to this that all more or less revolve around
having buckets of bandwidth and counting semaphores.  Finally a major
problem to figure out is how to know when to refresh your crawled
content.  Fortunately in the now many years of the web even older
sites will often return a Modified-Since header or an ETag.  Either
value is sufficient to do a gut-check on whether or not you need to
retrieve the page contents again.

Now that you have potentially several hundred gigabytes to several
terabytes of HTML 4.01 Transitional XML something-else-compliant
content downloaded, what do you do with it?  Well if the goal is to
build a content index then you'll need to index it.  It is my opinion
that for this kind of content collection a straightforward full-text
index is likely sufficient, especially if you can perform parallel
synonym substitution during queries.  If that's the case then during
index you can just discard all the layout information, index the text
that remains and store the ever growing index somewhere.  If you're
just starting out, you can likely run incremental crawl/index cycles.
This is sufficient for probably most collections in the long tail, as
they're unlikely to change much.  To maintain a collection of more
modern content, such as major news aggregators, you'd likely want to
adopt a streaming approach.

Index in hand you now need to serve it.  This should hopefully be a
lightweight prospect, but remember I'm designing for the power user
here.  Since the index is a full text index, I would expect to support
all the fancy text operators that Google has long since removed, and
the boolean operators that once made queries so powerful.  These
operators effectively break the query into sub-queries that should be
split into smaller ones for better performance.  Realistically though,
just serving an index would be enough for most users without the
optimizations of parallel query.

How does a project like this get built?  I think its probably a mix of
people becoming annoyed enough at the slow degradation of search
quality, and at the slow fragmentation of the web.  At some point
there will be a tipping factor that pushes people off the major
indexes.  Once that happens I fully expect to see smaller content
indexes rise again.

This post was mostly a shower thought, if you are interested in
actually building this, get in touch, I think it would be an
interesting project.
