# Adopted scroll Foley: production integration

2026-10-23 user instruction: “可以，实装吧。更新工程与协议”. The approved
audition is https://912b8b9f.the-second-language.pages.dev/labs/scroll-foley-study/
(code `9d17b41bca922c0034a615cd9a50a8c2eb3682f4`). This is an explicit adoption
of that paper v5 + unchanged A/B keeper performance, not inference from a signal
test and not approval of rejected historical sounds.

## Engineering

- `certification-reader/sound-base.js`: trusted unlock, buses, music, visibility,
  epoch protection and disposal; rejected v41 Foley seek/scheduling removed.
- `keeper-sound.js`: adopted ten A/B phases, native playback and contacts.
- `sound.js`: independent paper performance, pitch-preserving stretched tracks,
  continuous speed envelope and quiet moving tail. Source remains finite.
- `scroll-foley-study/sound.js` and `keeper-reference.js` import the production
  modules. Production imports no study code or source-only player UI.
- Production host now passes true `drag/automatic` mode, matching the audition.
- All 12 WAVs are byte-identical to the accepted sample. Sources/cuts/processing
  and licenses are recorded in `assets/audio-foley/v42/` and the v3 audio manifest.
  `scripts/promote-scroll-foley.mjs` reconstructs this promotion from an immutable
  Git pin; it does not regenerate audio, buy a service or request a model.
- Index/app/reader/audio module chain and shell cache use v42. Unchanged modules
  retain their existing versions. The visual reader bundle was not rebuilt.
- Artwork, frozen paper layers, model/material/mist, madeAt and content identity
  remain unchanged. Only project commemoration stays in the formal catalogue.

Adobe derivative audio is governed by Content Files terms, not MIT/CC0.
Original Adobe ZIP/WAVs stay in private ignored D storage. Keeper/music are CC0.
No new paid generation, subscription or continuing service cost.

## Verification and release

- `verify-project-beginning.mjs`: actual trusted product entry, unchanged decoded
  original pixels/content identity, document English/Chinese, default music and
  Foley, old mute ignored, open/close, hidden pause, exit and late decode.
- `verify-scroll-production-sound.mjs`: all twelve source hashes, actual paper
  gain output isolated from still-playing music, all moving-tail bins through
  rest in both directions, keeper cues, real drag/hold/reverse, exit during sound,
  production-only versioned module chain and a real fresh v42 service worker.
- Packaging checks staged bytes against real browser response hashes and includes
  current runtime/provenance closure. Deployment snapshots committed HEAD.

These are Chrome browser tests, not physical iPhone Safari tests. The finite
tracks cover normal automatic movement with headroom; arbitrarily long continuous
dragging or sustained severe frame stalls are not claimed to have infinite sound.
No chapter, score, attestation or certification record is written by verification.

Current main's paid-audio post-save failure protection was merged before the
integration. Pages release uses the certification-specific script and does not
redeploy the independent API worker. Actual published revision, URLs, byte
verification and task-end account-query result are recorded in `release.json`.
