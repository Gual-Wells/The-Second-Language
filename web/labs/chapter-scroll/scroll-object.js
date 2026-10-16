import * as THREE from '../certification/vendor/three.module.js';
import {rollRadius,rollPoint} from './vendor/paperlab-roll.js';

// Reusable renderer: no chapter lookup, certification API, app DOM, autoplay or UI.
// A host supplies a canvas, laid-out front/back surfaces and a series template.
export class ScrollObject {
  constructor(canvas, surfaces, template) {
    this.template = template;
    this.progress = 0; this.renderCount = 0;
    this.renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'low-power'});
    const renderer = this.renderer;
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
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
    this.material = new THREE.MeshStandardMaterial({map:front,bumpMap:back,bumpScale:.022,
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
    this.material.customProgramCacheKey = () => 'chapter-scroll-two-sides-v1';
    this.sheet = new THREE.Mesh(this.geometry,this.material);
    this.sheet.castShadow = true; this.sheet.receiveShadow = true;
    this.scene.add(this.sheet);
  }

  setProgress(value) {
    this.progress = Math.max(0,Math.min(1,value));
    const {width,height,layerThickness,coreRadius} = this.template;
    const boundary = -height / 2 + this.progress * height;
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
  }

  resize(width,height) {
    if (!width || !height) return;
    this.renderer.setSize(width,height,false);
    const aspect = width / height;
    const vertical = Math.max(this.template.height + .7,(this.template.width + .62) / aspect);
    Object.assign(this.camera,{left:-vertical * aspect / 2,right:vertical * aspect / 2,top:vertical / 2,bottom:-vertical / 2});
    this.camera.updateProjectionMatrix();
  }

  render() { this.renderer.render(this.scene,this.camera); this.renderCount++; }
  snapshot() {
    return {progress:this.progress,renderCount:this.renderCount,vertices:this.geometry.attributes.position.count,
      camera:this.camera.position.toArray(),template:this.template.id};
  }
  exportObject() { this.render(); return this.renderer.domElement.toDataURL('image/png'); }
  dispose() {
    this.geometry.dispose(); this.material.dispose();
    for (const texture of this.maps) texture.dispose();
    for (const light of this.scene.children) light.shadow?.dispose();
    this.renderer.dispose();
  }
}
