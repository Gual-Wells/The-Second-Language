# 独立印模素材制作提示词

内置imagegen，两次生成，均要求transparent_background=true。输出先保存在D:/CodexData/generated_images/01a12e3a-ffd2-7241-bb08-8a2452e79edb，随后完整复制入项目，不覆盖用户原件。这里是艺术素材，不是历史实物扫描；正文/印文/数字由字库排字。

## 1. 古书版刻

项目原件：web/labs/chapter-scroll-v10/assets/scholarly-codex.png。
源文件名：exec-cc28e526-4448-43cc-93f6-b2a83f166120.png。

Create ONE isolated black ink woodcut printer's device of an open medieval manuscript book, on a genuinely transparent background, for the central device of a small institutional seal on an aged parchment charter. This is a production emblem asset, NOT a whole stamp, NOT a mockup, NOT a photograph of a book. Square canvas with 12 percent transparent margin. No text, no letters, no border, no circle, no wreath, no crest, no cross, no other objects. Draw one sturdy thick leather-bound codex held open in a near-frontal slightly elevated view, broadly symmetrical, with visibly concave curved folios and a pronounced central gutter, slightly irregular beveled page-block edges, a small dark lower binding spine, three or four clear curved page layers, and restrained incised diagonal woodcut hatch strokes that describe the actual curves of the pages. Pages are mostly transparent negative space surrounded by expressive, weighty black carving lines and black binding masses. NO six straight horizontal 'text lines', NO rounded rectangular UI icon, NO app logo, no checkerboard, no white page fill, no gray or sepia or color, no shading gradients, no photographic material. Late-medieval / early Renaissance manuscript book printer's mark, sculptural chiaroscuro in actual BLACK ink and TRANSPARENT negative space, engraved by a skilled human, coherent clear volumes and clean silhouette at a small size. Refer in spirit to historical incised seal-matrix devices and black-line woodcuts, not modern icon packs. It should read as a meaningful formal mark of scholarship, without ornamental clutter, cartoon simplification, fantasy glow, random grunge, or fake illegible writing. Optimize a strong, handsome, highly legible historic silhouette for reproduction in dark ink.

## 2. 印模肩部余墨

项目原件：web/labs/chapter-scroll-v10/assets/ink-shoulder.png。
源文件名：exec-73524585-c737-45a0-9f07-237e62510070.png。

Create a single authentic isolated printmaker's ink smudge / dirty seal shoulder contact impression, pure near-black pigment on a genuinely transparent background. This is a reusable material alpha decal, not a drawing of a splash, not a complete seal. One asymmetrical narrow irregular patch, roughly vertical, wider toward the middle, gently tapered at one end where excess ink was wiped only a short distance. It should look physically captured from over-inking the edge of a hand-operated antique metal stamp onto smooth parchment: dense black pooled pigment, uneven partially dry contact, fine grain, irregular tiny clear misses, slightly ragged softened capillary fringe, and two or three tiny satellite flecks very close to the main patch. Lopsided footprint with coherent small-scale pigment detail. Avoid clean vector bezier edges, cartoon bubbly lobes, a tadpole shape, a geometrically round puddle, a long teardrop tail, blood spray, many disconnected droplets, dramatic motion, rectangular brush stroke, charcoal dust, mold, words, symbols, outlines, shadows, glow, grayscale backing, paper background, any other objects. Natural high quality physically convincing ink transfer, mostly dense opaque black with small translucent uneven margins. Single black mark in the central third of a square transparent canvas; generous transparent clearance all around. No text and no frame.

## 工程接入

透明主体通过实际图源有效区采样，转作印模/接触密度，而不是把完整带光照的图片当一张纸片贴上。古书保留开卷与装订，余墨独立于印圈。资源文件未被Python改图；排字、透明密度与纸面合成属于现有Canvas/Three材质路径。
