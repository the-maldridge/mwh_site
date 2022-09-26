---
title: "Modded Minecraft on the Steam Deck"
date: 2022-09-25T23:45:52-05:00
---

Though I don't have a huge amount of time for playing computer games,
I do spend a lot of time playing minecraft, as well as a number of
retro games and point and clicks.  As my desktop is optimized for
compiling code and having many terminals up, it doesn't exactly fit
the bill of a gaming optimized machine.  It doesn't help either that I
built my most recent desktop at the height of the 2019 GPU craze.

As you can imagine, when Valve announced a purpose built portable
gaming PC in the form factor of a Steam Deck, I was excited.  This was
a machine that I could dedicate to playing computer games on, it
wasn't really in a form factor I'd be tempted to do software
development on, and if I managed to corrupt it in some way I could
just re-image it with a known good system image.  The Steam Deck is
based on an obsolete package set from Arch Linux which bothers me, but
since everything on it but the Steam Client is open source software, I
can always change out the underlying distribution for one of my choice
with more modern software at the cost of then being my own OEM.

For Steam games I've played so far, the experience has been more or
less seamless.  Many games I like to play are available from Steam,
and the older ones I play are even available with either ScummVM
profiles or Proton configs that are known to work.  The one game that
is not available and will likely never be available via Steam is of
course Minecraft.  I bought Minecraft during beta, for which I think I
paid something around $6.  It has easily been one of the most
entertaining $6 I have spent.

Getting Minecraft running on the Steam Deck is a relatively well
documented process.  After switching to "Desktop Mode" and accessing
the KDE software discovery center you can trivially install PolyMC via
a flatpak.  This works super well for most Minecraft options you might
want to play, and even plenty of modded experiences.

At the time of writing though I have a Create: Above and Beyond world
going, and this uses a version of FML that errors out on versions of
Java newer than 8u230.  Even on the old version of Arch packages the
Steam Deck ships on Java is newer than this particular version.  Some
people talk about turning off the readonly overlay on the filesystem
and then retrieving an old version of Java from the AUR, but there's a
way easier way to do this.  You can simply get an old version of Java
from Adoptium (formerly AdoptOpenJDK) and place it somewhere in your
home folder.

For the modpacks I play,
[jdk8u312-b07](https://github.com/adoptium/temurin8-binaries/releases/tag/jdk8u312-b07)
is the most recent archive build that works.  After unpacking the
tarball somewhere in your home folder, simply point to the `java`
executable in the PolyMC instance settings for whatever instances
require the older version.  It should be possible to use only a JRE
instead of a full JDK, but modpacks tend to do things that are not
well constrained in what one would call "release quality Java".  After
all, if that were the case a patch level upgrade to an LTS build
should not have broken it.
