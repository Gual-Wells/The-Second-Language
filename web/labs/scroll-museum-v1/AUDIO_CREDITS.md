# Scroll Museum v1 — source recordings and sound direction

Retrieved 2026-10-21. This is a reversible, unissued exhibition specimen. No paid
subscription, generation API, external streaming player, or perpetual hosted audio
dependency was added. Music and foley are off until the visitor enables them.

## Music recordings

| Runtime file | Work and credited author | Original page | License |
| --- | --- | --- | --- |
| `assets/audio-music/ancient-mysteries.mp3` | **Ancient Mysteries** — Sperry Lion, LLC 2024 / sperrylion | [Author's publication](https://opengameart.org/content/ancient-mysteries) | CC0 1.0 |
| `assets/audio-music/a-new-town.mp3` | **A New Town (RPG Theme)** — The Cynic Project / pixelsphere.org / cynicmusic.com | [Author's publication](https://opengameart.org/content/a-new-town-rpg-theme) | CC0 1.0 |

The first author explicitly supplies a looping first file and an alternative tail
version; the sample uses the first MP3. The second author describes a minimal,
regal harp solo, created using Garritan Harps, and asks for the above credit despite
the CC0 dedication. Both downloaded MP3s are unchanged; runtime gain and scene
crossfades are reversible playback decisions. The two recordings are independent
compositions, not matching stems. No claim of historical medieval authenticity is
made. The frame/foley state changes do not synthesize or generate music.

The initial choice uses Ancient Mysteries for the room and A New Town for intimate
inspection. Source descriptions and decoded level measurements informed this
choice; **human/artistic listening approval has not been completed**. Their mood,
repetition, looping seam and fit with the final visual scene remain listening
acceptance items. Metadata, working playback and CC0 are not proof of artistic fit.

## Recorded action foley

**RPG Audio** — Kenney Vleugels (Kenney.nl).

- Official source: <https://kenney.nl/assets/rpg-audio>
- Official download: <https://kenney.nl/media/pages/assets/rpg-audio/8e99002d76-1677590336/kenney_rpg-audio.zip>
- License: [Creative Commons Zero 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- Unmodified source ZIP: `assets/audio-sources/kenney-rpg-audio.zip`
- Included original license: `assets/audio-sources/KENNEY_LICENSE.txt`

Selected original OGG files and portable 16-bit PCM WAV derivatives live in
`assets/audio-foley/`. The WAVs are decoded copies at 44.1 kHz, not newly invented
sounds, and are used for broader Safari compatibility. No oscillator, synthetic
bell, generated noise or continuously blowing fog sound was substituted.

| Source names | Initial use |
| --- | --- |
| `beltHandle1`, `beltHandle2` | Tension release and final fastening |
| `handleSmallLeather`, `handleSmallLeather2` | Retrieval and leather tail moving through the frame |
| `clothBelt` | Strap moving clear of or around the rolled parchment |
| `metalClick`, `metalLatch` | Pin leaving the hole / seating on return |
| `bookOpen`, `bookClose` | Brief roll-start and roll-completion contacts |
| `bookFlip1`, `bookFlip2`, `bookFlip3` | Sparse movement rustle variants, driven by distance and velocity |
| `bookPlace1`, `bookPlace2` | Gentle settling / placement |
| `dropLeather` | Decoded spare recorded leather contact; no default trigger |

Book-page recordings are a source material for the sample, **not a claim that a
modern book sounds exactly like aged parchment**. The final material timbre and
mix require listening; sources can be replaced without replacing the mechanics.
Technical trim only reduces loud book/metal impacts and lifts faint leather clips.
Original source bytes and decoded peak/RMS/duration measurements remain available.

## Timing and visitor behavior

- `SoundDirector` exposes `prepare`, `unlock`, scene, motion, three cue names,
  independent music/foley switches, pause/resume, disposal and a diagnostic snapshot.
- Merely preparing the sample fetches files but creates no AudioContext. With both
  switches off, `unlock()` also creates no context. A user gesture resumes a single
  lazy shared context before any network await. Only small foley is warmed in that
  call; background music downloading does not hold up taking a roll.
- The common global roll progress matches the accepted physical keeper: the first
  0–0.40 contains unfastening; paper motion follows. Thresholds emit a short recorded
  contact only as progress crosses it. The paper rustle also responds to accumulated
  travel and speed. Instant seeks do not play every skipped contact.
- A reversed motion uses newly appropriate recorded contacts, never a reversed MP3
  or an inverted recording. Shared cooldowns suppress threshold chatter. No sounds
  are queued to play after a slow decode, return to the room or tab restoration.
- Room and inspection music crossfade with modest overlap, and return to a remembered
  offset. These independent recordings are never layered indefinitely.
- Hidden/pagehide states stop sound. Returning may resume only already-enabled,
  previously unlocked sound, respecting system state. A browser denial does not
  retry by timer or prevent viewing. No lock-screen music or silent-unlock hack.
- This standalone lab does **not** change production learning or microphone audio
  routing. Production integration must give recording/examination and learning
  speech priority over museum music and foley.

## Integrity, recovery and verification

`assets/audio-sources/manifest.json` contains original URLs, authors, licenses,
byte lengths and full SHA-256 hashes for the imported MP3s, selected OGGs, derived
WAVs, official ZIP, license and conversion record. Conversion measurements are in
`assets/audio-sources/conversion.json`.

The complete audio directory contents total approximately **5.1 MiB**, including
the source ZIP and duplicate original clips; the browser loads only the two MP3s
and fifteen short WAVs. CC0 permits keeping original and derived files in the
project/asset archive; no third-party player or account is required for playback.

Focused Headless Chromium checks covered decoding all loaded samples, a muted
start with zero contexts, one context after explicit enable, scene transition,
progress-driven contact events, pause blocking new contacts and silencing existing
sources, resumption and disposal. These checks do **not** stand in for listening,
real iPhone Safari/PWA interruption tests or final artistic acceptance.

Technical method references: [Web Audio autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay),
[interrupted contexts in iOS Safari](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state),
[interactive music organization](https://www.audiokinetic.com/en/public-library/2024.1.8_8893/?id=creating_interactive_music&source=Help).
The sample uses native Web Audio directly; no Wwise runtime is included.
