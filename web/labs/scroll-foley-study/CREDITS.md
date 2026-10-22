# Recorded paper winding candidate — revision 5

## Adopted paper performance

User adopted this revision and the unchanged A/B keeper on 2026-10-23. The
study now imports the canonical production engine in `../certification-reader/`.
Current production provenance is in that directory's `AUDIO_CREDITS.md` and
`assets/audio-foley/v42/`; the source-only Audio Elk auditions below remain
unadopted research. The scope is normal automatic opening/closing, not unlimited
continuous dragging or every historical sound.

New recordings from **Adobe Audition Download Sound Effects / Foley**,
[official source](https://www.adobe.com/products/audition/offers/AdobeAuditionDLCSFX.html).
The paper winding part of the interactive scroll now uses:

- `Foley Paper Unroll 01.wav` — 1.567104 seconds, opening.
- `Foley Paper Roll Up Fast 01.wav` — 3.508396 seconds, closing.

Both source files are actual 48kHz / 16-bit / stereo PCM WAV. Revision 5 uses
offline FFmpeg Rubber Band time stretching (pitch scale 1, smooth transients,
soft detector, channels together) to approximately 4.5 seconds per take. Metadata
is removed and 10ms de-click edge fades applied. No EQ, gain normalization,
compression, generated noise, reverse, looping, silent padding or runtime pitch
change. Details and hashes: `paper-recordings.json`, build
recipe: `scripts/build-scroll-paper-candidate.py`.

These are paper performances, not verified animal parchment. Movement drives
output gain continuously: the last moving part becomes faint, then stops at
rest. The roughly 3.176-second paper phase of the normal automatic animation
is covered, correcting revision 4's silent final 1.6 seconds. The finite takes
do not support arbitrarily long continuous manual dragging. Pitch-preserving
processing is not a guarantee of perceptual transparency; adoption refers to
the particular audition approved by the user.
The keeper uses its separate unchanged A/B reference.

Processing reference: [FFmpeg Rubber Band filter](https://ffmpeg.org/ffmpeg-filters.html#rubberband).

Adobe source and derivatives retain the Adobe Content File license, **not MIT
or CC0**. They are provided only as necessary accompanying tracks inside this
authored interactive scroll; no independent source library/download player is
offered. Adobe permits use, modification and distribution with authored works,
subject to its standalone-content restriction; see [current terms, §3.6](https://www.adobe.com/legal/terms.html).
The original ZIP and complete source files are kept outside the public
repository. No Adobe endorsement is claimed.

## Previous keeper recovery and source audition — revision 3

## Current animation reference

At the user's explicit request, the keeper sound track from the previous A/B
study (`466132c`, immutable preview
<https://944d6c23.the-second-language.pages.dev/labs/scroll-foley-study/>) is
restored as a comparison reference. The ten keeper WAVs, levels and contact
cues are unchanged. This is a relatively usable reference that still requires
improvement, not final approval of the recording or mix.

The recording is **Teebee_Deael — TBDL Foley - Unbuckling belt sounds**, [author
page](https://freesound.org/people/Teebee_Deael/sounds/626503/), CC0. Author public
HQ MP3 preview, not a lossless original. Cut/processing details remain in
`cues.json` and `sources.json`. The old A/B paper performances are withdrawn and are not
loaded or played. No artwork, geometry, animation, keeper finish or mist changed.

## New source-only auditions

Four author-supplied individual WAV files are copied byte-for-byte from
**Audio Elk | Foley Sessions Vol. 1**, © 2025 Audio Elk,
<https://audioelk.itch.io/foley-sessions-vol-1>, licensed on the current author
page under **[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)**.
Files: `MXL900_BELT_HANDLING_01.wav`, `_07.wav`, `_13.wav`, and
`MXL900_BELT_IMPACT_07.wav` in `sources/audioelk/`. These are the author's
`SPLICED/BELT` exports, not the sampler montage and not the full-session RAW.
No processing by this project. Actual files are PCM **16-bit / 48 kHz / mono**,
despite the product's advertised 24-bit format.

Exact members, byte hashes, durations and source links are in
`source-auditions.json`; current work-specific license declaration and the
inconsistent older generic commercial PDF are documented in
`sources/audioelk/licensing-evidence.json`. This use relies on the author's
explicit CC grant for this named work, not a claim that the old PDF is CC.
Attribution and CC terms accompany the audio; no endorsement is implied. No
ownership or license change is claimed for the site's separate software.

These recordings are **not yet integrated into animation or approved as a
material match**. The source audition pauses the animated reference and music
to prevent mixing the two. No suitable new paper-roll recording was found in
this library; paper handling/crumpling/tearing is not substituted for winding.

Music remains **A New Town — Cynic Project / cynicmusic**, CC0, linked below.

## Rejected quiet paper winding study — revision 2 (archived)

The rejected revision 2 used only a new derivative of **[Spell Scroll / Unrolling
Parchment](https://lpc.opengameart.org/content/spell-scroll)** by **spookymodem**,
[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). The repository retains
the original 44.1 kHz, stereo, 16-bit PCM WAV in
`../certification-reader/assets/audio-sources/material-recordings/unrolling-parchment.wav`.
The author describes a spell scroll unrolling, without specifying the actual
sheet material. No claim of a measured animal-parchment recording is made.

Changes for this audition: 0.50–2.76 s contiguous cut, mono mix, DC and broad
frequency cleanup, downward-only burst attenuation, gentle edge fades. No
amplification of quiet parts, reversal, looping, pitch/time change, synthetic
noise or reuse of the rejected v40 tanh loop. Exact values and hashes are in
`soft-roll.json`; the reproducible edit is `scripts/build-scroll-soft-roll.py`.

Only paper winding drives the output, at low level; keeper, hands, desk, metal
and camera movements have no sound track. Very slow motion has no minimum
sound floor. Source exhaustion leaves the remainder quiet rather than repeating
short fragments. This is a candidate awaiting listening; filtering is not source
separation and does not prove that the recording itself contains no handling.

## Retained rejected first study

The following paper recordings remain archived for the first study, **rejected
by the user as hard, heavy, uneven and distracting**. Its keeper is separately
restored as the current comparison reference. The frozen first-study preview is
<https://944d6c23.the-second-language.pages.dev/labs/scroll-foley-study/>. A and B
share the new action cue edit and belt sounds; only their paper performances
differ. v41 is available as the user-rejected reference, not a quality standard.

## Recordings

| Author / sound | License | Use |
| --- | --- | --- |
| [Lewooz — Unrolling a paper map](https://freesound.org/people/Lewooz/sounds/580586/) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | A: two different forward performances of a thick paper roll |
| [Teebee_Deael — TBDL Foley - Unbuckling belt sounds](https://freesound.org/people/Teebee_Deael/sounds/626503/) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Shared belt movement and isolated buckle contact candidates |
| [duckduckpony — Paper_Parchment_Rustling](https://freesound.org/people/duckduckpony/sounds/204046/) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | B: two different forward paper/rustling performances |

The author HQ MP3 previews were downloaded on 2026-10-22. **These are not the
original lossless WAV recordings.** The belt original was itself uploaded as
141 kbps MP3. Decoding to 48 kHz PCM cannot restore lost information.

Changes: mono decode; fixed contiguous cuts; DC removal; broad high/low-pass
cleanup; static gain; short edge fades. The isolated metal transients are
trimmed to an 8 ms impact anchor. No reversal, looping, generated noise or
runtime pitch/speed modulation. Exact source bytes, authors and hashes are in
`sources.json`; every derivative, range, gain, EQ, impact anchor and hash is in
`cues.json`. Preparation scripts are retained in the repository.

The source descriptions document unrolling/rustling, not a verified reenactment
of rerolling historical parchment. Different forward takes are used for closing
as a trial. Their suitability, and the semantic assignment of individual belt
cuts, remain subject to listening with the actual rendered movement.

Music is the existing [Cynic Project / cynicmusic — A New Town](https://opengameart.org/content/a-new-town-rpg-theme), CC0.
The reference sound director and its retained assets have separate credits in
`../certification-reader/AUDIO_CREDITS.md`.

## Software and method

The study reuses the project Web Audio lifetime, music, WebGL scroll, keeper and
mist. The Foley director uses the established animation-audio-track approach:
named finite cues tied to mechanism phases, with a separate contact transient.
Official examples studied: [Godot audio playback tracks](https://docs.godotengine.org/en/stable/tutorials/animation/animation_track_types.html#audio-playback-track),
[Howler named sound sprites and voice lifetime](https://github.com/goldfire/howler.js),
[IRCAM audio scheduling](https://ircam-ismm.github.io/webaudio-tutorials/scheduling/timing-and-scheduling.html).
No code from those libraries is copied or newly bundled; adding an engine does
not correct a mismatched recording. Existing Three.js/Pavel/noise notices remain
in the unmodified reader bundle and their original source files.
