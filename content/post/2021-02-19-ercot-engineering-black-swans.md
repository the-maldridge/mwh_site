---
title: "PG&E, ERCOT, and Engineering Black Swans"
date: 2021-02-19T11:11:53-08:00
---

I've seen over the last few days a lot of comparisons being made
between the power outages occurring in Texas and the power outages
that are an annual event for parts of California.  These events aren't
particularly compatible due to the wildly different circumstances at
play, and I want to talk about why.  This post will get into what
engineers look at when designing a system, the concept of calculated
risk, and how black swans can really come from nowhere.

First off, lets look at what makes ERCOT unique and that allowed these
outages to happen in the first place.  For those not in the know, the
United States has 3 major power grids.  There's a western grid, and
eastern grid, and a Texas grid.  Why this is the case is a long and
interesting explanation of the slow conglomeration and interconnection
of utilities, and is way beyond the scope of this post.  All you need
to know though is that for practical purposes, Texas has had its own
electrical grid for a very long time and has successfully operated it
without major issues.

In the Texas grid, there are 3 major personas that exist.  These
personas are:

  * The grid operator who oversees the day to day operation, and
    responds to changes by coordinating other entities to meet demand
    in real time.
  * The consumer who buys the power, be it commercial, residential, or
    municipal use.
  * The generating companies.  These are the groups that actually own
    generators and operate them.

There's a 4Th kind of entity in Texas that is what most people think
of as the "power company" and actually does business with the
consumer, but this is mainly just the broker that buys power on the
wholesale market and sells it to the consumer.  If you're curious how
many of these there are, there's a handy site that shows you who they
are and how expensive they are relative to each other
[here](http://powertochoose.org/).

So where do Texans get their power from?  According to the US
Department of Energy, Texas has a diverse power supply including
traditional fossil fuels, nuclear plants, grid-scale renewables such
as wind and solar, and customer solar installations.  Under normal
circumstances this supply is more than sufficient for servicing the
electrical needs of every Texan and then some, but current conditions
are far from normal.

When engineers design a system, its all a balancing act.  It would
always be nice to design the most robust system possible that uses the
most stable and well tested technology available, but this isn't
always possible.  Additional factors such as cost, environmental
concerns, feasibility, and long term sustainability may overrule
choices that would otherwise win out.  When this happens engineers
draw on the expertise of many fields, and seek as much information as
possible to make the best choice, but there has to be a line drawn
somewhere.  After all, if you endlessly analyze without setting a
deadline or limit somewhere, no decision will ever be made.

To assist with drawing lines that bound the analysis, its helpful to
have some qualified hypotheticals in addition to the hard
requirements.  An example of a hard requirement would be the average
electricity usage on a hot summer day when most consumers are running
one or more air conditioners.  This is a number that can be measured,
recorded, and tracked over time.  A hypothetical requirement would be
to survive a particularly bad storm or particularly strong wind.

If you've ever bought a house or are generally curious, you may have
heard of a 100 year flood.  This is an example of a qualified
hypothetical situation that is accounted for in a design.  The 100
year flood is the flood that has a 1% chance of occuring in a given
year.  Practical Engineering on has a great video on YouTube that
talks about hydro-logical concerns in structures indented to last a
long time, you can watch that video
[here](https://youtu.be/EACkiMRT0pc).  It's not just floods that have
this kind of design criteria, most major weather events have
categories they fall into based on how likely they are to occur in a
given year.  Because these risks are different in every region,
infrastructure looks different in different places.  In the northern
parts of the country, for example, most power and electrical lines are
hardened to handle the colder temperatures that occur more frequently.
In the south, the systems are designed to survive harsh prolonged
heat, and on the gulf coast, systems are designed to survive the fury
of a hurricane, and to be quickly repairable afterwards.

What's happening in Texas now with the unprecedented winter storms is
well beyond any design criteria or forecast that was even joked about
during the design and planning of the electrical infrastructure that
powers the state.  Events like this get a special name, they're
referred to as Black Swans.  In this context since the term is
capitalized its used according to author Nassim Nicholas Taleb's terms
as laid out in [The Black
Swan](https://www.google.com/books/edition/_/YdOYmYA2TJYC?hl=en&gbpv=0).

This event is:

  1. An outlier: The weather being experienced in Texas is not
     normal, is far beyond what is considered extreme in general, and
     is far beyond the normal winter weather of the region.

  2. A carrier of extreme impact: millions of Texans are without power
     and water right now, if that doesn't qualify as extreme nothing
     does.

  3. Something that humans will try to concoct an explanation for
     after the fact, in spite of its outlier status.  To be clear,
     changing climate patterns do forecast more intense weather
     patterns, but not with any certainty or planning horizon that
     could have been used 20+ years ago when the risk model was being
     designed for the ERCOT grid.

The last point is significant, and is where I think a lot of people
erroneously conflate the outages that happen in summer in PG&E
territory with what's happening now on the ERCOT grid.  This was not
an event that could have been foreseen at a level that it was a risk
to design around.  Trying to get more money to design around
increasingly unlikely risks is a very hard thing to do, and most
investors are willing to take the gamble on the black swan never
showing up.  After all, more than half of the time the risk pays off,
and the resources can be assigned to more pressing needs.

To understand the differences in what's going on, its important to
understand an almost completely unique facet of the way electrical
grids operate.  Electrical grids operate in real-time.  As a software
engineer, I want to qualify this term as there are levels of
real-time.  There's soft real-time which is sufficient for things like
audio playback, and then there's hard real-time which is required for
things like aircraft avionics and life critical systems.  Working with
hard real-time software usually means involving a professional
engineer, so I don't have a lot of experience with it, but I do
understand the basics.  The primary difference is that in soft
real-time you can occasionally have a function call that slips, or a
request that runs slightly slower and things will generally be okay.
In hard real-time this is not an option.  Decisions must be made on a
strict cadence and failure to do so could result in at best a safety
shutdown, and at worst case a catastrophic failure of the system.

The electrical grid operates a tier further out, operating at what I
refer to as instantaneous real-time.  Electrical power at grid scale
can't be practically stored in a meaningfully dense way yet.  There
are so-called "surge" plants like the [Cruachan Power
Station](https://en.wikipedia.org/wiki/Cruachan_Power_Station) in
Scottland, but these plants are designed for peak loads.  Peak loads
are massive surges of power demand that happen, for example, when
large fractions of the UK [fancy a cup of tea during a
commercial](https://en.wikipedia.org/wiki/TV_pickup).  There are some
of the smartest people in the world working on this problem, but
there's no practical way to store significant amounts of power for
long periods of time yet at grid scale.

To account for this, electrical grids have different kinds of power
sources that can be switched in an out depending on the type of
demand.  For base loading (the power that is almost always needed)
large slow moving plants are preferred such as coal burning or nuclear
plants.  These plants can take hours or days to spin up and be ready
to come on-line, but once they are up and running their power is
cheap, predictable, and available in incredibly large quantities.
Most importantly, this is guaranteed power that, barring plant
maintenance, is always available and isn't dependent on weather or
other external factors.  Next up the stack are the smaller but faster
plants.  Hydroelectric plants fall into this category as they can be
ramped up within minutes, but there are additional factors that can
prevent their use such as drought, concern over downstream flooding,
and size of the plant.  It wouldn't make sense to use hydroelectric
power to cover the surge load of a pumping station downstream if doing
so will flood the station after all!  At the fast end of the power
generation spectrum are sources like single stage gas turbines and
industrial size diesel plants.  These plants have startup delays
measured in seconds and minutes, and are suitable for handling TV
Pickup type loads, but are expensive to operate, expensive to
maintain, and usually not particularly environmentally friendly.

You may notice I haven't mentioned solar or wind yet, and that's
because they occupy a special place in the world of power generation.
These are opportunistic sources that offer amazing advantages when
they're available, but aren't dependable enough to be part of the base
load, and usually don't fall into the category of peak load plants.
When the sun is shining, a solar farm produces power almost for free
if you count the maintenance costs as constant.  This power can be
sold to the grid at a market rate that makes it preferable to use, and
so in real time the grid will shift to consume this power.  When the
sun goes down the grid shifts back to sun-independent plants to cover
the load at night, but as demand is also lower its not always
necessary to bring another plant online.  Note that this is highly
dependent on a lot of factors even including the season and cultural
events that push high demand usage into the evening.  Wind follows a
similar usage profile of being great when its available, but with the
caveat that its more stable than solar.  In west Texas the wind blows
fairly consistently, and so massive wind farms are practical to
harness the wind for continuous power.

Coordinating the usage of various sources of power to achieve an exact
match second by second with the power demand is the job of grid
operators like PG&E and ERCOT.  This coordination is crucial to
managing the overall health of the grid and ensuring that the lights
stay on everywhere they're supposed to.

Now that we've gone through some background on power grids and power
sources, what's different between the ERCOT grid in Texas and the PG&E
grid in California?  For me, it comes down to a few points, and keep
in mind that this is largely a matter of opinion.  First, PG&E has
power outages every year because they don't have enough power to meet
demand.  Various factors such as regulatory cost, changing economics,
and increased demand without matching investments in increasing supply
have left PG&E in a precarious situation where there is more demand
than supply for power, and for many reasons its not practical to add
additional supply.  The nearly century old infrastructure as well was
never designed to handle the increased load that is placed on it.
Most grids are never operated at 100% capacity as that leaves no
safety margin for when the unexpected happens.  PG&E however doesn't
have much choice, and to service demand has to run their grid at the
absolute limits to even come close.  This is a risky maneuver since
the long distance high voltage lines run through forest, and like all
matter they expand when heated causing them to droop and either
directly contact or come within arcing range of things they shouldn't,
such as highly flammable trees.

In Texas, the grid was designed around the general demand curve, which
is incredibly high in the summer due to cooling requirements, and
moderately high in the winter.  In the winter solar plants produce
less power due to less sunlight, and in high wind and snow wind
turbines may freeze over or trip offline.  Turbines are also
mechanical systems, and so below certain temperatures lubricants can
congeal and quite literally "gum up the works."  You might ask
yourself why this hasn't been a problem in years past, and there's a
few relatively easy explanations for why this is the case.  First, a
large part of Texas uses fuel based heating.  Even though electrical
heating is by definition 100% efficient, there's a lot of reasons for
why fuel based heating is still in use, some of which were discussed
in [this Technology Connections video](https://youtu.be/56DSH8tKUvo).
Since most of South Texas is, as the name implies, in the South, the
winters are relatively mild, and don't require significant additional
heating.

Texas structures are not built to survive this level of intense cold.
While the house I rented when I lived in Dallas was relatively well
insulated, it still required a very substantial gas burning furnace
and some space heaters on the coldest days of winter, and I generally
preferred to spend less time at home and more time at work where we
had steam heat as it was warmer.  This is the first time in history
that every county in Texas has had a winter storm warning at the same
time.  Homes that have been traditionally dealing with winter with
space heaters or electric radiators are now running these appliances
around the clock, which has caused the demand on the grid to spike
while at the same time, solar farms are buried under snow and wind
turbines are frozen solid.  Hydro plants haven't escaped either as
most in Texas aren't fitted with the screens needed to keep ice out of
the turbines, not to mention that frozen tail races can't exhaust
water.

So this leaves the fuel burning plants, and the peak load plants, but
when your fuel is delivered by rail, and the rail lines are all under
multiple feet of snow and ice, its necessary to operate more
conservatively.

Ultimately, Texas finds itself in the situation of having more demand
than supply, but for completely different reasons than California
does.  Because these reasons are so vastly different, and this was a
completely unforeseen event, I believe that the rolling outages in the
summer in California are completely incomparable to the historic
events happening in Texas now.

I've thought a lot over the last few days of what I think as an
armchair observer could have been done differently to avert the power
outages in Texas, and so far I haven't come up with anything.  I'd
love the opportunity someday to chat with a grid engineer or an
engineer at a power plant, as I suspect they have their own set of
ideas that could help in the future.  The only real thing that could
have prevented this in my opinion is more weather independent plants
and generally better insulated structures to both increase the
available supply, and to decrease the peak demand.  Building
additional plants is a hard sell when they'll sit idle large parts of
the time, and this is an economics problem that remains unsolved with
renewable sources since they're incredibly cheap and attractive
sources, but also not reliable enough to serve base-load requirements,
or requirements outside of their peak output window in the case of
solar.  Building new structures more insulated is an easy sell to most
Texans, as while its a higher upfront cost, it will mean increased
comfort in the long run as air conditioners don't have to run as hard
and its cheaper to heat homes to a more comfortable level in the
winter.  As for older homes and less insulated structures, I haven't
come up with anything remotely practical to be done there.  The most
practical thing I've yet come up with is [district
heating](https://en.wikipedia.org/wiki/District_heating) in larger
cities to increase overall heating efficiency.

### TL;DR

The circumstances that have lead to power outages in Texas and in
California are wildly different to the point that I believe they are
not comparable, and the problems to be solved here are hard,
expensive, and only resolvable with time.  I look forward to seeing
what solutions and ideas grid engineers come up with, and I certainly
hope that all of my friends and family in Texas are weathering the
storm.  I know for myself when I inevitably move back to Dallas, I'm
already thinking about what I'll need to obtain to ensure I'm prepared
for severe weather in the future.

---

I hope you've enjoyed this post, it started out as a frustration that
the power outages in California and Texas were being tossed around as
equivalent events when in reality the circumstances are vastly
different.  Hopefully this post has sparked an interest in how the
infrastructure around you works, and given you some resources that you
can find more information with.  As always, the views expressed on
this site are my own, and if you wish to drop me a line, you can send
me an email at maldridge[at]michaelwashere.net, or drop me a line on
freenode where I idle as `maldridge`.
