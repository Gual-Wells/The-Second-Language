# 藏卷试样 · 制作与来源

本页是第一章的独立设计试样，不是已颁发认证，不写入学习、认证、VIX 或答卷数据。全英文文书由真实字体排版；羊皮、背面和皮环是三个独立美术资产。运行时全部同源，无模型调用。

## 实际采用

- **卷展**：[Paperlab](https://github.com/NourMtir0722/Paperlab/tree/41914833cb9ae12b32a8cbbdee4723f5b12158af) 的既有卷绕映射，Apache-2.0。复用基础版 `../chapter-scroll/vendor/paperlab-roll.js`；许可、NOTICE与原字体说明在 [基础版来源页](../chapter-scroll/CREDITS.md)。不是实时布料模拟。
- **书写**：Tommi Syrjänen 的 [Aboensis](https://ctan.org/pkg/aboensis)，SIL OFL 1.1；原字体未修改。依据1430年代瑞典法律书的晚期中古草书，不声称逐件复原英国王室文书。标题用红墨，正文用褐黑墨，画布与皮膜独立，可替换章节内容；另有现代字体释读。
- **雾染**：Pavel Dobryakov 的 [WebGL Fluid Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation/tree/a2d292931f19d9b3b9f564e23e6c32729d2121c3)，MIT，原许可证在 `licenses/Fluid-MIT.txt`。保留既有流体压力、旋度、平流及双缓冲求解器。移除原示例推广、统计、GUI、全局输入和内部RAF；本页负责单一调度、灰金色染料、外围流入口及与卷展联动。透明输出正确绑定默认帧缓冲后清屏，不能清掉刚得到的染料结果。它是二维流体视觉效果，不是三维体积烟雾。
- **渲染**：项目已有 Three.js 0.186.1，MIT，`../certification/vendor/three-LICENSE.txt`。`HDRLoader.js` 取自Three官方r186，仅替换本地import。没有新增React或第二套Three。
- **环境光**：Sergej Majboroda 的 [Studio Small 09](https://polyhaven.com/a/studio_small_09)，Poly Haven CC0。实际使用1k HDR，1,615,248字节；材质环境采样，背景不展示摄影棚。
- **美术**：本轮使用内置 imagegen 分别生成无字纸膜、独立皮环及纸膜反面。不是第三方历史扫描，也不是实测PBR或真实可绕看的皮扣模型。原始PNG、精确提示词及部署派生文件摘要在仓库 `research/scroll-lab-v3/`。上线WebP仅做编码转换，未用代码重画图案。

## 明确的艺术与工程取舍

固定正视镜头允许把精细皮环做成2.5D独立资产；它沿卷轴轴向整环退下，再展开纸膜，没有冒充解绳或真实解扣。纸膜是实时连续变形网格；书写、材质与动作分开。无木轴、无火漆印。皮环、局部水痕与细密花饰为本次艺术设计，不作为文物鉴定结论。

雾染在纸膜后面，保留正文清晰；可单独关闭。关闭后、页面隐藏时停止相应调度，减少动态效果模式直接展示完整静态卷页。本机只验证了Chromium iPhone尺寸模拟与软件WebGL，未声称完成真实iPhone Safari验收。

未购买素材、未开通订阅，未调用收费外部API；本轮无需Kaggle GPU。原基础版与被否决的增强版均有独立入口。
