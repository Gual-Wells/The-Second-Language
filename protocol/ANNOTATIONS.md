# 逐义真实语境单正文编码

2026-10-27尚未冻结的新章使用FORMAT:usage-context-v1，authoringPolicy:authentic-context-v1；语义见AUTHENTIC_CONTEXT，制作见TEACHING_AUTHORING。旧冻结/已发布原件保原读路，从其protocolCommit或切换前Git版本回查，不改旧声音身份。唯一执行实现为web/usage-context.js和web/teaching-units.js，protocol/usage-context.mjs重导出供Node/Worker使用；web/annotations.js分版本解析。

新正文没有PART或额外文章区。示意：

```md
<!-- FORMAT:usage-context-v1 -->
<!-- WORD:W001 -->
# adapt

**词源**：实际说明。

<!-- USE:U001 -->
## adapt /əˈdæpt/ v.
`双教材一次完整融合解释；语域、对象限制、句法、搭配与区别在这里讲清。`

<!-- CONTEXT:C001 USE:U001 KIND:abridgment -->
<!-- CONTEXT_META:{"title":"必要短标题","sourceUrls":["https://实际原文"],"displayContext":"必要时间或场景"} -->
<!-- SENTENCE:S001 USE:U001 -->
One actual complete English sentence.
<!-- SENTENCE:S002 -->
Another sentence needed for the same context.
<!-- TRANSLATION:C001 -->
整份语境的一块连贯译文，可有自然段。
<!-- END_CONTEXT:C001 -->

```

WORD、USE、CONTEXT、SENTENCE各自身份唯一，字母开头，字母数字/下划线/连字符，最长32字符。词头字典序；词形、音标、词性和一次完整解释按CONTENT。多词形编码为`form /IPA/ POS; form /IPA/ POS`，共享标题解析函数parseTeachingHeading。旧版末尾音标语法继续只读兼容。词源不新增USE、不点读。各USE先完成全部融合解释再放语境，例后不补讲；不能在USE标记与实际标题/释义之间插入块。

CONTEXT关联真实所选教学用法，kind仅abridgment/excerpt/example；元数据含title、sourceUrls、displayContext，可选speakers对象（如S001映射真实发言者）。JSON仅为数据。URL须无凭据HTTPS；真实缩编/摘录必须有来源，纯教学例句可空，不伪称真实出处。

英文按完整句给SENTENCE身份，真正使用目标义才列USE，承接句可无USE。一份语境可多句、多段和明确说话者。句身份服务整句点读/长按/词双击，不表示句译。每context只有一处TRANSLATION至同ID END_CONTEXT的整块译文，不采用旧等宽逐句译或sentence.translation。

每真实用法最终1–5份，3不是最低数或自动填充目标。多份的独立增量、实际候选取舍放私有contextChoices，不展示审核表，不强造候选三类。

## 自然共享

共享只允许自然发生，不主动追求。另一用法旁可引用已定义语境：

```md
<!-- CONTEXT_REF:C001 USE:U002 -->
```

原CONTEXT需声明U002且英文某句真用该义。可前向引用，但最终须有定义；每个所选(use,context)均须就地出现，不靠远处元数据算完成。同一(use,context)不得重复显示。refs只标实际教学关联，不标所有偶然词形。新独立语义分支独立USE，不机械拆旧ID或为减少材料合并区别。

## 译文与交互

完整融合解释→选中英文语境→整块译文，单正文就地读，不跳旧第二/第三部分。每份译文位置始终保留、默认马赛克隐藏，点击显露/再隐藏，保持几何高度；不显示显隐提示字或原生title提示。状态按稳定账户、章节digest、context ID持久，共享对象同步，换用户/版本隔离。可靠身份缺失或本机存储失败时只保本次内存状态，不落跨用户通用键；隐藏译文不能经复制、选择或无障碍名称泄漏。无全局译文模式开关。

保蓝银美学、纯净、定位和答疑。只语境完整英文句可点读；标题、定义、来源说明、中文不合成。长按句子、双击句内词及非英文区域纯净手势沿READER_INTERACTION，译文按钮独立消费点击，不误触点读/纯净。真实新闻标题若被选为完整语境句，可正常点读，不与导航标题混淆。

正文不绘制逐份来源／类型／导语附层；处理身份、必要署名和出处在已有参考／许可及私有证据保留，不把原文作者署成缩编作者。真实条件由恰当选段保真，不靠删说明改变事实。完整读件/删改在建设材料。来源包contexts与正文的id、kind、sourceUrls精确对应；URL/记录存在不证明读懂或语义通过。按BALANCES核对资源，不把模拟验收说成真机或学习效果验证。
