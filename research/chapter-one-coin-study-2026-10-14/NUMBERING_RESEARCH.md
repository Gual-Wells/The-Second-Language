# 编号排版修订 v3

## 用户选择与问题

用户明确采用中文主标题版（附件5d7d4667），要求修正发行编号散布过宽。语言层级选择已经确定；不再把中/英文两版当作待选方案。当前只修改编号排版，不增加其他币胚风格。

原图的六位数被加上过量字距，又与“№”拉开距离，读起来像六个孤立符号。它不是数据库编号长度问题，也不是缺少新装饰。

## 调研依据与本项目设计判断

- [Monotype / Fonts.com：Proportional vs. Tabular Figures](https://www.myfonts.com/pages/fontscom-learning-fontology-level-3-numbers-proportional-vs-tabular-figures)：比例数字适用于非表格文本，等宽数字的用途包括纵列对齐；数字字形宽度与数字高度风格是不同维度。
- [Microsoft：Latin figures design standards](https://learn.microsoft.com/en-us/typography/develop/character-design-standards/figures)：比例数字中的1通常比0窄，等宽数字具有统一advance width，字宽不能与额外tracking混为一谈。
- [Monotype：Common Errors in Type Design](https://foundrysupport.monotype.com/hc/en-us/sections/360004927572-Common-Errors-in-Type-Design)：先建立合理字形间距，再修正特殊字偶；整体应具有平衡的视觉节奏。

据此作出的独立设计选择（不是行业唯一规范）：币上的单个静态序号采用与现有刻银衬线风格协调的紧凑齐线比例数字；保持六位前导零，数字内部不插空格，不借tracking填满空位。只在№与数字组之间留一个小间隔，整体在右侧区域光学居中。未来跨币编号可共用定位锚点，不必为了等宽而把1旁边撑出空洞。

不分三位组、不加总量分母、不用ISSUE/ SERIAL等标签，不把序号做成第二个标题。这里只调整画稿，正式模型应使用可控字体/字距实现刻字；AI试样不能证明实际OpenType特性或精确字体名称。

## 本轮结果

![收紧编号后的中文试样](assets/chapter-one-certified-zh-v3.png)

实际使用内置imagegen，在完整币上下文中两次定向修改。首轮收紧幅度有限，未采用为当前稿；第二轮让六位数字形成更连续的整体。提示词中的宽度比例是引导目标，非已经达到的精确几何测量；不宣称像素不变或严格实现了OpenType排版。主标题、徽记、认证时间和空白正面保持原设计内容，材质微观细节可能随生成有轻微变化。

当前序号仍为设计用№ 000001，非已分配正式编号。认证样张时间沿用上一稿同一取时2026-10-14T10:35:15.314+08:00，不因修字重取时间。未开始三维制作，没有新增订阅/外部付款。

[提示词](prompt-set-v3.json) · [当前浏览入口](index.html)

