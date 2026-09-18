---
title: "Having a Good <s>Time</s> Frequency at VCFMW21"
date: 2026-09-17T22:58:01-05:00
---

One of the new and exciting features we added to the VCFMW ShadyTel
exhibit this year that almost no-one would have seen or realized
existed was an actual high precision master frequency reference for
our TDM network.  This post will dig into what this device is, what it
does, and why we use it.

## What is a Frequency Reference?

The ShadyTel core network is entirely TDM, also known as Real
Telephony.  Since this is a Time Division Multiplexing network, the
timing on the network is fairly important.  Its worth understanding
that in this context, timing is not absolute wall clock time in the
sense of NTP or PTP, but instead refers to a stable frequency
reference used for clocking synchronous serial interfaces.

For this purpose, I have a Spectracom Securesync 1200 clock.  These
timing appliances are 1U devices that support multiple input/output
timing cards and can supply both absolute time and frequency
references over a wide range of active and defunct standards.  For
using the clock with the show network, I obtained a 1204-0A T1/E1
output card.  In North America, a T1 is a common channelized interface
type, with the E1 being its counterpart in Europe and Australia.

With the Securesync connected to a suitable GPS antenna, it not only
obtains a very high quality timing reference, but also disciplines its
internal clock from the GPS signal, resulting in true atomic accuracy
without having to actually bring an atomic clock.  The T1/E1 card then
exports this reference as a precisely clocked T1 circuit configured
for the typical B8ZS ESF circuit type.  The circuit doesn't contain
any actual data, in fact it contains statically allocated frames that
just contain all 1's, but this has execellent properties for clock
recovery at the far end.  Again, clock here does not refer to absolute
time, but refers to frequency used for clocking a synchronous serial
line.

This clock source was passed back over the outside plant from a master
clock at Jeff Geerling's booth near the edge of the convention hall to
the CO in pod group C4.  Why was the clock at Jeff's booth?  Well,
since it requires a GPS reference, it was advantagous to place the
clock as close to the edge of the building as possible to minimize the
cable runs.  Since GPS was already being delivered to this location as
a ShadyTel Engineered Service (SM), it made sense to colocate the
clock there as well.

I'd like to give a special thanks to Meinberg for supplying a much
better quality GPS antenna than the one I originally brought, which
allowed us to get a cleaner signal over the roughly 250 feet of cable
that was required to get out the loading dock door and into an area
with clear sky.

## Of Various Strata

Just like absolute time systems, frequency reference and distribution
systems have strata that are used to specify the quality of the
reference.  Unlike absolute time references, however, frequency strata
are not a strict hierarchy, nor are they a distance from the source.
Frequency strata express the quality of the clock, both in terms of
holdover, and how far its able to tune to establish a lock.  The
holdover is relatively easy to understand and has the same meaning as
it does in absolute time: given an absence of the reference, how far
off will this clock get over a given amount of time.

Consider the following illustration:

```
Stratum 1:        |--+--|
Stratum 2:    |------+---|
Stratum 3:        |--+---------|
Stratum 4:             |---------------|
```

Notice that as the clock increases in stratum, the overall accuracy of
the clock decreases, and the ranges shift relative to each other.  In
the above example, the stratum 4 clock cannot achieve synchronicity
with the better clocks, because it lacks the ability to tune into the
range of the better clocks.  This is a substantial oversimplification,
but it is good enough to understand the fundamental design sins we
committed in making the network operate.

## The VCFMW Clocking Chain

From what we have above, you now know that the high quality GPS signal
was brought in to the Spectracom Securesync 1200 and then backhauled
over a T1 to the CO.  The Securesync, being a GPS disciplined
oscillator, is definitionally a stratum 1 reference source.  In the CO
however, we had a variety of old and mismatched hardware.  We fed the
high quality timing reference directly into our tandem switch which
was a Cisco ISR.  The ISR is only a stratum 4E device, which means
that it has a wide tunability range, but a quite poor holdover
characteristic.  This, coupled with the source being a stratum 1 led
to a very interesting network core.  We then distributed the clock
alongside all of our in-office and intra-office T1 lines to other
devices, and this is where we did some design no-nos.

The primary switch serving subscriber lines at VCFMW is a Nortel
Meridian 1 Option 11c.  This is a modular small office PBX capable of
serving several hundred lines.  It is meant to be disciplined from the
telephone company's high quality clocks, but when you are the
telephone company, the quality of your own internal clocks gets a
little fuzzy.  The Meridian is a Stratum 3 clock, but we were
connecting it to a Stratum 4 source.  This means that there is a
chance when the system starts up that before the absolute time
reference of the Stratum 1 pulls the ISR into range, the Meridian
might not be able to tune to it.  We did not observe this failure
mode, but we did discuss that there might need to be some dancing of
shut/no shut interfaces to get clocks to come up in the right order.

From the Cisco tandem at the core, and the Meridian serving most
subscriber circuits, the principal clock is distributed to the rest of
the network:

```
        +---------------------------+
        |Spectracom SecureSync 1200 |
        |                           |
        +---------------------------+
                     |
                     v
               +-----------+
               |Cisco 3845 |
               |           |
               +-----------+
                   |   |
                   |   +-------+
                   |           |
                   v           v
 +----------------------+---------------+
 |Meridian 1 Option 11c |T1 Subscribers |
 |                      |               |
 +----------------------+---------------+
           |
           v
   +----------------+
   |BRI Subscribers |
   |                |
   +----------------+
```

Through this clocking chain, we were able to deliver very high quality
frequency references all the way down to subscriber equipment.  We
were only delivering frequency references, if you want to learn about
absolute time and where NTP came from for the show network, check out
Jeff Geerling's writeup [here]().

Every year we try to add something new to the VCFMW network, and while
this year we added a lot of broadly invisible internal technology and
quality of life improvements, the team was very happy with how it
turned out.  You can expect the precision clocks to make a return next
year at VCFMW22, and experience precision time by dialing with
ShadyTel.
