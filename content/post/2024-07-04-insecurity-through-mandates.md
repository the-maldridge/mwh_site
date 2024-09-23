---
title: "Insecurity Through Mandates"
date: 2024-07-04T02:37:10-05:00
---

One of the topics of discussion in my circle of friends we keep
circling back to is security of personal, work, corporate, and
production systems.  Its no surprise since many of my circle have
backgrounds in highly academic fields and have between us bordering on
a century of experience in operating systems at all points on the
scale spectrum.  From active red-team work to defense of mission
critical systems, our discussions tend to span it all, and usually
with a fairly blunt and honest look at reality, something I don't
often see in the industry.

For example, we recently had a good laugh after seeing a "data center"
at a major university where a large amount of student data was stored
and how the managing team were quite proud of all the security
technology they had on the servers.  Indeed the digital protections
were quite impressive, but were almost completely nullified by the
improperly installed doors which didn't close all the way as well as
the 9' high plate-glass wall that seperated the machine room from a
hallway that was open to the public.  This is a common example I often
see where very little thought was actually given to the entire
security picture to the point that the system wound up having little
more than a "do not enter" sign on it.

Security as we usually discuss it is from 2 different angles.  We,
like many similar groups, are often always second guessing our own
work from a position of total knowledge to wonder if we could have
done better.  This is an easy doom spiral to get trapped in because
when you know how a system is built, it becomes easy to defeat it.
The far more concerning discussions are the ones where we realize that
some fundamental technology is just broken at the low levels.

What's amazing to me is that most of these systems tick all the boxes
for various policies, frameworks, and audit requirements.  This can
lead to only one conclusion, and its the one that most people in the
industry who know what they're doing implicitly understand, but chose
not to acknowledge: security is pretty universally bad, and most
organizations actively fight against measures that improve security.
Lets dive into this deeper and look at what is security, how most
places implement it, and ways to improve.

When my circle is talking about system security, we're usually looking
at various properties of the systems involved.  Two of the biggest are
resistance to technically inclined idiots and system integrity
preservation.  The idea here is that there is no system that is
idiot-proof, because as soon as you build one the universe will
manifest a better idiot to prove you wrong out of spite.  Given this
axiom, what secure systems should strive for is a passively secure
design.  This is similar in nature to the concept of a system that is
passively stable, similar to how airplanes have a natural posture at
which they will neither climb nor descend.  A passively secure one is
one that does not permit itself to be placed into an insecure mode of
operation.  Examples of such systems are ones that require mTLS, check
and validate configurations against the expected layout, and when all
else fails print a giant banner to the logs when operated in an
insecure mode.  My own software, NetAuth, takes this last option as
there are too many configuration options to generaly validate the
installation as conforming to a best-practices design.  Instead,
there's a giant message in the log that warns you if you've started
the system up without TLS encryption.  A very wise engineer I had the
privilege of working with early in my career once gave the advice
"write every log message as though its going to be read in a
congressional hearing to someone who has trouble telling a cellphone
from a pocket calculator."  This sentiment extends to messages that
are being logged into files from software I didn't write, the idea
being that I want to be comfortable with any logs that exist on
systems being read during an outage postmortem meeting.

Unfortunately, a lot of these discussions start to border very close
to the "what is true?" question, and that's best left for personal
reflection on your existential crisis of choice.  The gist though is
that all of security depends on making decisions based on the
information being presented from inherently untrustworthy sources in a
system that can trivially fake reality as is required to get a variety
of answers from the security hype system of the day.  With very
limited exceptions, there is nothing you can do to counter this, and
you have to accept specific compromises in the operation of any system
that exists in the real world.  The only exception to this that I'm
aware of is within the Apple ecosystem, where the hardware validates
everything from baked in firmware all the way up through application
binaries via a strict cryptographic chain to ensure they are what they
claim to be.  Unfortunately, even the finest fruit designed in
Cupertino loses all of these guarantees as soon as you make it useful
to a developer or engineer, because as soon as you introduce a general
purpose compiler, program interpreter, or extensible command shell
you've opened pandora's box to bring in unvalidated software.  You may
think you're clever and can lock down your systems, and we'll come
back to this later, but for now chew on the truism that strict parents
raise sneaky kids.

In 2019 I wrote up a discussion on [what is production
grade](2019-01-20-what-is-production-grade.markdown) and gave a lot of
considerations, opinions, and general food for thought as to how I and
the teams I work with grade software for fitness for a particular
function.  There's very little from that article I do not continue to
stand by today, and based on those tenants, I can firmly and without
hesitation say that to date, no security software I have interacted
with was even remotely production grade.  The vast majority of it that
I've had the displeasure of working with shouldn't have earned a
passing grade in the average computer science class.

Lets name names.

In my carer, I have had the displeasure of working with, in no
particular order or sense of time, AlienVault, Sophos Antivirus, Okta,
various MDM systems, ManageEngine UEMS, Falcon CrowdStrike, Carbon
Black, and dozens of other systems that I can summarize as "industrial
grade e-waste."

What makes these systems bad?  Well, lets break them down into
categories.  AlienVault, Okta, and the Sophos suites all fit into a
category of software that just isn't designed for humans.  I'm not
sure what higher plane beings it is designed for but software that has
the ability to remote wipe machines through automation or lock out
entire companies in ways that can't be recovered remotely needs to be
well designed and well maintained.  Between thousands of toggles, bad
documentation, or just plain bad product design these systems have
earned my ire.  They're manageability nightmares, barely even
acknowledging the concept of Infrastructure as Code (IaC) and usually
develop a priesthood of specifically trained engineers who get very
grumpy if you start to get too close or look too long at the services
they manage.

To single out Okta specifically, I've now had 3 different CISOs tell
me that they know that Okta's security is not great, as evidenced by
the string of security compromises that shouldn't have been possible
in the first place, but because "everyone else is with Okta" they
don't see it as a problem.  This is like saying "yeah, that wolf over
there is eating some sheep, but I'm also a sheep so I'm no tastier
than any of the sheep the wolf is eating."  The sheep are still
getting eaten, and its possible to avoid that fate!

Phrased differently, its my opinion this kind of technological herd
immunity is a dumb overextension of the concept of not writing your
own crypto.  Yes, you should not write mission critical security
components from scratch when there is no driving reason to do so.  At
the same time, you must acknowledge that those same components came
from somewhere and that somewhere was an engineer who sat down and
wrote them.  If you work in a technology company or company that does
engineering work, you almost certainly also have this kind of engineer
who can write security sensitive software specific to your use cases.

I've also now personally experienced Okta wildly mishandling a
security defect I reported some years back, and remain amazed that a
large publicly traded company came to exist out of something that used
to be table stakes to run internally.  Perhaps I'm in the wrong
business and should setup a startup that sells Kerberos with some
exorbitant per-user licensing bolted on top...

Looking at more software, lets look at UEMS, CrowdStrike, and Carbon
Black.  These are all endpoint programs, meaning that they waste CPU
and memory on every machine in your corporate fleet, or in some cases
across every machine in your production fleet.  They also all share a
common theme of being extremely poorly documented, running in
privileged contexts, and having functionally zero debuggability.  UEMS
is particularly impressive as its implemented in Golang (trivially
deducable from its many crash logs) but still regularlly has memory
segmentation violations.  The entire point of writing modern software
in Go is to avoid these kinds of memory management mishaps that are
themselves great entrypoints into security events.

CrowdStrike and Carbon Black fall into the category of security cults.
These are charactarized by being large, exceedingly expensive, and
completely undocumented in the name of not making them easy to bypass.
These solutions hook deep into the systems they are deployed to in
much the same way that the exploits they claim to defend against do.
Unsigned kernel modules side-loaded to avoid UAC or dmesg warnings,
sketchy "drivers" to hook process creation events, and usually CPU
intensive userspace processes to ship all this back to a super secure
enterprise security cloud that is definitely not us-east-1.  These
systems also target usually some recent version of macOS, some
reasonably recent build of Windows, and some ancient build of Ubuntu
that makes even Debian look like space age alien technology by
comparison.  I've run Linux on my workstations at every company I've
worked for and usually run either Ubuntu or Void Linux.  My machines
are, with perhaps the singular exception of my time at Google, orders
of magnitude more secure than the production systems I support.

This shouldn't be surprising, because my workstation doesn't have to
host any network accessible services, can run in fully privilege
isolated modes for X and friends, and only has to work for me.  Not
building a general purpose security solution means that almost all of
the complexity is gone and I can focus on how to turtle my specific
machine.  In all cases that I've then been asked (or had it just
demanded of me in a very unprofessional manner) to install a security
agent, its made my machine less secure.  I've wound up with privileged
processes, had to relax my kernel signing requirements or in many
cases roll back to an older kernel that the security software could
use.  In all cases, when I finally looked at what the agents of these
various things did, they really didn't scan much, and they ignored
containers, VMs, and most of my home folder.  This isn't particularly
surprising as they're built to handle the most basic use case.  What
is surprising, and in my opinion is not okay, is that these solutions
are all marketed as some kind of bullet-proof vest for endpoints that
are completely secure and will protect you from threats you can't even
imagine.

If you've ever looked into purchasing a bullet proof vest, you quickly
discover that they aren't marketed that way.  They're marketed as
bullet resistant for specific threats under specific circumstances
with no guarantees or even implied statements about untested and
unverified conditions.

Usually, I spend some time trying to explain to the security people I
work with these defects but eventually give up because its easier to
waste a week of company time getting security software to waste CPU
cycles than it is to get security people to understand that the vendor
is selling us snake oil.  I am willing to believe that these systems
have value on macOS or Windows where the system is more constrained
(though we'll come back to this in a minute), but on a Linux system, I
have yet to see a security agent that actually did anything other than
crash.

But what about developer workstations that are macOS or Windows based?
Well, simmilar to the realization that Neal Stephenson comes to in [In
the Beginning was the Command
Line](https://web.stanford.edu/class/cs81n/command.txt), almost all
develpment tools are from a UNIX background, which means that to have
a development environment on Windows or macOS, we need to bring enough
of a *NIX environment with us to do work there.  On macOS this is done
with `macports` or `brew` or even just running a Docker container.  On
Windows this is finally relatively standarized with WSL2 which just
provides a full blown Linux VM that's rather well integrated into the
shell.  In both of these cases, the important thing to keep in mind is
that this Linux subsystem is alien to the host operating system.  In
macOS its glued together into the paved path with various really
clever tricks to make it blend in, but its still fundamentally
seperate from the base system.  On Windows the divide is even greater
since Windwos actually virtualizes the ELF processes in special
containers that exist in the System Processes list, but aren't really
something you can interact with or interrogate.  On the F-Secure blog,
there's a really interesting article about this from the perspective
of WSL2.  You can read it
[here](https://blog.f-secure.com/hunting-for-windows-subsystem-for-linux/)
and I really think its worth the read to understand exactly how much
you can do under the radar.  Since this is a full seperate process
space being supervised by a seperate kernel, as you might expect the
host level EDR tools don't really do much with it since they can't
peer into it.  Reddit user u/BradW-CS sums it up really well in this
answer about [whether WSL2 is a blind
spot](https://www.reddit.com/r/crowdstrike/comments/iozosj/comment/g4idyfv/):

> Since WSL files are not true Windows executables, neither on-sensor
> nor cloud File Analysis ML will pick up the activity to generate an
> alert to your Falcon UI. We send process roll up (PR2) events for
> WSL processes including command line and image hashes, and we have
> the ability to block the processes if they are on a hash
> denylist. In general, the Falcon sensor on the host will continue to
> monitor for malicious activities from all processes regardless of
> whether they originate from WSL or not.
>
> Outside of that, regular IOAs around file system and network access
> apply here, but some Windows-specific detections/capabilities won't
> be supported.
>
> Additionally, as these are not Windows binaries, there is no ML
> model on them, so NGAV won’t really do anything to these binaries
> unless they’re on a custom denylist.

I fully expect that since this reply was posted in September of 2020
various vendors have improved their ability to interop with WSL2, but
the fact remains that for all EDR solutions, not just Falcon's
highlighted here, when you have access to a full blown VM the EDR
can't see into it since it is actually a different machine.

I haven't been able to find much information despite my Google-Fu that
says whether any of these solutions look into Brew or MacPorts
binaries, but I suspect the answer is a solid shrug since these
systems are kind of like the wild-west.  It would be like trying to
sift through an `npm` packages directory, something that's so complex
multiple whole companies exist just to try to get near to solving that
question.

This is important since engineers need to do actual work.  If you try
to stop engineers from doing actual work by making it harder to use
these standard tools, several things will happen.  The first is that
the good engineers will leave because your organization is wasting
their time.  The second is that the people who stay will get sneaky.
Can't work from the company issued machine?  No problem, it can sit on
the desk next to the unregistered one and work can just get disked
back and forth between them.  If strict parents raise sneaky kids,
then unworkable policies result in sneaky employees.

You'd think that at the end of the day the advanced machinery of the
human mind would prevail in these cases and most security teams would
double down on securing systems, even if that means admitting that a
smooth sales pitch turned out to be snake oil.  In my experience this
is so rarely the case that it is I believe the single biggest risk to
real security on the internet today.  With the singular exception of
the amazing security team I worked with at BetterHelp, every security
team I have worked with before and since has been a _Ministry of No_.

What is a _Ministry of No_?  Its a social construct enshrined in so
much business policy that has in most cases completely unchecked power
to do whatever they want, and questioning them is a good way to get
yourself fired.  These teams often have deeply rooted cultural
problems and try to hide behind policy rather than integrating
themselves as functional parts of the engineering organizations they
support.  This is a pretty damning claim to make, but its the harsh
truth I've experienced across a dozen tech organizations.  I sincerely
hope that you, the reader, have experienced a better fit than this.

Here's some examples of things I've seen various Ministries of No do
that are extremely unhealthy:

> Well that's just the way it is.

No, it isn't.  Nothing ever "just is".  It has a reason and a logic
for being, and if that logic is unsound then it needs to be addressed
and dealt with.  There can be no sacred cows in security and the
ability to sound the alarm that there are fundamental problems has to
be able to come from anywhere.

> I'm just the messenger.

Great!  Who has actual authority and responsibility, I'll go talk to
them.  I have no need to deal with arbitrary layers of messengers and
front-people when I'm highlighting an issue.  A team that hides behind
this kind of passive behavior doesn't take the responsibility for
their failures or their problems.

> Comply or GTFO.

Yes, this is an actual quote that a real security person at a past
role has said to me.  Ultimatims are never the answer and that kind of
adversarial language is not going to look good in an HR mediated
conflict resolution, because that is a threat.  I have left 2
companies in the past that tried this rhetoric, one that's still
dealing with the PR fallout when the public finally realized that the
company was doing sketchy things with user data security.  Its also
not helpful as a cultural point, because this kind of language makes
it clear that its best not to engage with security, to let them think
they know everything and have it all under control, and to just not
acknowledge the gaping holes you may discover in security systems.

> The Vendor says you're wrong.

SERIOUSLY?  This is like those water purification kits that come with
their own test setups, or sunglasses that come with a special
flashlight to prove they work.  If you haven't independently verified
a vendors claims then you should assume the vendor is actively lying
to you either through stated intention to get your money or sheer
incompetence.  This is usually the point at which I give up on trying
to improve security and start looking for a new job.  The culture that
enables this kind of cargo-cult behavior is the culture that walks
straight into the security breach without even realizing that's what
they're doing.

> I can't believe you don't want us to be secure!  Why would you argue
> against obvious security?

This is a logical fallacy. These tools are security in brand
recognition only, and installing them notably reduces security. If it
devolves into any more of a personal attack, you may have found
yourself speaking with a toxic security team.  This kind of cargo
culting is a dangerous end-game state of most Ministries of No which
can lead to the "Comply or GTFO" state from above.

So far, this has been one hell of a rant, and that's not the note I
want to end this post on.  I want to end this post talking about how I
think the industry can improve, and things I wish the security people
I'd worked with previously could do to improve.  Security has to be
collaborative, approachable, and understandable.  It has to be a group
that people aren't afraid to approach, and it has to be a group who
can accept mistakes and admit when they themselves were wrong.  It
also has to be a group that's okay with being challenged on things.
Seperating one's work from oneself is a hard thing to do, but it pays
dividends over your career.  I've only ever experienced this
personally from the security team at BetterHelp, and I sincerely hope
that they've been able to hang onto that culture as it was a huge part
of what made them successful.

Perhaps the single most important thing any of my professors in my
Software Engineering degree did was to say "someday you will be faced
with an issue that challenges your integrity and you'll have to decide
if you're willing to leave a company over it."  Dr. Straach was
without a doubt one of the biggest influences on me during my
undergraduate years, and her question still rings in my ears
regularly.  Security as both a profession and a concept is based on
top of trust, and trust is a quality derived from integrity.  When you
or your employer violate their integrity, it is impossible to build
the trust on top that is required to operate securely.

---

As always, but for this one specifically, the views I express on this
blog are my own and do not represent those of any employer, past or
present.  The themes of this post are not specific to any employer,
though some have been worse than others.
