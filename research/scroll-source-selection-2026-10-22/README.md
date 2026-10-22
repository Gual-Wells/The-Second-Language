# 卷轴拟音：恢复皮扣参照，先重新选择原音

2026-10-22。工作基线 `318f9e9e2ecaad964c3fb0364c4883765c62f2e5`，branch `codex/project-commemorative`，本轮开始前工作树干净。

## 用户纠正与本轮范围

用户否定轻卷展声，指出根本音源差；皮扣本来相对可用却被静音，又要求皮扣同样改善材质与动作贴合。最新明确恢复参照是**上一轮 A/B 试听页**，不是生产v41或早期v12的声音。这条回答覆盖上一轮规程中错误扩大为“扣具全静音”的解释。

- A/B 代码／证据固定在 `466132c8191a7f6f37d417fd76d330ab8bc54c3a`，不可变预览为 <https://944d6c23.the-second-language.pages.dev/labs/scroll-foley-study/>。
- 只恢复其皮扣十条WAV、原切片／增益、机构阶段与接触调度；纸声全部停用，不把静音冒称修复。`keeper-reference.js`来源明确，未重新加工参照。
- 纸张、正文、madeAt／内容码、三维机构、动画、皮革铜件做旧和雾保持原件。生产主站未用研究候选替换。
- 新源先独听，确认实际材质后才剪辑并接到阶段；本轮不再把失败纸源反复低通／压音量作为新成品。

## 新资源与实际取得

详见[source-research.md](source-research.md)。采用作者明确的实体道具录音新路线，实际从 Audio Elk 官方匿名免费包按 HTTP Range＋成熟 RemoteZip 定向取件，避免整包661MB下载。没有付款、注册、复用旧Token或新增订阅。

独立试听区放3条皮带handling及1条impact的**作者WAV原件**，共2,146,678字节，未由本项目处理；作者的RAW/CLEANUP完整141.9秒录音在D缓存保留供上下文复核。不是把综合sampler当单一道具原音。实际交付为16-bit/48kHz单声道，与宣传24-bit不同，按文件真实头记录。

授权采用当前作者页针对本作品的明确CC BY-SA4.0声明，署名／链接／改动说明与资产一起保存；包内旧的通用商业PDF内容不同，已在证据中明确，不将其伪写成CC。独立音频许可不改写项目代码许可。来源／成员／字节摘要与可重复制备入口：`web/labs/scroll-foley-study/source-auditions.json`、`sources/audioelk/licensing-evidence.json`、`scripts/prepare-scroll-source-auditions.mjs`。

**尚未找到适合的纸卷新原音。**该库纸张只有揉、拿、撕等动作，不以标签含paper就集成。额外专业库虽有原速unbuckle录音，但不购买整库来赌纸卷适配；具体曲目与限制保留在资源研究。

## 可调用的听音辅助与边界

实际匿名调用 NVIDIA 官方 Audio Flamingo Next，对原A/B公开CC0录音、新AudioElk第13条各做一次独立盲提示，以无材质语义的文件名上传，未将前次返回加入后次提示。两次都成功返回声音描述，但没有明确辨认皮革／解扣，且措辞较泛化。这说明当前有可操作的辅助听音途径，也说明其细材质判断具体性有限；同一模型两次调用不是独立共识，不能代替人耳验收。输入SHA、提示词和实际返回见[原A/B盲听](af-next-anonymous-blind-audition.json)、[新原音盲听](af-next-audioelk-blind-audition.json)。它未接收画面，未做视听同步审核，不经项目学习答卷服务，不发送用户私有录音。采用官方非商业研究演示作辅助，未把此受限模型接成产品服务。

## 恢复核验与当前前沿

`scripts/verify-scroll-keeper-reference.mjs`在真实Chromium手机视口／WebAudio核对十份WAV与`466132c`逐字节一致，开／合每条机构cue恰一次、原gain／rate1／不循环、纸阶段无声、真拖／停手／反向、退出清理以及未变画面／机构。开合录音是实际页面输出的Opus捕获再解码WAV，不是母带或真实iPhone听审。结果在`verification.json`，艺术／听感认可明确为false。

新原音试听与动画／音乐互斥，原件不自动播放、不预下载；原音试听后需真实点击回到参照，不晚到补响。研究页允许独听／合听控制，正式产品仍保持默认声音且无声音设置。

新增独立检查 `scripts/verify-scroll-source-auditions.mjs`，报告`source-auditions-verification.json`：四份原件本机／实际HTTP字节与SHA相同、浏览器解码时长一致，初载无原音请求，native播放器实播与动画／音乐互斥，切回参照重置原音，退出释放正常。393px整页无横向溢出、无HTTP／脚本错误。后台与离场事件为合成事件检查，不冒称真机切后台。`source-auditions-iphone.png`是实际整页截图，待点击的播放器因`preload=none`显示0:00，不是解码失败，原时长另有文字。

下一步按实际试听筛掉粗硬、桌擦／拿放及不合机构的take，再按真实卸力、脱孔、退尾、滑离、针框轻触剪辑。纸卷必须先有适合柔膜卷展的原件或录制方案；尚未完成不能称整个拟音已修好。发布与实际回读见`release.json`。
