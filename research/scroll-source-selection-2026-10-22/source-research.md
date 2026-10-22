# 卷轴与皮扣音源重选：专业实体录音路线

核查日期：2026-10-22。本轮只研究与取得候选原音，没有购买、注册、联系作者或修改正式 web。用户最新决定是恢复上一轮 A/B 页的皮扣作为参照并继续改进，不是把皮扣静音，也不是退回正式页 v41 的音轨。

## 1. 材料与动作边界

- 纸卷要柔韧、低冲击、较均匀的实际卷展；许多慢动作可以近乎无声。手摸、桌擦、抽动、乱折、硬纸壳爆裂、书页翻拍都不等价。
- 皮扣需要独立保留：旧皮革弯曲／受力松开、带尾经过小框、针与框的少量受阻尼接触。不能用解裤带综合有损录音或大物件抖响作为默认答案。
- 失败源 spookymodem、厚地图、重纸、干竹叶不再制作新的纸声候选。降低音量、EQ 或压缩不能把错误材料与表演变成正确音源。
- 新来源先做未加工原音试听，再决定剪辑和同步；“录音棚”“高采样率”“实体道具”也不能替代实际听审。

## 2. 路线 A：免费实体录音原件定向取得（已落盘，未听审）

### Audio Elk — Foley Sessions Vol. 1

作者原页：<https://audioelk.itch.io/foley-sessions-vol-1>

作者公开提供免费／自愿定价下载，无需账号或付款；说明为无生成 AI 的真实道具录音，两套话筒是 MXL900 与 Presonus PM-2。当前页面明确将这部具体作品列为 **CC BY-SA 4.0**：<https://creativecommons.org/licenses/by-sa/4.0/>。

这条路线不同于 Freesound MP3 公开预览：本轮从作者提供的 ZIP 内精确取出了独立 WAV 成员，而不是把预览转 WAV，也不是从综合 sampler 中冒认一个独立道具。

### 实际取得的文件

缓存根目录：`.cache/foley-community-sources-2026-10-22/`

| 文件（位于 `audioelk-originals/`） | 实测时长 | 实际格式 | 字节数 | 用途边界 |
|---|---:|---|---:|---|
| `MXL900_BELT_HANDLING_01.wav` | 1.191458 秒 | PCM 16 bit／48 kHz／mono | 417,208 | 作者独立皮带操作切片，未确认具体动作 |
| `MXL900_BELT_HANDLING_07.wav` | 1.739750 秒 | 同上 | 469,846 | 同上 |
| `MXL900_BELT_HANDLING_13.wav` | 6.620375 秒 | 同上 | 938,386 | 较长皮带操作切片，未证明是连续抽带 |
| `MXL900_BELT_IMPACT_07.wav` | 0.191771 秒 | 同上 | 321,238 | 皮带冲击候选，不能凭名字当作针落框 |
| `BELT_MXL900_RAW.wav` | 141.903667 秒 | 同上 | 13,925,468 | 完整未清理录音，可核查操作上下文 |
| `BELT_MXL900_CLEANUP.wav` | 141.903667 秒 | 同上 | 13,925,468 | 作者清理版本；与 RAW 成对听，不假定处理更好 |
| `AudioElkLicenseAgreement.pdf` | — | PDF | 149,500 | ZIP 内旧许可文本，见下方明确差异 |

**规格纠正：**网页与曲目表宣传 24 bit／48 kHz；Python `wave` 对实际交付 RIFF 头的核验显示本轮这些源是 **16 bit／48 kHz／单声道**。不能将宣传参数写成原件验证结果。文件中有较多元数据，不能通过总字节数反推为 24 bit。原件的 SHA、ZIP 成员完整路径、CRC、压缩大小与实测格式见 `audioelk-originals-manifest.json`。

此外取得：

- `AE_FoleySessions_Vol1_Tracklist.pdf`：545,007 字节，SHA-256 `0055cbebb842f530d77c6a783193fbc6e79807bcc8d7411c8615c915cdc3c8a9`。其 `.txt` 是本地提取文本。
- `AE_FOLEYSESSIONS_SAMPLE.wav`：4,850,520 字节，SHA-256 `0332228241fd41750b6e21300784d1ba643132e9f96ac7a5c157388dcd83a14c`。这是作者**综合试听串联文件**，不是单件原音，不直接进入产品。

### 许可来源差异必须保留

当前作者页面对这部作品的明确许可句已单独保存在缓存 `audioelk-current-license-evidence.json`，含日期、链接、有限可见文字与原页 SHA，没有复制 HTML 内脚本或 CSRF 字段。可随研究公开的证据是同目录 [licensing-evidence.json](./licensing-evidence.json)，逐件限定四个 `SPLICED/BELT` 作者切片，保留实际格式、完整来源路径、SHA、CRC、当前作品专属 CC 声明与旧 PDF 差异。它没有临时下载签名或会话信息。

ZIP 内附 `AudioElkLicenseAgreement.pdf` 却是旧式商业 EULA，标题写 `AUDIO ELK LEWD LIBRARY`，含购买证明、限制独立录音再分发等文字。它与当前作品页面的 CC BY-SA 声明不是同一文本；不能把这份 PDF 错标为 CC，也不能假装未发现差异。PDF 与提取文本都已留存。

本轮四个独立作者切片的使用依据采用当前页面的作品专属 CC BY-SA 授权，并保留上述证据；音频作品与其改编按适用的 CC BY-SA 条件署名、说明改动、提供许可，不把它错误地扩大成整个项目源码必须使用相同许可证。不能因当前页面许可宽松，就改写 ZIP 内旧文本或冒称作者另行确认过。试听中应称它们为作者切片而非未经处理的 RAW；完整 RAW／CLEANUP 只作为本地上下文核查材料，sampler 不进入正式音源候选。

### 检索／传输方法：避免大包与过期误判

- 作者完整 ZIP 是 693,301,050 字节（页面约 661 MB），本轮**没有完整下载或完整解压**。
- 正常匿名免费下载页可取得文件链接；实际对象存储支持 `Range`，本轮已观察到 HTTP 206 与准确的 Content-Range。
- 采用成熟工具 [python-remotezip](https://github.com/gtsystem/python-remotezip)，版本 **0.12.6**，读取目录后只取上表七个成员，标准 ZIP 解码同时校验 CRC。
- 作者给出的对象存储签名链接只有 **60 秒**有效。首次目录探测后的后续 403 是已过期链接；重新经过同一正常匿名入口立即取件成功。它不是不支持 Range，也不能以此为由无边界重试旧链接。
- 临时取件程序 `extract-audioelk-belt.py`、依赖与缓存都在 D 盘任务缓存。临时签名 URL／会话页不应进入仓库。复现时从作者正常入口重新取得链接，不能把已失效签名写成长期下载地址。

### 为什么目前只推荐用于皮扣听审

曲目表的皮带确有 RAW、CLEANUP、两个话筒版本、独立 handling／impact 切片。但曲目没有细述每个切片是否轻弯、针框接触或大力拉带；需要从完整 RAW 和独立片段听出，不根据名称硬配。

纸张只有 RAW／CLEANUP、CRUMPLE、HANDLING、TEARING，没有明确卷起／展开动作。**不将它的纸张目录当成新的纸膜卷展方案，不为凑齐材料再获取揉纸声。**

## 3. 路线 B：先听专业专门库，再决定是否一次买断（未购买）

### Eiravaein Works — Quirboilly，皮革与金属附件专门库

- 作者购买与直接试听页：<https://eiravaein.com/products/quirboilly>
- 直接试听入口是作者页内 SoundCloud：<https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/679672751>
- 作者曲目表：<https://cdn.shopify.com/s/files/1/0241/5857/files/Quirboilly_Tracklist.pdf?2834=>
- 本次作者页价格 **US$20 一次买断**，不是订阅。本轮未加入购物车、未购买。

这套库针对皮革与金属附件的亲密细节，而不是泛化衣物/UI；作者说明实际操作带金属扣、铆钉、扣件的皮革物件，包含轻微与强烈动作。它有可解释的器物／表演分类，优于默认反复使用一条有损解裤带录音。

实际曲目表存在：

- 大件粗皮／黄铜附件的 `unbuckle,remove,gather,slide,scuffing`，约 6 秒。
- 同类的 `gather,bundle,rollup,dense,soft`，约 3 秒。
- 小件光滑皮革／轻金属分类，以及按轻触、释放、移动等区分的独立片段。

但它也含拉链、晃动、掉落、标签串响与大件操作，不能整套混入小卷轴。应听作者 demo，并对照曲目选出小尺度、受阻尼、无拉链／过重晃响的片段；若 demo 无法说明目标动作，不因为库专业就直接买。

**规格边界：**作者页列 538 WAV、192 kHz／24 bit／mono，提供的 PDF 条目则列 96 kHz／24 bit／mono；未购买原件，不能声称已核验哪一版交付。正式授权使用范围以购买时适用许可为准。受限商业 demo 只做试听，不能下载后当作可发布生产素材。

### 纸张小库与现有付费路线为何还没有被推荐购买

- [344 SFX — The Foley Vault: Paper](https://www.asoundeffect.com/sound-library/the-foley-vault-paper/) 是成熟实体 Foley 场、MKH50、15 个文件的小库，但已公开曲目多为纸张持拿、皱折、掉落、桌面动作；不因 96 kHz／24 bit 或电影背景就当成柔软卷展。无需为当前目标盲买。
- [The Foley Vault: Leather Movement](https://www.asoundeffect.com/sound-library/the-foley-vault-leather-movement/) 也是专业小库，可作为皮革质感对比，却未核实薄旧皮带／针框具体表演。页面在不同访问中出现 `$0`、不同促销价，不能把异常 `$0` 当免费授权。
- [Parched](https://sonniss.com/sound-effects/parched/) 含多纸种、近距离录音与独立动作，但主要是写、揉、折、撕、抖。当前没有核实到精确柔软连续卷展；不以买整库代替动作审查。
- [Sound-Fishing 古地图／羊皮纸卷展](https://www.soundfishing.eu/sound-effect/antiquity-medieval) 有明确 roll/unroll 的专业商业条目，可在作者页逐个试听；原 WAV 为 Premium，尚未核实柔软声底，未取得原件或可靠单件报价，不假定其一定更合适。

结论是：本轮找到一条可立即用原件听审的免费皮带路线，以及一条有针对性的 US$20 专业皮革／金属库路线；**尚未找到并听审通过可以推荐购买的柔软纸膜卷展源**。纸源空缺应如实保留，不以失败素材处理填补。

## 4. 收敛后的下一步

1. 原音试听先比较 Audio Elk 的三个 handling、一个 impact 与 RAW/CLEANUP，不加音乐、不用动态包络隐藏缺陷，不把 impact 预先标成“针落框”。
2. 只有听出具体可用的材质与动作后，才对齐皮扣动画。保留既有 A/B 页皮扣基线供比较。
3. 商业 Quirboilly 先听作者受限 demo；可用与授权购买是两个独立事实，本轮只完成前置调研，不擅自采购。
4. 纸卷继续保持未选定新原音的状态；不靠复制随机颗粒、削高频或压缩把硬揉声伪装成柔膜。

本文与缓存清单不构成材质听审批准，也不构成作者已为本项目录制的声明。
