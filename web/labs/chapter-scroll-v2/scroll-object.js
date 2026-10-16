import * as THREE from '../certification/vendor/three.module.js';
import {rollRadius,rollPoint,windAngle} from '../chapter-scroll/vendor/paperlab-roll.js';
import {ScrollMist} from './mist.js';

// Reusable renderer: no chapter lookup, certification API, app DOM, autoplay or UI.
// A host supplies a canvas, laid-out front/back surfaces and a series template.
export class ScrollObject {
  constructor(canvas, surfaces, template, resources) {
    this.template = template;
    this.progress = 0; this.renderCount = 0; this.paperProgress=0; this.deformations=0;
    this.options={mist:true,shaft:true,band:true}; this.bounds={minY:0,maxY:0,rollY:0};
    this.renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'low-power'});
    const renderer = this.renderer;
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
    renderer.setClearColor(0x000000,0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.maps = [new THREE.CanvasTexture(surfaces.front),new THREE.CanvasTexture(surfaces.back)];
    const [front,back] = this.maps;
    for (const map of this.maps) {
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = Math.min(4,renderer.capabilities.getMaxAnisotropy());
    }
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-4,4,4,-4,.1,30);
    this.camera.position.set(0,0,12); this.camera.lookAt(0,0,0);
    this.scene.add(new THREE.HemisphereLight(0xf7f4ed,0x554839,2.0));
    const key = new THREE.DirectionalLight(0xfff3da,3.0);
    key.position.set(-3.5,5,7); key.castShadow = true;
    key.shadow.mapSize.set(1024,1024);
    Object.assign(key.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.1,far:25});
    key.shadow.normalBias = .015; key.shadow.bias = -.0002;
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xc9d7e4,.65); fill.position.set(4,-1,4); this.scene.add(fill);
    this.geometry = new THREE.PlaneGeometry(template.width,template.height,48,480);
    this.geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
    this.base = new Float32Array(this.geometry.attributes.position.array);
    const heightMap=new THREE.CanvasTexture(surfaces.heightMap);this.maps.push(heightMap);
    this.material = new THREE.MeshStandardMaterial({map:front,bumpMap:heightMap,bumpScale:.032,
      roughness:.96,metalness:0,side:THREE.DoubleSide,alphaTest:.46});
    this.material.onBeforeCompile = shader => {
      shader.uniforms.backPaper = {value:back};
      shader.fragmentShader = 'uniform sampler2D backPaper;\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>',`
        #ifdef USE_MAP
          vec4 sheetColor = gl_FrontFacing ? texture2D(map, vMapUv) : texture2D(backPaper, vMapUv);
          diffuseColor *= sheetColor;
        #endif`);
    };
    this.material.customProgramCacheKey = () => 'chapter-scroll-two-sides-v2';
    this.sheet = new THREE.Mesh(this.geometry,this.material);
    this.sheet.castShadow = true; this.sheet.receiveShadow = true;
    this.scene.add(this.sheet);
    this.createShaft(resources);
    this.createBand();
    const fogMap = new THREE.Texture(resources.mist); fogMap.needsUpdate=true;
    fogMap.colorSpace=THREE.SRGBColorSpace;this.maps.push(fogMap);
    this.mist=new ScrollMist(fogMap);this.scene.add(this.mist.group);
  }

  createShaft(resources) {
    const maps=['wood','normal','rough'].map(name=>{
      const map=new THREE.Texture(resources[name]);map.needsUpdate=true;
      map.wrapS=map.wrapT=THREE.RepeatWrapping;
      map.center.set(.5,.5);map.rotation=Math.PI/2;map.repeat.set(1,3);
      this.maps.push(map);return map;
    });
    maps[0].colorSpace=THREE.SRGBColorSpace;
    this.woodMaterial=new THREE.MeshStandardMaterial({map:maps[0],normalMap:maps[1],roughnessMap:maps[2],
      color:0xa79b86,roughness:.83,normalScale:new THREE.Vector2(.3,.3)});
    // Restrained turned profile: core, shoulder, flange and short terminal; no metal fittings.
    const half=[[0,-2.60],[.065,-2.60],[.09,-2.57],[.09,-2.53],
      [.17,-2.50],[.17,-2.46],[.14,-2.43],[.14,-2.37],[.112,-2.30]];
    const profile=[...half,[.112,2.30],...half.slice(0,-1).reverse().map(([r,y])=>[r,-y])];
    this.shaftGeometry=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),48);
    this.shaftGeometry.rotateZ(Math.PI/2);
    this.shaft=new THREE.Mesh(this.shaftGeometry,this.woodMaterial);
    this.shaft.castShadow=true;this.shaft.receiveShadow=true;this.scene.add(this.shaft);
  }

  createBand() {
    this.bandGeometry=new THREE.PlaneGeometry(.13,1,4,180);
    this.bandMaterial=new THREE.MeshStandardMaterial({color:0x75624a,roughness:1,side:THREE.DoubleSide});
    this.band=new THREE.Mesh(this.bandGeometry,this.bandMaterial);
    this.band.castShadow=true;this.band.receiveShadow=true;this.scene.add(this.band);
    // A short overlapped retaining strip, not an invented historically exact knot.
  }

  setOptions(options) {
    for(const name of Object.keys(this.options)) if(name in options) this.options[name]=Boolean(options[name]);
    this.shaft.visible=this.options.shaft;this.mist.setEnabled(this.options.mist);
    this.setProgress(this.progress);
  }

  updateBand(release,radius) {
    const r=radius+.017, length=Math.PI*2*r*1.08;
    const q=Math.max(0,Math.min(1,release));
    const curvature=(1-q)/r, slide=Math.max(0,(q-.62)/.38);
    const xShift=-8*slide*slide*(3-2*slide);
    const positions=this.bandGeometry.attributes.position;
    for(let i=0;i<positions.count;i++) {
      const row=Math.floor(i/5),col=i%5,s=row/180*length;
      const tilt=q*Math.PI/2, angle=tilt+curvature*s;
      const y=curvature>1e-5 ? r+(Math.cos(angle)-Math.cos(tilt))/curvature : r-s;
      const z=curvature>1e-5 ? (Math.sin(angle)-Math.sin(tilt))/curvature : 0;
      const overlap=.007*s/length*(1-q);
      positions.setXYZ(i,-.78+(col/4-.5)*.13*(1+.015*Math.sin(s*49))+xShift,
        this.bounds.rollY+y+overlap*Math.cos(angle)-slide*.7,radius+z+overlap*Math.sin(angle));
    }
    positions.needsUpdate=true;this.bandGeometry.computeVertexNormals();this.bandGeometry.computeBoundingSphere();
    this.band.visible=this.options.band && q<1;
  }

  setProgress(value) {
    this.progress = Math.max(0,Math.min(1,value));
    const release=this.options.band ? Math.min(1,this.progress/.17) : 1;
    this.paperProgress=this.options.band ? Math.max(0,(this.progress-.17)/.83) : this.progress;
    const {width,height,layerThickness,coreRadius} = this.template;
    const boundary = -height / 2 + this.paperProgress * (height-.20);
    const wound = Math.max(0,height / 2 - boundary);
    const radius = rollRadius(wound,coreRadius,layerThickness);
    const position = this.geometry.attributes.position;
    let minY = Infinity,maxY = -Infinity;
    for (let i = 0; i < position.count; i++) {
      const x = this.base[i * 3],y = this.base[i * 3 + 1];
      const edge = Math.pow(Math.abs(x) / (width / 2),5);
      const waviness = .008 * Math.sin(y * 5 + x * 3) + .024 * edge * Math.sin(y * 3.2 + .4);
      const [px,py,pz] = rollPoint(x,y,waviness,boundary,radius,layerThickness);
      position.setXYZ(i,px,py,pz);
      minY = Math.min(minY,py); maxY = Math.max(maxY,py);
    }
    position.needsUpdate = true;
    this.geometry.computeVertexNormals(); this.geometry.computeBoundingSphere();
    this.sheet.position.y = -(minY + maxY) / 2;
    this.bounds={minY:minY+this.sheet.position.y,maxY:maxY+this.sheet.position.y,
      rollY:-boundary+this.sheet.position.y};
    this.shaft.position.set(0,this.bounds.rollY,radius);
    this.shaft.rotation.x=windAngle(wound,radius,layerThickness/(2*Math.PI));
    this.updateBand(release,radius);this.deformations++;
  }

  resize(width,height) {
    if (!width || !height) return;
    this.renderer.setSize(width,height,false);
    const aspect = width / height;
    const vertical = Math.max(this.template.height + .8,(this.template.width + 1.05) / aspect);
    Object.assign(this.camera,{left:-vertical * aspect / 2,right:vertical * aspect / 2,top:vertical / 2,bottom:-vertical / 2});
    this.camera.updateProjectionMatrix();
  }

  update(delta,velocity=0) { this.scene.updateMatrixWorld(true);this.mist.update(this.camera,delta,{...this.bounds,velocity}); }
  render() { this.renderer.render(this.scene,this.camera); this.renderCount++; }
  snapshot() {
    return {progress:this.progress,paperProgress:this.paperProgress,bandRelease:Math.min(1,this.progress/.17),
      renderCount:this.renderCount,deformations:this.deformations,mistTime:this.mist.elapsed,options:{...this.options},
      shaftPosition:this.shaft.position.toArray(),bounds:{...this.bounds},vertices:this.geometry.attributes.position.count,
      camera:this.camera.position.toArray(),template:this.template.id};
  }
  exportObject() {
    const fog=this.mist.group.visible;this.mist.group.visible=false;
    this.render();const data=this.renderer.domElement.toDataURL('image/png');
    this.mist.group.visible=fog;this.render();return data;
  }
  dispose() {
    this.geometry.dispose(); this.material.dispose();
    this.shaftGeometry.dispose();this.woodMaterial.dispose();this.bandGeometry.dispose();this.bandMaterial.dispose();this.mist.dispose();
    for (const texture of this.maps) texture.dispose();
    for (const light of this.scene.children) light.shadow?.dispose();
    this.renderer.dispose();
  }
}
