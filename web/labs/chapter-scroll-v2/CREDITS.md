# 第一章古卷增强试样：资源与边界

2026-10-16。独立设计试样，未颁发认证，未写学习记录。全部运行资源同源，没有模型、音频生成或素材订阅。

## 继承已获认可的基础

字体 Aboensis（Tommi Syrjänen，OFL）、cron 的 Old Parchment Paper（CC0）、Paperlab 卷绕算法（Apache-2.0）及项目已有 Three.js（MIT）：实际文件与完整许可沿用 [前版说明](../chapter-scroll/CREDITS.md)。字体与纹理原件未改，未复制另一套引擎。

字体有真实晚期中古手稿依据，但不冒称英国某件中古公文的复原。纸面仍是作者制作的 628×470 外观贴图，新增颜色磨损及凹凸细节不能将它变成实物扫描或高分辨率原件。

## 木轴材质

- Poly Haven，**Wood Table Worn**：[资源页](https://polyhaven.com/a/wood_table_worn)。摄影 Dimitrios Savva，处理 Rico Cilliers。
- [资源接口](https://api.polyhaven.com/files/wood_table_worn)，采用 1k 的 diffuse、OpenGL normal、roughness 三张 JPG 原件。
- [CC0 许可](https://polyhaven.com/license)；用于小木轴的木纹、粗糙度与表面凹凸，不将现代木材扫描冒称为出土古物。
- 原生车削轮廓包括轴芯、肩、盘缘和短端头；依据可见实物结构作克制的艺术适配，不附会某种独有的中世纪英国器制。

## 雾效运行组件

- [pmndrs/drei-vanilla](https://github.com/pmndrs/drei-vanilla)，MIT；固定来源 `28978f680f9071e4f4794611781c19f46de48e35`。
- 使用 `src/core/Cloud.ts` 与 `src/helpers/deprecated.ts`，esbuild 打包为 `vendor/drei-cloud.js`。许可证保留于 `licenses/drei-MIT.txt`。
- 修改：本地 Three.js 导入路径；去除未采用的远程默认纹理。原组件负责实例化、朝向相机与深度排序；本项目在独立 `mist.js` 中增加流动、动作扰动及前景正文遮罩。
- 没有使用许可未核明的上游默认 cloud.png，也没有安装 React 或整个 Drei 包。

## 雾的密度来源

- JangaFX 官方 [Free VDB Animations](https://jangafx.com/software/embergen/download/free-vdb-animations)，CloudPack，CC0。
- 实际采用 `cloud_04_variant_0000.vdb` 的 `density` 通道，经 Blender 5.1.2 / Cycles CPU 24 samples，密度系数 0.22，正交相机，透明背景，烘焙为 512×512 RGBA 的 `assets/jangafx-cloud.png`。
- 原包许可证与说明：`licenses/JangaFX-CC0.txt`、`licenses/JangaFX-README.txt`。烘焙程序：`research/scroll-lab-v2/bake_cloud.py`。
- 浏览器使用预烘焙密度切片、轻微 UV 流动及透明实例，不是实时三维流体仿真，也不是把整个 VDB 下载到手机。源 VDB 与下载包仅在 D 盘缓存，未打入网页或 Git。

## 原生设计与可见限制

- 纸面颜色老化、边缘触摸磨损、淡水痕与短褶线，独立于文字与纤维凹凸。没有为营造年代感随意破坏正文或制造孔洞。
- 窄收束带先展开抽离，卷页随后展开；收起反向。它是可逆的艺术化收束演示，**不是已经证实的历史绳结，也没有绳结/布料碰撞求解**。不使用火漆、蝴蝶结。
- 木轴与卷芯共享位置和卷绕角，末端保留少量纸膜包绕。固定正视相机；同一纸面、同一正文 UV 连续变形。
- 雾在卷芯附近低密度流动，前景中间书写区域受遮罩保护；可单独关雾、木轴及收束带。减少动态效果时雾静止；后台暂停；关雾且静置时停止持续绘制。
- 透明导出只保留卷轴本体（含启用的木轴与收束带），剔除环境雾与应用界面。

文件散列见同目录 `asset-manifest.json`。历史形制及旧化研究来源、取舍与验证记录见仓库 `research/scroll-lab-v2/README.md`。
