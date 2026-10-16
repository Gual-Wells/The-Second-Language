import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const entries=[
  ['wood-Diffuse.jpg','CC0','https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wood_table_worn/wood_table_worn_diff_1k.jpg'],
  ['wood-nor_gl.jpg','CC0','https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wood_table_worn/wood_table_worn_nor_gl_1k.jpg'],
  ['wood-Rough.jpg','CC0','https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wood_table_worn/wood_table_worn_rough_1k.jpg'],
  ['jangafx-cloud.png','CC0','JangaFX CloudPack / cloud_04_variant_0000.vdb; bake_cloud.py'],
];
const assets=[];
for(const [file,license,source] of entries) {
  const bytes=await readFile(path.join(root,'web/labs/chapter-scroll-v2/assets',file));
  assets.push({file:'assets/'+file,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),license,source});
}
const vendor=await readFile(path.join(root,'web/labs/chapter-scroll-v2/vendor/drei-cloud.js'));
assets.push({file:'vendor/drei-cloud.js',bytes:vendor.length,sha256:createHash('sha256').update(vendor).digest('hex'),
  license:'MIT',source:'https://github.com/pmndrs/drei-vanilla/tree/28978f680f9071e4f4794611781c19f46de48e35',
  changes:'esbuild ESM bundle; local Three import; removed unused remote default texture'});
await writeFile(path.join(root,'web/labs/chapter-scroll-v2/asset-manifest.json'),JSON.stringify({
  specimen:true,productionCertification:false,date:'2026-10-16',assets,
  inheritedCredits:'../chapter-scroll/CREDITS.md',
  bake:{source:'JangaFX CC0 CloudPack cloud_04_variant_0000.vdb',tool:'Blender 5.1.2 Cycles CPU',
    resolution:[512,512],samples:24,density:.22,script:'research/scroll-lab-v2/bake_cloud.py'}
},null,2)+'\n');
console.log(JSON.stringify({assets:assets.length,downloadBytes:assets.reduce((n,a)=>n+a.bytes,0)}));
