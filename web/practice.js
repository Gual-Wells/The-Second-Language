import {practiceWorkspace} from './practice-workspace.js?v=28';
import {speakingRecorder} from './recorder.js?v=28';
import {createReading} from './reading.js?v=28';
import {createListening} from './listening.js?v=28';
const $ = id => document.getElementById(id);
const node = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text != null) element.textContent = text;
  return element;
};
const dateLabel = value => value ? value.replaceAll('-', '.') : '';
const partLabel = part => ({'reading-1':'阅读 Passage 1','reading-2':'阅读 Passage 2','reading-3':'阅读 Passage 3','listening-1':'听力 Part 1','listening-2':'听力 Part 2','listening-3':'听力 Part 3','listening-4':'听力 Part 4', 'speaking-1': '口语 Part 1', 'speaking-2': '口语 Part 2', 'speaking-3': '口语 Part 3', 'writing-1': '写作 Task 1', 'writing-2': '写作 Task 2' })[part] || part;

export function createPracticeUI({ api, toast, showDialog, getContext, openSource }) {
  let workspace=null,currentSet = null, list = { sets: [], active: null };
  const listeningUI=createListening({api,toast,openSource,pauseOthers:()=>{for(const audio of players)audio.pause();for(const r of recorders)for(const a of r.querySelectorAll('audio'))a.pause();}});let listeningCard=null,readingCard=null,clockInterval=null;const speakingTimers=new Set();const recorders=new Set();const players=new Set();
  function clearClocks(){for(const timer of speakingTimers)clearInterval(timer);speakingTimers.clear();clearInterval(clockInterval);}
  function disposeRecorders(){for(const r of recorders)r.dispose();recorders.clear();}
  function stopAudio(except){listeningUI.stop();for(const a of players)if(a!==except)a.pause();for(const r of recorders)for(const a of r.querySelectorAll('audio'))if(a!==except)a.pause();}
  const readingUI=createReading({api,toast,openSource});
  const listPanel = $('practiceListPanel'), detailPanel = $('practiceDetailPanel');

  function requestState() {
    const { chapters, current } = getContext();
    const focus = current && !current.kind ? chapters.find(chapter => chapter.id === current.id) : null;
    const latest = [...chapters].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
    const chosen = focus || latest;
    $('practiceScope').textContent = chosen ? `覆盖第一章至 ${dateLabel(latest.date)}，重点阅读 ${dateLabel(chosen.date)} · ${chosen.title}` : '正式章节发布后可申请';
    $('practiceRequestButton').disabled = !chosen || Boolean(list.active);
    $('practiceRequestStatus').textContent = list.active ? `练习册正在${list.active.status === 'building' ? '建设' : '等待建设'} · ${dateLabel(list.active.focusChapterId)}` : list.stopped ? `${list.stopped.reason==='credit'?'额度不足，':'上次'}建设已停止；已有材料保留。` : '';
    return chosen;
  }

  async function refreshIndex() {
    const params = new URLSearchParams();
    for (const [key,id] of [['q','practiceSearch'],['kind','practiceKind'],['chapter','practiceChapter'],['status','practiceStatus']]) {
      if ($(id).value) params.set(key,$(id).value);
    }
    const { questions } = await api(`/api/practice/index?${params}`);
    const panel = $('practiceIndex'); panel.replaceChildren();
    if (!questions.length) panel.append(node('p','practice-empty','没有匹配的题目。'));
    for (const item of questions) {
      const button = node('button','practice-shelf-item'); button.type = 'button';
      button.append(node('strong','',`${partLabel(item.part)} · ${item.setTitle}`),
        node('small','',`${dateLabel(item.focusChapterId)} · ${item.lastStatus === 'reviewed' ? '已反馈' : item.lastStatus ? '待批改' : '未作答'}`),
        node('span','',item.prompt.slice(0,130)));
      button.addEventListener('click', () => openSet(item.setId,item.id)); panel.append(button);
    }
  }

  async function refresh() {
    list = await api('/api/practice');
    const shelf = $('practiceList'); shelf.replaceChildren();
    if (!list.sets.length) shelf.append(node('p','practice-empty','尚无雅思练习册。申请后会在这里长期保存。'));
    for (const set of list.sets) {
      const button = node('button','practice-shelf-item'); button.type = 'button';
      button.append(node('strong','',set.title), node('small','',`重点章 ${dateLabel(set.focusChapterId)} · ${new Date(set.createdAt).toLocaleDateString('zh-CN')}`), node('span','',`${Object.entries(set.profiles||{}).map(([k,v])=>`${k==='listening'?'听力':'阅读'} ${v==='mini'?'微缩 24 题':'完整 40 题'}`).join(' · ')}${set.introduction?' · '+set.introduction:''}`));
      button.addEventListener('click', () => openSet(set.id)); shelf.append(button);
    }
    const chapterSelect = $('practiceChapter'), chosen = chapterSelect.value;
    chapterSelect.replaceChildren(node('option','', '全部章节'));
    chapterSelect.firstChild.value = '';
    for (const chapter of [...getContext().chapters].sort((a,b) => b.date.localeCompare(a.date))) {
      const option = node('option','',`${dateLabel(chapter.date)} · ${chapter.title}`); option.value = chapter.id; chapterSelect.append(option);
    }
    chapterSelect.value = chosen;
    requestState(); await refreshIndex();
  }

  function showList() { workspace?.dispose();workspace=null;clearClocks();disposeRecorders();stopAudio();clearInterval(clockInterval);listeningCard?.dispose();listeningCard=null;readingCard?.dispose();readingCard=null;currentSet = null; detailPanel.hidden = true; listPanel.hidden = false; }

  async function openSet(id, questionId) {
    try {
      currentSet = await api(`/api/practice/sets/${encodeURIComponent(id)}`);
      workspace?.dispose();clearClocks();disposeRecorders();stopAudio();listeningCard?.dispose();listeningCard=null;readingCard?.dispose();readingCard=null;players.clear();
      listPanel.hidden = true; detailPanel.hidden = false;
      $('practiceSetTitle').textContent = currentSet.title;
      $('practiceSetIntroduction').textContent = currentSet.introduction;
      $('practiceSourceCount').textContent = `第一章至申请时共 ${currentSet.sources.length} 章 · 焦点章 ${dateLabel(currentSet.focusChapterId)}`;
      const questions = $('practiceQuestions'); questions.replaceChildren();
      listeningCard=listeningUI.render(currentSet);if(listeningCard)questions.append(listeningCard);readingCard=readingUI.render(currentSet);if(readingCard)questions.append(readingCard);
      clearInterval(clockInterval);
      if(currentSet.questions.some(q=>q.kind==='writing')){const bar=node('div','practice-clock writing-clock'),label=node('span','', '写作 · 两个 Task 共 60 分钟'),start=node('button','bevel-button','开始计时'),key=`tsl-writing-clock-${currentSet.id}`;start.type='button';let end=Number(localStorage.getItem(key)||0);const tick=()=>{if(end){const seconds=Math.max(0,Math.ceil((end-Date.now())/1000));label.textContent=seconds?`写作剩余 ${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`:'60 分钟已结束 · 保留答案，请提交';} };start.textContent=end?'继续当前计时':'开始计时';start.onclick=()=>{if(!end){end=Date.now()+3600000;localStorage.setItem(key,String(end));}start.disabled=true;start.textContent='计时进行中';tick();};bar.append(label,start);questions.append(bar);clockInterval=setInterval(tick,1000);tick();}
      for (const question of currentSet.questions) if(question.kind==='writing'||question.kind==='speaking')questions.append(questionCard(question));
      workspace=practiceWorkspace({root:questions,set:currentSet,start:!questionId,onLeave:panel=>{for(const r of recorders)if(panel.contains(r))r.pauseForNavigation();if(panel.querySelector('.listening-paper'))listeningCard?.interrupt();}});
      if(questionId){const reading=currentSet.reading?.passages?.some(p=>p.questions.some(q=>q.id===questionId));if(reading){workspace.select('reading');readingCard.focusQuestion(questionId);}else workspace.focus(questionId);}
    } catch (error) { toast(error.message); }
  }

  function questionCard(question) {
    const card = node('section','practice-question'); card.id = `practice-${question.id}`;card.dataset.kind=question.kind;card.dataset.part=question.part;
    const heading = node('div','section-band'); heading.append(node('strong','',partLabel(question.part)),node('span','',String(question.position + 1).padStart(2,'0'))); card.append(heading);
    const body = node('div','practice-question-body');
    const prompt=node('p','practice-prompt',question.prompt);body.append(prompt);
    if(question.presentation?.questionAudioId){const audio=node('audio');audio.controls=true;audio.preload='none';audio.src=`/api/practice/media/${encodeURIComponent(question.presentation.questionAudioId)}`;audio.setAttribute('aria-label','考官提问');audio.className='question-audio';players.add(audio);audio.addEventListener('play',()=>{listeningUI.stop();for(const a of players)if(a!==audio)a.pause();});body.prepend(audio);
      if(question.part!=='speaking-2'){const textButton=node('button','bevel-button','查看提问原文');textButton.type='button';textButton.onclick=async()=>{try{const q=await api(`/api/practice/questions/${question.id}/prompt`,{method:'POST'});prompt.textContent=q.prompt;textButton.disabled=true;}catch(e){toast(e.message);}};body.append(textButton);}}
    const visual=question.presentation?.visual;if(visual?.type==='table'){const caption=node('p','practice-prompt',visual.title),table=node('table','practice-data-table'),head=node('thead'),row=node('tr');for(const h of visual.headers)row.append(node('th','',h));head.append(row);table.append(head);const tb=node('tbody');for(const cells of visual.rows){const tr=node('tr');for(const c of cells)tr.append(node('td','',c));tb.append(tr);}table.append(tb);const wrap=node('div','practice-data-wrap');wrap.append(table);body.append(caption,wrap,node('p','practice-guidance',visual.sourceNote));}
    if (question.guidance) body.append(node('p','practice-guidance',question.guidance));
    if(question.kind==='speaking'){
      body.append(node('p','practice-guidance',question.part==='speaking-2'?'准备 1 分钟，陈述最长 2 分钟，之后按题目做简短跟问。':'本 Part 与考官交流约 4–5 分钟；完整口语约 11–14 分钟。'));
      if(question.part==='speaking-2'){const bar=node('div','practice-clock'),label=node('span','', 'Part 2 · 1 分钟准备 / 2 分钟陈述'),start=node('button','bevel-button','开始准备');start.type='button';let timer=null;card.disposeClock=()=>{clearInterval(timer);speakingTimers.delete(timer);};start.onclick=()=>{clearInterval(timer);speakingTimers.delete(timer);const began=Date.now();start.textContent='重新准备';const tick=()=>{const seconds=Math.floor((Date.now()-began)/1000);label.textContent=seconds<60?`准备剩余 ${60-seconds} 秒`:seconds<180?`开始陈述 · 剩余 ${180-seconds} 秒`:'陈述时间结束 · 继续简短跟问';if(seconds>=180){clearInterval(timer);speakingTimers.delete(timer);}};timer=setInterval(tick,1000);speakingTimers.add(timer);tick();};bar.append(label,start);body.append(bar);}
    }
    const links = node('div','practice-links');
    for (const link of question.links) {
      const button = node('button','bevel-button',`${dateLabel(link.chapterId)}${link.useId ? ` · ${link.useId}` : ''}`);
      button.type = 'button'; button.addEventListener('click', () => { $('practiceDialog').close(); openSource(link.chapterId, link.useId, currentSet.sources.find(source=>source.id===link.chapterId)?.digest); }); links.append(button);
    }
    const sourceDetails=node('details','practice-source-details');sourceDetails.append(node('summary','','相关章节'),links);sourceDetails.hidden=!question.revealed&&!currentSet.attempts.some(a=>a.questionId===question.id)&&!currentSet.speakingAttempts?.some(a=>a.questionId===question.id);body.append(sourceDetails);
    const attemptList = node('div','practice-attempts');
    const attempts = currentSet.attempts.filter(item => item.questionId === question.id);
    for (const attempt of attempts) {
      const block = node('div','practice-attempt');
      block.append(node('strong','',`${attempt.status === 'reviewed' ? '已反馈' : '等待批改'} · ${new Date(attempt.submittedAt).toLocaleString('zh-CN')}`));
      block.append(node('p','practice-answer',attempt.answerText));
      if (attempt.review) {
        block.append(node('p','',attempt.review.summary));
        for (const value of attempt.review.strengths || []) block.append(node('p','practice-review-point',`优点 · ${value}`));
        for (const value of attempt.review.priorities || []) block.append(node('p','practice-review-point',`改进 · ${value}`));
        if (attempt.review.nextStep) block.append(node('p','practice-review-point',`再试一次 · ${attempt.review.nextStep}`));
      }
      attemptList.append(block);
    }
    body.append(attemptList);
    if(question.kind==='speaking'){const recorder=speakingRecorder({question,set:currentSet,api,toast,pauseOthers:stopAudio,reload:()=>refreshCard(question.id)});recorders.add(recorder);card.recorder=recorder;body.append(recorder);}
    const label = node('label','field-label',question.kind === 'writing' ? '我的写作答案' : '文字补充练习（仅分析文字）');
    const input = node('textarea','text-input practice-answer-input'); input.rows = 8; input.maxLength = 20000; input.placeholder = question.kind === 'writing' ? '在这里写下自己的回答…' : '可记下口头练习的文字内容；此项只接受文字维度反馈。'; label.append(input); body.append(label);
    input.spellcheck=false;input.autocapitalize='none';
    const pendingKey=`tsl-answer-pending-${question.id}`,medium=question.kind==='writing'?'written':'speech-transcript';
    let pending=null;try{pending=JSON.parse(localStorage.getItem(pendingKey));}catch{}
    if(pending?.medium===medium)input.value=pending.answerText||'';
    const draftKey=question.kind==='writing'?`tsl-writing-${question.id}`:`tsl-transcript-${question.id}`;input.value=localStorage.getItem(draftKey)??input.value;input.addEventListener('input',()=>{try{localStorage.setItem(draftKey,input.value);}catch{}});
    if(question.kind==='speaking'){const details=node('details','speaking-text-supplement');details.append(node('summary','','补充文字练习'));details.append(label);body.append(details);}
    if(question.kind==='writing'){const counter=node('p','practice-guidance'),draftKey=`tsl-writing-${question.id}`;input.value=localStorage.getItem(draftKey)||'';const count=()=>{counter.textContent=`${input.value.trim()?input.value.trim().split(/\s+/).length:0} 词 · ${question.part==='writing-1'?'Task 1 至少 150 词，建议 20 分钟':'Task 2 至少 250 词，建议 40 分钟'}。提交不足字数的真实答案仍可获得反馈。`;localStorage.setItem(draftKey,input.value);};input.addEventListener('input',count);count();body.append(counter);}
    const actions = node('div','button-row');
    const submit = node('button','primary-button','提交答案'); submit.type = 'button';
    submit.addEventListener('click', async () => {
      if (!input.value.trim()) { toast('请先填写答案'); return; }
      submit.disabled = true;input.disabled=true;
      try {
        const answerText=input.value.trim();
        if(!pending||pending.answerText!==answerText||pending.medium!==medium)pending={id:crypto.randomUUID(),answerText,medium};
        try{localStorage.setItem(pendingKey,JSON.stringify(pending));}catch{}
        await api(`/api/practice/questions/${encodeURIComponent(question.id)}/attempts`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(pending) });
        try{localStorage.removeItem(pendingKey);localStorage.removeItem(draftKey);}catch{}
        pending=null;input.value='';
        toast('已提交，Codex 批改后可在此查看'); await refreshCard(question.id);
      } catch (error) { toast(error.message); submit.disabled = false;input.disabled=false; }
    }); actions.append(submit);
    const reveal = node('button','bevel-button',question.revealed ? '收起参考答案' : '查看参考答案'); reveal.type = 'button';
    const reference = node('div','practice-reference'); reference.hidden = !question.revealed;
    const fillReference = (answer, notes) => { reference.replaceChildren(node('p','practice-answer',answer)); if (notes) reference.append(node('p','practice-guidance',notes)); reference.hidden = false; reveal.textContent = '收起参考答案'; };
    if (question.revealed) fillReference(question.referenceAnswer,question.referenceNotes);
    reveal.addEventListener('click', async () => {
      if (question.revealed) { reference.hidden = !reference.hidden;reveal.textContent=reference.hidden?'查看参考答案':'收起参考答案'; return; }
      try { const result = await api(`/api/practice/questions/${encodeURIComponent(question.id)}/reveal`, { method: 'POST' }); question.revealed = true;sourceDetails.hidden=false; question.referenceAnswer = result.referenceAnswer; question.referenceNotes = result.referenceNotes; fillReference(result.referenceAnswer,result.referenceNotes); }
      catch (error) { toast(error.message); }
    }); actions.append(reveal); body.append(actions,reference); card.append(body); return card;
  }

  async function refreshCard(id){const setId=currentSet.id,next=await api(`/api/practice/sets/${encodeURIComponent(setId)}`);if(currentSet?.id!==setId)return;currentSet=next;const old=document.getElementById(`practice-${id}`),question=next.questions.find(q=>q.id===id);if(!old||!question)return;old.disposeClock?.();if(old.recorder){old.recorder.dispose();recorders.delete(old.recorder);}const fresh=questionCard(question);fresh.hidden=old.hidden;old.replaceWith(fresh);workspace?.refresh();}
  async function open() {
    const { authenticated, demo } = getContext();
    if (!authenticated || demo) { toast('请登录正式阅读器后使用雅思练习'); return; }
    $('practiceRequestToggle').checked = false; $('practiceRequestBox').hidden = true;
    showList();libraryView('library');showDialog('practiceDialog');
    try { await refresh(); } catch (error) { toast(error.message); }
  }

  const library=$('practiceListPanel'),requestSection=library.querySelector('.settings-section'),indexControls=library.querySelector('.practice-index-controls'),indexBand=indexControls.previousElementSibling,shelf=$('practiceList'),shelfBand=shelf.previousElementSibling;
  const nav=node('nav','practice-library-tabs');library.prepend(nav);const libraryParts={library:[shelfBand,shelf],request:[requestSection],index:[indexBand,indexControls,$('practiceIndex')]};
  function libraryView(view){for(const [key,elements]of Object.entries(libraryParts)){for(const e of elements)e.hidden=key!==view;}for(const b of nav.children)b.classList.toggle('active',b.dataset.view===view);if(view==='request'){$('practiceRequestToggle').checked=true;$('practiceRequestBox').hidden=false;}}
  for(const [view,label]of [['library','练习册'],['request','新申请'],['index','查找题目']]){const b=node('button','',label);b.type='button';b.dataset.view=view;b.onclick=()=>libraryView(view);nav.append(b);}requestSection.querySelector('.switch-row').hidden=true;$('practiceRequestButton').textContent='申请练习册';libraryView('library');
  $('practiceBack').addEventListener('click', showList);
  for (const id of ['practiceKind','practiceChapter','practiceStatus']) $(id).addEventListener('change', () => refreshIndex().catch(error => toast(error.message)));
  $('practiceSearch').addEventListener('input', () => { clearTimeout(refreshIndex.timer); refreshIndex.timer = setTimeout(() => refreshIndex().catch(error => toast(error.message)),250); });
  $('practiceRequestToggle').addEventListener('change', () => { $('practiceRequestBox').hidden = !$('practiceRequestToggle').checked; });
  $('practiceRequestButton').addEventListener('click', async () => {
    const chosen = requestState(); if (!chosen || !$('practiceRequestToggle').checked) { toast('请先开启申请'); return; }
    const button = $('practiceRequestButton'); button.disabled = true;
    const size=document.querySelector('[name=practiceSize]:checked').value;
    try {
      await api('/api/practice/requests', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ size,focusChapterId: chosen.id, note: $('practiceRequestNote').value.trim() }) });
      $('practiceRequestToggle').checked = false; $('practiceRequestBox').hidden = true; $('practiceRequestNote').value = '';
      await refresh();libraryView('library');toast('雅思练习申请已保存');
    } catch (error) { toast(error.message); button.disabled = false; }
  });
  $('practiceDialog').addEventListener('close',()=>{workspace?.dispose();clearClocks();disposeRecorders();stopAudio();});
  return { open, refresh };
}
