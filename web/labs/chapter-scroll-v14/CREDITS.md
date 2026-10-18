# 第五章 · 新材料与动效试样

仍是未颁发设计样品，源于第五章《河谷里未说完的话》。正文、插画及章节来源沿用[上一样品](../chapter-scroll-v13/CREDITS.md)，没有重新生成教材或认证事件。

- 纸胚为内置imagegen参照已认可材料标准新作的独立空白羊皮切片，轮廓、折痕和磨耗重新安排。原图与完整提示词在仓库research/scroll-lab-v14。微粒法线与粗糙度是明确的派生近似，不是扫描数据。主要两道折痕另以连续微小几何位移呈现。
- 实体皮扣由Three.js既有SkinnedMesh/Skeleton、ExtrudeGeometry和TubeGeometry组装，配件为独立有体积网格。64骨节控制皮环，另有带孔皮舌、铜框、扣针、横杆与铆钉。动作编排不等于全物理皮革模拟；没有正面剪贴层、放大淡出替身。
- [ambientCG Leather030](https://ambientcg.com/view?id=Leather030)和[Metal032](https://ambientcg.com/view?id=Metal032)：CC0。法线/粗糙度来自其1K JPG包；皮革和铜的最终基色另经内置imagegen按原皮扣的做旧标准制作。通用微表面并非最终基色纹样的逐点重建。下载源、摘要与原始包路径记录在仓库。
- 雾染继续使用Pavel Dobryakov MIT Fluid，旧页默认不改。v14通过可选接口添加连续旋度场、空间雾团生命周期、纸缘与皮扣速度扰动；是二维屏幕雾染，不是三维湿度模型。[Curl Noise方法依据](https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph2007-curlnoise.pdf)。
- [Ashima Arts / Stefan Gustavson webgl-noise](https://github.com/ashima/webgl-noise)：MIT，使用完整noise2D.glsl并保留vendor/webgl-noise-LICENSE.txt。
- Three/MIT、Paperlab/Apache-2.0、Aboensis/OFL、原长方藏记继续沿用既有许可链，见[第一章来源](../chapter-scroll-v12/CREDITS.md)。

本轮内置生图三次，实际图像模型和单次费用未由工具暴露；没有新订阅、外部付费模型调用或Kaggle GPU任务。浏览器不调用生成接口，打开/重播复用静态材料与本地渲染。iPhone尺寸Chromium检查不等于物理iPhone/Safari验收。
