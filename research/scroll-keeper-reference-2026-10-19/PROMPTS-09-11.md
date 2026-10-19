# Follow-up image prompts 09–11

Built-in imagegen; transparent_background=false. Model/quality/billing parameters were not exposed. These are art/structure candidates, not approved production references. Prior prompts are in PROMPTS.md.

## 9. keeperMechanismV2Prompt

Workspace: closed-mechanism-v2-rejected.png
Default source: D:/CodexData/generated_images/01a12e3a-ffd2-7241-bb08-8a2452e79edb/exec-5c0118a7-095d-4482-8b89-74e5e1c35a09.png

```text
Use case: product-mockup.
Create a single detailed photorealistic CLOSED antique leather scroll cuff, isolated on white. Input 1 is a mechanical side-section that controls threading and contact; Input 2 is APPEARANCE ONLY (open leather cuff, worn brown leather and antique bronze), not a closed geometry to reproduce. Rebuild the closed mechanism carefully.
The cuff uses ONE leather strip with a rounded rectangular bronze buckle fixed at the left end by a folded leather anchor and two bronze rivets, plus ONE complete hinged tang.
The incoming perforated strap comes from the RIGHT, rides on the FRONT/outside of the RIGHT frame bar, passes backward through the frame opening, and continues BEHIND the LEFT frame bar and behind the riveted anchor. The right bar's middle is OCCLUDED, not embedded in leather.
THREE REQUIRED SPATIAL FEATURES:
1. The right bronze receiver bar is an intact smooth solid behind the leather. Where its upper and lower exposed portions pass under the leather, show rounded continuous metal disappearing BEHIND a separate leather edge, with a real contact shadow and a slim visible depth gap. No metal tip ending flush into a hole cut in the side of leather. No leather fused onto metal.
2. The entire free leather tail EXISTS after passing under the LEFT bar. Show a short pointed free end on the INNER side of the cuff to the left of the buckle: it continues along the inner circumference, with an unmistakable separate cut edge and an overlap shadow. It is behind the fixed strap, NOT pasted onto its front, NOT cut away or silently removed. Choose the camera to reveal this tucked tail inside the ring without changing the threading.
3. The tang hinges at the LEFT bar, crosses the opening, penetrates an actual occupied adjustment hole just before the RIGHT bar, then its tip RESTS ON THE RIGHT BAR. That metal tip lies between the right bar and the overlying leather and therefore lifts the leather slightly: a small physically plausible arch/bridge with distinct thickness and clearance, not a tight flat fused join. The tang must reach the right bar, not end as a short detached blob halfway across the strap. One spare adjustment hole can remain visible farther right.
Camera is a moderately elevated three-quarter close-up chosen to reveal the inner tucked tail and the separation between metal receiver and raised strap. Full cuff visible with no cropping; the mechanics must be legible at once. No additional inset images or diagrams.
Worn hand-cut matte brown vegetable-tanned leather, thick subdued antique bronze, believable irregular edge wear, restrained patina, no contemporary stitching ornaments, no plastic gloss, no theatrical grunge. Clear soft studio light and sharp boundaries. No text, labels, arrows or watermark. Preserve structural clarity over decorative surface detail.
```

## 10. keeperFrontLayerPrompt

Workspace: front-layer-candidate.png
Default source: D:/CodexData/generated_images/01a12e3a-ffd2-7241-bb08-8a2452e79edb/exec-463fdbd0-c876-4441-91e8-e6035155241a.png

```text
Use case: sketch-to-render.
Turn this EXACT front-view buckle construction drawing into a crisp photorealistic antique leather and bronze object close-up. Preserve the supplied drawing's projection, silhouette, proportions, occlusion and overlap. Do not invent a different buckle design or a full circular cuff.
One continuous perforated leather strap enters from the right, passes IN FRONT OF the right frame bar, slopes backward through the frame opening, then passes BEHIND the left bar and fixed riveted leather. The entire middle portion of the RIGHT bar is hidden behind leather, exactly as drawn. Its exposed upper and lower rounded portions continue behind the strap; intact metal with a contact shadow, never embedded or fused into the leather. The leather above the right bar is slightly arched because the tang tip rests on that bar underneath it.
Keep the one full tang shaft from the left pivot to the occupied hole, plus the small part visible in that hole. The tang continues behind the foreground leather to the right receiver bar. Do not replace the tang with a detached stud. Keep the two rivets and the spare hole.
The leather ends continue outside this close-up left/right: do not make an extra cut end in the middle. The inward free tail behind the fixed leather must still exist, not be deleted. This crop investigates the front occlusion only; no loose tip is to be pasted on the front.
Materials: centuries-worn matte brown leather with believable cut thickness and restrained hand wear, differentiated from solid antique bronze with uneven subdued patina and softened tool marks. Soft neutral light, white background. Turn flat areas into natural materials without changing any of the front/back relationships in the drawing. No added hardware, text, diagrams, marks, plastic gloss or exaggerated damage. Right receiver bar MUST NOT appear across the front of the leather.
```

## 11. keeperClosedFromFrontAnchorPrompt

Workspace: closed-from-front-anchor.png
Default source: D:/CodexData/generated_images/01a12e3a-ffd2-7241-bb08-8a2452e79edb/exec-2ccf8296-6bcd-4e94-8a47-d8a1d007beee.png

```text
Use case: precise-object-edit.
Edit/outpaint this corrected buckle macro into ONE complete closed antique leather scroll cuff. The supplied FRONT BUCKLE AND ITS THREADING are the edit target to PRESERVE, not something to redesign. Preserve the foreground strap occluding the entire middle of the right receiver bar, the two fixed rivets, the left tang pivot, the one occupied hole, the spare hole and the small raised leather bridge over the receiver. Do not bring the right receiver bar to the front of the leather.
Extend the leather continuing off the left and right edges smoothly backward into a continuous circular/oval cuff. It is ONE strap fastened at its two ends. Use a slightly elevated frontal view so the inside of the cuff is visible, without reversing any of the correct front overlap.
The free end which passes behind the left bar/fixed strap continues a short distance ALONG THE INNER CIRCUMFERENCE on the left. Reveal its distinct tapered end and cut thickness inside the cuff, with a separate overlap shadow. It is not a second loose strap, it is the same continuous perforated tongue after passing through the buckle. Do not delete the tail and do not paste a pointed tongue over the outside front of the fixed strap.
The right receiver is intact metal behind the strap. Its tip and lower exposed curve must read as connected metal passing behind leather with real depth, not metal embedded in a leather cut-out. The tang crosses the occupied hole and its concealed tip bears on the receiver, making the existing small arch in the strap. Keep the corrected macro's mechanics.
One single high resolution product photograph on clean white, full cuff in frame, diffuse light, natural aged hand-cut leather and subdued worn bronze, no text or insets, no new hardware or ornament. Preserve the input's art direction and keep all skin/metal surfaces clearly separate.
```
