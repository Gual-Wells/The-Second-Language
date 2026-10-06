// Display metadata only: published chapter text and digests remain immutable.
export function chapterNumber(chapter) {
  return String(chapter.number || '每日章节').replace(/课/g, '章');
}

export function createChapterBook({getContext, openChapter, showPart, showDialog, renderCalendar}) {
  const $ = id => document.getElementById(id);
  const tabs = [$('chapterBookTab'), $('chapterCalendarTab')];
  const panels = [$('chapterBookPanel'), $('chapterCalendarPanel')];
  const make = (tag, cls, text) => { const node = document.createElement(tag); node.className = cls; if (text != null) node.textContent = text; return node; };
  function select(index) {
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; panels[i].hidden = i !== index; });
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', event => {
      const next = {ArrowLeft:1-i, ArrowRight:1-i, Home:0, End:1}[event.key];
      if (next === undefined) return;
      event.preventDefault(); select(next); tabs[next].focus();
    });
  });
  let opening = false;
  async function read(id, part) {
    if (opening) return;
    opening = true;
    $('chapterBookPanel').setAttribute('aria-busy', 'true');
    try { if (await openChapter(id) && part) showPart(part, true, false); }
    finally { opening = false; $('chapterBookPanel').removeAttribute('aria-busy'); }
  }
  function render() {
    const {chapters, current, lastDailyId} = getContext();
    const ordered = [...chapters].sort((a,b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
    const active = ordered.find(chapter => chapter.id === (current?.kind ? lastDailyId : current?.id));
    const query = $('chapterBookSearch').value.trim().toLocaleLowerCase();
    const matches = ordered.filter(chapter => [chapter.date, chapterNumber(chapter), chapter.title, chapter.subtitle].join(' ').toLocaleLowerCase().includes(query));
    $('chapterBookCount').textContent = query ? `${matches.length} / ${ordered.length} 章` : `${ordered.length} 章`;
    const resume = $('chapterBookResume');
    resume.hidden = !active;
    if (active) {
      $('chapterBookResumeTitle').textContent = active.title;
      resume.onclick = () => read(active.id);
    }
    const list = $('chapterBookList'); list.replaceChildren();
    if (!matches.length) {
      list.append(make('p', 'chapter-list-empty', query ? '没有匹配的章节，试试标题、编号或日期。' : '第一章发布后会出现在这里。'));
      return;
    }
    let month;
    for (const chapter of matches) {
      const group = chapter.date.slice(0,7);
      if (month !== group) {
        month = group;
        const band = make('h3', 'chapter-book-month', `${group.slice(0,4)} 年 ${Number(group.slice(5))} 月`);
        list.append(band);
      }
      const entry = make('section', 'chapter-book-entry');
      if (active?.id === chapter.id && !current?.historical) entry.classList.add('active');
      const title = make('button', 'chapter-book-title'); title.type = 'button';
      title.append(make('small', '', `${chapterNumber(chapter)} · ${chapter.date.slice(2)}`), make('strong', '', chapter.title));
      if (chapter.subtitle) title.append(make('span', '', chapter.subtitle));
      title.setAttribute('aria-label', `打开${chapterNumber(chapter)}：${chapter.title}`);
      title.onclick = () => read(chapter.id);
      const contents = make('div', 'chapter-book-contents');
      contents.setAttribute('role','group'); contents.setAttribute('aria-label', `${chapter.title}目录`);
      for (const [part, label] of [['one','01 词汇与用法'],['two','02 例句与翻译'],['three','03 任意文']]) {
        const button = make('button','',label); button.type = 'button'; button.onclick = () => read(chapter.id, part); contents.append(button);
      }
      entry.append(title, contents); list.append(entry);
    }
  }
  $('chapterBookSearch').addEventListener('input', render);
  return {open() { select(0); render(); renderCalendar(); showDialog('calendarDialog'); }, render};
}
