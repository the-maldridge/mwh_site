---
title: "Has Everyone Forgotten About Support Agreements?"
date: 2023-08-15T01:33:44-05:00
---

Recent changes in high profile open source projects has got people
talking about sustainability in companies that build open source
again.  Usually I don't really care about this as it comes across as
just poor business management, but Hashicorp taking the entire core
portfolio out of the Open Source ecosystem has lensed this through a
new perspective for me.  That perspective is when business people try
to solve for market conditions, and seem to forget about established
solutions.

## What Goes Wrong

So in organizations like Hashicorp, ElasticSearch, MongoDB, Docker,
and even large community projects you'll often find that over time,
the software gets poisoned by license restrictions, weird agreements,
and almost certainly-unenforceable clauses in End User License
Agreements (EULAs).  Why this happens is interesting in its own right
but it usually seems to boil down to one of two cases, which I'll now
briefly talk about.

The first case is the more commonly talked about, which is that your
software becomes popular enough for some very large cloud provider
potentially named after a tropical rain forest to decide that your API
is commercially viable to commodities.  There's a bit of nuance here I
want to really hammer home: in almost all cases, it is the API, not
your implementation, that is being commodities.  From working on
things at Google, you don't just slap a No-SQL store out onto Borg and
call it good.  Running things in those kinds of environments requires
near complete rewrites of the software, which is always easier to do
as a start-from-scratch workflow.  You implement according to a
carefully prepared API specification, sometimes via a clean-room
process, and produce a new proprietary implementation of the concept
that is API compatible with the software that originally proved
interesting.  If you find that you are at this point a large operating
systems manufacturer in the last century, its important at this point
to bolt on lots of proprietary extensions.  This case annoys me
because its so often the one that's talked about, and so often the one
that does not matter.  If your widget is interesting enough for an
extremely large cloud provider to find it interesting, I guarantee you
its not the code that's interesting.  Concepts are infinitely harder
to come up with than code, and if the code itself was interesting, its
far more easy to just dump a massive pile of cash in front of a
developer.

The second case in which organizations willingly poison their own
software is often more subtle, and it happens over a longer timescale.
In this case you have organizations that try to monetize a software
stack that was published as open source code originally, usually under
a permissive license.  Since very few projects start out with a CLA,
and every company that acts in questionable faith with one makes it
that much less likely a developer will ever sign another, re-licensing
the project usually isn't an option initially.  It can become an
option later once you have the cash to out-litigate any developers
from your pre-CLA days with standing, but by that point you probably
have sufficient claim to the code-base to re-license quasi-legitimately
anyway.  I've seen various numbers tossed around over the years, but I
think the Dolphin project was where I saw the claim that 95% is good
enough, and I'm inclined to agree.  Getting 95% of all copyright
holders in the code base to agree to something means you've made a
long, noisy effort to track people down, and anyone who wanted to
lodge a complaint could have done so.

If you can't re-license it, you can always build an "open core" where
you try to maintain your Fundamental Commitment to Open Source while
also trying to come up with a way that you can keep closed-source
ownership of the features you think are commercially viable.  This
fractures the code-base, makes things a lot more complicated to build
and maintain, and generally breeds ill-will from your pool of external
contributors, especially any who design or implement features that
then get pay-walled away into an enterprise tier.  Though they annoy
contributors, enterprise tiers work well for software that you sell to
people to run on their own computers.  In this case, they are paying
for the compute, the storage, and the engineering time to deploy and
maintain the system, and being able to sell them a few hundred bytes
of cryptographically signed JSON is a lucrative possibility.

What about cloud services though?

If the thing that you're hosting is something that you previously
released for free, and later made available to consumers via a hosted
service things get more interesting.  In this case its you, not the
customer, who must host it, back it up, provide your own engineers to
maintain and improve it, and often times you'll find its necessary to
build connectors and service glue that has no value in your open
source offerings making it pure cost.  If you build your entire
service as an orchestrated stack of containers on top of Kubernetes,
you'll eventually wind up needing to add meta-orchestration when
inevitably you can't provide the isolation guarantees that you're
promising customers.  All of this leads to the cloud offering
becoming more expensive over time to operate, and if the software was
good enough to draw users in the first place, there's no reason for
end users to use the cloud service in the first place.  One of the
reasons there's so much Redis compatible stuff out there is that the
protocol is easy to use, easy to implement, and if you send something
even remotely close to the protocol to a real Redis server it will
usually do what you wanted.

So to make your cloud product interesting, you can do one of two
things.  You can either make it so good that people naturally conclude
that paying you is better than running their own either in terms of
expenditure, reliability, safety or security, or some other aspect of
the system.  Alternatively you can just poison-pill your own software
once you have the requisite ownership to do so and make it legally
challenging for anyone to compete with you.

One of the things about software licenses that fascinates me to this
day is that most have never been challenged in a court of law.  I
suspect the vast majority of them don't actually hold up, and the more
vague clauses of "you can't do what we do" or "do whatever the f\*\*\*
you want" probably don't actually work.  Licenses that don't fully
satisfy the four corners doctrine by leaving terms vague and at the
discretion of the IP holder at a convenient later date are
particularly suspicious to me.  I'd love to hear from an expert in the
field of software law what their opinions are on these nouveau
licenses.

Assuming you can pull this off and actually chose to do so, you'll
soon find yourself on the receiving end of a lot of frustration,
anger, and most likely brain drain as developers with capability to do
so abandon your projects.  Polarizing events also have a habit of
spurring people up and over humps to implement solutions or workalikes
that they wouldn't have previously.  ElasticSearch was a great example
of an organization deciding they weren't getting a big enough piece of
the pie, and then their market share vanishing as the user base went
to other solutions that aligned better economically, ideologically,
and that understood user bases are fickle things that don't take well
to blind-sided changes.

As an aside, its my opinion that if another company can come in and
eat your lunch hosting the tooling you wrote and customers think the
competitor's tooling is better, then tough luck.  Your product
leadership team has failed, and you didn't produce a compelling enough
product to capture the market.  Maybe your pricing model was bad,
maybe the onboarding experience wasn't smooth, maybe your sales team
promised features engineering hadn't built yet.  Whatever it was, its
probably important to figure out where things went off the rails as
getting beat at your own game is an embarrassing fall from grace.

## Bringing Home the Bacon

All of this stems from a requirement that a company be sustainable.
In the US for publicly traded companies this goes a bit further, and
no matter how much you may want to claim a more principled stance,
companies exist for the benefit of the shareholders, and failure of
the leadership team to pursue this can result in legal action from the
shareholders.  Its a really weird quirk and if you want to learn more
about where this comes from, I highly recommend looking into the
strange case of _Dodge v. Ford Motor_ which sets up the precedent that
corporations exist for the benefit of the shareholders ahead of the
public good.  Given that one of the core tenants of true Open Source
software is that it is developed for use by the public without
restriction, I suspect it probably would run afoul of the ideas
outlined in _Dodge v. Ford Motor_ (semi-related: if you want a good
example of just how little it takes to make software non-free, go look
up why php-json is non-free in Debian).

So how else can an organization make money on software in a way that
doesn't drive off the developers, doesn't look like a bait-and-switch
of ideals, and still results in a model that sustains further
development and maintenance of the software?  First, I think reality
has to play a key role here.  Absurd quarter-on-quarter growth metrics
are dumb, and the sooner people agree with this the less bad the next
dot-com style bubble is going to be.  I've met precious few investors
who are willing to play the long game, but those that do understand
that the payout is almost always there for them in the end.  Second,
understanding that there's more than one way to make money is key.

I think in recent years with the rise of commodification of all
software and the app-ification of most consumer systems people have
forgotten that there was a time when things broke that you could
contact a real live human who could either fix the problem then and
there, or escalate to a more competent or more knowledgeable person
who could.  It was not uncommon in some scenarios to eventually be
talking with the engineer that wrote the original code that was the
subject of the defect.  This seems to have fallen by the wayside in
the need to go ever bigger.  Cory Doctrow recently published a look
into TikTok and how that platform is dying, its well worth a read
[here](https://pluralistic.net/2023/01/21/potemkin-ai/#hey-guys), even
though the ideas presented there are slightly different since TikTok
was never open source.

So if you don't make money by selling your users, you don't make money
by forcing your competitors out, and you don't make money from
enterprise features people didn't need in the first place, that only
leaves one real avenue left for making money: support!

It boggles my mind now the number of interactions I've had with
various organizations that refuse to sell me support plans for the
open source offering they already produced.  I do not care about your
enterprise features, unless you belong on the [SSO Wall of
Shame](https://sso.tax/), I do not care about your integrated value
adds with mobile apps that will synergize my productivity.  I'm an
infrastructure systems engineer, and I care about your code working
reliably.  When it doesn't work, I care about being able to get in
touch with someone who can actually competently speak about the error
message in front of me, and preferably who can fix it.  Maybe not fix
it today, but within at most one patch cycle.  Secondarily, I care
about being able to influence product road-maps to my benefit.  Maybe
there are features that I want to put money behind, maybe there are
goals I want to express the importance of with dollars, either way I
want to be able to put money behind things that were already going to
get done to get them done sooner or in the order I prefer.

Sure, there are companies that want the white glove experience of a
managed product.  You may recognize this as a special form of support:
consulting services.  These customers have so much money to burn
they're willing to effectively pay your engineers to babysit services
running at their sites.  If you do things correctly and your services
are low overhead, you can conceivably have one engineer being paid for
by a dozen clients who want someone who can perform the routine
maintenance, advise them on how to use your products better, and who
can confidently read and explain error messages in the uncommon
occurrences where things break.  Why are these experiences uncommon in
this model?  When only qualified persons are handling the sharp edges
of the system, they're far more likely to handle things with care.

To date, one of the best implementations of this system I have ever
seen was by Phacility as the support workflow for Phabricator.
Phrabricator's promise was a git forge with so many other features it
could replace your entire Atlassian footprint, your corporate
groupware, some of your operations systems, and at least one meme feed
per functional team.  The support agreement got you "mana" which you
could then spend on things you wanted.  These might be support
engagements to have assistance in debugging a problem, putting more
weight on a particular feature, or saving them up for a larger
consulting engagement when you know you'll need first party support.
I know lots of business people who dislike that the credit was called
"mana" which also entertains me given the amount of flowery language I
often see in support agreements now.  I liked this system because it
was very clear what you paid for, it was clear what you got and how
much of it you got, and both parties could see the amount of mana
changing hands at any given time.  Phacility has wound down
operations, but I chalk this up to slightly missing the mark on how
many people use git (Arcanist was great once you knew what it did, but
hard to explain to people already struggling with git).

So it works for a company, but how well does it scale?  I currently
maintain two open source projects for which I offer consulting
services.  The [ResinStack](https://resinstack.io), whose future is
uncertain with the change to the licenses of its underlying
components, and [NetAuth](https://netauth.org) which has always been
an interesting sell to people who don't want to understand the
historical context to it being not-LDAP.  While I don't do a large
amount of business with either of these software suites, I have found
the model to be sustainable.  More importantly, the downstreams I
support appear to be satisfied with the arrangement, and often are
willing to pay for services that I am surprised by.  During my time at
VoiceOps, we also directly sponsored several of our open source
dependencies in order to ensure their ongoing development, and to
engender good will from the maintainers of projects we could not do
without.  Writing open source software that's part of low level
infrastructure is often a thankless prospect, and we felt it was
important to show our support that the software mattered to us, and it
mattered enough to "pay for it" with our donations even when that
wasn't required.

## Where was I going with this ramble??

I'll wrap this up by saying that I think the world of open source
software, especially that of the Silicon Valley startups and orange
site hype have become too obsessed with growth.  Growth at all costs
eventually costs the project itself, and then you're back at square
zero starting over.  Support agreements are a thing, often times a
lucratively profitable thing, and I wish more places would still offer
support that wasn't attached to some feature tier I don't care about.
Even more than that, I wish that support was not seen purely as a pack
in, but as a product line in its own right.  There is no doubt in my
mind that the support team at my dayjob knows more about our product
than some of the engineers working on it, and leaving that kind of
expertise untapped is just foolish.  I also don't think people realize
how much companies will pay to be able to jump spots in the queue for
issue tickets.  As an engineer this is frustrating, but if I know that
the company is making bank on it, I'm less annoyed by it as I know
that eventually goes to pay my salary.

If you're a product owner at your organization, I invite you to think
about this for a while and see if your trajectory is sustainable.
Everything that goes up eventually comes down, but with the right
planning you can turn that descent into a stable orbit.

---

It should go without saying, but the opinions expressed here are my
own and do not represent those of any of the named companies in this
post, nor my employers past or present.  I currently hold the opinion
at the time of writing that the fundamental processes and workflows
that sustain Open Source ecosystems are breaking down, and I wanted to
write about it.  If you found this interesting, [shoot me an
email](mailto:maldridge@michaelwashere.net).
