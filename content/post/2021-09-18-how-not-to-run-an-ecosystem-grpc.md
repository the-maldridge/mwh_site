---
title: "How Not to Run an Ecosystem - gRPC"
date: 2021-09-18T00:11:24-05:00
---

I was recently going through deprecation warnings and doing some
housekeeping in one of my personal projects,
[NetAuth](https://netauth.org).  In the process, I came across that I
was using a deprecated import for the protocol buffers support
libraries.  As the major version number hadn't changed, I assumed that
the update was safe and changed my import.  Given that the import was
changing from `github.com/google/protobuf` to
`golang.google.com/protobuf` I made the assumption that the import
path had been changed for aesthetic and branding reasons.  This seems
line with other changes Google has made.

The reality could not be further from the truth.  This was a breaking
major version bump that ignored the need to bump the SemVer major
version number.  There were several things that contributed to them,
and I'll address each of the major issues as I see them below.  The
way I found that things went wrong though was due to a compiler error
that my RPCServer type did not implement
`v2.mustEmbedUnimplementedNetAuth2Server`.  Since this is not a method
in my interface, and is not a method I had any understanding of since
it embeds my type name in some auto-generated code, I figured it was
time to start digging into the docs.

My brief search led me first to
[grpc/grpc-go#3794](https://github.com/grpc/grpc-go/issues/3794).  In
this thread we learn that in fact the gRPC API broke in a backwards
compatible way and the team chose not to bump the major version
number.  Digging further I found [this
post](https://go.dev/blog/protobuf-apiv2) on the Go blog talking about
changing the interface for protocol buffers in a backwards
incompatible way without bumping the major version number.  I think
I'm getting the point across that Google has a stunning lack of
understanding around version numbers as they pertain to libraries
despite the Go team having a very clear understanding of the concept
of backwards compat and not breaking forward consumers.  From my time
at Google I chalk this up to teams simply not talking to each other,
the fiefdoms of control are so strong and so many that its unlikely
the gRPC team bothered to consult with anyone about how to roll out a
change that did not align with language paradigms.  Figuring that at
this point I was in for the ride and trying to figure out what was the
"logic" behind this change, I followed the thread to another issue.

Just before following to another issue though, I came across [this
comment from GitHub user
@Garydevenay](https://github.com/grpc/grpc-go/issues/3794#issuecomment-709127687):

> Having a method inside the obvious (and documented) interface to
> implement as an instruction seems like an awful code smell.

I agree with this completely.  This is a change from mechanically
generated code that I'm expected to blindly import into my code, and
it was injected into an interface type during a supposedly compatible
update.

Anyway, we go to the next thread,
[grpc/grpc-go#3669](https://github.com/grpc/grpc-go/issues/3669).
This is quite a thread, maybe pop some popcorn before you read it.  As
an aside, this thread and @dfawley specifically remind me why I don't
miss working with most Google SWEs.  The team I worked with in search
was full of great devs and engineers that really understood why things
worked, but we often found ourselves dealing with people who didn't
understand why our services worked on very much legacy paradigms and
why we did things the way we did.  The analogy of [Chesterton's
Fence](https://wiki.lesswrong.com/wiki/Chesterton%27s_Fence) is
required reading here.  I worked in an environment with lots of really
talented and driven people, but the need to constantly refactor things
which often resulted in subtle breakage was pretty annoying.  The way
this thread reads reminds me all too much of Steve Yegge's [excellent
post](https://steve-yegge.medium.com/dear-google-cloud-your-deprecation-policy-is-killing-you-ee7525dc05dc)
on why Google Cloud is so developer-hostile.  The need to make the API
"cleaner" even in the face of many, many developers coming forward and
pointing out that the code is not idiomatic, does not leverage
language features, and is a poor developer experience is something I
can only describe as "googley".

The last point that comes to mind is that the gRPC team seems to be
trying to point at other implementations of the gRPC libraries as the
justification for doing things this way.  They point to C++, Java, and
C# implementations not doing this as a reason that Go shouldn't
either.  We'll ignore for a moment here that a primary strategy in
this argument seems to be throwing previous maintainers under the bus,
and instead focus on the attempt to apply paradigms from OOP languages
to non OOP languages.  Didn't catch that?  In C++, Java, and C# there
exist clear inheritance paradigms and override mechanisms that are
checked by the compiler.  In Go, which is not an OOP language, there
is no inheritance and no clear override mechanism.  Instead the
language focuses on composeability and interface types.  The gRPC team
appears to be trying to force a paradigm from one language onto
others, and its unclear which language team here is missing
experience.  If I had to take a guess, I'd say that the gRPC team
lacks the understanding that those of us living outside the Google
monorepo have with respect to not trying to refactor the internet in
an afternoon.  When you have a monorepo its relatively
straightforward, when you have a few million downstreams you have no
contact info for its quite a bit harder.

Overall this has left a sour taste in my mouth.  Sourer than usual to
have led to this being a blog post.  You might ask why I didn't just
stay on the previous API if its going to continue to be maintained,
and the short answer is that I have absolutely zero faith in any arm
of the Google empire in maintaining support for anything that isn't
the most recent released way of doing things, and even then I expect
it to be pre-deprecated on release.  As a direct result of this
experience, I can confidently say that NetAuth is the last gRPC
service I will work on, and I will likely begin the slow work of
migrating NetAuth off of gRPC.  The protocol is relatively stable, and
supporting a better solution such as standard JSON over HTTP would
make it easier to write clients that interface with NetAuth.  I'm also
evaluating other RPC technologies such as capnproto or JSON-RPC.  I
encourage you and your teams to also evaluate if working with a
technology that openly operates as a moving target is in your best
interest.  I know that in my limited time I have to work on code in
the nights and weekends, I chose not to waste it on chasing the whims
of upstreams that seem to have forgotten how the rest of the world
develops and refactors software.
