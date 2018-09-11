---
layout: post
title: Bringing a new platform to Void
date: 2017-10-04 22:00:00
categories: void bootstrap linux
author: maldridge
---

When you download an image for your Raspberry Pi or Beaglebone or
other SBC do you ever pause to think about how that image came to be?
Installing the system for a single board computer rarely involves
booting into an installer, indeed it rarely looks like an x86 system
until well after the system is up.  Why is this?  To answer this I'm
diving into what it took to add the latest hardware support to Void
Linux: the Pogoplug Mobile (v4).

## What's a Pogoplug?

One of the first questions that can be asked here is why the Pogoplug?
Ultimately the answer boils down to it was cheap and I like the
Kirkwood architecture.  Its unique and a pretty slick system when you
get down to it.  It was one of the first devices in my opinion that
really counted as an IoT device and was really ahead of its time when
it came out in terms of a plug and play Linux based appliance.  Alas
times have changed and the Pogoplug is no longer the single player in
the market.

At a high level the Pogoplug is a Marvell Kirkwood platform with 128M
of NAND flash and just under 128M of usable RAM.  Its an 800Mhz system
so not a speed demon by any means, but quite capable as a file-server
or a small game server.  The system boots with u-boot like many other
ARM platforms.  It features one USB 2.0 port, one full size SD card
slot, one user defined button (used for ejecting volumes in the stock
OS) and perhaps strangest of all in my opinion is a Gigabit Ethernet
NIC.  I find this odd since no bus on the device can use that
bandwidth.  At the time of this writing a new old stock Pogoplug v4
Mobile can be had for just $9 from Amazon.

## Scoping the Target

One of the first steps in figuring out how to bring up a new target
for Void or any distro in general is to learn about the target
platform.  This involves finding out what hardware it has, what system
interfaces it might not expose but have on-board, and how to own the
device if this is already known.  Fortunately most of this information
is out on the internet already since this is a somewhat dated device.
With this information in hand I had positive confirmation that it is
an armv5tel processor.  Looking further, it turns out that this device
is supported by the mainline Linux kernel and has a well supported
DTB.  The DTB or Device Tree Blob tells the Kernel how the hardware is
laid out on the board.  DTBs are a somewhat new development designed
to keep the complexity of many small IoT devices in check.  The kernel
can boot, read the DTB and then understand instantly where the
hardware is and how to talk to it.  Other information was obtained
from Wikipedia and general Google searches.  More specific information
was obtained later.

The next steps involved making sure that a root file-system could be
built for the device.  Lets take a step back here and look at why this
is the way ARM systems are installed.  On an x86 system the BIOS loads
some initial stubs to talk to the hardware and then searches the
various block devices for one with both a boot sector which is valid
and a partition with the boot flag set.  EFI systems use a similar
mechanism of searching for a valid EFI stub, but may also validate
signatures along the way.  After the BIOS loads in the limited amount
of code that brings up the boot-loader it is finished with its
interaction in the boot but remains around as the well defined
interface by which the kernel talks to the rest of the hardware.  With
an Arm system u-boot will load, initialize whatever bus is needed to
talk to the NAND flash and then because partitions aren't really a
thing in the NAND world, it will load a uImage and uInitrd into
memory.  Modern kernels will also load the DTB into memory just after
the initrd.  After this step u-boot will jump into the kernel and its
job is done.  It doesn't really stick around and after the initial
load of the kernel completes, it is the sole arbiter of what happens
on the machine.  To be clear this is how in practice x86 systems work
as well, but for historical reasons, its important to know that the
BIOS/EFI systems are still around at the low levels of the machine.

So clearly a complete file-system needs to be available for the
target. For Void, everything is cross-compiled from x86_64 build
machines.  Fortunately, Void already has supported cross compilers and
cross profiles for the armv5tel and armv5tel-musl architectures.  This
stems from years ago when dockstar support was added.  So to bring up
a new system that would work for Void on armv5 all I had to do was
bootstrap a dedicated masterdir to run the build in and build the
base-system package right?  Wrong.  The base-system package is a
metapackage and so is intrinsically noarch, but it has hard
dependencies on x86-only packages.  Plus, the Pogoplug needs some
other stuff installed on it to work correctly.  As is common with SBC
platforms, it needed a dedicated base package.  After building a
dedicated base package (pogoplugv4-base) I set the masterdir building.
This was left to run overnight as even on my quite fast desktop it
still took several hours to compile all of the base system components.

While this was running I started working on how I would actually
connect and boot the system.  I knew I needed access to the boot time
console and perhaps even the ability to dump in new firmware if I
messed things up really spectacularly.  All of this is possible from
the netconsole in newer versions of u-boot, but the Pogoplug runs an
ancient version so this wasn't an option initially.  Like most
embedded style systems the pogoplug has a UART to be able to do some
debugging and initial programming during assembly.  As an aside, its
possible with certain versions of the OS to get SSH access and then do
all the re-flashing from memory and over the network.  I personally do
not like this option and prefer out of band consoles when possible.
To get access to do the initial flash I tacked on an FTDI cable I
bought several years ago to an unlabeled set of pads that contained
the TX, RX, and GND lines.  I did not have to reason out the identity
of these pads as this if fortunately available on several sites, but
in general I just look for 4 pads near each other and one of them with
continuity to ground and one with continuity to a power rail; at that
point its a guess as to which is transmit and receive, but you've got
a 50% chance of getting it right on the first try.

With the serial console tacked on I was greeted with a root shell
because after all, the 'S' in 'IoT' stands for security.  From this
point I updated the u-boot installation based on [directions from the
doozan forums](https://forum.doozan.com/read.php?3,12381).  I could
now boot the device and watch everything from the initial boot scroll
to the stock OS loading.  The system was now ready to boot a Void
tarball on.

To build the tarball I added support to the void-mklive system to
build a "PLATFORMFS" tarball for this device.  These are tarballs
derived from broad architecture tarballs and contain support for the
specific device in question.  Doing this was pretty trivial as I had
recently overhauled the system that builds the SBC images to make more
efficient use of bandwidth with better caching and to build the same
thing fewer times.  This change boiled down to a handful of lines to
change and then a new function to permit injecting custom dracut args
into a build (more on why this is necessary in a bit).

The build script creates a temp directory and installs the desired
packages into it.  If the target architecture is different from the
host architecture or some magic flags are set, XBPS will skip the
final configure stage of the package.  With the data unpacked into the
tempdir xbps-reconfigure can be used to, from the host, configure the
base-files package.  This sets up some critical subsystems that are
needed before chroots will work in the tempdir.  After that is done,
the image can be configured "natively" with the use of
qemu-user-static which allows the arm binaries to run on the host
system.  This involves echoing some magic hex strings into /proc and
is very poorly documented.  Fortunately most of this complexity is
wrapped up into mklive and so a developer would not need to
necessarily understand how all of this works at the start.

## Booting the System

So with a platformfs written to a flash drive, the new u-boot
installed, and a serial console connected I was ready to boot.  Except
that no matter what I tried, it did not boot.  This is where its
important to know when you're out of depth.  My experience is in full
blown x86 systems where I have lots of debugging tools available and I
can introspect into the stack very early in the boot process.  In Arm
this is much much harder to do, when its possible at all.  As a quick
sanity check I attempted to boot Debian on the platform.  Its well
supported and it would give me a good point to clear out weirdness in
the stack.  When Debian failed to boot, I posted a thread on the
[doozan forums](https://forum.doozan.com/read.php?2,37074) where it
was pointed out to me very quickly that I'd updated the firmware but
not written the new NVRAM state.  You can think of the NVRAM as the
"settings" similar to those in a BIOS based system.  Since I had the
old environment with the new u-boot, it was little wonder that things
weren't working.  After correcting the NVRAM state Debian booted just
fine.

With Debian booting I figured I was on the home stretch.  After all,
once *any* distro can be booted on a platform its generally just a
matter of assembling the right user-space system around the known good
kernel.  Since I had no desire to package yet another kernel for Void
I skipped this and decided to boot with the mainline kernels that are
regularly tracked and updated.  This also meant I could boot with
zImage support since I had an updated u-boot.  I wrote my system to
another disk and plugged it it and u-boot promptly stopped booting.
It turns out that the environment variables from the doozan forums are
fiendishly clever and try to auto-detect the disk that contains the
boot files.  Since I was using a zImage instead of a uImage this check
didn't work.

With more help from [bodhi] who is a truly incredible developer of Arm
based systems the variables were patched to look for a zImage instead
of a uImage.  The system now loaded the zImage, the uInitrd and the
DTB into memory.  With baited breath I hastily typed out `boot` at the
prompt and watched as the system promptly crashed.  Okay, so what
gives?  It loaded everything, it was the right arch and Debian had
already booted, so what could be wrong?  Once again [bodhi] came to
the rescue to spot that I had a 42M uInitrd.  This is insanely large,
you can fit an entire system in 42M and this was just the initrd.  You
see, if you build a Void kernel without a config file it will default
to building all possible extensions as modules.  Then if you build the
initrd with dracut and have the `-N` flag set you will wind up with
all of these modules in the initrd.  Many of these modules make no
sense on SBCs much less traditional x86 systems.  Configuring a kernel
build is time consuming and very dull work.  Fortunately this work was
already done, I was able to just use the kernel config file from the
Debian build to drive the Void build.  This resulted in a smaller
kernel and a smaller initrd.  But why did this fail in the first
place?  Unlike BIOS systems which will load the kernel and initrd into
memory at locations it chooses, u-boot requires you to set an absolute
memory address to load the resources to.  The address set for the DTB
was inside the range occupied by the initrd and so it corrupted it on
each boot.  The smaller initrd and moving the DTB solved this issue.

With the system now booting happily I pulled the drive out and made
some changes with it mounted on my desktop, mostly setting up a serial
console and making sure that sshd and dhcpcd were set to start on
boot.  After all this, I had a functional Void system that booted on
the Pogoplug.  Here's a quick look at what the booted system looks
like:

```
void-live login: root
Password:
Last login: Thu Jan  1 00:00:32 on console
# xbps-uhelper arch
armv5tel-musl
# uname -a
Linux longshot-musl 4.13.3_1 #1 PREEMPT Tue Sep 26 06:20:29 UTC 2017 armv5tel GNU/Linux
# df -h
Filesystem      Size  Used Avail Use% Mounted on
devtmpfs         52M     0   52M   0% /dev
tmpfs            58M     0   58M   0% /dev/shm
tmpfs            58M  132K   58M   1% /run
/dev/sda1       7.4G  201M  6.8G   3% /
cgroup           58M     0   58M   0% /sys/fs/cgroup
tmpfs            58M     0   58M   0% /tmp
# free -m
              total        used        free      shared  buff/cache   available
Mem:            114          11          76           0          26          98
Swap:             0           0           0
# pstree
runit---runsvdir-,-runsv---sshd
                 |-runsv---login---sh---pstree
                 |-runsv---dhcpcd
                 |-runsv---udevd
```

The system is booted on 11M of RAM, I'd say that's a pretty usable
system.  Its working with musl to try and get the system just a little
smaller. I'm pretty sure it could be made below the 128M limit to fit
in internal NAND but I'm content to boot from an SD card and keep the
NAND for recovery purposes.

This has been a brief look at how a new platform is brought up from
unboxing to booting on Void Linux.  Hopefully its been informative and
useful in explaining some of the unusual things about Arm SBCs and
Void's build processes.  If you'd like to duplicate this setup, here's
the TL;DR:

1.  Unbox and power on your Pogoplug, it needs to boot once on the
stock system to complete some initial tasks.

2. Open the case by removing the two screws under the feet and then
gently prying the top off at the seam line around the base.  This is
best done with a thin flat piece of metal.  Solder on a console cable
to the 4 pads near the SD card [according to this
page](https://wiki.openwrt.org/toh/cloudengines/pogo-v4).

3. Verify that you can connect to the serial console at 115.2
kilo-baud and that you have a root shell.

4. Update u-boot using the steps [here](https://forum.doozan.com/read.php?3,12381)

5. Compile the base system for the Pogoplug:

    ```
    $ git clone git://github.com/voidlinux/void-packages.git
    $ cd void-packages
    $ ./xbps-src -m masterdir-armv5tel -a armv5tel -r armv5tel binary-bootstrap
    $ ./xbps-src -m masterdir-armv5tel -a armv5tel -r armv5tel pkg pogoplugv4-base
    $ cd ../
    $ git clone git://github.com/voidlinux/void-mklive.git
    $ cd void-mklive
    $ make
    $ sudo ./mkrootfs.sh -r ../void-packages/hostdir/binpkgs/armv5tel armv5tel
    $ sudo ./mkplatformfs.sh -r ../void-packages/hostdir/binpkgs/armv5tel pogoplugv4 void-armv5tel*
    ```

6. Write the resulting file-system to disk.  Put this in the Pogoplug.

7. Boot with the following environment variables:

    ```
    setenv load_image_addr 0x800000
    setenv scan_disk 'echo running scan_disk ...; scan_done=0; setenv scan_usb "usb start";  setenv scan_ide "ide reset";  setenv scan_mmc "mmc rescan"; for dev in $devices; do if test $scan_done -eq 0; then echo Scan device $dev; run scan_$dev; for disknum in $disks; do if test $scan_done -eq 0; then echo device $dev $disknum:1; if load $dev $disknum:1 $load_image_addr /boot/zImage 1; then scan_done=1; echo Found bootable drive on $dev $disknum; setenv device $disknum:1; setenv bootdev $dev; fi; fi; done; fi; done'
    setenv dtb_file '/boot/dtbs/kirkwood-pogoplug-series-4.dtb'
    setenv load_image 'echo loading Image ...; load $bootdev $device $load_image_addr /boot/zImage'
    setenv bootcmd_exec 'run load_image; if run load_initrd; then if run load_dtb; then bootz $load_image_addr $load_initrd_addr $load_dtb_addr; else bootz $load_image_addr $load_initrd_addr; fi; else if run load_dtb; then bootz $load_image_addr - $load_dtb_addr; else bootz $load_image_addr; fi; fi'
    setenv load_dtb_addr 0x3000000
    ```

With those set, you can now type `boot`.  If everything is done right
you should see "Welcome to Void" within a few seconds and the normal
runit system startup shortly thereafter.  Congratulations, you've got
Void on a Pogoplug!

---

If you found this article cool or want to reach out, feel free to ping
me in IRC.  I idle in `#voidlinux` on Freenode as `maldridge`.

