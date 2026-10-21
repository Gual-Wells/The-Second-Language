// Content and drawing are independent of the mesh and its animation.
// Existing artwork: cron's CC0 parchment; existing lettering: Tommi Syrjänen's Aboensis.
export const DOCUMENT_WIDTH = 1536;
export const DOCUMENT_HEIGHT = 2112;

export function documentLines(record) {
  return [record.institution, record.heading, record.introduction, record.displayTitle,
    ...record.paragraphs, record.colophon, record.specimenNote];
}

export function populateTranscript(container, record) {
  container.replaceChildren();
  for (const [index, text] of documentLines(record).entries()) {
    const element = document.createElement(index === 1 ? 'h3' : 'p');
    element.textContent = text;
    container.append(element);
  }
}

export async function loadImage(url) {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
}

function rng(seed) {
  let state = seed >>> 0;
  return () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
}

function wrap(context, text, maxWidth) {
  const lines = []; let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && context.measureText(next).width > maxWidth) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export function createDocument(record, paperImage, template) {
  const w = DOCUMENT_WIDTH, h = DOCUMENT_HEIGHT;
  const paper = Object.assign(document.createElement('canvas'), {width:w,height:h});
  const ctx = paper.getContext('2d');
  // Rotate the authored landscape membrane, keeping its existing tears, creases and alpha.
  ctx.translate(w / 2, h / 2); ctx.rotate(Math.PI / 2);
  ctx.drawImage(paperImage, -h / 2, -w / 2, h, w);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const ink = Object.assign(document.createElement('canvas'), {width:w,height:h});
  const pen = ink.getContext('2d');
  const family = template.fontFamily;
  pen.fillStyle = '#302017'; pen.textBaseline = 'alphabetic';
  pen.textAlign = 'center';
  pen.font = `62px ${family}`;
  pen.fillText(record.institution, w / 2, 232);
  pen.font = `114px ${family}`;
  pen.fillText(record.heading, w / 2, 397);

  const margin = 186, textWidth = w - margin * 2;
  pen.font = `61px ${family}`;
  pen.fillText(record.introduction, w / 2, 520);
  pen.font = `88px ${family}`;
  // Keep long future titles within the same physical writing area.
  pen.fillText(record.displayTitle, w / 2, 636, textWidth);

  pen.textAlign = 'left';
  let y = 766;
  const fontSize = 58, lineHeight = 73;
  pen.font = `${fontSize}px ${family}`;
  const random = rng(104729 + record.chapterNumber);
  for (const paragraph of record.paragraphs) {
    for (const line of wrap(pen, paragraph, textWidth)) {
      // Small whole-line ink variation; keep letter shapes intact and fully readable.
      pen.fillStyle = random() > .65 ? '#3a281c' : '#302018';
      pen.fillText(line, margin + (random() - .5) * 1.8, y + (random() - .5) * 1.4);
      y += lineHeight;
    }
    y += 34;
  }
  if (y > 1770) throw new Error('正文超出卷轴书写范围，需要重新排版。');
  pen.textAlign = 'center';
  pen.font = `65px ${family}`; pen.fillText(record.colophon, w / 2, 1850);
  pen.font = `38px ${family}`; pen.fillText(record.specimenNote, w / 2, 1940);

  // Local ink abrasion affects the ink layer alone. The author-supplied skin
  // texture remains the source of the material; this is not a generated sheet.
  pen.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 14000; i++) {
    pen.fillStyle = `rgba(0,0,0,${.08 + random() * .28})`;
    const x = random() * w, iy = random() * h;
    pen.fillRect(x, iy, .4 + random() * 2.0, .3 + random() * 1.6);
  }
  pen.globalCompositeOperation = 'source-over';
  const front = Object.assign(document.createElement('canvas'), {width:w,height:h});
  const frontCtx = front.getContext('2d');
  frontCtx.drawImage(paper, 0, 0);
  frontCtx.globalCompositeOperation = 'source-atop';
  frontCtx.drawImage(ink, 0, 0);
  return {front, back:paper, ink, layout:{lastBaseline:y, width:w, height:h}};
}
