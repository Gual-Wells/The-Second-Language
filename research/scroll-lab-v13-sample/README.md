# 第二份纪念手稿：第五章《河谷里未说完的话》

2026-10-18。制作基线为scroll-lab分支`33df66d`。本次只更新卷轴协议、独立样品与验证材料；不重做教材、不写通过事件、不启用正式认证。第一章已获肯定的长方藏记及文书保留在v12，未覆盖其原件、时间或摘要。

## 从实际章节到整体构图

第五章为2026-10-12，源自main提交`21bd29066df595c3ae7bd08ee638a5a8cc77c12b`；固定章节digest为`0da38ab64e21652d49f32283cba6cc85f7dabe26d107a453c004d5af54d6a8ed`。本工作分支本身较早，实际使用git按该commit读取源文件，不凭本地缺少第五章推测内容。详细依据见source-evidence.json；源文件正文SHA-256已与章节digest相符。

从reed的植物/管笛/簧片语义、seed/germinate的萌发意象、旧档案/笔迹/标本的留存关系，提炼“声音、留存与尚未来临的季节”。没有复述Mara的资料馆剧情，也没有以测试成绩虚构用户品德。画中的芦管、折页与橡实是原创象征组合，不冒称教学原文中的同一件实物。

艺术题名**Of Leaf and Letter**（叶与书简）；保留正式章名的英文译名**Words Unfinished in the Valley**（河谷里未说完的话），在纸上分别呈现，不改教材身份。

第一章为左侧细长意象/右侧散文，本章为上部题名、横向小画、居中双节题辞、居中归属及卷末藏记；图文关系、阅读节奏与版式均重新设计。没有随机选择一个现成模板。小画尺度、设色和留白由实际全页检查确定，不能据程序检查宣布用户已经接受艺术效果。

## 实际英文与中文

**Chapter V** — 第五章

**Of Leaf and Letter** — 叶与书简（艺术题名）

**Words Unfinished in the Valley** — 河谷里未说完的话（正式章名译名）

> A reed gives breath a voice.
> Old ink outlives the hand.
>
> A seed lies in the fold,
> holding a season yet to come.

芦管赋予气息以声音。<br>
旧墨长存，落笔的手已成往昔。

一粒种子卧于折页之间，<br>
怀抱着尚未来临的季节。

> For Gual Wells, in remembrance of Chapter V
> and its trial successfully completed.

为Gual Wells留存，纪念第五章及其已通过的考验。此为样品内的颁发文案演示，没有真实通过事件。

藏记：**The Second Language / In remembrance** — 第二语言 / 以此留念。

末尾：**Specimen — Not issued** — 样品，尚未颁发。

样品制作时间固定为`2026-10-18T06:06:37.007Z`，显示为18 October 2026 / 14:06:37.007 +08:00。不是章节发布时间或通过时间。

完整内容SHA-256见inspection.json与藏卷记录；纸面短码为`D320 6A22 91E2 E6E7`。它包含未颁发状态，不可冒充正式认证。

## 实现与资源

- `web/labs/chapter-scroll-v13/art-plan.json`保存本章构思、实际文本、版式、素材摘要、母材变体和来源；`document.js`按已审阅数值排印，不让用户开卷时重新生成。每个文字块均测真实字形边界，拒绝超界/相交。
- `charter.js`核验艺术方案文件的完整SHA-256，再解析；来源章节和digest必须匹配。`second-language.memento.v3`绑定艺术方案摘要、原文、艺术题名/正式章名、藏记、身份与时间。布局、纸材变体或素材变化会改变作品身份；旧v12/v11仍维持各自格式。
- 新图像是独立透明资产，不含文字；本轮内置imagegen一次，提示词在PROMPTS.md，原件进入项目，透明通道已实际检查。字体、日期、哈希和印文是实际排印。
- 使用既有Aboensis/OFL、Three、Paperlab、Fluid、v6纸膜/雾染、v8皮扣/刚性扣件、v12长方藏记。纸张仅采用既有母材镜像变体，没有冒称新皮膜或新增纸张物理仿真。细节许可见样品CREDITS.md。
- 艺术制作/审阅的目标配置在CHARTER固定gpt-6.1-sol/xhigh；图像工具型号未暴露，实际模型证明尚未接入，不能从全局默认配置倒推出每次调用已获证明。没有新增通用自动制作服务或生成任务队列。

## 验证与发布

本地：`node scripts/inspect-scroll-v13.mjs`；线上：`node scripts/verify-scroll-v13-live.mjs <immutable-pages-origin>`。

核对实际章身份、文字边界、方案摘要与内容摘要、修改方案被拒绝、开合后身份稳定、手机细看/释读/只看藏卷、字体加载失败的全文回退、首章原件与摘要保持。线上另外核对正常触控开合、实际发布资源字节以及私有API鉴权。结果见inspection.json/deployment.json；运行环境是402×874 DPR3 Chromium软件WebGL，不是实体iPhone/Safari性能结论。

实际公开样品和别名见deployment.json。首次满分、正式认证和永久发放继续等待产品接入；用户艺术验收尚未发生。

本轮无新订阅、外部付费模型或GPU作业；使用一次内置生图。余额与容量按BALANCES单独收尾更新，不将工程样品写成正式学习记录。

收尾已执行maintenance工作区的`check-balances.mjs`：服务额度与OneDrive、三座D1及共享KV容量均已发布更新，永久归档已排队；未触发新的收费生成。

## 研究依据

- [Getty页式分析](https://www.getty.edu/news/breaking-down-a-page-like-a-medievalist/)：文字栏、题头、首字和装饰的组织关系；2026-10-18重新读取。没有复制其宗教内容或把一种页式当通用规范。
- [Getty中世纪平面设计](https://www.getty.edu/news/getty-presents-graphic-design-in-the-middle-ages/)：文字、图像与阅读的整体设计；不据此证明本项目的具体艺术效果。
- 既有章印/字库和纸膜研究沿用research/scroll-lab-v12及各代CREDITS，先复用已验证资源。
