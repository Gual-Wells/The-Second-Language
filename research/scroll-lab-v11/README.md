# 具名纪念文书：方形文字印与文书尾记

日期2026-10-18；基线`dec8b7a`，分支`codex/medieval-scroll-lab-2026-10-16`。此轮为v11设计试样，不开启生产认证。最新规范在`protocol/CHARTER.md`，实际英文/中文在TEXT_REVIEW.md。

## 研究结论与实际设计

### 1. 不把方印做成“换个外框的应用logo”

St Andrews大学典藏的notarial marks材料表明：身份符号、签名式字形和稳定构图能够共同承担文书收束。该页记录的下部文字基座与字母组合值得借用，但其公证/教会权威及真实公证人个人图样不可挪用。Missouri典藏还展示地区和时代差异，因此不能把中世纪欧洲当成单一固定印章标准。

实际采用The / Second / Language / Attested四行方形字印；全文与印章均使用既有OFL Aboensis。无图像中心、圆形铭文、火漆和新造的伪拉丁铭文。粗细双线为独立印模边界，不是现代圆角控件。余墨、断墨和纸张压陷与母版独立，以光学衰减透出纸纹。损耗没有把印章整体做灰做浅。姓名下的收笔不冒充人的真实签名。

### 2. 从“匿名机构证书”转为“授予某人的可收藏文书”

旧版标题/章名/大圆章轴线会把姓名挤成正文中的一个单词。v11把Granted unto和Gual Wells作为中轴核心：发行主体 → 文书名 → 受誉者 → 章序/题名 → 正文 → 左方印/右尾记。名义270×360mm、3:4，较300×420mm略宽；不是为塞入更多故事。纸面从2048×2868改2048×2732，复用已认可v6纹理，不声称重新扫描羊皮。

检视实际图面后，正文由首基线1285调到1320、字号由80调78、行距96，章名上移到1150；解决前一草稿近乎贴行的问题。样品状态移到2630，避免2675时碰到原纸破损裁缘。正文当前9行、实际下沿2173，方印盒从2220开始。

### 3. 文书的“纪念性”怎样成立

ASChart以文书功能区分告知、处分、受益人、日期等，不要求在每张文书加入一段题材故事。借此重新取舍：本项目凭真实通过事实授予文书，并把它永久保存为该次达成的纪念。简洁的memorial of the achievement句确立收藏理由，不虚构人格品质、学习时长或教材文学价值。

当前三段固定正文不读取教学范文、例句或章节梗概。每章独特性来自具体题名、真实时刻、哈希，及哈希固定的收笔/吃墨；不是每章换机构印或任意同义替换正文。目前只实现受控笔迹与墨迹差异，**没有**声称每章已自动生成高质量原创独幅纸纹。下一阶段如需更强艺术差异，可制作少量审核过的纸张/书写母版，但需通过整页验收，不靠噪声密度当艺术指标。

### 4. 编号和时间的历史感与准确性

十六进制摘要和毫秒都是现代信息。采用抄写式尾记的版面/字体语气容纳它们，日期以英文月名排印，时间保留精确数字和+08:00，不伪称历史做法。受限UTF-8 JSON位置数组是明确且可复现的现代编码，不引入通用序列化框架。不同表示的同一时刻归一为UTC后摘要相同；毫秒变化会改变摘要。

本页当前为未颁发样品：sampleTime独立于passedAt；时间及sha在proof-record.json中固定。实际通过后才允许用服务器的首次通过事件替换并封存。样品/正式状态参与摘要，二者不会混用。纸面短码64bit仅用于识别，完整SHA-256和事件ID才是档案关联；摘要不是签名，本文未部署发行鉴权。

### 5. 用户身份

用户明确给定Gual Wells，新增`web/owner-identity.js`作为公开显示身份入口，v11实际使用。稳定subject仍为second-language-owner，不改变Passkey注册键或生产登录。正式记录将姓名快照写入attestation；以后改显示名不会重写历史。当前没有批量改写历史学习数据或假造真实证书。

## 资源检查与实现边界

- 优先复用既有Aboensis、Three、Paperlab卷绕、Fluid雾染、v6羊皮、v8皮环及透视。无需新框架或生图。
- 方印是实际字库排字和明确边线，不依赖AI生成文字；肩部余墨复用v10已审核独立素材。
- 本版没有改动雾染求解、纸膜展开和刚性铜扣运动。没有重回从零写运动轮子或整幅AI图代替可展开资产的路线。
- 纸面比例略调整，仍属艺术预览；没有声称物理羊皮FEM、真实铁胆墨化学或中世纪法律效力。

## 验证、原件与发布

`node scripts/inspect-scroll-v11.mjs`导出document.png/open-native.png/open-iphone.png/detail-iphone.png/seal-master.png/seal-height.png及proof-record.json、inspection.json。

检验真实SHA256与Node独立重算相符，摘要稳定且绑定内容/毫秒，等价时区表达一致；拒绝缺事件正式记录、混入事件的样品、无效日期和时区；同种子印痕一致、不同种子印痕不同；墨色与余墨检查只是回归辅助，整页图片才是艺术验收对象。移动视口402×874、DPR3、软件WebGL，不冒称实机Safari性能。

发布后deployment.json记录独立预览与在线检查；旧版保留。任务末尾按BALANCES查询并更新生产余额/容量，不修改认证能力。

## 一手研究入口

- https://aschart.kcl.ac.uk/tech/tech_intro.html
- https://university-collections.wp.st-andrews.ac.uk/2023/06/23/notarial-marks-in-the-st-andrews-burgh-charters/
- https://library.missouri.edu/specialcollections/exhibits/show/fragmenta-manuscripta/manuscript-decoration/monograms-stamps-ownership-doo
- https://www.rfc-editor.org/info/rfc3339/
- https://www.rfc-editor.org/info/rfc8785/

均用于研究与判断，没有把大学藏品照片复制成项目印章素材。
