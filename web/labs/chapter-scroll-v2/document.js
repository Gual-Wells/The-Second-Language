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

// Distinguish skin structure from stains (colour) and ink (surface only).
// Seeded local conservation wear; no random holes, burned border or uniform dirt.
function ageSkin(paper,random) {
  const w=paper.width,h=paper.height,ctx=paper.getContext('2d');
  ctx.save(); ctx.globalCompositeOperation='source-atop';
  for (const [x,y,r,alpha] of [[40,160,390,.23],[w-40,h-80,370,.18],
    [w*.91,h*.41,190,.12],[w*.08,h*.79,145,.10]]) {
    const g=ctx.createRadialGradient(x,y,r*.12,x,y,r);
    g.addColorStop(0,`rgba(101,66,29,${alpha})`);g.addColorStop(1,'rgba(101,66,29,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  }
  // A faint, irregular tide line follows the exposed margin, away from the writing.
  for(let j=0;j<3;j++) {
    ctx.beginPath();
    for(let i=0;i<=80;i++) {
      const y=h*.10+i*h*.0096;
      const x=104+Math.sin(i*.19)*15+Math.sin(i*.64)*6+j*3;
      i ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
    }
    ctx.strokeStyle=`rgba(104,68,30,${.035-j*.008})`;ctx.lineWidth=2.5;ctx.stroke();
  }
  // Short marginal handling lines, tapered and irregular rather than a tiled grid.
  for(let i=0;i<145;i++) {
    const left=random()<.5,x=left ? 35+random()*75 : w-35-random()*75;
    const y=100+random()*(h-180),len=8+random()*43;
    ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+(left?len:-len)*.5,y-3,x+(left?len:-len),y+random()*7);
    ctx.strokeStyle=`rgba(103,72,36,${.035+random()*.055})`;ctx.lineWidth=.5+random();ctx.stroke();
  }
  ctx.restore();
  const height=document.createElement('canvas');height.width=768;height.height=1056;
  const bump=height.getContext('2d'),pixels=bump.createImageData(height.width,height.height);
  for(let y=0;y<height.height;y++) for(let x=0;x<height.width;x++) {
    const i=(y*height.width+x)*4;
    const edge=Math.pow(Math.abs(x/height.width-.5)*2,8);
    const fibre=Math.sin(x*.69+y*.13)*1.1+Math.sin(y*.44+x*.033)*1.1;
    const value=128+fibre+(random()-.5)*3+edge*Math.sin(y*.06+x*.07)*5;
    pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=value;pixels.data[i+3]=255;
  }
  bump.putImageData(pixels,0,0);
  return height;
}

export function createDocument(record, paperImage, template) {
  const w = DOCUMENT_WIDTH, h = DOCUMENT_HEIGHT;
  const paper = Object.assign(document.createElement('canvas'), {width:w,height:h});
  const ctx = paper.getContext('2d');
  // Rotate the authored landscape membrane, keeping its existing tears, creases and alpha.
  ctx.translate(w / 2, h / 2); ctx.rotate(Math.PI / 2);
  ctx.drawImage(paperImage, -h / 2, -w / 2, h, w);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const heightMap=ageSkin(paper,rng(70019+record.chapterNumber));

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
  // Slight warm diffusion at strong strokes, with the original glyph mask on top.
  frontCtx.globalAlpha=.16;frontCtx.filter='blur(1.1px)';frontCtx.drawImage(ink,0,0);
  frontCtx.filter='none';frontCtx.globalAlpha=1;frontCtx.drawImage(ink, 0, 0);
  return {front, back:paper, ink, heightMap, layout:{lastBaseline:y, width:w, height:h}};
}
