---
title: "Reading Durations with IOS TCL IVRs"
date: 2025-05-09T01:44:25-05:00
---

I have recently been doing a lot of work with Cisco IOS Interactive
Voice applications written in TCL.  This is a dated technology at this
point, but still a very stable one. In my application, I wanted to be
able to have a duration spoken aloud.  Getting the duration itself is
not hard, IOS provides a robust timer system to meter calls and set
deadlines for actions.  Speaking the duration on the other hand is
much harder because the Cisco ISR platform lacks the hardware for
real-time speech synthesis.

Fortunately, through the magic of barely documented format strings,
IOS is able to convert durations in seconds into a list of files that
should be played sequentially to read out a full duration.
Specifically the `%t` formatter converts a number of seconds, for
example 296, into a series of files to be played using the also barely
documented language localization system.  In this example, 296 seconds
becomes "four minutes and fifty-six seconds".  Remember though that
this is happening on hardware that lacks speech synthesis, so each of
those words needs to be a discrete audio file that can be played out.
What this actually results in is the following files being played in
sequence:

  * _four.au
  * _minutes.au
  * _and.au
  * _fifty.au
  * _six.au
  * _seconds.au

The underscores are the filenames after the language code.  For the
general case, this can be defaulted inside of the application service
block with the following instructions:

```
paramspace english index 1
paramspace english location flash:/media/en/
```

Be sure to change the path to wherever you actually store your audio
assets.

Now you just need to know what files IOS wants, which is of course not
documented.  Hopefully you're detecting a theme here.  Fortunately,
IOS has built-in debug capabilities, unfortunately its like drinking
from a fire hose.  Ensure you only do these steps from a single
terminal, and on a lightly loaded system, otherwise you run a very
real risk of crashing IOS and the underlying router.

  1. Enable voice media state debugging with `debug voice application
     media state`.
  2. If connected over SSH, enable terminal monitoring with `terminal
     monitor`.
  3. Place a call into your IVR and trigger an action that would load
     the files you're unsure about.
  4. Locate the line containing `dp_mcTranslate`.  It will contain the
     translation result and the files that IOS is trying to load.  For
     example:

```
*May  9 07:30:22.851: //-1//DPM :DP11:/dp_mcTranslate:  Translation result=0 _nine.au _minutes.au _and.au _thirty.au _six.au _seconds.au
```

You can now review which files are missing and load them to the
system.  For durations under an hour, the following list is the
minimum required:

```
en_and.au
en_eight.au
en_eighteen.au
en_eleven.au
en_fifteen.au
en_fifty.au
en_five.au
en_forty.au
en_four.au
en_fourteen.au
en_minute.au
en_minutes.au
en_nine.au
en_nineteen.au
en_one.au
en_second.au
en_seconds.au
en_seven.au
en_seventeen.au
en_six.au
en_sixteen.au
en_ten.au
en_thirteen.au
en_thirty.au
en_three.au
en_twelve.au
en_twenty.au
en_two.au
en_zero.au
```

To extend this up to the IOS maximum duration you should only need to
add `en_hour.au` and `en_hours.au`, though I have not validated this.
