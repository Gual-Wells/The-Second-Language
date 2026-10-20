import * as T from '../certification/vendor/three.module.js';
import noise from '../chapter-scroll-v17/vendor/noise2D.glsl';

// Layered scan material + mesh AO/pointiness + material-coordinate use masks.
// The noise is Ashima/Gustavson's MIT simplex, not time-varying screen dirt.
// All fields are attached to the actual part, so wear follows every pose.
const common=`${noise}
float ageNoise(vec2 p){return .5+.5*snoise(p);}
float ageField(vec2 p){return .58*ageNoise(p)+.28*ageNoise(p*2.13+17.2)+.14*ageNoise(p*4.37-9.3);}
`;

function leather(keeper){
 const m=keeper.strap.material,previous=m.onBeforeCompile;
 // MaterialPath exposes scalar authority, not a second set of fit dimensions.
 const L=keeper.path.length,H=keeper.path.data.selectedHoleMm,F=keeper.path.data.foldEndMm;
 m.onBeforeCompile=shader=>{
  previous(shader);
  // Replace v17's provisional edge/crease treatment, never compound it.
  const old=/float rubbed=smoothstep\(7\.7,9\.1,abs\(vKeeperMaterial\.z\)\);[\s\S]*?diffuseColor\.rgb\*=1\.-\.18\*crease;/;
  if(!old.test(shader.fragmentShader))throw Error('Review changed base leather shader before applying age layers');
  shader.fragmentShader=common+shader.fragmentShader.replace(old,'');
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   vec2 ap=vec2(vKeeperMaterial.x,vKeeperMaterial.z);
   float slow=ageField(ap*vec2(.045,.085));
   float fleck=ageNoise(ap*vec2(.91,1.63)+vec2(38.,7.));
   float edge=smoothstep(7.5,9.04,abs(ap.y));
   float cutSide=smoothstep(8.75,9.02,abs(ap.y));
   float tip=1.-smoothstep(1.,17.,${L.toFixed(5)}-ap.x);
   float bending=exp(-pow((ap.x-${(F-10).toFixed(5)})/6.0,2.));
   float buckleTrack=exp(-pow((ap.x-${(H-8).toFixed(5)})/9.,2.));
   float holeRim=0.;
   for(int i=0;i<3;i++){
    vec2 hp=(ap-vec2(${H.toFixed(5)}+12.*float(i),0.))/vec2(i==0?3.:2.1,2.1);
    holeRim=max(holeRim,(1.-smoothstep(.97,1.65,length(hp))));
   }
   float innerRim=holeRim*(1.-smoothstep(.85,1.15,abs(vKeeperMaterial.y)));
   float section=max(cutSide,innerRim);
   vec3 sectionColor=texture2D(map,vec2(ap.x/47.,vKeeperMaterial.y/28.+.37)).rgb;
   diffuseColor.rgb=mix(diffuseColor.rgb,sectionColor*vec3(1.14,1.06,.94),section);
   float scuff=smoothstep(.49,.76,slow+.12*fleck)*(.28+.55*edge+.4*tip+.32*buckleTrack);
   float polish=clamp(.55*edge+.40*buckleTrack+.22*bending,0.,1.)*(.48+.52*slow);
   float fiber=clamp((edge*.60+tip*.36+holeRim*.8)*smoothstep(.37,.74,fleck),0.,.85);
   // Hand oil / compressed edge first, then incomplete loss of the grain coat.
   diffuseColor.rgb*=mix(.72,1.08,slow)*(1.-.19*polish);
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.22,.104,.037)*( .73+.65*fleck),scuff*.42);
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.265,.136,.057)*( .70+.45*slow),fiber*.49);
   // Cut sections show a layered fibrous core; they are not smooth clay.
   float lamella=ageNoise(vec2(ap.x*1.7,vKeeperMaterial.y*6.));
   diffuseColor.rgb*=1.-section*(.06+.10*lamella);
   // Fine irregular creases at repeated bend sites, never a full black stripe.
   float creaseNoise=ageNoise(vec2(ap.x*1.9+fleck*.4,ap.y*.34));
   float fissure=smoothstep(.77,.93,creaseNoise)*(bending*.5+buckleTrack*.23)*(.4+.6*slow);
   diffuseColor.rgb*=1.-fissure*.48;
  `);
  shader.fragmentShader=shader.fragmentShader.replace('roughnessFactor=clamp(.65+roughnessFactor*.28,.7,.96);',
   'roughnessFactor=clamp(.64+roughnessFactor*.29-polish*.20+fiber*.13+fissure*.05,.48,.97);');
  // The original UV atlas collapses the 2.5mm cut face to a line. Do not
  // amplify that degenerate tangent into long wood-like normal-map stripes.
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',
   '#include <normal_fragment_maps>\nnormal=normalize(mix(normal,nonPerturbedNormal,section*.90));');
 };
 m.customProgramCacheKey=()=> 'keeper-aged-scanned-leather-v18-1';
 m.normalScale.set(.52,.52);m.envMapIntensity=.65;m.needsUpdate=true;
}

function metal(keeper,mask){
 for(const part of keeper.parts.filter(o=>o!==keeper.strap)){
  const m=part.material=part.material.clone();
  m.envMapIntensity=5.2;m.roughness=1;m.metalness=1;m.normalScale.set(.66,.66);
  m.onBeforeCompile=shader=>{
   shader.uniforms.ageMasks={value:mask};
   shader.vertexShader='varying vec3 vAgeMetal;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvAgeMetal=position*1000.;');
   shader.fragmentShader=`uniform sampler2D ageMasks;varying vec3 vAgeMetal;\n${common}`+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
    vec3 am=texture2D(ageMasks,vMapUv).rgb;
    vec2 mp=vAgeMetal.xy+vAgeMetal.z*vec2(.37,.81);
    float uneven=ageField(mp*.65+21.);
    float convex=smoothstep(.50,.58,am.g);
    float worn=clamp(am.b+.15*convex,0.,1.)*smoothstep(.28,.7,uneven)*(.5+.5*am.r);
    float hollow=clamp((1.-am.r)*1.55+(1.-am.b)*.24+(1.-smoothstep(.42,.5,am.g))*.12,0.,1.);
    float pit=1.-smoothstep(.08,.18,dot(diffuseColor.rgb,vec3(.3,.59,.11)));
    float patina=clamp(hollow*.65+smoothstep(.52,.77,uneven)*.24,0.,.8);
    // Brown stable patina, rubbed warm brass/bronze crowns, preserved scan pits.
    vec3 bronze=diffuseColor.rgb*vec3(1.65,1.80,1.92)+vec3(.043,.034,.018);
    bronze=mix(bronze,vec3(.072,.039,.020),patina*.60);
    bronze=mix(bronze,vec3(.52,.35,.14),worn*.35);
    diffuseColor.rgb=bronze*(1.-pit*.22);
   `);
   shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
    roughnessFactor=clamp(.25+roughnessFactor*.20+patina*.14-worn*.12,.22,.65);
   `);
   shader.fragmentShader=shader.fragmentShader.replace('#include <metalnessmap_fragment>',`#include <metalnessmap_fragment>
    metalnessFactor=mix(.94,.45,patina*.55);
   `);
  };
  m.customProgramCacheKey=()=> 'keeper-aged-bronze-v18-1';m.needsUpdate=true;
 }
}

export async function applyKeeperAging(keeper,renderer){
 const mask=await new T.TextureLoader().loadAsync(new URL('./assets/metal-age-masks.png',import.meta.url).href);
 mask.flipY=false;mask.colorSpace=T.NoColorSpace;mask.wrapS=mask.wrapT=T.ClampToEdgeWrapping;
 mask.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());keeper.maps.push(mask);
 leather(keeper);metal(keeper,mask);
 for(const map of keeper.maps)map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 return {version:'v18 layered physical wear',nativeMasks:'Cycles AO / curvature / crown atlas 1024',sourceGeometry:'unchanged v17',noMold:true,noTimeAnimatedNoise:true};
}
