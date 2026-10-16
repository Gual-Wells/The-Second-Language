# 第一章卷轴试样：资源与授权

本页是设计试样，不是已颁发认证。未使用生成式图像。没有火漆印；本版不含绑绳与解绳动作，其历史形态尚待确定。

## 字体：Aboensis

- 作者：Tommi Syrjänen。
- 来源：https://ctan.org/tex-archive/fonts/aboensis
- 原文件：https://mirrors.ctan.org/fonts/aboensis/Aboensis-Regular.otf
- 作者说明：基于1430年代瑞典Codex Aboensis法律书及相近年代材料的晚期中古草书。它不是英国王室文书的逐件复原；本样品采用其有依据的手写字形，而不冒称历史仿真文物。
- 字体许可：SIL Open Font License 1.1，原始OFL与README见licenses/；保留原始版权文本，不改字体。上游OFL文本保留Reserved Font Name Missaali，未擅自改名修订。
- 原文件SHA256：0ad00fb94899b3a8277680377eb7270c5fb3ee73dd9fefbd6fb31d9f94c4707b。

## 羊皮外观：Old Parchment Paper

- 作者：cron，2012。
- 作者页面：https://opengameart.org/content/old-parchment-paper
- 原文件：https://opengameart.org/sites/default/files/parchment_alpha.png
- 许可：CC0 1.0，https://creativecommons.org/publicdomain/zero/1.0/ 。
- 原文件SHA256：a6684d988405c7522d4206e995c097fbfc22ccf59a12643e0f63b9015bb34f74。
- 使用方式：原纹理旋转为竖幅，以现有透明边缘、裂口、褶痕与色斑承载文字。墨迹在独立画布排版后局部磨损，不修改资源原件。
- 限制：这是社区作者制作的旧羊皮外观贴图，不是经过鉴定的真实中古皮膜扫描，也不是一套独立测量的PBR材质；源分辨率628×470。不得把放大的文字纹理称为高分辨率材质原件。

## 卷展形变：Paperlab

- 作者：Noor Mtir。
- 仓库：https://github.com/NourMtir0722/Paperlab
- 固定来源版本：41914833cb9ae12b32a8cbbdee4723f5b12158af。
- 路径：packages/paperlab/src/deformers/roll.ts；参考behaviors/unroll.ts。
- 许可：Apache License 2.0；全文与上游NOTICE在licenses/。
- 本项目改动：把卷绕核心移植到普通浏览器ES模块，去掉React和schema依赖，以已有Three.js绘制；保留来源和修改说明。不是整库移植，也不冒称上游测试覆盖本项目改版。
- 未采用其他社区Blender附件，未复制未核明许可的商业卷轴或字体。

## 渲染：Three.js

- 项目已有Three.js 0.186.1：../certification/vendor/three.module.js 与three.core.js。
- 作者：Three.js Authors；许可MIT，全文在../certification/vendor/three-LICENSE.txt。
- 未新增另一份Three.js、React、R3F或实时布料依赖。

## 本项目实现

原生代码负责第一章内容装配、可替换的系列配置、真实英文排版、局部墨迹磨损、照明与交互。外部资源负责基础材料、手稿字形、卷绕算法和渲染引擎。运行时全部资源同源加载，没有模型调用、充值或素材订阅。
