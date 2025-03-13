---
title: "Launching the Gizmo"
date: 2025-03-10T00:00:00-05:00
---

People who've known me for a while know that I'm an alumni of a
program called BEST Robotics, and that I still actively volunteer with
the program.  This is an experiential learning program with a strong
focus on industry exposure.  Students compete in many different
aspects in Spring and Fall, but I am most heavily involved with the
flagship BEST Robotics Competition in the fall.  This 8 week program
sees students presented with a challenge and turned loose for 8 weeks
to come up with an answer.

Unlike other robotics competitions, one thing that makes BEST special
is that every team starts with the same pile of stuff, provided to
them by BEST.  This is all they're allowed to use, with limited
exceptions.  Working under these constraints, on this timeline, leads
to some very unique solutions, but the challenges should be familiar
to anyone with a career in engineering: an under-scoped problem with a
budget written by someone else, and you're on the clock for a looming
deadline.

Since around 2009, the BEST Robotics Competition has used the Vex
Cortex platform as its programmable controller.  This was, at the time
it was launched, a really neat controller, but time is not kind to
industrial designs.  Using very low power micro-controllers, a
semi-custom IDE for writing C-ish code, and an engineering style that
the world has moved on from its showing its age.  Its no great
surprise though, for a controller that would have begun its design
life-cycle when George W. Bush was still president, the Vex Cortex has
had an extremely long and successful service life.

All good things must come to an end, and automation controllers are no
different.  With the end of the Vex Cortex firmly on the horizon, BEST
started looking for a new controller.  I'd been on the periphery of
this search for a while keeping an idle curiosity at what people were
inspecting, but hadn't really contributed much.  During the Made 2
Order game year, this would all change.

## A Deafening Stadium

Made 2 Order proved to be an exciting game with a last minute scramble
against the clock.  Positions were gained and lost on the leader board
in 15 second match-end pushes that had the stadium on their feet.
Being part of the game operations team, I kept my feet up off the
floor whenever possible because walking for 12 hours a day on solid
concrete very quickly wears out your feet.

A long time friend and now COO Greg Young joined me at the video
control desk where I was overseeing the streamed portion of the game.
This is one of those positions where once everything is up and
running, you get to watch the game and relax a bit, but you have to be
ready to jump in at any time if things start to go sideways.  I asked
Greg how the hunt for a new controller was going, and what it looked
like the front runners were.  He told me that it was basically down to
a few systems, none of which really "felt" like BEST.  In the world of
BEST, the kit can most accurately be described as "a pile of stuff".
Think sheets of plywood, bits of metal, raw fasteners and assorted
bits of wire.  This closely mirrors industry where designs emerge from
component parts.

I asked if the Kit Committee had looked into the Raspberry Pi
ecosystem, and he mentioned they had, but they were concerned about
the boot times.  It dawned on me that they'd looked into the Broadcom
based Raspberry Pi boards which boot a full blown Linux system, but
not the relatively new at the time RP2040 micro-controllers.  These
micro-controllers present an appealing target for mechatronics: they're
real-time, they boot almost instantly, and they're relatively
inexpensive, which is good when there's a chance that a learning
moment might fry a controller.  Greg asked me what a controller based
on this concept might look like, and I took out a sheet of paper and
sketched a design with two boxes on it, and some arrows drawn out to
motors, servos, and a gamepad.  Little did I know that with this
stroke of a pen, I was committing my nights and weekends for the next
two years.

## The Winter Break

Between the end-of-season championship events and the start of the
next season, BEST has a winter break.  I figured if I was going to
seriously propose this idea, I should have a working prototype.  I
rounded up a few close friends who had the right background with the
relevant "I'm putting together a team" memes, and we started chewing
on the problem.  The very first prototype of what would later become
the Gizmo is still sitting on a shelf near my desk.  It was a single
breadboard with the code that would later become the system firmware
running on one core and the code that was my own robot control code
running on the other core.  The two components communicate via a
region of shared memory, and it uses a crude HTTP based API to a
server running on my laptop.  The entire system is cobbled together,
but it works and demonstrates the concept.  It also demonstrates that
you can silo off all the complex communication parts and allow a
student who may be writing embedded code for the first time to focus
solely on their code, what we'd normally call "business logic".

I took some pictures of this, wrote up some design goals, and sent
them off to Greg and my team.  My team was hooked on the idea of
developing this, and within about a week a schematic existed, and a
week later artwork for printed circuit boards followed.  These boards
bear a striking resemblance to the final production boards, but have
lots of subtle problems and things we'd come to learn the hard way
needed to be fixed.  These boards were also, when we ordered them,
completely blank and designed to be hand assembled.

We'd learned that machine assembly was a fairly expensive thing to
have done with the supplier that made these very first prototype
boards, and as a result, we thought we'd design the whole thing to be
a "solder it yourself" type affair, similar to BEST's IR sensor kit.
Most importantly, this limited us to some fairly basic components.  We
had fixed-color LEDs to indicate if various parts of the board had
power, we had 3 multi-color NeoPixel style LEDs that we could control,
though for what we didn't know yet, and we had a power connector that
somehow despite multiple reviews, we'd managed to get the polarity
wrong on.  What we had most importantly was a working prototype.

## We'll Get it This Time (TM)

What happened next was a rapid fire progression of a few boards.
First we ditched most of the through-hole components.  They were slow,
big, and our idea of build it yourself wasn't going to fly with the
target audience, most of whom do not have precise soldering equipment
and skills.  What most people would want is a board that you take out
of the packaging, put some modules on it and then you can get back to
building a robot.  This would take some refactoring.

We changed suppliers, working with a new manufacturer that offered
turn-key parts sourcing and assembly.  We then heavily heavily
optimized for what would make the controller easy to use.  Part of
this meant eliminating external cable harnesses by shuffling around
voltages on the board.  Parts of this goal were also achieved by
putting them in the hands of anyone who would take one.  During this
phase, we handed out around 30 boards to engineers, educators, and
former coaches to get feedback on what worked and what didn't.

Feedback is an important thing, and I'm setting this paragraph aside
to say that the single most important thing you can do in your career
is to learn to separate yourself from your work.  Sometimes your works
sucks and you need to be told that.  You don't suck, your work on one
specific project does, and that's a point to listen to and move on
from.

We got told the intermediate prototypes sucked, multiple times over.

People didn't like the power connectors, they were too expensive.  We
got the polarity of some pins flipped, fine, fixed in the next board
step.  There were questions about doing dual-voltage I/O lines; no
problem, we'll make everything 3.3v which simplified a lot of layout
concerns.  One of the biggest things we got rid of after a few
revisions was a bank of "mode select" pins that we were so sure we'd
need at some point, but never came up with a compelling use case for.
One of these was for the "competition mode jumper" which even in the
very earliest versions of the software we'd made obsolete.  If the
design depended on moving around fiddly jumper wires it was not likely
to succeed.

By this point, we'd caught the eyes of the BEST Kit Committee, because
what we were designing was very close to a component thing.  It was
and is a carrier board without any intelligence of its own.  I/O lines
from the student processor are directly exposed, and the only real
"magic" on the board is a Wiznet Ethernet controller managed by the
system processor to supply an Ethernet port.  The kit committee made a
few specific asks for things, like providing a regulated high-current
supply for servos to plug into, and we incorporated more of their
feedback into the design.  A number of people in my team are BEST
alumni, but having direct feedback was extremely valuable.

One of the things that the Kit Committee liked a lot about the design
was that it was open.  From the very start, we'd decided this thing
was going to be Open Source.  Not just the software, but the hardware
and the docs too.  My team never intended to make any money off this,
so the only gain we wanted was our names on the PCB, and for people to
consider using more open source software and hardware, especially in
education.

## A Pilot Roll-out

Eventually, it came time for BEST to decide if they were going to
proceed with the controller that by this point had picked up the name
"Gizmo" would be used or not.  The board of directors met and reviewed
test reports, comparisons with other systems, a trade study, and a
comprehensive report from the Kit Committee talking about how each
possible control system aligned or didn't align with BEST's overall
mission.

The Gizmo came up to the top of this report, but people were certainly
concerned about going in on a new control system.  No matter what
happened, it was going to be a big change, teachers would need to
learn a new platform to support their students, and it would need to
be a decision with longevity, since BEST operates on a fairly long
procurement cycle.  My team had stated we were comfortable committing
to a 10 year design lifetime, which means that we guaranteed the
ability to manufacture and support the system until 2034 at least.
This is a big deal in a program that is run entirely as a non-profit,
since it means that amortized cost of the changeover comes down
considerably.

Ultimately, the board liked the Gizmo, but was concerned about a
big-bang roll-out, and directed Greg to develop a roll-out plan.  After
a lot of conversation and back and forth, we concluded that a phased
roll-out was possible, but would need careful planning.

I'll admit I was annoyed by the concept of the phased roll-out, because
it came across as a lack of faith in my team to deliver.  By this
point we'd been building custom software solutions for BEST for a
solid decade.  The Gizmo would, however, be our first hardware design
for BEST and this was something that we knew would be more complex.
In retrospect, it was a good thing we did a phased pilot program.

## Designed For Manufacture

There is an old documentary film produced by Western Electric entitled
"The Tyranny of Large Numbers".  The film talks about the manufacture
of low tolerance resistors, which at the time were a part that had
only recently come into demand in the fabrication of ever more complex
telephony equipment.  The film talks about how building a handful of
something is easy, but once you need a lot of that thing, you start to
realize that all those small delays and time sinks add up quickly.

When we ran the math for the launch footprint of the Gizmo, we worked
out that we'd be shipping around 350 units across a footprint spanning
more than 5 states.  While 350 may not sound like a large number to
you, when you think about handling 350 circuit boards to get them
fabricated, receive them, re-pack them, and then deal with potentially
350 robotics teams to debug and troubleshoot them it becomes a
tyrannically large number very quickly.  This would require us to
optimize our processes, and to standardize our design language far
more than we had up to this point.

We did lots of work around Out Of Box experience, streamlining
software installation, streamlining bootstrapping procedures, and
doing one final board spin to add some extra voltage lines and bring
out any pin not currently broken out to a header.  All in, by the time
we approved fabrication on v1.00r0, we'd made 14 distinct revisions, 6
of which were actually fabricated as test articles.  We'd shipped 20
preview software releases and countless test builds to reviewers.
This work paid dividends, because it meant that we were forced to
optimize our processes.  All builds shipped via automation, all orders
followed standard templates, and all docs were managed via source
control and released in lock-step with their corresponding software
builds.

## Designed for Classroom Use

Designing a robust hardware system is one thing, and writing software
on top of that is another.  Both of these are, however, still grounded
in conventional engineering process and rationale.  What is not is
working with classroom technology.  I have a background in school IT
and had some idea of what we were getting into, but not the problems
we would soon face.

We had designed the Gizmo around as much standard technology as we
could, but the three main hurtles that remained to schools were:

  * Its programmable, so you still need to have some software to
    program it.  At the lowest possible end this is Notepad, but more
    advanced editors and IDEs are preferred.
    
  * Its a USB peripheral, so you need to be able to plug it in.
  
  * Its controllable, so you need to be able to run some control
    software to drive it around.
    
This last one proved to be a pretty substantial problem.  We'd
designed the Gizmo around standard 802.11n point to point network
connections to allow competitions to tightly control their radio
environments.  This would guarantee that interference from external
sources would affect all teams roughly equally, but meant that in a
classroom environment, you needed to establish a connection between
the control computer and the Gizmo itself.

It was at this point that I realized I'd been the Cool Uncle (TM) of
IT as my approach was that if it didn't immediately break something, I
was willing to let people try it.  To be clear, I did not start out
this way, and I have to thank my own cool uncle for drilling in to me
the most powerful phrase of IT: "we can try that."  This simple phrase
is so important.  I may know already that something isn't going to
work, but if I answer an end user with a "knee-jerk-no" then not only
have I not solved their problem, they now feel like I am not
interested in solving their problem.  At best, this breeds resentment,
at worst, it leads to people going around IT and the security measures
that are designed to keep an organization safe.  Unfortunately in
dealing with the roll-out of the Gizmo, we encountered many IT
departments that embody the Ministry of No as described in my last
post on information security.

So we need a way around this.  The solution we came up with was the
most straightforward user experience, but also the most work for my
team: we would stop depending on the user's computer entirely for
control.

# The Driver's Station

We introduced a hardware component called the driver's station.  In
its current incarnation, this is a Raspberry Pi Zero 2 W with a
backpack board that contains an Ethernet PHY and a USB hub.  It even
comes with an injection molded case, all at a reasonable price.  I'm
not sure how companies manage to sell this kind of hardware, but I'm
glad they do.

Having access to an embedded system that we controlled simplified a
lot of our control code massively.  No longer needing to worry about
it working on macOS, Windows, and Linux, we could now target a single
distribution of Linux and very strongly validate that things worked
how we thought they did.  We build up a process that would generate
whole system images that just needed to be written with Balena Etcher
(or similar) and quickly developed the driver's station into a full
concept that was ready for deployment.

Unfortunately, this kind of rapid development tends to introduce just
as many problems as it fixes.  The two primary problems that got
introduced with the driver's station were as follows:

  * Its Unstable - The initial software builds used a conventional
    EXT4 Linux file system to boot from, and since there was no
    safe-shutdown option, every time you pulled the power out it
    risked minor disk corruption.  This would almost never be enough
    to cause the machine to become unbootable, but it would be enough
    to get it stuck in an FSCK on boot.
    
  * The driver's station invalidated a large part of the field
    architecture.

Both of these are serious problems, and took months to fully nail down
and resolve in ways we were satisfied with, well into the pilot
competition season.

We fixed the first issue identified by using a conventional technique
well understood by anyone who works with embedded Linux: we put the
system into a ram-disk.  This made it much easier to update the
driver's station software image as well, and it simplified
configuration.  Team information was extracted from the FAT32 volume
label, which also makes the disks self-identifying.  Since all the
Linux internals were now fully encased in the ram-disk mechanism
updates became literal drag-and-drop of a set of files onto the micro
SD card.

The one thing that we did not expect when making this change away from
an image based card setup was that even though Windows has graphical
tools for most tasks you could want, there still isn't a graphical
tool for formatting and partitioning disks.  We wound up resorting to
`diskutil` which is a rare Windows console utility that closely
mirrors well understood Linux analogs.  This command allows us to very
accurately define what we want as a disk layout and format the disk
with the appropriate label type, make the partitions we want, and
format those with the correct type as well.

The second problem that the driver's station introduced was much more
nuanced, and more involved to resolve.

## The Field Management System

The Field Management System (FMS) is, as the name implies, a system
for managing one or more fields.  It coordinates network usage, radio
channels and keys, and streams metrics and log data back from every
team into an interface suitable for review.

In the pre-driver-station architecture, the FMS was little more than a
commodity wireless router and a laptop that all the joysticks plugged
into.  When using joysticks over longer distances baluns could be used
to extend the USB signals over cat5 cable.  This architecture was
quick to deploy, easy for maintenance, and horrifically insecure if
anyone was able to breach the security of the laptop, since it was the
central choke-point for all control messages.  When we introduced the
Driver's Station, this architecture became untenable.

Why?

The Driver's Station is a full embedded Linux target with network
connectivity.  We couldn't trust anymore that it was going to be
running the software that it went out the door with when a random team
showed up to play their match.  This may not sound like a problem
since the FMS network has been completely air-gaped from any and all
other networks since day 1 of the design, but its a very serious
problem for making sure that one team doesn't interfere with another
team.  Fortunately, there is prior art in this space, and we could
borrow elements of design from other large robotics competition
control systems.  If we can't trust the teams to not interfere with
each other on the network, then the solution is really simple: give
each team their own network that is isolated from each other.

Unfortunately, this is one of those things that's really easy to say
and describe, but a fair bit more complicated to implement.  To pull
this off, you need to implement VLAN aware switching for Driver's
Stations to plug into, you need to implement unique SSID/PSK pairs for
each team to connect to, and you need to implement some layer 3
fire-walling to ensure that team hardware can still communicate a few
critical things back to the FMS supervisory processes, mainly things
like status checks and metadata communications.

Out the window went our architecture of whatever laptop and WiFi
access point you happened to have, this would now require
sophisticated programmable network elements to manage the various
elements, provide the required services, and do so on the cheap.  We
looked at a few options ranging from arbitrary commodity hardware
running OpenWRT to more enterprise options.  We ultimately settled on
equipment from a Mikrotik, a Latvian network equipment manufacturer
that makes extremely versatile network hardware at very reasonable
prices.

This hardware is managed via Terraform running from a dedicated Linux
machine that serves all of the FMS tasks.  To standardize this
component, we selected the Raspberry Pi 400, and have since qualified
support for the Raspberry Pi 500.  Switching to an architecture where
we control the entire hardware and software stack came with a number
of benefits.  It meant higher quality documentation could be drafted,
and better testing could be performed since we could now duplicate an
entire competition environment with high confidence.

## The Roll-out

With the BEST Robotics 2024 "Low G" season fast approaching, things
quickly turned into a blur of software releases, hardware prep
parties, and working calls with various different groups to get the
entire system out the door, so how did it go?

Well, like all projects, the outcome had some positive elements, and
some negative elements.  Perhaps the biggest negative element is that
no matter how much training content, documentation, and assistive
material we published, we discovered most people just didn't read it.
They'd encounter some fault condition and throw their hands up in
panic.  I'm well accustomed to this in writing software for general
consumption, but I'd hoped that in a setting where people are
specifically seeking out new knowledge and skills in the engineering
disciplines that the response would have been different.

By the end of the season, we were able to identify 3 key fault states
that a team could get themselves into:

  * Corrupted Driver's Station
  * Bad User Code
  * Bad Field Link
  
The corrupted Driver's Station software was addressed early on by
switching to the ram-disk enabled builds described above, but this led
us into a more subtle and more insidious problem we'd keep running
into throughout the season.  People just wouldn't update their
software.  Even as late as mid-December for a season that started all
the way back in August, I was running into teams that were reporting
issues we'd fixed months earlier and they just hadn't updated their
software.  To some extent this is understandable, because in the
context of BEST Robotics, teams are not supposed to modify the
hardware or software without explicit authorization from their hub.
What we did not account for, and still have not found an understanding
of, was the decision several hubs made to remain on known-bad versions
of the software.  This fact and the similar surrounding factors mean
that we are making a much stronger effort to lock all software
versions prior to the start of the 2025 game season to ensure there
isn't a foreseen need to update software mid-season for teams.

The bad field link turned out to be an extremely frustrating game of
whack-a-bug where myself and my team regularly tore the whole system
apart looking for issues only to think we'd fixed something and
discover the next problem.  We debugged MQTT, we debugged firewalls,
we debugged DHCP and DNS, we reworked watchdogs and re-architected
components of the provisioning system, all without much success.  We
eventually started recommending to hubs to run their competitions in
Direct Connect mode where the FMS was out of the loop.  This had known
side effects and was not a long term solution, but due to the game
design in 2024 and the distances the wireless link needed to work
over, we could tolerate the lower supported range in exchange for a
more stable connection.

In the end, the problem was staring us right in the face, but took a
large number of steps to fully isolate and validate.  The metrics we
collected on the system were all from the Gizmo's perspective, and
from its perspective the wireless link was being received well, and
had a good signal to noise ratio.  The problem, obvious in hindsight,
was that the small WiFi radio on the Gizmo with its integrated PCB
antenna just wasn't transmitting at very high power, and the received
signal was very low quality at the Mikrotik device at the field.  This
didn't matter in the Mikrotik to Gizmo direction because the Mikrotik
was plugged into an external voltage supply and could transmit at the
legal limit, even using its PCB antennas.

The solution, elegantly simple, was to just use a Mikrotik access
point with external high-gain antennas.  This produced a nearly 10dBm
signal improvement out of the box, which was further refined by
carefully studying how the RF performance was affected by the
orientation of the device and re-orienting it relative to the expected
robot positions.  This is a key takeaway if you're designing a
wireless system: always check and validate your understanding of the
antenna performance in both directions.

Once we swapped out the field access points, 2 large scale
championship events went off without an RF related hitch.  The most
frustrating part of this discovery was that we'd done our original
range calculations with a Linksys N300 access point before refactoring
the design to use the Mikrotik hardware, and the N300 uses external
antennas!  We'd been so focused on the performance of the Gizmo itself
and how it received signals that we'd lost sight of the fact that even
if the IP layer channel is unidirectional, the underlying 802.11n
signaling protocol is intrinsically a bidirectional channel.

The one issue that remained in the FMS through the entire season is
one of operator confidence.  The FMS runs on top of a Linux system, as
that's what my team works with regularly and were confident to develop
a production-critical application around.  For us the terminal is just
another day in the office, but for many the white text on the black
screen seems to trigger some kind of pseudo-fear response.  As
computers have become more and more appliance-based and there's less
and less opportunity to see how things work, the once common knowledge
of the text shell has begun to vanish from the consumer tech lexicon.
We're addressing this item by bolting a web interface onto the FMS to
make most operations point and click, but it does bother me some just
how much that has become a requirement for interacting with the
computer.  I've always been of the opinion that learning a new system
is going to involve "failing forward" and making mistakes along the
way in order to gain a deeper functional understanding of how the
machine does what it does, but I've come to learn that that kind of
attitude towards computers is not shared.

The last major issue we stumbled into during the season was the most
expected.  Students who are learning to write code aren't particularly
good at it.  There's no shame in this at all, every engineer has to
start somewhere, and you only get better at things by making mistakes
and improving your skills.  What we did not expect in this was how
little support schools provide to enable their students to learn more
and receive help.  Our main documentation site was blocked in most
over-zealous web filtering systems, so we had to migrate hosts and
file various appeals.  In the end we wound up hosting our docs in many
different places in the hopes that one of them would be available, and
making PDF copies available on request via email.

We were surprised to discover just how many schools were touting their
programming courses and then blocking access to GitHub and other
popular cloud tools for doing software development work.  This is the
one that frustrates me the most, because it encourages bad habits and
handicaps students by not getting them access to industry standard
tools from the start.  I saw at least a dozen teams (ab)using Google
Docs as a source control system, and constantly having to fight with
its attempts to insert smart quotes into source code.  On more than
one occasion teams would ask for assistance, and send me a file via
email usually named something like `Copy of Robot(6) - WORKING
FINAL.ino.docx.zip`.  While I find the dedication of the students
working under these conditions to be inspiring, it does explain why I
regularly encounter university students who have no idea how to lay
out and work on larger software projects.

This last problem is the one I'm most unsure of how to fix, but is the
most important to address.  Schools want to provide their students
with these experiential learning programs and to get them ready for
careers in the real world, but also want to provide such a restrictive
environment with no interaction with that outside world, so
unsurprisingly, success is rare.  We're toying with the idea for the
2025 year of providing a pre-built system image for the Raspberry Pi so
that all programming can happen on specially air-gaped machines that
are not subject to the normal problems we encountered this year.  If
you have suggestions for how to teach computer science concepts in an
environment that actively resists access to computers, please do write
to me and share your ideas.

## Where We Are Now

I write this post having just submitted the order for Production
Revision v1.1, the first revision that will be available to the
general public to purchase (as opposed to being available as merely a
set of plans with the fabrication left as an exercise to the reader).
This has been a monumental journey and I could not have done it
without the amazing team I worked with to put together the Gizmo, and
the amazing team of educators and facilitators withing BEST Robotics.
The next steps will be to gear up for another year, though this time a
less hectic one having completed a large amount of the engineering
work already.

I would be a fool to say that we've solved all of the problems and
there's nowhere to go from here, but I do absolutely believe that we
addressed the major show-stoppers, have plans for the ones that
remain, and have a general handle now on where things go bad.  None of
us ever expected the first pilot to go smoothly, but we do have reason
to believe that this year will be smoother.

If you want to learn more about the Gizmo, you can check out the main
Gizmo website (<https://gizmoplatform.org/>) and the documentation site
(<https://gizmoplatform.dev/>).
