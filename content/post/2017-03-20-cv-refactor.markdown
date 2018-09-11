---
layout: post
title: CV Network Refactor
date: 2017-03-20 00:00:00
categories: CV Void Linux Ansible OpenBSD
---

My last spring break and I'm spending it doing a massive network
refactor.  I can't say I didn't see this coming.

For a long time the CV gateways have been custom managed OpenBSD
machines.  With the rest of the network now under full Ansible control
with very nice setups for managing them, its time the OpenBSD network
layer was given the same treatment.

About a year ago I started working on this thing called
"SimpleGateway".  It was supposed to be a single Ansible role that
would manage my home network.  So it would be 'simple' right?  Yeah
its not simple anymore.

The SimpleGateway suite now has its own GitHub organization and
comprises several Ansible roles for providing services ranging DHCP
and PXE to CARP failover and high availability fabrics.  I have
enjoyed this project, though it was a grueling 5 day process to get
here of finding the limits in Ansible, pushing them out and then
reaching them again.  This is some of the most dense code I've ever
written and without the support of m_wynn and phy1729 this wouldn't
have happened.  SimpleGateway now runs the CV network, the CSG lab
segments, the LUG standing and portable fleets and a few other systems
around UTD, not to mention various people's home networks and labs.
