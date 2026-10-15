# 第二语言认证币原始设计包 · v1.2

## v1.2 · 已加入实际拟合三维样币

[真实多角度视图](production/index.html) · [制造、重建与边界](production/README.md) · [可编辑Blend](production/outputs/hostile-dragon-fitted-candidate.blend) · [GLB](production/outputs/hostile-dragon-fitted-candidate.glb)

按用户最新指示：先制造参数币胚，再拟合正面、币背与跨缘结构；**币侧严格遵循参数，币背参数图只作数值参考，审美以完整视觉稿为准**。以下旧版图05、背面矢量和固定排版属于参考资料，不能覆盖本轮实际拟合布局；实际布局见`production/outputs/fitting-layout.json`。已交付真实模型及本地可重建源，不代表用户已完成艺术采用。系列认证币入口与身份规范完整保留。

2026-10-15 · 工作母版，待用户最终审美采用。当前任务是清理、优化与固定设计的闭环交接，尚未生成新的艺术三维模型。

[可视总览](index.html) · [设计规范](spec/design-spec.json) · [建模交接](MODEL_HANDOFF.md) · [撤回记录](AUDIT.md)

## 先选择币种

- **系列认证币**：先读[SERIES_HANDOFF.md](SERIES_HANDOFF.md)，看图09—11；使用series配置与series-sample.json。
- **启动特别币**：看foundation-refined与图05—06，使用foundation配置。
- **共用母版**：图01—04、07—08，blank/edge/reverse的固定框架。

v1.0遗漏了系列币的完整固定资料；v1.1已补正，不再把“共用币胚已有数据”当作“系列币已交付”。

## 从这里开始

1. 看 `visuals/foundation-refined.png`，了解本轮修订后的完整币观感。
2. 看十一张 `drawings/*.png`；需要细看、编辑或放大时打开同名SVG。
3. 用 `spec/design-spec.json`、`spec/glyph-placement.csv`、`vectors/edge-curves.json` 落实固定设计。
4. 用完整 `sources/approved-dragon-front.png` 保护原认可龙形；不能以旧外推侧视重新发明眼、爪、角与龙身。
5. 按MODEL_HANDOFF检查正背映射、包边和破口，再进入真实建模。

## 权威关系

| 内容 | 权威来源 |
|---|---|
| 原认可龙的主形、眼、角、爪、盘绕体量与左下纹样 | sources/approved-dragon-front.png |
| 轴、角度、尺寸、分区、字形、方向与覆盖规则 | spec/design-spec.json＋导出的SVG/CSV/曲线JSON |
| 原开卷轮廓与每页三道横线 | sources/project-icon.svg，等比例适配 |
| 银色和整体雕刻风格 | visuals/foundation-refined.png；只作观感参考 |
| 币背有机卷草细雕 | 完整币胚参考的风格与规范内的定位框；没有伪造隐藏拓扑 |
| 被撤回的多角度图 | 无当前设计权威，见AUDIT.md与历史提交 |

系列动态字形入口为`spec/series-resolved.json`、`spec/series-glyph-placement.csv`与`vectors/series-reverse-*.svg/json`。图09—11与可重建脚本同时提供，不依赖重新AI生图。

新定下的数值属于本轮工程设计名义值，**不是从AI图片恢复出的真实相机或制造测量**。用户仍拥有最终审美权。SVG母纹、字体和分区经过本轮整理，不冒称用户早已批准了每个数字。

## 固定设计的核心

- 坐标沿用已有工程：X正面向右，Z向上，正面法线−Y，背面+Y；O为币心，P0=(0,0,20)。
- 正面十二点为θ=0°，顺时针增长。背面屏幕q=−X，同一世界角映射β=−θ mod360。
- D40，平场厚2.8，总包边厚3.2，圆肩R0.2；不附加直齿、斜齿、锯齿或隐形第二圈。
- 三组完整THE SECOND LANGUAGE的中心在0°、120°、240°。各预留76°；实际字形约72.618°。
- 三个同母短草纹中心60°、180°、300°，各占23°。预留区域间隔各10.5°；实际字形与草纹间留白约12.191°。
- 字顶朝正面−Y，字底朝背面+Y。阅读向是θ递减，禁止镜像或逐组翻字。
- 字高1.4mm，Cinzel 600真实轮廓，跟踪0.03mm；全部57字位含空格逐项给出坐标。空格没有刻槽。
- 45°母线作为展开切口，落在空白中；它是数据展开切口，不是制造接缝。
- 启动特别币不使用章号、哈希码、认证时间、发行序号或虚构日期。

## 十一张说明图

1. 坐标、零点、正背对应。
2. 角度分区和等比例展开；标注预留区与实际字形的区别。
3. 相同曲线数据的四方位投影，避免独立AI图改变分布。
4. 同一币体的圆肩截面，明确2.8/3.2mm与R0.2的关系。
5. 特别币背固定文字、书徽与定位框，字体转轮廓。
6. 上下爪施工包络、破口节点及背面映射。
7. 第一组逐字坐标图；CSV包含三组全部字位。
8. 短草纹母轮廓、尺寸、结构与控制点文件说明。
9. 系列第一章币背的真实信息、字体与排版。
10. 系列各行尺寸、身份码、认证时刻和永久绑定。
11. 系列空白正面母版、共用结构与特别币例外的边界。

## 如何闭环

所有固定字形与纹样可从提供的字体、脚本和规范重建；世界坐标导引无需再从AI侧视猜位置。规范、图纸、SVG、CSV、曲线和检核结果都在包内，阅读不依赖联网。字体附SIL OFL许可证，SVG图纸内嵌说明字体；PNG可直接查看。

`checks/design-checks.json`验证三周期、分区覆盖、字形容纳、正背映射及外法线。`scripts/validate_package.py`验证包内哈希、曲线半径、字位数量及被撤回文件不混入活动包。系列检查另覆盖动态标题换行、身份与首次通过时刻、实际行距、逐字CSV/世界坐标，以及不继承特别币缺口。`MANIFEST.json`列出各文件散列；它不递归记录自身。

v1.2闭环已覆盖设计资料、参数币胚、实际拟合网格与本地重建。三维形体已可绕看；艺术采用、最终表面工艺与实体制造验证仍独立于文件检查。

## 重建

无需重建也可直接使用图纸、轮廓与导引。若要修改并重算：

```text
python -m pip install -r scripts/requirements.txt
python scripts/build_design.py
python scripts/wrap_fixed_guides.py
powershell -File scripts/render_drawings.ps1
python scripts/validate_package.py
```

生成器与图纸是本版固定排版的配套源文件。更改规范须同时检查文字标注和视觉布局，重建后更新清单；不能只改一份JSON便忽略相关的路径母纹或标注。无需再次运行prepare_fonts；现有TTF已提供。prepare_fonts仅用于按固定上游版本重新制作字体子集。

v1.0/1.1图稿整理历史未调用GPU；v1.2新增两次免费Kaggle生成/细化任务，见production/provenance。没有新订阅或付款，历史模型原件、生产前端和数据库未改。

