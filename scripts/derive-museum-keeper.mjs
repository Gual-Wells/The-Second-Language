import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

// A deliberately narrow container edit, not a mesh optimizer. The source asset
// and finishing implementation are pinned: a new source requires a fresh audit
// that all six embedded images are replaced before the first visible frame.
// Format reference: Khronos glTF 2.0, sections 3.6 / 3.8.3 / 4.4.3.
// https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html
const root=fileURLToPath(new URL('../',import.meta.url));
const sourcePath='web/labs/chapter-scroll-v17/assets/keeper-physical.glb';
const finishingPath='web/labs/chapter-scroll-v19/finishing.js';
const placeholderPath='web/labs/chapter-scroll-v14/assets/unused-keeper.png';
const outputPath='web/labs/scroll-museum-v1/assets/keeper-display.glb';
const manifestPath='web/labs/scroll-museum-v1/assets/keeper-display.json';
const expectedSource='a6084299daf55d9ead8e7905ab973fe6be9ec88a6a7f26914230c1f04e959668';
const expectedFinishing='7d9adfdcd4497a9791a80931e1ab34b70dee40ea52be71042e5b799d7aa4b30f';
const expectedPlaceholder='c2153f77e11087fcb078ae38527fa83bef29791e3700e30cc87fec4405a66d0f';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const load=relative=>readFile(path.join(root,relative));
const check=process.argv.includes('--check');
assert(process.argv.slice(2).every(arg=>arg==='--check'),'Only --check is supported');

function parse(bytes){
 assert.equal(bytes.readUInt32LE(0),0x46546c67,'Not a GLB container');
 assert.equal(bytes.readUInt32LE(4),2,'Only GLB version 2 is supported');
 assert.equal(bytes.readUInt32LE(8),bytes.length,'GLB length mismatch');
 const chunks=[];let offset=12;
 while(offset<bytes.length){
  const length=bytes.readUInt32LE(offset),type=bytes.readUInt32LE(offset+4);
  assert.equal(offset%4,0);assert.equal(length%4,0);assert(offset+8+length<=bytes.length);
  chunks.push({type,bytes:bytes.subarray(offset+8,offset+8+length)});offset+=8+length;
 }
 assert.deepEqual(chunks.map(chunk=>chunk.type),[0x4e4f534a,0x004e4942],'Unexpected GLB chunks: do not discard them');
 const document=JSON.parse(chunks[0].bytes.toString('utf8'));
 assert.equal(document.asset.version,'2.0');assert.equal(document.buffers.length,1);assert.equal(document.buffers[0].uri,undefined);
 assert(document.buffers[0].byteLength<=chunks[1].bytes.length&&chunks[1].bytes.length-document.buffers[0].byteLength<=3);
 for(const view of document.bufferViews){
  assert.equal(view.buffer,0);assert(!view.extensions,'Compressed/extension buffer views require another audited tool');
  assert((view.byteOffset||0)>=0&&(view.byteOffset||0)+view.byteLength<=document.buffers[0].byteLength);
 }
 return{document,binary:chunks[1].bytes};
}
const viewBytes=(asset,index)=>{
 const view=asset.document.bufferViews[index];return asset.binary.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength);
};
const structuralDocument=document=>Object.fromEntries(Object.entries(document).filter(([key])=>!['buffers','bufferViews','images'].includes(key)));
const withoutOffset=view=>Object.fromEntries(Object.entries(view).filter(([key])=>key!=='byteOffset'));
function pack(document,binary){
 const json=Buffer.from(JSON.stringify(document)),jsonPadding=Buffer.alloc((4-json.length%4)%4,0x20),binPadding=Buffer.alloc((4-binary.length%4)%4);
 const a=Buffer.concat([json,jsonPadding]),b=Buffer.concat([binary,binPadding]),header=Buffer.alloc(12),jsonHeader=Buffer.alloc(8),binHeader=Buffer.alloc(8);
 header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(12+8+a.length+8+b.length,8);
 jsonHeader.writeUInt32LE(a.length,0);jsonHeader.writeUInt32LE(0x4e4f534a,4);binHeader.writeUInt32LE(b.length,0);binHeader.writeUInt32LE(0x004e4942,4);
 return Buffer.concat([header,jsonHeader,a,binHeader,b]);
}

const [sourceBytes,finishing,placeholder]=await Promise.all([load(sourcePath),load(finishingPath),load(placeholderPath)]);
assert.equal(sha(sourceBytes),expectedSource,'Source GLB changed: audit the new source before deriving it');
assert.equal(sha(finishing),expectedFinishing,'Finishing changed: verify every placeholder is still overwritten');
assert.equal(sha(placeholder),expectedPlaceholder,'Placeholder source changed');
assert.equal(placeholder.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
assert.equal(placeholder.readUInt32BE(16),1);assert.equal(placeholder.readUInt32BE(20),1);
const original=parse(sourceBytes),document=structuredClone(original.document);
assert.equal(document.images.length,6);assert.equal(document.materials.length,2);assert.equal(document.bufferViews.length,46);
assert.equal((document.extensionsUsed||[]).length,0,'Audit source extensions before rebasing binary offsets');
const imageViews=new Set(document.images.map(image=>{assert.equal(image.uri,undefined);assert(Number.isInteger(image.bufferView));return image.bufferView;}));
assert.equal(imageViews.size,6,'Do not conflate image view identities');
for(const accessor of document.accessors){
 for(const index of [accessor.bufferView,accessor.sparse?.indices?.bufferView,accessor.sparse?.values?.bufferView])if(index!==undefined)assert(!imageViews.has(index),'An image view is also used by geometry');
}
for(const material of document.materials){
 assert(!material.occlusionTexture&&!material.emissiveTexture&&!material.extensions,'A texture slot not covered by v19 finishing exists');
 assert(material.normalTexture&&material.pbrMetallicRoughness?.baseColorTexture&&material.pbrMetallicRoughness?.metallicRoughnessTexture);
}
const imageReplacements=document.images.map((image,imageIndex)=>({imageIndex,name:image.name,bufferView:image.bufferView,sourceMimeType:image.mimeType,derivedMimeType:'image/png',sourceByteLength:document.bufferViews[image.bufferView].byteLength,derivedByteLength:placeholder.length,sourceSha256:sha(viewBytes(original,image.bufferView)),derivedSha256:sha(placeholder)}));
let offset=0;const pieces=[];
for(const [index,view]of document.bufferViews.entries()){
 const padding=(4-offset%4)%4;if(padding){pieces.push(Buffer.alloc(padding));offset+=padding;}
 const payload=imageViews.has(index)?placeholder:viewBytes(original,index);
 view.byteOffset=offset;view.byteLength=payload.length;pieces.push(payload);offset+=payload.length;
}
for(const image of document.images)image.mimeType='image/png';
const binary=Buffer.concat(pieces);document.buffers[0].byteLength=binary.length;
const derivedBytes=pack(document,binary),derived=parse(derivedBytes);
assert.deepEqual(structuralDocument(original.document),structuralDocument(derived.document),'Geometry, skin, morph, UV, materials, textures, hierarchy or another structural field changed');
assert.deepEqual(derived.document.images,original.document.images.map(image=>({...image,mimeType:'image/png'})));
assert.deepEqual({...derived.document.buffers[0],byteLength:original.document.buffers[0].byteLength},original.document.buffers[0]);
const nonImageBufferViews=[];
for(const [index,view]of original.document.bufferViews.entries()){
 assert.equal((derived.document.bufferViews[index].byteOffset||0)%4,0);
 if(imageViews.has(index))continue;
 assert.deepEqual(withoutOffset(view),withoutOffset(derived.document.bufferViews[index]));
 const sourceSha256=sha(viewBytes(original,index)),derivedSha256=sha(viewBytes(derived,index));assert.equal(sourceSha256,derivedSha256);
 nonImageBufferViews.push({index,byteLength:view.byteLength,sourceByteOffset:view.byteOffset||0,derivedByteOffset:derived.document.bufferViews[index].byteOffset||0,sourceSha256,derivedSha256,equal:true});
}
const materialImageSlots=[];
for(const[materialIndex,material]of original.document.materials.entries())for(const[slot,ref]of Object.entries({normalTexture:material.normalTexture,baseColorTexture:material.pbrMetallicRoughness.baseColorTexture,metallicRoughnessTexture:material.pbrMetallicRoughness.metallicRoughnessTexture}))materialImageSlots.push({materialIndex,slot,textureIndex:ref.index,imageIndex:original.document.textures[ref.index].source});
assert.deepEqual([...new Set(materialImageSlots.map(slot=>slot.imageIndex))].sort(),[0,1,2,3,4,5]);
const manifest={
 schema:'second-language.museum-keeper-display-derivative.v1',
 purpose:'Museum-only download derivative. Six provisional embedded scans become 1px PNGs; v19 finishing must replace them before first display. Not a standalone finished material asset.',
 scope:'/labs/scroll-museum-v1/',
 formatReference:'https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html',
 source:{path:sourcePath,bytes:sourceBytes.length,sha256:sha(sourceBytes)},
 derived:{path:outputPath,bytes:derivedBytes.length,sha256:sha(derivedBytes),savedBytes:sourceBytes.length-derivedBytes.length,savedPercent:Number(((1-derivedBytes.length/sourceBytes.length)*100).toFixed(4))},
 requiredFinishing:{path:finishingPath,sha256:sha(finishing),firstDisplayAfterFinishing:true},
 placeholder:{path:placeholderPath,bytes:placeholder.length,sha256:sha(placeholder),width:1,height:1,mimeType:'image/png'},
 invariants:{nonImageBufferViews:nonImageBufferViews.length,allNonImageBytesIdentical:true,wholeStructuralDocumentIdentical:true,structuralSha256:sha(JSON.stringify(structuralDocument(original.document))),accessors:document.accessors.length,meshes:document.meshes.length,skins:document.skins.length,nodes:document.nodes.length,animations:document.animations?.length||0,preserved:['accessors','primitive attributes and indices','morph targets including flattened inspection','skin weights and joints','UVs','materials and texture indices','samplers','node transforms and hierarchy','scenes','all non-image bufferView bytes'],removed:[],simplified:false},
 materialImageSlots,imageReplacements,nonImageBufferViews,
};
if(check){
 const [existing,existingManifest]=await Promise.all([load(outputPath),load(manifestPath).then(bytes=>JSON.parse(bytes))]);
 assert.deepEqual(existing,derivedBytes,'Derived GLB is not the deterministic expected output');assert.deepEqual(existingManifest,manifest,'Manifest mismatch');
}else{
 await mkdir(path.dirname(path.join(root,outputPath)),{recursive:true});
 await writeFile(path.join(root,outputPath),derivedBytes);await writeFile(path.join(root,manifestPath),`${JSON.stringify(manifest,null,2)}\n`);
}
assert.equal(sha(await load(sourcePath)),expectedSource,'Source must remain unchanged');
console.log(JSON.stringify({mode:check?'verified':'derived',source:manifest.source,derived:manifest.derived,invariants:manifest.invariants},null,2));
