# Reader music and recorded performances

Adopted revision **v42**, 2026-10-23. The user approved the final moving-tail
audition at <https://912b8b9f.the-second-language.pages.dev/labs/scroll-foley-study/>
(code `9d17b41bca922c0034a615cd9a50a8c2eb3682f4`) for integration into the real
reader. Adoption covers that normal automatic opening/closing performance;
deployment and physical iPhone Safari verification are separate evidence.
This file does not assert that production was published merely because it was
updated. The release record identifies the actual deployed revision.

## Music

**A New Town (RPG Theme)** by **The Cynic Project / cynicmusic**, CC0:
<https://opengameart.org/content/a-new-town-rpg-theme>.
assets/audio-music/a-new-town.mp3 is unchanged, with natural end and rest.

## Adopted paper winding

**Adobe Audition Download Sound Effects / Foley**:
<https://www.adobe.com/products/audition/offers/AdobeAuditionDLCSFX.html>.

| Source recording | Original duration | Reader track | Actual duration |
| --- | --- | --- | --- |
| Foley Paper Unroll 01.wav | 1.567104s | paper-unroll-v5.wav | 4.366854s |
| Foley Paper Roll Up Fast 01.wav | 3.508396s | paper-rollup-v5.wav | 4.498250s |

Both originals are 48kHz / 16-bit / stereo PCM WAV, identified as paper
performances, **not verified animal parchment**. Offline FFmpeg Rubber Band
time stretching preserves pitch (`pitch=1`, smooth transients, soft detector,
channels together); metadata is stripped and 10ms de-click edge fades applied.
No EQ, gain normalization, compression, generated noise, reverse, looping,
silent padding or runtime pitch change. Runtime playback rate is 1. Exact
source/output hashes and filters are in
[paper recordings](assets/audio-foley/v42/paper-recordings.json); the build
recipe is `scripts/build-scroll-paper-candidate.py`.

Actual paper movement drives a continuous low-level envelope. The last moving
portion fades faintly rather than being cut by a speed threshold or premature
source exhaustion; the current automatic paper phase is approximately 3.176s.
Hold, rest and exit stop playback. Finite recordings do not cover arbitrarily
long continuous manual dragging. Pitch preservation does not itself establish
processing transparency; this exact audition has a user adoption decision,
not a universal approval for future stretching or material changes.

**Adobe source and derivatives retain Adobe Content Files terms, not MIT or
CC0.** They accompany the authored interactive scroll as necessary runtime
tracks, not an independent sound library or source-download player. Adobe
permits use, modification and distribution with authored works subject to the
standalone-content restriction; see [current terms, §3.6](https://www.adobe.com/legal/terms.html).
The original ZIP and complete original WAVs are retained outside the public
repository in the ignored D-drive source cache. No Adobe endorsement is claimed.

## Adopted keeper performance

**TBDL Foley - Unbuckling belt sounds**, **Teebee_Deael**, **CC0**:
<https://freesound.org/people/Teebee_Deael/sounds/626503/>.

The reader uses the same ten keeper cuts, levels and contact behavior as the
user-requested A/B recovery reference (`466132c`), now adopted together with the
final paper audition. Source acquisition was the author's public HQ MP3
preview, **not a lossless original**; decoding to WAV restores no discarded
information. Cuts remove DC, apply broad high/low pass and static gains, with
short edge fades; playback remains forward at native pitch/speed. The cue names
are `bendOpen/Close`, `holeOpen/Close`, `tailOpen/Close`, `slideOpen/Close`,
`park` and `seat`. Exact cut and source metadata are in
[keeper cues](assets/audio-foley/v42/keeper-cues.json) and
[keeper sources](assets/audio-foley/v42/keeper-sources.json). Keeper and paper
retain independent motion and stop states.

The twelve adopted runtime WAVs live in `assets/audio-foley/v42/`. The shared
`sound.js` engine is used by production and the study; the study's unrelated
source-only Audio Elk players are not product audio. The
[runtime manifest](assets/audio-sources/manifest.json), schema
`second-language.reader-material-audio.v3`, revision
`v42-approved-recorded-foley`, identifies those twelve WAVs and the unchanged
music file; historical sources remain credited without becoming active inputs.

## Superseded v41 attribution

The following rejected production mix is retained as historical evidence and
does not define the adopted v42 sound:

- **Parchment - Unroll**, **Vrymaa**, CC0:
  <https://freesound.org/people/Vrymaa/sounds/753282/>. Dried bamboo leaf
  performed as stiff parchment.
- **Leather Belt Stretching 1_8**, **Joao_Janz**, CC0:
  <https://freesound.org/people/Joao_Janz/sounds/493154/>.
- **Belt buckle**, **Joseph SARDIN**, CC0:
  <https://bigsoundbank.com/belt-buckle-s0575.html>.

Historical attribution and processing remain in
[v41 source credits](assets/audio-sources/performance-recordings/CREDITS.md),
[v41 derivatives](assets/audio-sources/performance-recordings/derivatives.json).

## Retained historical attribution

**Spell Scroll / Unrolling Parchment**, **spookymodem**, **CC BY 3.0**:
<https://lpc.opengameart.org/content/spell-scroll>,
<https://creativecommons.org/licenses/by/3.0/>.
The original and v40 derivative remain archived; full change notice and old
altfuture/Kenney attribution remain in
[historical credits](assets/audio-sources/material-recordings/CREDITS.md).
Those sounds are not used by the v42 reader; no endorsement is implied.

Music and foley default on after a trusted tap; no product sound settings or
stored mute preference override that default. Playback pauses in background
and stops on exit, including late asynchronous results. Paper/artwork, keeper
geometry, aging, mist, music original and fixed commemorative identity are
unchanged by this audio adoption. No new subscription or recurring cost.
