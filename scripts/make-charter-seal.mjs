import {readFile,writeFile} from 'node:fs/promises';
const icon=await readFile('web/icon.svg','utf8'),paths=[...icon.matchAll(/<path\b[\s\S]*?\/>/g)].map(x=>x[0]);
if(paths.length!==3)throw Error('Project icon changed; review its geometry before deriving a seal');
const fill=paths.slice(0,2).map(x=>x.replace('fill="#3469e6"','fill="white"')).join('\n'),lines=paths[2].replace('stroke="#f4f6fa"','stroke="black"');
const font=await readFile('web/labs/chapter-scroll-v7/assets/UncialAntiqua-Regular.ttf');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512" role="img" aria-label="The Second Language chapter attestation seal">
<style>@font-face{font-family:SealUncial;src:url(data:font/ttf;base64,${font.toString('base64')})}text{font-family:SealUncial,serif;font-size:35px;letter-spacing:.5px;fill:#583622}</style>
<defs><path id="upper" d="M51 256 A205 205 0 0 1 461 256"/><path id="lower" d="M51 256 A205 205 0 0 0 461 256"/>
<mask id="projectBook" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><rect width="512" height="512" fill="black"/>${fill}${lines}</mask></defs>
<g fill="none" stroke="#583622"><circle cx="256" cy="256" r="246" stroke-width="4"/><circle cx="256" cy="256" r="238" stroke-width="1.5"/><circle cx="256" cy="256" r="165" stroke-width="3"/><circle cx="256" cy="256" r="157" stroke-width="1"/></g>
<text text-anchor="middle"><textPath href="#upper" startOffset="50%">THE SECOND LANGUAGE</textPath></text>
<text text-anchor="middle" style="font-size:32px"><textPath href="#lower" startOffset="50%">CHAPTER ATTESTATION</textPath></text>
<path d="M40 247 49 256 40 265 31 256Z M472 247 481 256 472 265 463 256Z" fill="#583622"/>
<g transform="translate(97.28 99.2) scale(.62)"><rect width="512" height="512" fill="#583622" mask="url(#projectBook)"/></g>
</svg>`;
await writeFile('web/labs/chapter-scroll-v7/assets/project-seal.svg',svg);
await writeFile('research/scroll-lab-v7/seal-construction.svg',svg.replace('width="1024" height="1024"','width="512" height="512"'));
