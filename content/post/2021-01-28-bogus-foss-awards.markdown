---
title: "Awards are Bogus Metrics"
date: 2021-01-28T21:47:58-08:00
---

I recently had the baffling experience of reaching out to a company to
ask about commercial support for their product as I was having a lot
of trouble getting it installed and working.  Those in the know of
FOSS software can probably already see the red flag that needing to
engage commercial support to get even a tech demo working is usually a
sign of poor engineering quality and a fragile solution.

I forged ahead anyway, as I didn't have a lot of good options.  The
software in question is for handling logs, and with my only practical
backup being ELK I didn't have any realistic options.

After chatting with a sales representative over a relatively sedate
email exchange, I finally got through to them that I was interested in
on-prem support and that no, no matter how hard they tried I was not
interested in their cloud product.  This in and of itself was strange,
but after finally getting through to them I would not be accepting any
cloud offering, they threw back some Oracle style pricing.

Seriously, in 2021 a major vendor of cloud software and a member of
the CNCF quoted me a license cost in terms of CPU sockets and cores
running their code.

They also threw back a laughably high cost associated with this
support contract, which I reiterate I was only interested in due to
the poor quality of their public facing documentation.  I explained I
would not be proceeding with them if the quote they provided was the
best they could do, and I'd need to search for another vendor.  I
expected that like any other vendor I'd thank them for their time,
they'd thank me for mine, and we'd go our separate ways.  Instead they
emailed back that it was really unfortunate that I didn't want to use
their cloud, and then they linked me several articles about FOSS
awards they'd won in the last year.

Awards are a measure of success in a lot of fields.  They are,
however, not a great metric of success in software.  If you want a
great metric for software, you need to measure metrics like install
count, daily active users, and the general atmosphere of your issue
tracker.  When I check the GitHub issue tracker for this software, its
full of reports of data loss, configuration bugs, regressions between
releases, and other general evidence of questionable engineering
practices.  Its all the hallmarks of a team hurling code out faster
than they can test it, and then trying to build a company around it.

So what are my take always from this experience?  Well not much I
didn't already know, that awards given out by editors of magazines or
other sites don't capture the metrics that really matter, such as the
software being production quality.  Second, I've learned that the
per-socket pricing model is a cockroach that will never die.

So now I find myself seeking better logging software from a vendor
that understands that real businesses still run real servers that are
not in a cloud, and that when the vendor's docs aren't up to snuff,
then their support offerings had better be.

---

As always, these views are mine and not necessarily those of my employer.
