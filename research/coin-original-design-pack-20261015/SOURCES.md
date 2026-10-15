# 来源、工具与保存

## 项目来源

项目Gual-Wells/The-Second-Language，基线5e17c6ff844ebb2b317b176e38ed01de10ad7213。

- sources/approved-dragon-front.png：此前认可的完整龙稿，从原concept-anchor-v1原件复制，字节未改。
- sources/user-blank-reference.png：用户币胚附件79f6bb01原图，保留原件。
- sources/project-icon.svg：项目既有开卷资源，未重新生图。
- 本轮保留临时协议v1.2的视觉/三维权威分工，未修改正式协议或将工作母版冒充最终艺术采用。

## 成熟资源

- 字体：Google Fonts官方仓库，固定commit 67bc647ce1910e92f461bcc82aae30f21d21a9cc。Cinzel与Noto Serif SC，采用wght600实例。字体子集、原作者、SHA256及许可证见fonts/。
- [fontTools官方子集工具](https://fonttools.readthedocs.io/en/latest/subset/index.html)：从真实OpenType轮廓导出路径，版本4.67.0。本机新增依赖、pip缓存和临时均在D盘。
- [W3C SVG路径规范](https://www.w3.org/TR/SVG2/paths.html)：使用真实可编辑路径与Bezier，不把扩散图当控制点。
- 本机既有Chrome headless渲染SVG，使用独立D盘profile、cache、tmp，隐藏窗口，没有接管用户浏览器。
- 银色完整观感图由内置imagegen修订；没有换用CLI/API或另外购买模型。
- [ECB币侧规格](https://www.ecb.europa.eu/euro/coins/common/html/index.en.html)、[德国1DM凹入卷草规格](https://www.gesetze-im-internet.de/m_nz1dmbek/----.html)支持工艺家族。当前76°/23°分区、0.2圆肩等具体参数为本项目设计决定，不冒称源自这些币种。

## 独立性与范围

字体和SVG工具用于固定排版与数据交接，不承担原生发明龙的艺术造型。没有从无稿primitive堆新龙，也没有复用被否决的3D分支。没有向HF/Kaggle发任务、没有改变数据库或生产应用。


## v1.1 系列补正来源

基于已发布原始包b963bbf5367df74462f401bff690d13c1bc905e9增量补齐。系列参考为此前用户79f6bb01完整币胚稿，复制保留原字节；不从新龙币反推系列背面。第一章数据来自既有chapter-facts.json，记录原仓库bf4768ff6a1110d72be04622ecf0f019369c1f6d下的真实章节文件与章节摘要。码与时刻来自此前single-identity-v5.json，不重抽/重取。副本在sources/series-*。

时间格式再次核对[RFC3339 §5.6](https://www.rfc-editor.org/rfc/rfc3339#section-5.6)，采用显式偏移与三位小数秒。毫秒是本项目记录精度选择，未据此宣称时钟物理精度。本次复用已有字体字源及fontTools，无新依赖下载、AI生图、GPU推理、订阅或付费。


## v1.2 实际三维制造来源（覆盖上述旧版“无GPU任务”的当前状态）

完整认可正面与币背视觉分别初始化新的TRELLIS.2艺术网格，未使用旧废稿。微软代码pin75fbf0183001ed9876c8dbb35de6b68552ee08bd，权重pin与实际阶段在production/provenance内；DINO权重只由已有授权账户在私有环境使用，未公开转存。包内保存生成后的艺术几何，不要求用户下载门控模型才能本地拟合重建。

[Manifold](https://github.com/elalish/manifold)用于封闭币胚与实际布尔阴刻；[SciPy闭运算说明](https://docs.scipy.org/doc/scipy/reference/generated/scipy.ndimage.binary_closing.html)与[scikit-image Marching Cubes](https://scikit-image.org/docs/stable/api/skimage.measure.html#skimage.measure.marching_cubes)提供隐藏空腔修复方法依据；不是无稿重造爪形。首次尝试的高面数精确Minkowski闭运算因成本过高停止，改用有界体素距离场；独立生成的背爪因形体不一致而弃用。

真实渲染为Blender5.1.2 Cycles，交互为已审计Three.js r186（MIT许可证随包）；字体沿用原包OFL。二维图稿不是实际几何/光照真值。本轮合计免费GPU1984.944秒，无新增订阅或外部付款；实际源几何、脚本、缓存和日志均落D盘。
