# The Returning Thread · Image generation prompts

2026-10-21。执行用途：分别生成无字羊皮纸胚与独立透明饰画。`art-direction.md` 保持原版本；本文件不记录生成或发布成功。

两次调用均设置 `transparent_background: true`。原生输出尺寸以工具实际结果为准；下述2048类坐标是构图目标，不能以放大文件冒充原生细节。保存成功原件、真实像素尺寸、alpha及可观察工具记录。

## 1. Blank parchment sheet — executable English prompt

Create one original, completely blank sheet of aged animal-skin parchment for a finely made contemporary keepsake inspired by European medieval manuscript materials. This is a flat material asset, not a scene. Show the entire single sheet laid completely flat and seen straight from above, orthographic, with every edge visible and no perspective or foreshortening. Portrait proportions approximately 5:7, intended for a 2048 by 2868 pixel document. The sheet should occupy about 94 percent of the image width and height, with only a narrow fully transparent margin around its outline. It is one unbroken piece of parchment, with no stitching or central slit.

The principal colour is quiet warm grey ivory. Let the upper right be subtly thinner, cooler and faintly translucent in character, while the lower left is slightly thicker and warmer, with a very restrained honey undertone. Keep the central writing field calm and light enough for dark brown calligraphy, while retaining real variation in tone and fine, non-repeating scraping marks. Render subtle parchment membrane texture, minute follicle traces and gentle changes of opacity as material detail; the surface is matte and tactile, not smooth modern stationery, shiny leather, or fibrous cotton paper. Preserve the delicate grey-to-warm-ivory distinction under soft, even, neutral illumination. Only intrinsic material colour and very shallow local fold shading belong in the asset.

Give this particular sheet a distinctive, restrained contour. The top edge has a slight oblique hand-cut slope and a very shallow asymmetric shoulder at the upper left. The long sides are mostly straight with tiny natural deviations. At approximately 65 percent down the right outer edge, include one very small short notch extending inward by less than 2 percent of the sheet width. The lower edge is relatively level, with sparse, discontinuous abrasion. Avoid a uniformly deckled silhouette. Wear is uneven: a little contact-darkening near the upper right edge and lower left edge, clean stretches between worn places, and a few softly abraded areas. Keep the margins free of any continuous dark rim.

The single main old compression fold lies across the blank lower part of the sheet, centred at approximately 76 percent of the total image height, around y=2180 on a 2868-pixel-high canvas. It is a broad, very shallow, nearly horizontal flattened crease, slightly irregular and interrupted, with a little settled age tone in parts of its valley. It must remain gentle enough for later writing and should read as old pressure in a flexible membrane. Keep the upper three quarters free of major creases. Do not add crossing diagonal folds, a central vertical fold, an X pattern, triangular folded corners, or dramatic raised ridges. The sheet remains flat at all edges and corners.

Output true RGBA with alpha zero everywhere outside the parchment outline. The transparent exterior must not contain a painted checkerboard, white or coloured backdrop, table, wall, gradient, vignette, halo, props, or cast shadow. The sheet interior should be continuous and sufficiently opaque for later printing; use only delicate local edge transparency. No writing of any kind: no text, letters, pseudo-script, numerals, stains that resemble writing, signature, date, stamp, seal, ornament, border, illustration, thread, needle, seam or repair. No mould, mildew, foxing-dot carpet, insect-hole pattern, scorch marks, burned perimeter, dark antiquing ring, equal damage on all four sides, glossy highlights, excessive dirt, or modern rounded corners. Deliver a single quiet, materially convincing blank parchment cutout with its complete contour visible.

## 2. Seam miniature — original English prompt

以下原prompt逐字保留自艺术方案。为排除“两张纸缝接”的误读，执行时在原prompt前加这一句：

**This miniature depicts a small repaired slit within one continuous sheet of parchment; both sides of the slit belong to that same sheet, and the stitches keep that single page intact.**

An original, restrained miniature study for a contemporary keepsake inspired by European medieval manuscript craft. An extremely narrow, gently bending slit in pale aged parchment is joined by about seven fine stitches of faded brick-red silk. Each stitch enters a tiny paired hole, disappears to the reverse, and returns through the next hole; the short crossings rest close to the parchment rather than floating above it. The two ends of the slit taper quietly into the intact surface. Delicate parchment fibres, a few subtle warm brown ink shadows, and minute variations in the thread show the work of the hand. A slender vertical composition with generous transparent space around it, fine sepia drawing with very light tempera-like washes, quiet and materially convincing. The visible parchment around the seam dissolves irregularly into full transparency so there is no rectangular page or sticker outline. The seam remains slim, a small mended imperfection, never a wide wound or a torn-open gash. This is a unique illustration, not a reproduction of any historical object. No text, letters, glyphs, pseudo-writing, numerals, signatures, seal, border, needle, hand, book, flowers, leaves, seed, river, map, crown, cross, gold, wax, wooden rod, scene, background, cast shadow onto a background, modern product photography, mould, or scorch marks. Transparent RGBA output.

## 3. Semantic confirmation

**The seam holds the page** means that the stitches repair a narrow slit and maintain the integrity of **one existing page**. It does not mean joining two separate sheets into a larger page.

中文同义：**缝线维系着纸页**，即缝补使同一张羊皮纸保持完整。图像应在细缝的上下端清楚回到连续、完好的羊皮表面，以支持这个读法。现有英文与中文正文可保持定稿。
