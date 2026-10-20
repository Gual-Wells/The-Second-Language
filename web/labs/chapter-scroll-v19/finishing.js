import * as T from '../certification/vendor/three.module.js';

// Authoring lives in the editable native workshop, not a set of browser noise
// thresholds. Three uses the baked coherent PBR channels on the accepted mesh.
export async function applyFinishing(keeper,renderer){
 const loader=new T.TextureLoader(),names=['leather-color','leather-orm','leather-normal','bronze-color','bronze-orm','bronze-normal'];
 const maps=await Promise.all(names.map(async name=>{
  const t=await loader.loadAsync(new URL(`./assets/${name}.webp`,import.meta.url).href);t.flipY=false;
  t.colorSpace=name.endsWith('color')?T.SRGBColorSpace:T.NoColorSpace;
  t.wrapS=t.wrapT=T.ClampToEdgeWrapping;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;
 }));
 const [lc,lo,ln,bc,bo,bn]=maps,oldMaps=new Set();
 for(const part of keeper.parts)for(const key of ['map','normalMap','roughnessMap','metalnessMap'])if(part.material[key])oldMaps.add(part.material[key]);
 const material=keeper.strap.material,previous=material.onBeforeCompile;
 const uv=keeper.strap.geometry.attributes.uv,flat=keeper.flat;
 for(let i=0;i<uv.count;i++)uv.setXY(i,flat[i*3]/keeper.path.length,.5-flat[i*3+2]/18.);
 uv.needsUpdate=true;
 Object.assign(material,{map:lc,normalMap:ln,roughnessMap:lo,metalnessMap:null,roughness:1,metalness:0,envMapIntensity:.7});material.normalScale.set(.72,.72);
 material.onBeforeCompile=shader=>{
  previous(shader);
  const old=/float rubbed=smoothstep\(7\.7,9\.1,abs\(vKeeperMaterial\.z\)\);[\s\S]*?diffuseColor\.rgb\*=1\.-\.18\*crease;/;
  if(!old.test(shader.fragmentShader))throw Error('Base material changed: review before using baked finishing');
  shader.vertexShader='varying vec3 vKeeperSurface;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('vKeeperMaterial=keeperMaterial;','vKeeperSurface=keeperNormal;vKeeperMaterial=keeperMaterial;');
  shader.fragmentShader='varying vec3 vKeeperSurface;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace(old,'');
  shader.fragmentShader=shader.fragmentShader.replace('roughnessFactor=clamp(.65+roughnessFactor*.28,.7,.96);','roughnessFactor=clamp(roughnessFactor,.42,.99);');
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   float cutSide=smoothstep(.42,.82,1.-abs(normalize(vKeeperSurface).z));
   // Keep incised face motifs off the exposed core. A separate thickness
   // cross-section samples the central, untooled portion of the leather map.
   vec2 coreUv=vec2(vKeeperMaterial.x/${keeper.path.length.toFixed(5)},.36+vKeeperMaterial.y*.09);
   vec3 core=texture2D(map,coreUv).rgb;
   vec3 coreN=texture2D(normalMap,coreUv).xyz*2.-1.;
   float coreTone=dot(core,vec3(.30,.59,.11));
   float coreFiber=clamp(.57+2.4*coreTone+.48*(coreN.x+coreN.y),.40,1.5);
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.145,.067,.024)*coreFiber,cutSide*.93);
  `);
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',
   `#include <normal_fragment_maps>
    coreN.xy*=.25;
    mat3 coreTangent=getTangentFrame(-vViewPosition,nonPerturbedNormal,coreUv);
    normal=normalize(mix(normal,normalize(coreTangent*normalize(coreN)),cutSide*.96));`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.94,cutSide);');
 };
 material.customProgramCacheKey=()=> 'keeper-native-workshop-leather-v19';material.needsUpdate=true;
 const bronze=keeper.parts.find(p=>p!==keeper.strap).material.clone();
 Object.assign(bronze,{map:bc,roughnessMap:bo,metalnessMap:bo,normalMap:bn,roughness:1,metalness:1,envMapIntensity:5.2});bronze.normalScale.set(.85,.85);bronze.needsUpdate=true;
 for(const part of keeper.parts)if(part!==keeper.strap)part.material=bronze;
 keeper.maps=keeper.maps.filter(t=>!oldMaps.has(t));keeper.maps.push(...maps);
 // The base loader has not uploaded these replaced scan maps yet. Dispose
 // their GPU allocation if any, then drop references from the active texture list.
 for(const map of oldMaps)map.dispose();
 return {version:'v19 native multi-pass finishing',leather:['scanned grain','hide variation','dark contact polish','grain-coat loss','opened flex creases','worn hand-incised borders','terminal lozenge'],metal:['scanned microstructure','planishing depressions','file dressing','paired incised grooves','brown stable oxide','subdued crevice patina','rubbed crowns'],sourceGeometry:'unchanged v17',offlineBaked:true,noMold:true};
}
