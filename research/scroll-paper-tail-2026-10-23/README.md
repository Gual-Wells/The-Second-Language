# Paper winding: retain the final moving sound

User correction, 2026-10-23: the final part may fade very weak, but must not be
entirely silent while paper still moves. This supersedes the earlier allowance
to let a short source expire before the normal animation ends.

## Cause

The 5.6-second smoothstep animation reaches global progress .4 at about 2.4244s;
the actual paper phase therefore lasts about 3.1756s. The 1.5671s opening take
expired at about paper progress .6665. A separate 15mm/s hard threshold also
silenced the final approximately 113ms of moving paper. Earlier verification
discarded frames with no active voice, concealing the missing tail.

## Repair

Use the same two Adobe recordings, offline stretched to approximately 4.5s with
the installed FFmpeg librubberband filter. Pitch scale stays 1. No noise padding,
looping, reverse, gain normalization or new recording purchase. Official tool
reference: https://ffmpeg.org/ffmpeg-filters.html#rubberband (also confirmed with
the installed binary's filter help). Exact filters, source/output hashes and
duration are in `web/labs/scroll-foley-study/paper-recordings.json`; reproducible
preparation is `scripts/build-scroll-paper-candidate.py`.

Runtime playback remains rate 1, one finite take per automatic direction.
The continuous speed response approaches zero only at rest; the final 28% of
directional movement adds a smooth downward taper. Endpoint/hold/exit stop
conditions remain. A/B keeper source bytes, levels and behavior are unchanged;
production paper, models, materials, mist and music are unchanged.

## Verification and boundaries

`scripts/verify-scroll-paper-candidate.mjs` now includes all moving frames,
including frames with no voice. It measures actual master output, with music
off, in the last .70–.85, .85–.95, .95–.985 and .985–1 (excluding exact rest) movement intervals in
both directions. Rest/hold/exit are checked separately. Captures and report are
stored here; they prove playback/timing, not human sound quality acceptance or
physical iPhone Safari compatibility.

Stretching may affect sound texture and remains subject to listening. Finite
tracks still cannot cover arbitrarily slow continuous manual dragging or severe
sustained frame stalls. This patch addresses the reported normal automatic
open/close tail, without claiming a new infinite variable-speed audio transport.

Independent audition only; production sound is not replaced. No new subscription,
paid model call or ongoing cost. Adobe derivative license remains unchanged.
