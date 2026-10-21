# Certification reading — recorded music and action foley

Reused 2026-10-21 from the project's existing verified CC0 audio bytes. No new
purchase, subscription, generation, online player or external music service.
The museum score and take/return/arrival cues are absent from this reader.

## Music

**A New Town (RPG Theme)** — The Cynic Project / pixelsphere.org / cynicmusic.com
(published as `cynicmusic`).

- Author's publication: <https://opengameart.org/content/a-new-town-rpg-theme>
- Original MP3: <https://opengameart.org/sites/default/files/025_A_New_Town.mp3>
- License: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- Runtime file: `assets/audio-music/a-new-town.mp3`
- Unchanged source bytes: 766,291 bytes. The author asks for the above credit.

The author describes a minimal, regal solo-harp theme, made with Garritan Harps.
It is an existing complete recording, not a generated theme, historical recording
or a set of interactive music stems. The decoded duration is approximately 62.26
seconds. **It is not advertised here as a seamless loop:** the entire recording
finishes naturally, keeps its tail, then leaves 1.8 seconds of silence before a new
play. Opening, closing or dragging the parchment never restarts the music.

Source licensing and successful decoding have been checked. Human listening,
speaker/headphone balance and final artistic approval remain separate acceptance
work; this record does not claim that a listening review has passed.

## Action recordings

**RPG Audio** — Kenney Vleugels (Kenney.nl), CC0 1.0.

- Official publication: <https://kenney.nl/assets/rpg-audio>
- Original ZIP: <https://kenney.nl/media/pages/assets/rpg-audio/8e99002d76-1677590336/kenney_rpg-audio.zip>
- Exact original ZIP: `assets/audio-sources/kenney-rpg-audio.zip`
- Included original license: `assets/audio-sources/KENNEY_LICENSE.txt`

These existing 44.1 kHz, 16-bit PCM WAV derivatives were decoded from the original
OGG clips in the prior project experiment. They were copied byte-for-byte, not
resynthesized or regenerated for the reader. The original OGGs remain inside the
source ZIP. No native oscillator or generated noise replaces a source recording.

| Files in `assets/audio-foley/` | Action role |
| --- | --- |
| `beltHandle1.wav`, `beltHandle2.wav` | Leather unloading and final fastening |
| `handleSmallLeather.wav`, `handleSmallLeather2.wav`, `clothBelt.wav` | Tail withdrawal and keeper clearing |
| `metalClick.wav`, `metalLatch.wav` | Pin leaving its hole / pin seating |
| `bookOpen.wav`, `bookClose.wav` | Initial unroll and final close contact |
| `bookFlip1.wav`, `bookFlip2.wav`, `bookFlip3.wav` | Sparse rustle variants tied to travel and velocity |
| `bookPlace1.wav` | Gentle paper settling |

Book-page recordings are source material, not a claim that modern paper exactly
matches aged parchment. The reversible runtime trim reduces loud metal/book
impacts and lifts faint leather. The final timbre and volume require listening.

## Playback contract

- Music and foley start disabled; initial relative volumes are `.35` and `.65`.
  Preferences are set by the host and remain independent of host lifecycle state.
- `setActive(true)` means the reading host is present. `setActive(false)` stops
  sources, saves the current music offset or remaining end-rest, and prevents
  foreground/visibility callbacks from reviving audio outside the reader.
- `pause()` is a temporary lifecycle pause; `resume()` can only resume an active
  host and never enables a user-disabled music or foley preference. A user pause
  is represented by `setMusicEnabled(false)`, which keeps the music offset.
- `unlock()` must be called directly from a trusted tap. It makes/resumes one lazy
  AudioContext before awaiting assets. The visual viewer must not await audio to
  open or respond. If both preferences are off, no context is created.
- `prepare()` requests only enabled resources for an active host. It does not
  create a context. One director can serve multiple chapter viewers; chapter
  changes need not stop or recreate its music source.
- The source plays once per complete recording. The 1.8-second natural end-rest
  is paused and resumed if the app is hidden or music is disabled midway through
  that rest. No replay timer remains armed in an inactive/paused host.
- Independent music and foley gain changes are smoothed over 40 milliseconds.
  Relative volume is not a guarantee of acoustic loudness on an iPhone speaker.
- Keeper contact points use the existing shared mechanism's global progress
  (first 0–.40 unfastens the keeper). Paper rustle also follows real distance and
  speed. Reverse gestures use appropriate forward recordings, not reversed audio.
- Disabling, leaving, suspending or disposing invalidates asynchronous action
  requests, so a delayed decode never sounds after the original physical action.
- Failed loading/decoding is exposed in `snapshot().failures`; it must not disable
  the parchment, its gesture controls, static artwork or transcript.
- The main app must give learning speech/examination/microphone capture priority.
  This module does not take over the app's learning audio or global media session.

## Recovery and integrity

`assets/audio-sources/manifest.json` records actual bytes, complete SHA-256,
authors, original URLs, CC0 license and previous repository location for every
copied file. The runtime loads one MP3 and thirteen short WAVs, approximately
1.56 MiB. The original ZIP/license and provenance are retained separately for
recovery; the complete copied audio set is approximately 2.5 MiB.

One decoded harp recording consumes approximately 21 MiB of PCM at 44.1 kHz
stereo. No per-chapter music copies or additional permanent music subscription are
needed. Closing the whole reader must deactivate it; final host disposal releases
the context, sources, decoded buffers, retained bytes and lifecycle listeners.

Browser method references:
[autoplay policy](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay),
[interrupted AudioContext state on iOS](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state).
Chromium functional checks are not evidence of physical iPhone Safari/PWA behavior
or of artistic listening approval.
