---
title: "Convincing debian-installer I don't want swap"
date: 2023-01-13T17:56:00-05:00
---

Debian has an autoinstaller.  With some difficulty, you can even get
it to automatically install Debian.  What the autoinstaller actually
does under the hood is interesting in its own right since Debian
doesn't *technically* install from Debian, but instead from a
different operating system that uses a distinct package collection and
its own distinct package manager.

This distinct system, which as far as I am aware doesn't really have a
name beyond "debian-installer" is a very compact system that is not
designed to be particularly user editable, after all its sole purpose
is to install Debian, which is designed to be extremely user
modifiable.  To accomplish this installation in an automatic mode, the
installer makes use of `debconf` which is an extremely extensible
framework for prompting for user input normally used during `dpkg`
transactions.  To perform the automatic installation `debconf` just
loads all the answers to the questions it would normally ask from a
file rather than prompting them to the screen.  While there is
virtually no documentation for this beyond the source code itself, it
takes surprisingly few toggles to get an automatic installation.  The
bulk of the config goes into answering the questions in `partman` the
partition manager.

All of this is relatively straightforward unless you want to build a
system without swap.  Now why you would want to do this is beyond the
scope of this article, but many reasons exist where you would not want
to provision a server with a swap partition.  To disable this there is
a token provided for this purpose:

```
d-i partman-basicfilesystems/no_swap boolean true
```

This should acknowledge the dialog that warns you that you have not
provisioned a swap partition.  It does not.  Regardless the value of
this selection the installer is convinced that I need to go back and
add a swap partition.  By my reading of the actual check code, there
is no possible way this config could ever work:

```sh
if ! $swap; then 
  db_input critical partman-basicfilesystems/no_swap || true 
  db_go || true 
  db_get partman-basicfilesystems/no_swap 
  if [ "$RET" = true ]; then 
    exit 1 
  fi 
fi 
```

This is at the very end of the
[`check_swap`](https://salsa.debian.org/installer-team/partman-basicfilesystems/-/blob/master/check.d/check_swap)
file.  And there is no way I can see to drive that Return value false
with the toggle.  I asked in the `#debian-boot` IRC channel and didn't
get any kind of answer over the course of a week, so I kind of assume
this isn't a well tested path.

Fortunately the check is written in shell, so we can use a shell
shaped hammer to solve this shell shaped problem:

```
# UGLY HACK ALERT!!!  This works around the installer not correctly
# handling the value that should normally suppress this check by just
# claiming that we have swap when we don't.
d-i partman/early_command string sed -i "s/swap=false/swap=:/" /lib/partman/check.d/10check_swap
```

Is this the right solution?  No the right solution is to figure out
why `db_get partman-basicfilesystems/no_swap` doesn't work, but that
would require dealing with Debian's byzantine patch process as well as
waiting on a new release of the installer.  Since the project that led
me down this rabbit hole in the first place is likely about to abandon
the entire `partman` component due to its differing opinions on how to
set up LUKS containers, I'm going to leave this as an ugly hack that I
hope to get rid of by getting rid of the entire component that
consumes it.

Since I couldn't find anything in my googling that explained how to do
this I've written up my solution.  If you have a better answer for how
to do this, or are from one of the Debian team's responsible for how
this is supposed to work and can explain why this doesn't work today
please reach out.
