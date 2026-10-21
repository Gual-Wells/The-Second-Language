# 第八版 · 松环、空间遮挡与同纸印痕

第七版被用户否决，旧版保留用于比较；本版仍是第一章未颁发试样，不写入真实认证。

## 复用与研究

- 纸膜、连续GPU卷展、古旧无霉变纹理、哑光显示、雾染继续来自[第六版](../chapter-scroll-v6/CREDITS.md)。皮革与铜扣图源继续为[第四版](../chapter-scroll-v4/CREDITS.md)已认可资产，非新生成整幅卷轴。
- [Three.js PerspectiveCamera](https://threejs.org/docs/pages/PerspectiveCamera.html)、[BufferGeometry morphAttributes](https://threejs.org/docs/pages/BufferGeometry.html)、[官方形态动画实例](https://threejs.org/examples/webgl_morphtargets.html)、[Material深度/透明规则](https://threejs.org/docs/pages/Material.html)：采用其已有透视、端点形态插值、深度测试与材质机制；没有引入新的动画库或弹簧求解器。
- 皮环有真实前后深度与侧壁，前部皮革/金属扣按原资产UV分层。金属片不伸缩，皮环先略松，再沿轴退出，完全退出后才转角前移。它是小尺寸三维/2.5D混合道具，不是解舌扣全过程或360°高精度皮具模型。
- [英国国家档案馆印章研究](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/seals/)与[英国博物馆中世纪印模](https://www.britishmuseum.org/collection/object/H_1989-0604-1)用于印模/印痕、环周铭文及中心象征。没有挪用他人印章图像或纹章。
- 持续遵守不要火漆的要求，本版采用纸面墨色与浅压痕，是历史印模语言的项目改编，不能宣称中世纪普遍使用这种干压墨印。
- 项目书形取自`/icon.svg`的原三条路径，以线刻重现；全部纸面文字、印文统一使用Aboensis（既有OFL资产），取消第七版Uncial及实心数字logo表现。印痕有纸面线性高度图，明确与纸张原法线合成，不只给材质挂一个会被忽略的bumpMap。

## 验证和边界

记录与实际逐帧画面见`research/scroll-lab-v8`；独立样品保留细看、透明实物导出、减少动态、雾染开关和静态降级。视口为402×874，软件WebGL核验不能代表真实iPhone/Safari帧率。艺术协调性仍由用户验收，不用网格净空数值代替观感。

没有新增生图、付费模型、GPU服务或订阅。Three/MIT、Paperlab/Apache-2.0、Fluid/MIT、Aboensis/OFL和Poly Haven/CC0等固定版本及许可沿旧版来源。
