# Scroll Foley listening study

This is an unapproved audition, separate from the production reader. A and B
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
