# 第一章纪念手稿样品

2026-10-18；基线74c62bd，独立入口`/labs/chapter-scroll-v12/`。依据上一轮`research/scroll-lab-v12`的抄本纪念叶方案制作。它是可展开、可细看、可比较藏记的工程样品，不是已通过艺术验收的正式收藏。

## 本版实际变化

- 取消Charter of Attainment、Granted unto、最大姓名标题和三段机构授予条款。章名与原创题辞形成主体，Gual Wells以66字号进入尾记，题辞106、题名146。
- 恢复原纸5:7比例，名义300×420mm，实际2048×2868；不另做纸张材质，不引入高光。
- 第一章的局部边饰取地图墨线与真实水域的关系。独立透明素材使用一次内置imagegen，带一条细褪红线、水域与少量根枝。它是本章意象，不是将整幅背景或文字交给生图；实际输出比提示的纯线稿略有着色，保留为本轮审核候选。
- 长方藏记为两行机构与纪念字样，小圆印为环文和SL字母组合。两者实际生成为透明墨版，浓墨、接触缺损、少量肩部余墨、独立高度压痕合成在同一张纸上。
- 两个按钮原位切换纸面纹理与压痕，不重建场景、纸膜或动作，不跳页、不重新收卷。返回原样式的摘要和墨迹稳定。

## 真实英文与中文

**Chapter I / The Line on the Map**

第一章 / 地图上的那条线

> Upon the map, a river lies in ink.

地图上，河流栖于墨线之间。

> Beyond the ink, rain gathers, roots hold, and the water finds its course.

墨线之外，雨水汇集，树根固土，水流循径而去。

> For Gual Wells, in remembrance of Chapter I and its trial successfully completed.

为Gual Wells留存，纪念第一章及其已通过的考验。

- The Second Language：第二语言。
- In remembrance：以此留念。
- SL：项目字母组合。
- 18 October 2026 / 11:51:50.158 +08:00：2026年10月18日，东八区11时51分50秒158毫秒；仅样品制作时间，未伪造通过事件。
- 长方样品短摘要：590C C91F FCA8 634B；圆形样品：4AFF DB99 F826 2318。
- Specimen — Not issued：样品，尚未颁发。

## 记录与可复用性

`charter.js`沿用v11输入核验和时间格式，重新定义memento.v2内容数组，绑定章节、受誉者、事件/样品时间、原创正文、归属、印文、藏记样式、艺术版本和边饰素材SHA-256。不是将旧版三段官方正文的摘要换个显示标签。

两种藏记有不同摘要；切回同一形制的摘要不变。纸面短码为完整SHA-256的前16位，完整内容原文和摘要可在细看/记录及inspection.json中核对。样品状态始终参与摘要并保留纸面标识，无正式写请求。

`setSurfaces`更新既有CanvasTexture和sealBump；原纸膜、相机、进度、皮环、雾染继续使用成熟实现。只新增第一章排版与资源，不声称已解决所有章节的自动艺术创作。本版实际保留较多留白、粗草书与小边饰，是否达到纪念艺术效果由用户看整页验收。

## 检查与交付

`node scripts/inspect-scroll-v12.mjs`核对实际按钮切换、展开进度保留、摘要独立重算/稳定、无旧官方文案、细看放大、全请求只读和浏览器错误，并导出两种完整纸面、移动截图、透明实物及墨版。整页检查后缩小藏记文字以消除越框，尾记按语义分两行，避免Chapter/I拆开。

在线验证另存deployment.json；资产摘要见asset-manifest.json。软件WebGL视口402×874，不冒充实机Safari帧率。正式认证未启用，无新增持续成本；旧版保留。
