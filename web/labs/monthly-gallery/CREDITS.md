# 月度展厅样件：素材与改编

这是一组独立观赏实验，不是正式认证后的收藏。三枚象征样币均采用实际三维模型，保留材质、正背面和币缘。预览只有三枚，三十台档的另外二十七台为空，不宣称已经制作三十枚独立作品。

## 建筑与环境

- **Zoilo / iliedom**，Gothic Cloister Corner：[作者原作](https://sketchfab.com/3d-models/gothic-cloister-corner-69f4351215e84d3ca61feea9fe9890db)，[BabylonJS 授权副本](https://github.com/BabylonJS/Assets/tree/master/meshes/GothicCloisterCorner)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。使用完整版的 8K 纹理来源；合并、网格简化、纹理缩至 4K、坐标校正、镜像布局与场景光效属于本项目改编。模型不是本项目从零创作。原许可明确保留。
- **BabylonJS Assets**，`environments/ulmerMuenster.env`：[源资产](https://github.com/BabylonJS/Assets/blob/master/environments/ulmerMuenster.env)，按该资源库 [CC BY 4.0](https://github.com/BabylonJS/Assets/blob/master/LICENSE) 使用，用于建筑环境反射照明。
- **BabylonJS Assets**，[`meshes/shark.glb`](https://github.com/BabylonJS/Assets/blob/master/meshes/shark.glb)，按资源库 CC BY 4.0 使用；缩小纹理，保留真实骨骼和三段动画，海底预览使用原游动动画及本项目巡游路径，不以金属鲸雕塑冒充鱼群。
- [Poly Haven](https://polyhaven.com/license) **CC0**：Rob Tuytel（扫描）、Rico Cilliers（建模）的 [Fern 02](https://polyhaven.com/a/fern_02)；Tina 的 [Bronze Whale Statue](https://polyhaven.com/a/bronze_whale_statue)；Benny Weimer 的 [Gothic Statue](https://polyhaven.com/a/gothic_statue)。本项目归一尺度、组合入币、改变深度/材质与动画。原模型的专有设计不是本项目原创；当前用于检验真实网格符号、币缘组合及近看，尚不代表最终独特纪念作品验收。

## 声音

- qubodup：[20 Rustles of Dry Leaves](https://opengameart.org/content/20-rustles-dry-leaves)，`rustle03.flac`，CC0。截取、滤波与短空间回响，以叶片为唯一主体。
- jcpmcdonald：[Skippy Fish Water Sound Collection](https://opengameart.org/content/skippy-fish-water-sound-collection)，`bubbles.wav`，CC0。低通与回响，用于水生环境象征。
- PWL：[Bell Dings/Chimes](https://opengameart.org/content/bell-dingschimes)，`bell_ding1.wav`，CC0。滤波与回响，对应 ordinance 的宗教仪式义。
- Blender Foundation / YoFrankie! / Lamoot：[Ambient Mountain, River, Wind and Forest and Waterfall](https://opengameart.org/content/ambient-mountain-river-wind-and-forest-and-waterfall)，`amb_forest.flac`、`amb_wind_1.flac`，[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)。截取、混音、滤波与淡化；海底环境声为风声经过低通的氛围设计，不冒称实地海底录音。

音量统一到约 -23 LUFS、真峰值目标 -5 dBTP；前端另外限制播放增益。剪辑配方见 `assets/sound-build.json`，离线复建入口 `scripts/build-gallery-sounds.mjs`。播放直接复用静态文件，不调用模型、不写 KV。

## 引擎

[Babylon.js](https://github.com/BabylonJS/Babylon.js) 与 glTF loaders **9.30.0**，Apache-2.0；固定版本、自托管。完整许可位于 `vendor/LICENSE-Babylon.txt`。应用胶水、预览状态、镜头路线、声音播放和反馈通路为本项目代码。完整 GLB/材质展示与艺术质量分别验证，不用引擎功能清单冒充用户验收。
