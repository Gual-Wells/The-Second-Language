# 逐词教材与真实语境制作工具

2026-10-27起尚未冻结的新运行采用 AUTHENTIC_CONTEXT：`authoringPolicy=authentic-context-v1`，正文 `FORMAT:usage-context-v1`。50主词、完整双教材/真实词族/全义、gpt-6.1-sol/ultra、05:00开始、默认休息和音频空选配保持。工具只固定原件、装配和结构检查；候选比较、释义、缩编和语义审阅由Codex完成。

已冻结selection没有authoringPolicy或为sourced-collection-v1，继续其原三部分合同及作者稿，从原protocolCommit或切换前Git版本恢复；不静默升级、重选、重标。以下为新默认。

## 固定完整教材

prepare-vix固定VIX、教材、词源；feedback-snapshot保存原目标/反馈及learnerBaseline，已有快照只复用。冻结前候选范围仍是`mainWords:[{text,family:[{text}]}]`。

```sh
node scripts/prepare-teaching-materials.mjs DATE --scope=work/runs/DATE/candidate-scope.json
node scripts/prepare-teaching-materials.mjs DATE --additional=work/runs/DATE/additional-terms.json
```

additional如`{"compensate":["compensatory"]}`只表示补查意图，不自动认词族或标注。逐主词、每个实际派生和必要引用独立查询两书，再实际先读完整Collins、后Oxford；精确标题无命中须查拆行、同名组及交叉引用，不从旧不完整lookup筛选冒充补查。

材料实存在D盘`teaching/materials/<SHA>.json`且不可覆盖，materials.json记录原输入和独立查询。materialDigest、条目excerptDigest、教材digest实际核对。该材料manifest的sourced-collection-v1属于既有取得合同，不代表新作者稿仍用三部分。材料变更后实际复核受影响稿件，不只换摘要。

`□/◊`只是原例定位候选，可能有片段、重复、标签或非本族内容；回到完整条目判断。全部相关原例及去向仍可回查，新默认不要求全部展示。选择的是完整词族全义，不是新闻命中子集。

## 冻结与作者稿

读清全义后、冻结前将`authoringPolicy:"authentic-context-v1"`同studyDate、vixInputCommit、vixMarkLabel和50主词/实际family一起保存。不能在旧冻结selection追加该字段。原时点prepare-vix-marking/mark-vix/publish-vix，原副本/标签/回执和未知计费保护不变。

每词权威文件仍为`teaching/authored/word-W001.json`，新稿不含partTwo，不以articles.json为权威。形状示意：

```json
{
  "wordId":"W001", "text":"adapt", "materialDigest":"真实材料摘要",
  "partOne":"<!-- WORD:W001 -->\n# adapt\n\n**词源**：实际说明。\n\n<!-- USE:U001 -->\n## adapt · 适应 /əˈdæpt/\n`融合核心义`\n\n必要限制。\n\n<!-- CONTEXT_SLOT:U001 -->\n\n其余语法、搭配和区别。",
  "contexts":[{
    "id":"C001", "kind":"abridgment", "uses":["U001"],
    "title":"必要短标题", "displayContext":"必要时间或情境", "sourceUrls":["https://实际原文"],
    "paragraphs":[[{"id":"S001","text":"Actual complete English sentence.","uses":["U001"]}]],
    "translation":"整份连贯中文，可有自然段，不逐句配对。",
    "sourceEvidence":[{"url":"https://实际原文","readRecord":"真实读件路径","locator":"原段页行","senseEvidence":"实际目标义及结构依据","changes":"保留删改及限定","publicationBasis":"本版本用于该种摘抄或改编的实际依据"}]
  }],
  "contextChoices":[{"useId":"U001","contextIds":["C001"],"reason":"实际取舍理由"}],
  "sourceCoverage":[{"sourceId":"实际教材条目ID","disposition":"实际内容/标签/区别去向或具体排除理由"}],
  "exampleCoverage":[{"exampleId":"实际原例候选ID","uses":["U001"],"disposition":"选到何语境，或原件留存而未胜出的具体理由"}]
}
```

示意占位不能作为成稿。context.kind仅abridgment/excerpt/example。纯教学例句用sourceUrls及sourceEvidence空数组，并写fallbackReason；若声明实际采用URL，例句也须相应来源证据。英文paragraphs按自然段，每完整句唯一id，可带speaker；真实目标义才给uses，承接句可空。禁止sentence.translation，中文只写一份context.translation。

每个真正教学用法最终1–5份。3只是各份有充分独立增量时的甜区，不是目标。多份须choice.contributions逐份`{contextId,reason}`说明不可替代的学习增量，否则只取1份最佳。可选candidates只记录实际候选id和decision，不强凑三类/数量，最终5份上限不是检索配额。

partOne只放讲解和每USE唯一CONTEXT_SLOT；禁止夹入已装配CONTEXT、REF、句子/译文绕过作者证据。插槽位于完整标题/核心义/必要限制后，其余说明前。新真实语义分支独立USE，不按“或”机械拆旧身份。

自然共享可以只定义一个context被几个真实用法选择，工具在其他位置输出CONTEXT_REF；每个(use,context)均要就地呈现，同一位置不重复。refs只列实际采用教学关联，不把偶然出现的目标词全挂上。不得主动找共享、合并题材或考核复用率。

## 装配和封存

```sh
node scripts/assemble-teaching.mjs DATE
```

核原selection、不可变材料、全部词条/用法身份、原条/原例去向、语境及选择；输出teaching/chapter.md和teaching/context-sources.json。不发布、不标VIX、不调用声音。漏译、1–5越界、多份缺增量、无来源、重复身份/插槽/局部REF、未知USE或共享缺就地引用都会拒绝。工具不认证词义/自然度/真实收益。

按QUALITY_WORKFLOW实际语义审阅后采用同源chapter.md。meta保留contentPolicy:etymology-fused-v1与sourcePolicy:current-affairs-v1，并设置authoringPolicy:authentic-context-v1。source-notes.contexts采用导出索引，URL绑定实际readRecord、自写事实及边界，不用articles数组。

```sh
node scripts/pack-current-affairs.mjs DATE work/runs/DATE/source-notes.json
node scripts/pack-chapter.mjs DATE
node scripts/publish-chapter.mjs DATE
```

正文必须逐字来自作者稿装配。首次封存逐context实际验证作者sourceEvidence.readRecord，采用URL一一对应，原件readDigest须与封存来源相同；网址相同不足以证明同版原文。pack-chapter核固定证据与当前同源作者稿，原文取得缓存可不再存在。正文/来源分别摘要、OneDrive原件回读再发布，D1只存轻量引用。不将新闻全文放公开Git/正文；新旧格式不靠空PART壳混装。中断只续缺项，具体写resume，不重选/重标/重做成功收费资产。

2026-10-30起，pack-current-affairs自动生成chapter-evidence-v1私有包，将实际采用原文、读取凭据、已有原HTML、完整材料、原例去向及取境记录按正文/运行/选择摘要固定。publish-chapter先永久上传并回读，再提交正式章节，读者来源页只得到evidenceDigest。恢复不访问旧凭据中的绝对路径，当前作者去向改变不能沿用旧证据；语义与实际采用权仍须正常核对。旧同正文来源包不可静默改绑，缺失原件不能靠重新抓取伪造历史。

验证入口：check-usage-context-authoring、check-usage-context-packaging、check-usage-context-backend、check-context-reader。结构与浏览器仿真不能证明语义正确、用户已掌握或物理iPhone体验。全部新增数据实存D，任务末尾按BALANCES核查；休息、独立雅思/答疑/测试/认证/卷轴及计费保护继续。
