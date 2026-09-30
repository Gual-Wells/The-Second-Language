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

export function renderPart(source, part, target) {
  target.replaceChildren();
  target.classList.toggle('prose', part === 'three');
  const words = [];
  let container = target;
  let paragraph = [];
  let list = null;
  let quote = null;
  let example = null;

  function flushParagraph() {
    if (!paragraph.length) return;
    const p = document.createElement('p');
    appendInline(p, paragraph.join(' ').trim());
    if (part === 'two' && container.classList.contains('word-entry') && !quote) {
      example = document.createElement('div');
      example.className = 'example-pair';
      example.append(p);
      container.append(example);
    } else (quote || container).append(p);
    paragraph = [];
  }

  for (const raw of source.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line) { flushParagraph(); list = null; quote = null; continue; }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph(); list = null; quote = null; example = null;
      if (heading[1] === '#' && part !== 'three') {
        const section = document.createElement('section');
        section.className = 'word-entry';
        section.id = `word-${words.length + 1}`;
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
        const title = document.createElement('h2');
        title.textContent = heading[2];
        sense.append(title);
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
      list.append(item);
      continue;
    }
    list = null;
    paragraph.push(line);
  }
  flushParagraph();
  return words;
}
