# 第七版 · 章印、文书与皮扣路径

第一章设计试样，未颁发；不调用正式认证写接口，不虚构通过时间、得分或证书编号。正式工程规范见仓库 `protocol/CHARTER.md`。

## 研究与设计

- [国家档案馆印章指南](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/seals/)与[专业印章编目指南](https://pure.aber.ac.uk/ws/portalfiles/portal/88005476/ARA_Seals_Guide_Seals_FINAL_WEB_8.8.24_2.pdf)：采用中心图像、周边机构铭文与分隔记号的职责关系。历史认证印常压入蜡等材料；本项目继续用户不要火漆的要求，做纸面墨色印记，是历史构图启发的现代项目设计，不宣称严格器制复原。
- 中心开卷由项目 `web/icon.svg` 原有三个路径直接导出，两页及六条行线保持，单色/透明留白适配印记。没有生成新的项目徽记，没有取用他人纹章图像。
- 新增 Brian J. Bonislawsky / Astigmatic 的 **Uncial Antiqua**，SIL OFL，Google Fonts目录固定提交 `f006ade507ba4f5ced8b279d8658cfd885302ceb`。原字库与完整许可在assets；SVG内嵌同一字库，保持独立输出字形。它是现代uncial/half-uncial混合字体，不是原中古印模字形。
- [ASChart文书结构研究](https://aschart.kcl.ac.uk/tech/tech_intro.html)与[国家档案馆文书英译](https://www.nationalarchives.gov.uk/education/teaching-resources/magna-carta-1214-1225/)用于发行、告知、记录、印证与日期的分工。正文原创，英文清楚优先；不移植王权、宗教誓词或虚构见证名单。
- 首章纪念段已核对真实原章的河流、雨林、洪水、合作营救和地图预警内容。样品的认证段明确等待首次通过；未来正式版只陈述保存的那份测验，不宣称长期完全掌握。

## 工程

纸膜、哑光显示、连续GPU卷展及雾染沿用[第六版](../chapter-scroll-v6/CREDITS.md)，不重新改造已认可的材质方向。

皮扣保持`.41×.77`刚性几何，先在深度方向抬离，纸卷保持闭卷，继而向左退出轮廓，完全清出后才淡出；逆向同轨迹。检查包括完整闭卷的保守前表面上界和旋转后矩形占位。道具仍为正视2.5D资产，没有宣称完成真实后环/解舌扣/软体碰撞。

章印为原生矢量，正文、身份和时间为真实字库排字，再一起映入纸面；不让AI生成文字或认证事实。2048×2868排字，DPR3、细看放大、减少动态、静态降级继续保留。iPhone/Safari实际帧率仍待实机体验。

复用的Three/MIT、Paperlab/Apache-2.0、Pavel Fluid/MIT、Aboensis/OFL与Poly Haven/CC0固定来源及许可见旧页。本版没有生图、付费API、Kaggle或新订阅用量。
