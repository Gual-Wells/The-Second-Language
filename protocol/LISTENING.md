# 第四部分听力建设与交接

从 EXPRESSION.md 的有序 skills 读取申请，仅在包含 listening 时建设。申请在 profiles.listening 明确选择 full 或 mini，详见 PRACTICE_SIZES.md；两者均正式长期保存。full 四段四十题，mini 四段二十四题并覆盖完整题型、平均及以上难度。测试只走隔离数据；不建立专项训练入口。来源为申请时固定的第一章至最新章，当前焦点章显著优先，题面不设用词配额。

## 内容与声音

四段分别建设日常对话、日常单人讲话、教育/培训讨论和学术单人讲话；full 每段十个计分空位、总题号 1–40，mini 每段六个空位、总题号 1–24，答案证据按材料时间顺序出现。对话人物必须可辨认，单人材料保持同一主声音。题文、说明、字数/数字限制、多选数量及图示必须清楚且相互一致。原创新场景，不把已经读过的第三部分文章直接当作模拟考试脚本。

先用官方形式提出场景和候选，建设连贯材料与题组，逐题留下唯一答案、允许写法、发言证据、自然转述、干扰项不成立理由及顺序关系。先反向寻找其他成立答案，再冻结材料与题面。资料不足时修改题目，不补造答案证据，不用专业背景或机械堆高级词提高难度。中间文档自由保存在 `work/expression/<request-id>/listening/`，注意力集中于内容建设和下一步，而非维护长聊天上下文。

主声音为本人短试听通过的 Microsoft MAI-Voice-2.1 / Harry；其他人物选支持列表内可辨认的音色，完整对话需核对后使用，不把目录存在视为音色已验收。Aura-2 Apollo 优先用于口语考官问句，不静默替代听力声音。

按自然段或连续发言建立片段身份，通过 Cloudflare 合成；同一人物声音固定。数字、字母、否定、单复数及所有答案邻近区域是关键核对点。片段不是最终播放材料；加入读题、段间及检查时间后组装四段最终 MP3，全文不再逐句额外插入停顿。总长度按正常速度及真实读题时间full 接近官方完整约三十分钟，mini 约十八分钟，不靠异常语速凑时长。末段结束后读者有检查答案时间；当前个人训练允许主动提交，不伪称监考软件。

## 可运行命令与数据

1. `node scripts/practice-job.mjs claim <request-id>` 领取；读取 claim.json 中 skills、固定来源，继续已有材料。
2. 写 `audio-plan.json`：`setId`、`segments`（id、text、purpose=listening、voice）；`assemblies`（最终 id、initialSilenceSeconds、segments）。组装条目包含片段 id、scriptId、speaker、translation、gapAfterSeconds；编号不得复用到不同内容。
3. `node scripts/practice-audio.mjs synthesize audio-plan.json`。本机只发控制和回收文件，OpenRouter / Workers AI 调用均在 Cloudflare。返回不为 ready 时停止；不要换 ID 自动重付未知结果。
4. `node scripts/practice-audio.mjs assemble audio-plan.json`。已有 ffmpeg 解码到 24 kHz 单声道 PCM，按实际样本数建立发言区间，添加停顿后编码 MP3，上传最终资产。产物和 cues 位于忽略的 `.cache/practice-audio/`。
5. `node scripts/practice-audio.mjs verify audio-plan.json`。Cloudflare Whisper 全量转写最终文件，保留原始结果。本地读取核对答案区域、全文忠实度和切点；转写与题文一致不等同所有发音/长文自然度通过。必要时用户试听或已有声音模型辅助核对。
6. 定稿 set.json，`format` 为 `ielts-v2`，profiles 与申请逐项一致，questions 为所选写作/口语题（听力单科为 []）；`listening` 含四个材料对象。然后 `node scripts/practice-job.mjs publish <request-id> set.json`。发布前检查文字、音频、答案与来源版本对应，不能为凑发章略过不确定题。

每题额外记录 family、groupId、instructions、difficulty、difficultyReason，family 使用 web/exam-spec.js 的完整题型目录；mini 不能遗漏目录或申报 lower。共享题面 stimulus.text，表格用 headers/rows，流程图用 steps。真实题面及图表须完整可读，不能以题型名称冒充内容。

材料对象：`id,title,instructions,audioId,script,questions,keys,links`，图示题另有 visual。script 的每个发言有 `id,speaker,text,translation,start,end`，时间来自实际组装；keys 的每题有 `id,accepted,explanation,evidence`，证据为发言编码列表。题面只保留以下字段，隐藏答案不得塞进题面或选项的附加属性。

- 填空：`id,number,type=gap,prompt,maxWords,allowNumber`；允许答案写法在 keys 中明确列出，不做模糊拼写放行。
- 单选/配对：`type=single|matching`、options（id/text）；每题一个计分空位。
- 多选：`type=multi,answerCount`；number 为这组的起始题号，连续占 answerCount 个计分空位；答案集合不要求顺序，数量及重复选择不合规时该组不计分。
- 图示：`type=diagram`、选项列表；材料 visual 有 title、width/height、areas（id/label/x/y/width/height）、routes（points 坐标列表）。图示、方向和答案位置须实际核对，适配锁定缩放的 iPhone，不用原始 SVG 字符串拼出脚本注入。

links 自然关联申请快照中的章节；有真实 USE 则填 useId。无需每个空格强配一个词义。编号全套唯一，版本发布后不覆盖；纠正题面/音频/答案须新版本，旧尝试绑定旧材料。

## 作答与分析

题面、图表、选项始终可见，脚本、译文、答案及解析提交前不向客户端下发。测验正常速度依次一次播放；精听允许回听、慢放和主动揭示。来电、退出或故障保存位置与草稿，恢复后标记中断；首次成绩与重答分别保存，不覆盖。已做过材料的后续尝试标为已练过，不能冒充首次条件。当前为个人训练，客户端播放记录不是防作弊认证。

后端确定性判分，保留原始答案、允许写法、词数限制、题号、证据和已用辅助条件；每题一分（多选按计分空位），full 满分四十、mini 满分二十四。题目或音频缺陷优先视为内容问题，不苛责本人。正确数不直接认证 IELTS band；教学引导朝 7.5 方向，但听力答案并无“7.5 范文”。

`node scripts/practice-job.mjs listening-claim` 取得逐题答案、判分、条件、完整脚本、音频身份和来源；Codex 区分确定的错误与推测原因，给出有依据的解释、少量优先改进点和 nextStep，不单凭一次填错断言声学问题。`listening-complete <attempt-id> review.json` 提交 summary / priorities / nextStep 等反馈。PWA 支持答案发言回听、原文与译文、章节 USE 回链；不建立专项训练申请。

## 私有资源、额度与续作

当前独立 PRACTICE_MEDIA KV 为可运行私有音频存储，每个 MP3 最大 20 MiB；整套分四个独立资产，历史长期保存，不走 48 小时临时页销毁。登录同域读取、Range 支持、no-store，不内嵌音频 base64，不混入日课 KV。R2 适配已预留 PRACTICE_R2；账户尚未启用 R2，不把它作为现阶段不可绕过的部署前提。长期容量接近账户上限时再迁移，相同摘要不重合成。

OpenRouter 与原声分析共用钱包。waiting_credit 时保留全部成稿与成功片段，北京次日核对充值后继续，不自行付款；权限/地区错误与余额不足分别处理，未知收费结果不自动重试。允许声音迟些完成，已发布日课与其他无依赖练习继续；本练习册所选组件仍须完整后发布，不把未有音频的听力标成完成。
