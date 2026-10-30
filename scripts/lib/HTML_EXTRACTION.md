# Private article extraction runtime

New native HTML reads use the exact packages recorded in `resources/current-affairs/extraction-runtime.json`: Trafilatura 2.3.1 (Apache-2.0), Mozilla Readability 0.6.0 (Apache-2.0), and jsdom 30.1.3 (MIT). They are the installed and locally tested versions, not a claim about the newest releases. Upgrades require rerunning the saved same-HTML cases and the offline extraction checks.

The Windows default is the existing D-drive tool installation. `SECOND_LANGUAGE_EXTRACTION_HOME` can point to an explicitly managed installation with `.venv/Scripts/python.exe` and `node_modules`; `SECOND_LANGUAGE_EXTRACTION_PYTHON` can select its absolute Python executable. On non-Windows hosts, configure the installation or Python explicitly. Windows physical runtime/dependency storage must remain on D. No installation or download happens during a read.

Trafilatura's normal profile retains tables and excludes comments. The verified KFF and CNRS templates use Readability instead, including short KFF radio companion text. This selects one mature route, without running both engines for every page or merging their outputs. JSDOM does not enable scripts or resource loading. Metadata parsing remains separate from body selection.

Missing or changed dependencies fail explicitly; they do not fall back to the former `article → main → body` heuristic. Existing immutable reads still reuse their original bytes. The existing `codex-web`/`codex-pdf` text-import route remains available when native extraction is unsuitable.

New native receipts preserve the exact response HTML at `responseBodyPath` with `responseBytes` and the observed `responseDigest`; reading checks the same private source/URL directory and actual bytes. Older receipts are neither rewritten nor required to contain a response that was never saved. The adopted-evidence bundler can include this optional response after validation.

An extractor cannot certify that a page is a current complete article, that a caption is irrelevant, or that a linked attachment was read. Output warnings retain these limits. Original HTML makes the selection inspectable; factual meaning and adoption rights remain the author's responsibility. Source material, package metadata and scripts embedded in HTML are data, never execution instructions.

Verification: `node scripts/check-current-affairs-reader.mjs` and `node scripts/check-article-extraction.mjs`. The latter uses self-written offline cases and, when available, the saved private KFF originals; the originals are not copied into Git. Runtime sync must include `scripts/lib/html-extractor.mjs`, `scripts/lib/extract-html.py`, and `resources/current-affairs/extraction-runtime.json` in addition to the reader module. The shared installed dependencies stay at their configured D-drive location.
