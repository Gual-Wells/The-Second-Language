# 第二轮纪念币作品与授权

## 本轮原创作品

币面 `map-face.png`、`ledger-face.png`、`wetland-face.png` 为本轮通过 OpenAI imagegen 制作的原创主题图像，分别表现地图与森林勘界、河流与记录、湿地水流回归。展示采用真实斜削币缘与圆形双面几何，币面细节是图像及浅凹凸贴图，并非完整雕刻网格。

三个主题声音由本项目独立剪辑、淡入淡出、分层混音：地图展开与森林河流；翻阅账本与间隔记录、河水涨落；稀疏风声、溪水回归与林间生命。没有英文朗读、换音高模拟主题或运行时模型调用。下列原作者保留各自版权，改编部分不取消原录音授权。

## 声音来源

- **Blender Foundation, YoFrankie! / OpenGameArt 提交者 Lamoot**：[Ambient Mountain, River, Wind and Forest and Waterfall](https://opengameart.org/content/ambient-mountain-river-wind-and-forest-and-waterfall)。`amb_forest.flac`、`amb_river.flac`、`amb_stream.flac`、`amb_wind_1.flac`；[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)。已截取、调整音量、淡化与混音，非原样分发。
- **kurt**：[Stream Sounds](https://opengameart.org/content/stream-sounds)，`stream2.ogg`；[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)。已截取、循环、调整音量、淡化与混音。
- **Kenney**：[Casino Audio](https://kenney.nl/assets/casino-audio) 中 card-fan、card-slide、card-shuffle；[Impact Sounds](https://kenney.nl/assets/impact-sounds) 中 impactMetal_light；[CC0](https://creativecommons.org/publicdomain/zero/1.0/)。已截取、调整音量与混音；纸牌声作为翻阅纸张的拟音素材。
- **thedapperdan**：[Drop Coin into Glass](https://freesound.org/people/thedapperdan/sounds/199922/)，公开高品质预览录音；[CC0](https://creativecommons.org/publicdomain/zero/1.0/)。截取三段实际币落玻璃声音、调整音量与淡化，用于玻璃罐接触。

原文件摘要、剪辑位置与混音参数见 [assets/sound-build.json](assets/sound-build.json)，复建入口为仓库 `scripts/build-certification-sounds.mjs`。环境音保留上述署名与授权链接。

## 渲染与物理

- [Three.js](https://github.com/mrdoob/three.js) 0.186.1，MIT；复用已固定版本的本地模块及该版本 `RoomEnvironment`，仅调整导入路径。
- [Rapier](https://github.com/dimforge/rapier.js) 0.21.0，Apache-2.0；复用已固定版本的 WASM 模块。完整许可证与摘要保存在第一轮 `../certification/vendor/`。
- 容器、运动校准、实例化布局与声音触发代码为本轮原生实现。参考 Three 官方实例、Rapier 官方文档及公开开发经验；没有复制缺少明确许可证的社区项目代码。
