const $ = id => document.getElementById(id);
const node = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text != null) element.textContent = text;
  return element;
};
const dateLabel = value => value ? value.replaceAll('-', '.') : '';
const partLabel = part => ({ 'speaking-1': '口语 Part 1', 'speaking-2': '口语 Part 2', 'speaking-3': '口语 Part 3', 'writing-1': '写作 Task 1', 'writing-2': '写作 Task 2' })[part] || part;

export function createPracticeUI({ api, toast, showDialog, getContext, openSource }) {
  let currentSet = null, list = { sets: [], active: null };
  const listPanel = $('practiceListPanel'), detailPanel = $('practiceDetailPanel');

  function requestState() {
    const { chapters, current } = getContext();
    const focus = current && !current.kind ? chapters.find(chapter => chapter.id === current.id) : null;
    const latest = [...chapters].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
    const chosen = focus || latest;
    $('practiceScope').textContent = chosen ? `覆盖第一章至 ${dateLabel(latest.date)}，重点阅读 ${dateLabel(chosen.date)} · ${chosen.title}` : '正式章节发布后可申请';
    $('practiceRequestButton').disabled = !chosen || Boolean(list.active);
    $('practiceRequestStatus').textContent = list.active ? `练习册正在${list.active.status === 'building' ? '建设' : '等待建设'} · ${dateLabel(list.active.focusChapterId)}` : '';
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
    if (!list.sets.length) shelf.append(node('p','practice-empty','尚无表达练习册。申请后会在这里长期保存。'));
    for (const set of list.sets) {
      const button = node('button','practice-shelf-item'); button.type = 'button';
      button.append(node('strong','',set.title), node('small','',`重点章 ${dateLabel(set.focusChapterId)} · ${new Date(set.createdAt).toLocaleDateString('zh-CN')}`), node('span','',set.introduction || '口语与写作练习'));
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

  function showList() { currentSet = null; detailPanel.hidden = true; listPanel.hidden = false; }

  async function openSet(id, questionId) {
    try {
      currentSet = await api(`/api/practice/sets/${encodeURIComponent(id)}`);
      listPanel.hidden = true; detailPanel.hidden = false;
      $('practiceSetTitle').textContent = currentSet.title;
      $('practiceSetIntroduction').textContent = currentSet.introduction;
      $('practiceSourceCount').textContent = `第一章至申请时共 ${currentSet.sources.length} 章 · 焦点章 ${dateLabel(currentSet.focusChapterId)}`;
      const questions = $('practiceQuestions'); questions.replaceChildren();
      for (const question of currentSet.questions) questions.append(questionCard(question));
      if (questionId) requestAnimationFrame(() => document.getElementById(`practice-${questionId}`)?.scrollIntoView({ block: 'start' }));
    } catch (error) { toast(error.message); }
  }

  function questionCard(question) {
    const card = node('section','practice-question'); card.id = `practice-${question.id}`;
    const heading = node('div','section-band'); heading.append(node('strong','',partLabel(question.part)),node('span','',String(question.position + 1).padStart(2,'0'))); card.append(heading);
    const body = node('div','practice-question-body');
    body.append(node('p','practice-prompt',question.prompt));
    if (question.guidance) body.append(node('p','practice-guidance',question.guidance));
    const links = node('div','practice-links');
    for (const link of question.links) {
      const button = node('button','bevel-button',`${dateLabel(link.chapterId)}${link.useId ? ` · ${link.useId}` : ''}`);
      button.type = 'button'; button.addEventListener('click', () => { $('practiceDialog').close(); openSource(link.chapterId, link.useId); }); links.append(button);
    }
    body.append(links);
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
    const label = node('label','field-label',question.kind === 'writing' ? '我的写作答案' : '口语文字练习（录音与发音评价尚未启用）');
    const input = node('textarea','text-input practice-answer-input'); input.rows = 8; input.maxLength = 20000; input.placeholder = question.kind === 'writing' ? '在这里写下自己的回答…' : '可记下口头练习的文字内容；此项只接受文字维度反馈。'; label.append(input); body.append(label);
    const actions = node('div','button-row');
    const submit = node('button','primary-button','提交答案'); submit.type = 'button';
    submit.addEventListener('click', async () => {
      if (input.value.trim().length < 20) { toast('请先完成至少 20 字符的答案'); return; }
      submit.disabled = true;
      try {
        await api(`/api/practice/questions/${encodeURIComponent(question.id)}/attempts`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ answerText: input.value, medium: question.kind === 'writing' ? 'written' : 'speech-transcript' }) });
        toast('已提交，Codex 批改后可在此查看'); await openSet(currentSet.id);
      } catch (error) { toast(error.message); submit.disabled = false; }
    }); actions.append(submit);
    const reveal = node('button','bevel-button',question.revealed ? '参考答案已展开' : '查看参考答案'); reveal.type = 'button';
    const reference = node('div','practice-reference'); reference.hidden = !question.revealed;
    const fillReference = (answer, notes) => { reference.replaceChildren(node('p','practice-answer',answer)); if (notes) reference.append(node('p','practice-guidance',notes)); reference.hidden = false; reveal.textContent = '参考答案已展开'; };
    if (question.revealed) fillReference(question.referenceAnswer,question.referenceNotes);
    reveal.addEventListener('click', async () => {
      if (question.revealed) { reference.hidden = !reference.hidden; return; }
      try { const result = await api(`/api/practice/questions/${encodeURIComponent(question.id)}/reveal`, { method: 'POST' }); question.revealed = true; question.referenceAnswer = result.referenceAnswer; question.referenceNotes = result.referenceNotes; fillReference(result.referenceAnswer,result.referenceNotes); }
      catch (error) { toast(error.message); }
    }); actions.append(reveal); body.append(actions,reference); card.append(body); return card;
  }

  async function open() {
    const { authenticated, demo } = getContext();
    if (!authenticated || demo) { toast('请登录正式阅读器后使用表达练习'); return; }
    $('practiceRequestToggle').checked = false; $('practiceRequestBox').hidden = true;
    showList(); showDialog('practiceDialog');
    try { await refresh(); } catch (error) { toast(error.message); }
  }

  $('practiceBack').addEventListener('click', showList);
  for (const id of ['practiceKind','practiceChapter','practiceStatus']) $(id).addEventListener('change', () => refreshIndex().catch(error => toast(error.message)));
  $('practiceSearch').addEventListener('input', () => { clearTimeout(refreshIndex.timer); refreshIndex.timer = setTimeout(() => refreshIndex().catch(error => toast(error.message)),250); });
  $('practiceRequestToggle').addEventListener('change', () => { $('practiceRequestBox').hidden = !$('practiceRequestToggle').checked; });
  $('practiceRequestButton').addEventListener('click', async () => {
    const chosen = requestState(); if (!chosen || !$('practiceRequestToggle').checked) { toast('请先开启申请'); return; }
    const button = $('practiceRequestButton'); button.disabled = true;
    try {
      await api('/api/practice/requests', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ focusChapterId: chosen.id, note: $('practiceRequestNote').value.trim() }) });
      $('practiceRequestToggle').checked = false; $('practiceRequestBox').hidden = true; $('practiceRequestNote').value = '';
      await refresh(); toast('表达练习申请已保存');
    } catch (error) { toast(error.message); button.disabled = false; }
  });
  return { open, refresh };
}
