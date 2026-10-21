# Recorded scroll materials — source credits and changes

Retrieved 2026-10-22, without signing in or purchasing. These are existing source
recordings, not generated audio. The source files in this directory preserve the
downloaded bytes; the runtime uses the smaller derivatives in `../../audio-foley/`.
`derivatives.json` records exact source and derivative hashes and numerical edits.

## Spell Scroll / Unrolling Parchment — spookymodem

**Attribution:** “Spell Scroll” by **spookymodem**, published on OpenGameArt,
licensed under **Creative Commons Attribution 3.0 Unported (CC BY 3.0)**.

- Author's publication: <https://lpc.opengameart.org/content/spell-scroll>
- Original file: <https://lpc.opengameart.org/sites/default/files/Unrolling%20Parchment.wav>
- License: <https://creativecommons.org/licenses/by/3.0/>
- Legal code: <https://creativecommons.org/licenses/by/3.0/legalcode>
- Archived source: `unrolling-parchment.wav`, 555,232 bytes.
- Source SHA-256: `0ecdba822baa623f478a0131c20eaf175e9494f8fb534d666427685813c9e54f`.
- Actual format: 44,100 Hz, stereo, 16-bit PCM WAV; 3.147347 seconds.

**Changes made for The Second Language:** the runtime derivative
`../../audio-foley/parchment-roll-loop.wav` uses the source interval 0.54–2.75 s,
downmixed to mono, with DC removal, a 120 ms same-recording equal-power seam,
soft transient compression at the 99.7th amplitude percentile, gain adjustment capped at 0.72 peak, and export as 44,100 Hz 16-bit PCM WAV.
Its resulting duration is 2.09 s. Runtime gain, low-pass filtering and restrained
playback-rate changes respond to the actual paper winding motion. The runtime
audio bus also applies gentle dynamics control; this is not a claim that the
preserved original recording was changed. The derivative has the explicitly recorded offline soft transient compression.

This source and its derivative remain available under CC BY 3.0. Keep the author,
title, source link, license link and this change notice when redistributing the
audio. No author endorsement is implied. The recording's licensed status does
not establish the realism of its timbre for this particular scroll.

## Leather Stretched — altfuture

**Credit:** “Leather Stretched” by **altfuture**, published on Freesound,
under **Creative Commons CC0 1.0 Universal**.

- Author's publication: <https://freesound.org/people/altfuture/sounds/174638/>
- Public HQ preview found on that page:
  <https://cdn.freesound.org/previews/174/174638_3015949-hq.mp3>
- License: <https://creativecommons.org/publicdomain/zero/1.0/>
- Legal code: <https://creativecommons.org/publicdomain/zero/1.0/legalcode>
- Archived source: `altfuture-leather-stretched-hq-preview.mp3`, 612,480 bytes.
- Source SHA-256: `aae6b357aaf6dc2f4fcc70724e26f0d59c082ff4b84f4d2ca4c7edc965a9616f`.
- Actual downloaded format: 48,000 Hz stereo MP3; decoded effective duration
  approximately 24.998 seconds. The MP3 container includes encoding delay.

**This is the publicly accessible compressed HQ preview, not the original
96 kHz/24-bit lossless WAV.** The author page requires login for that full WAV;
no login-protected download was obtained or bypassed. The page's CC0 declaration
applies to the sound; the file is accurately retained and labelled as a preview.

**Changes made for The Second Language:** the MP3 was decoded, the 14.7–16.1 s
interval selected, downmixed to mono, given DC removal and a 120 ms same-recording
equal-power seam, soft transient compression at the 99.7th amplitude percentile, gain adjusted with a 0.72 peak cap, and exported as
`../../audio-foley/leather-flex-loop.wav` (44,100 Hz, mono, 16-bit PCM; 1.28 s).
Runtime level/filter/rate respond to the actual keeper's bend, hole-release,
tail-withdrawal and sliding coordinates. The intermediate decoded WAV hash in
`derivatives.json` describes an intermediate, not a different original creator.

## Evidence, limits and remaining assets

Author-page snapshots and 100 ms technical signal measurements are in
`research/scroll-reader-correction-2026-10-22/audio-sources/` at the repository
root. Source hashes above refer to unchanged downloaded bytes.

Neither these credits nor successful decoding constitutes a human listening
review. These material beds are edited recorded sources; the current tooling
has **not** passed their final timbre, balance, loop-seam or device-speaker
listening acceptance. No seamless-loop guarantee is made.

The music and the quiet Kenney `metalClick` contact use their separately credited
existing sources in the parent `AUDIO_CREDITS.md`. The material correction does
not add book-opening, page-flip, book-placement, cloth or latch sound layers.
There is no additional purchase, subscription or per-chapter recording cost.
