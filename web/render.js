export function parseParts(markdown) {
  const parts = { one: '', two: '', three: '' };
  const matches = [...markdown.matchAll(/^<!-- PART:(one|two|three) -->\s*$/gm)];
  matches.forEach((match, index) => {
    const end = matches[index + 1]?.index ?? markdown.length;
    parts[match[1]] = markdown.slice(match.index + match[0].length, end).trim();
  });
  return parts;
}

function appendInline(element, value) {
  const tokens = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;
  let start = 0;
  for (const match of value.matchAll(tokens)) {
    element.append(document.createTextNode(value.slice(start, match.index)));
    const child = document.createElement(match[1] ? 'strong' : match[2] ? 'em' : 'code');
    child.textContent = match[1] || match[2] || match[3];
    element.append(child);
    start = match.index + match[0].length;
  }
  element.append(document.createTextNode(value.slice(start)));
}

function addExampleJump(container, id, onJump) {
  if (!id) return;
  container.dataset.useId = id;
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'usage-jump'; button.textContent = '例句 ›';
  button.title = `查看 ${id} 的例句`;
  button.setAttribute('aria-label', `查看用法 ${id} 的例句`);
  button.addEventListener('click', () => onJump?.('two', id));
  container.append(button);
}

function renderStory(source, target, options) {
  let paragraph = null, pending = null, pair = null;
  target.classList.toggle('highlight-sentences', Boolean(options.highlight));
  target.classList.toggle('show-translations', Boolean(options.translations));
  for (const raw of source.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line) { paragraph = null; continue; }
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading && !pending) {
      const element = document.createElement(`h${heading[1].length}`);
      element.textContent = heading[2]; target.append(element); paragraph = null; continue;
    }
    const marker = /^<!-- SENTENCE:([A-Za-z][A-Za-z0-9_-]{0,31})(?: USE:([A-Za-z][A-Za-z0-9_-]{0,31}(?:,[A-Za-z][A-Za-z0-9_-]{0,31})*))? -->$/.exec(line);
    if (marker) { pending = { id: marker[1], refs: marker[2] ? marker[2].split(',') : [] }; continue; }
    if (pending && !pair) {
      if (!paragraph) { paragraph = document.createElement('p'); paragraph.className = 'story-paragraph'; target.append(paragraph); }
      if (paragraph.childNodes.length) paragraph.append(document.createTextNode(' '));
      pair = document.createElement('span'); pair.className = 'story-pair';
      const sentence = document.createElement('span'); sentence.className = 'story-sentence';
      const refs = [...pending.refs];
      sentence.dataset.sentenceId = pending.id;
      if (refs.length) { sentence.classList.add('linked-use'); sentence.dataset.useRefs = refs.join(','); }
      appendInline(sentence, line);
      if (refs.length) {
        sentence.addEventListener('click', () => { if (options.highlight) options.onSentence?.(refs); });
        sentence.addEventListener('keydown', event => { if (options.highlight && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); options.onSentence?.(refs); } });
        if (options.highlight) { sentence.tabIndex = 0; sentence.setAttribute('role', 'button'); sentence.setAttribute('aria-label', `查看对应词汇用法 ${refs.join('、')}`); }
      }
      pair.append(sentence); paragraph.append(pair); continue;
    }
    if (pending && pair && /^`[^`]+`$/.test(line)) {
      const translation = document.createElement('span'); translation.className = 'story-translation mono'; translation.textContent = line.slice(1, -1);
      pair.append(translation); pending = null; pair = null; continue;
    }
  }
  return [];
}

export function renderPart(source, part, target, options = {}) {
  target.dataset.audioPart = part;
  target.replaceChildren();
  target.classList.toggle('prose', part === 'three');
  target.classList.remove('highlight-sentences', 'show-translations');
  if (part === 'three' && source.includes('<!-- SENTENCE:')) return renderStory(source, target, options);
  const words = [];
  let container = target;
  let paragraph = [];
  let list = null;
  let quote = null;
  let example = null;
  let pendingWord = null, pendingUse = null, pendingExample = null;

  function flushParagraph() {
    if (!paragraph.length) return;
    const p = document.createElement('p');
    appendInline(p, paragraph.join(' ').trim());
    if (part === 'two' && container.classList.contains('word-entry') && !quote) {
      example = document.createElement('div');
      example.className = 'example-pair';
      if (pendingExample) { example.dataset.useId = pendingExample; pendingExample = null; }
      example.append(p);
      container.append(example);
    } else if (part === 'one' && pendingUse) {
      const block = document.createElement('div'); block.className = 'usage-detail';
      block.append(p); addExampleJump(block, pendingUse, options.onJump);
      container.append(block); pendingUse = null;
    } else (quote || container).append(p);
    paragraph = [];
  }

  for (const raw of source.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line) { flushParagraph(); list = null; quote = null; continue; }

    const wordMarker = /^<!-- WORD:([A-Za-z][A-Za-z0-9_-]{0,31}) -->$/.exec(line);
    const useMarker = /^<!-- USE:([A-Za-z][A-Za-z0-9_-]{0,31}) -->$/.exec(line);
    const exampleMarker = /^<!-- EXAMPLE:([A-Za-z][A-Za-z0-9_-]{0,31}) -->$/.exec(line);
    if (wordMarker || useMarker || exampleMarker) {
      flushParagraph(); list = null; quote = null; example = null;
      if (wordMarker) pendingWord = wordMarker[1];
      if (useMarker) pendingUse = useMarker[1];
      if (exampleMarker) pendingExample = exampleMarker[1];
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph(); list = null; quote = null; example = null;
      if (heading[1] === '#' && part !== 'three') {
        const section = document.createElement('section');
        section.className = 'word-entry';
        section.id = `word-${words.length + 1}`;
        if (pendingWord) { section.dataset.wordId = pendingWord; pendingWord = null; }
        const bar = document.createElement('div');
        bar.className = 'word-heading';
        const order = document.createElement('span');
        order.className = 'word-order';
        order.textContent = String(words.length + 1).padStart(2, '0');
        const title = document.createElement('h1');
        title.textContent = heading[2];
        bar.append(order, title);
        section.append(bar);
        target.append(section);
        container = section;
        words.push({ text: heading[2], element: section });
      } else if (heading[1] === '##' && part === 'one') {
        const sense = document.createElement('section');
        sense.className = 'sense-block';
        if (pendingUse) sense.dataset.useId = pendingUse;
        const head = document.createElement('div'); head.className = 'sense-head';
        const title = document.createElement('h2');
        title.dataset.heading = heading[2];
        const pronunciation = /^(.*?)\s+(\/[^/\n]+\/)\s*$/.exec(heading[2]);
        const label = pronunciation ? pronunciation[1] : heading[2], split = label.indexOf(' · ');
        const word = split < 0 ? label : label.slice(0,split), definition = split < 0 ? '' : label.slice(split+3);
        title.append(document.createTextNode(word));
        if (pronunciation) {
          const ipa = document.createElement('span'); ipa.className = 'sense-ipa'; ipa.textContent = pronunciation[2];
          title.append(document.createTextNode(' '), ipa);
        }
        head.append(title);
        if (pendingUse) { addExampleJump(head, pendingUse, options.onJump); pendingUse = null; }
        sense.append(head);
        if (definition) { const summary=document.createElement('p');summary.className='sense-definition';summary.textContent=definition;sense.append(summary); }
        if (words.length) words.at(-1).element.append(sense);
        else target.append(sense);
        container = sense;
      } else {
        const title = document.createElement(`h${heading[1].length}`);
        title.textContent = heading[2];
        container.append(title);
      }
      continue;
    }

    if (/^---+$/.test(line)) { flushParagraph(); list = null; quote = null; container.append(document.createElement('hr')); continue; }
    if (/^`[^`]+`$/.test(line)) {
      flushParagraph(); list = null; quote = null;
      const code = document.createElement('code');
      code.className = 'mono';
      code.textContent = line.slice(1, -1);
      (part === 'two' && example ? example : container).append(code);
      continue;
    }
    if (line.startsWith('> ')) {
      flushParagraph(); list = null;
      if (!quote) { quote = document.createElement('blockquote'); container.append(quote); }
      paragraph.push(line.slice(2));
      continue;
    }
    const listItem = /^([-*]|\d+\.)\s+(.+)$/.exec(line);
    if (listItem) {
      flushParagraph(); quote = null;
      const kind = /^\d/.test(listItem[1]) ? 'ol' : 'ul';
      if (!list || list.tagName.toLowerCase() !== kind) { list = document.createElement(kind); container.append(list); }
      const item = document.createElement('li');
      appendInline(item, listItem[2]);
      if (part === 'one' && pendingUse) { addExampleJump(item, pendingUse, options.onJump); pendingUse = null; }
      list.append(item);
      continue;
    }
    list = null;
    paragraph.push(line);
  }
  flushParagraph();
  return words;
}
