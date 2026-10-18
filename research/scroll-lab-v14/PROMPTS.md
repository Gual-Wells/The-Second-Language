# 实际位图制作提示词

工具：内置imagegen；实际图像模型、质量参数及单次金额未暴露。三次均以既有认可素材作为编辑/材质参考，结果保存原件。未调用CLI或外部生成API。

## 独立羊皮纸胚

参考：web/labs/chapter-scroll-v6/assets/charter.webp。结果：parchment-source.png；透明背景。

Use case: precise-object-edit. Asset for an interactive medieval manuscript scroll: create a DIFFERENT individual sheet of aged European parchment using the reference only as the successful material/age standard. Single completely blank sheet, perfectly straight-on orthographic, portrait aspect 5:7, whole sheet fills canvas with tiny transparent perimeter. No perspective, no curled roll, no props, no text or ornament. Preserve dignified old warm ivory/ochre material, high fidelity visible skin fibre, fine irregular vellum grain, supple variable thickness. Redesign physical outline subtly: broad nearly straight hand-trimmed sides with occasional shallow angular nicks, lower left small worn notch, asymmetric rounded-worn corners but never scalloped/burnt. Design this sheet's own aged history: a restrained shallow diagonal crease entering from upper left and dying before centre; a long shallow uneven horizontal compression fold near lower third; rubbed thin areas and warm amber old tide staining localized to outer edges; quiet central writing area still with fine grain and pale uneven age. No mold, no black spots, no decorative floral all-over texture, no dense scratch-noise, no giant tears or pronounced diagonal bright ridges across the writing. Authentic old handled material, neither pristine modern paper nor dirty rotten skin. Diffuse neutral lighting, NO baked shiny highlights, NO cast shadow, fine texture sharp not blurry. This is a physically plausible surface and cutout for a 3D sheet, not a finished illustration. Transparent outside sheet, paper inside opaque. Make the material as convincing and aged as the reference while clearly a distinct sheet; do NOT merely mirror or rotate reference.

## 古旧皮革基色

参考：web/labs/chapter-scroll-v4/assets/keeper.webp。结果：leather-albedo-source.png；非透明。

Use case: precise-object-edit. Supporting reference is an aged leather strap with bronze buckle. Extract and re-create ONLY its convincing old leather material as a single seamless square PBR BASE COLOR texture filling the entire image. Do NOT depict a strap, buckle, borders, metal, holes, perspective, object or shadow. Flat orthographic macro material surface. Match the reference's strong historical age: deep warm walnut brown leather with clear fine branching pale tan abrasion cracks and intermittent broader compressed creases, irregular rubbed lighter worn patches, small darkened areas embedded in grain, old supple hide. Rich visual fidelity, not rotten, no mold. Do not make it uniformly clean modern pebbled leather. Texture is for a small 3D scroll keeper: features should remain legible on a narrow strip. Lighting deliberately completely diffuse flat albedo, NO directional illumination or baked highlight/shadow, no shiny white cracks. Subtle local warm tonal diversity. Film prop material quality, coherent natural grain. Entire canvas is leather, no margins or text.

## 古铜基色

参考：同上。结果：bronze-albedo-source.png；非透明。

Use case: precise-object-edit. Supporting image contains an antique bronze buckle. Re-create ONLY its surface material as a seamless square PBR BASE COLOR texture, flat macro filling whole canvas. Absolutely NO buckle shape, leather, object silhouette, border, holes, text, perspective, cast shadow or baked specular highlights. Dark historically aged warm bronze with worn ochre-bronze exposed metal islands, tiny dents and scuffs, irregular near-black brown oxidized recess coloring and sparse restrained muted gray-green patina occupying under 10 percent. Clearly centuries-old but maintained, neither shiny new gold nor orange rusty iron. Uneven fine hammer marks and short discontinuous hairline abrasions. This is ALBEDO for actual volumetric bronze geometry whose reflections are computed in real time: perfectly diffuse neutral light, no big highlights. Material must look old at close range and still read warm subdued antique bronze at small scale. No large decorative motif, no cracks running through whole sheet, no fake metallic lighting gradients. Single continuous texture fills canvas.

## 实际检查

新纸胚的上左短斜折、下部横折、缺口与磨耗区别于原母材；渲染继续检查明显折痕的空间对应。皮革/古铜单图作为基色，不能因为提示词写了PBR就宣称已获得完备的物理扫描材质；当前法线/粗糙度仍为许可明确的通用微表面图。手工质感与真实光照效果以实际道具画面为准。
