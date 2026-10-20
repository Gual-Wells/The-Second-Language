# 第五章丝质系绳逐帧试样

这是独立设计样品，没有颁发认证或写入学习记录。纸张、文书、字体、小画、藏记与样品时间沿用[第五章 v14](../chapter-scroll-v14/CREDITS.md)，皮扣旧版保留。

## 系绳与动画

- 细编丝绳材质由内置 imagegen 生成。完整提示词、源图、SHA256 和制作方式见仓库 `research/scroll-cord-frames-2026-10-20/`。图像工具未暴露可核实的底层模型名称、单次成本或 quality 参数，不补造这些信息。
- 动作为离线编排的二维路径及前后遮挡，利用 Canvas 2D 将同一份纤维素材沿路径绘成 64 张透明帧。浏览器按开合进度查帧，同时平移取下系绳；没有绳索三维模型、实时绳索动力学或 AI 视频生成。
- 四张 WebP 图集是实际动画资产，384 像素帧；纹理共用而不逐帧重新生图。后侧为独立投影层，接触阴影绘入帧图。适用于固定正面，不适用于绕到背面观看或任意动态光照。
- 关闭采用可逆界面动作，不声称模拟人手真实重新系结。帧间变化、结的空间读法和节奏仍需要审美验收。

## 历史与动作参考的边界

[KU Leuven 文书纺织附件修复](https://www.kuleuven.be/charters/exhibits/show/conservation-textile-cords/conservation-textile-cords)记录麻、丝绳和丝带，主要属于悬挂封印的附件，不能直接当作本样品卷轴绑法的实物证明。本例是有历史材料依据的当代中古风格设计，不是某件文物复原。

[英格兰文书 wrapping-tie 研究](https://www.cambridge.org/core/journals/early-medieval-england-and-its-n/article/production-of-forgery-at-westminster-abbey-1050c-1154/918030EA6A718EA4A523B91A57ADEA99)讨论羊皮文书自身裁出的系条及折叠形式，不与独立丝绳束卷混称。曾检索的 Oxford Lincoln 丝带束卷实例年代为19世纪，未拿来证明中世纪通式。

[Animated Knots 的结绳步骤](https://www.animatedknots.com/shoelace-bow-knot)用于学习可拉解结的基本穿绕；没有复制其图片、动画帧或商用素材。[Krita 官方逐帧工作流](https://docs.krita.org/en/user_manual/animation.html)与 [Canvas drawImage](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)作为关键姿态、补帧与图集制作参考。

Three.js、Paperlab、字库及雾染继续遵循既有许可；本页雾染默认关闭，可手动开启以比较。没有新增订阅或 Kaggle 作业。
