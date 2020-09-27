---
title: "The confluence of cheapness and dubious design: AT&T FTTH"
date: 2020-09-27T03:07:02-07:00
---

For annoying reasons that I won't get into here, I'm finally building
out a home office.  For me this meant getting another IKEA desk, and
then making sure that the network path from my main network rack out
to the garage where my office will be is built well and reliably
installed.

This has so far been a case of pulling wire through the attic, and
then putting in a network terminal in the closet where all the network
gear lives.  From this NT down to the 9U rack that most of my network
lives in I will run a bundle of Ethernet cables to supply data
services out to the rest of the house.  So far so good, though I will
say to anyone wanting to pull cable: buy a cheap boroscope/endoscope
for looking at what's in your walls, its way more useful than it
sounds, and flexible auger bits are really cool.

So far so good, pulling cable and patching networks is easy.  In doing
this though, I realized that I have an artificially short cable
between the optical modem and the wall mounted splice box where AT&T
drops off the line I get my Sonic internet on.  No problem, I'll just
unplug it and plug in a longer one and oh, wait, splice box...

In my network the aerial drop from the pole outside comes to the eave
of the house, then goes all the way to the back and punches through a
wall into a closet where the network equipment lives.  Then, it goes
into a small wall mounted box where it is spliced directly onto a
short length of cable with an SC/APC end on it.  When I say "a cable
with an end on it" I literally mean that.  I watched the installer
open a sealed cable [much like this
one](https://www.amazon.com/gp/product/B07B89FV3P) and just cut one
end off of it.  This means that I have a fixed length that the Optical
Network Terminal (ONT) must be within to be connected.  Further, you
know that fiber is relatively fragile, and that this being a
non-socketed cable means that if I need to replace it I need to call
out a tech to replace the cable, which then AT&T will most assuredly
bill me for.

This is cheapness number 1, and its the one that I am most annoyed
about right now.  The splice box can accept a port on one side via a
knock out, and had the tech done this, I could have plugged in a cable
of a more appropriate length and been done.

"But maldridge!" I hear you say, "you can't have a connector there
because that would be on the AT&T side of the network, you only get
connectors once you're past the point of demarcation!"

While correct in the most technical sense, this doesn't matter for a
point we'll get to in a minute.  For those that don't know though, a
point of demarcation or demarc as its more commonly referred to is the
point at which responsibility for network elements formally changes.
In a POTS service this is usually a gray plastic box (called a Network
Interface Device or NID) on the outside of the building, or in a
business its in the Main Point Of Entry (MPOE).  Both the NID and the
MPOE are strictly defined components that are regulated and enshrined
in federal code for telecommunications equipment.  Now, in an optical
network the point of demarcation is most commonly the Optical Network
Terminal (ONT) which is the point at which the operator's network is
converted into something that the customer can use.  Very rarely would
you ever see a network in which you as a customer are allowed to plug
your fiber directly into an optic that you provide.  This is where the
connector argument above falls apart.  The cable has an SC/APC
connector on the end of it because that's the socket that's on the
ONT.  It must be there, because the ONT does not take a raw fiber
strand.

Calling the ONT the point of demarcation though doesn't actually work
in an AT&T FTTH setup, because you can't just plug into the ONT and
pull down an address.  No we are firmly into the era of micro services
and internet of things, so the demarc is an embedded Linux box running
practically unmaintained software that's misconfigured at best, and
massively overpriced for what its capable of actually doing.  In AT&T
terms this is a Residential Gateway (RG) and they come in various
flavors.  The important thing to know though is that regardless of
flavor this is a box that is uniformly junk.  The RG negotiates an
EAP-OL transaction with the carrier network, which it then establishes
the outbound service on.  It also is responsible for providing the
Analog Telephony Adapter if you purchase or otherwise end up with
"landline" phone service, and it provides a handful of other features
that I don't think I've ever heard of anyone using (seriously, have
you ever seen a HPNA network with your own eyes?).

Oh, and I'm being billed for renting both of these devices that I need
to consume the service that I'm already paying for.  The ONT I can
understand, though its price should really be folded into the monthly
service bill, rather than being a line item.  The RG I do not accept,
because its completely unnecessary.  Sure, it can and probably should
be offered to customers as a value added appliance, as for customers
that don't want to build their own network it will probably meet their
needs.  For anyone else though its a box that runs hot and slow and
breaks from time to time for no readily explainable reason.

> A quick side note: I'm aware that methods exist for performing the
> EAP-OL transaction without the RG.  This is not the point.  The
> point here is that a completely unnecessary hop has been added to my
> network, when the ONT could have negotiated that transaction on its
> own as it has some limited onboard smarts.

So, this brings us to the final point, the dubious design.  Both of
these devices, the RG and the ONT are required to use the service, and
both are static components, they will be installed in a location and
not moved.  In the case of the ONT it is best it never move since the
cable that is plugged into it is not user replaceable.  So obviously
both of these devices must have keyhole mounts on the back, or have
mounts that I can order or request from the provider right?  Wrong
again.  Neither device has the keyhole mounting points that one would
expect in a modern bit of molded plastic, and neither appears to have
a ready-made mount that I could find after an hour of searching.

So now I am writing this rant having just placed an order to Amazon
for some generic mounts that should be able to secure both devices to
the wall such that I can keep them out of the way and hopefully lessen
the risk of damage to the fiber.

What are some takeaways though?  If you're an AT&T person reading this
what could you have done to not earn my rant?  Well, probably not much
since I'm actually a Sonic customer, and strange business rules apply,
but here's some points anyway:

  * I don't want the RG, and I don't need it.  I have had AT&T/SBC
    service since DSL was considered unobtainably expensive, and I
    remember being able to go out and buy a DSL modem that I could
    plug into the line and it worked just fine.  There weren't
    thousands of lines of poor quality code from Southwestern Bell in
    my network requiring a reboot every few days.  This should be the
    way it is now as well, offer the RG as a value added service, but
    if I don't want it then hand me an Ethernet circuit I can pull
    DHCP from or perform SLAAC on.

  * If a cable may require replacement, both ends of it had better be
    socketed.  Even the most technologically challenged customer
    understands the "unplug it and replace it" concept, and this could
    save field visits by just mailing customers new cables if they
    need to replace them.  Or in proper telco fashion, I suspect it
    would be making people drive to a local store to buy a spare cable
    that's still on the network side of the demarc...

  * Provision for hardware to be installed in various ways.  The ONT
    has rubber feet on it, but no provision for mounting it to the
    wall.  I would buy an AT&T branded mount for the thing if one
    existed, but one does not.  Similarly, the RG is a large device
    with fairly thick plastic, it should have had keyholes molded into
    it.  Baring that it should have a mount available either from AT&T
    or Arris.  These were really simple things that should have been
    done, and I find it really surprising that an industrial designer
    looked at both devices and signed off that they didn't need any
    facilities for rigid mounting.

That's all I've got in this rant, hopefully you found it at least
mildly entertaining to read.  As always, if you want to discuss this
post or other annoying artifacts of the "modern" internet, I am
`maldridge` on freenode.
