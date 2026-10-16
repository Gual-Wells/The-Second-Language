import * as THREE from '../certification/vendor/three.module.js';
import {Cloud,Clouds} from './vendor/drei-cloud.js';

// Existing Drei billboard/depth sorting, with our locally baked JangaFX CC0 density.
// The page and the effect share a host clock; this module never owns a RAF.
export class ScrollMist {
  constructor(texture) {
    this.group = new THREE.Group();
    this.layers = []; this.elapsed = 0; this.enabled = true; this.impulse = 0;
    for (const foreground of [false,true]) {
      const clouds = new Clouds({texture,limit:foreground ? 4 : 8,material:THREE.MeshBasicMaterial,frustumCulled:false});
      const uniforms = {
        mistTime:{value:0}, mistForeground:{value:foreground ? 1 : 0},
        paperBounds:{value:new THREE.Vector3(2.25,0,.2)}
      };
      const compile = clouds.cloudMaterial.onBeforeCompile;
      clouds.cloudMaterial.onBeforeCompile = shader => {
        compile(shader);
        Object.assign(shader.uniforms,uniforms);
        shader.vertexShader = 'varying vec3 mistWorld;\n' + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>',`
          #include <project_vertex>
          mistWorld = (modelMatrix * instanceMatrix * vec4(transformed,1.0)).xyz;`);
        shader.fragmentShader = `uniform float mistTime;
          uniform float mistForeground;
          uniform vec3 paperBounds;
          varying vec3 mistWorld;
          float fogHash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
          float fogNoise(vec2 p) {
            vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
            return mix(mix(fogHash(i),fogHash(i+vec2(1.,0.)),f.x),
              mix(fogHash(i+vec2(0.,1.)),fogHash(i+vec2(1.)),f.x),f.y);
          }
          float fogField(vec2 p) {
            return fogNoise(p)*.57+fogNoise(p*2.03+3.2)*.28+fogNoise(p*4.1)*.15;
          }\n` + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>',`
          vec2 flow=vec2(mistTime*.024,-mistTime*.012);
          vec2 drift = vec2(fogField(vMapUv*5.0+flow),fogField(vMapUv*5.0-flow+9.0))*.10-.05;
          vec2 uv=clamp(vMapUv+drift,0.0,1.0);
          float a=texture2D(map,uv).a*smoothstep(.23,.68,fogField(vMapUv*7.0+flow));
          vec4 mistSample = vec4(vec3(.84),a);
          diffuseColor *= mistSample;`);
        shader.fragmentShader = shader.fragmentShader.replace('#include <tonemapping_fragment>',`
          float outside = max(abs(mistWorld.x)-paperBounds.x,
            abs(mistWorld.y-paperBounds.y)-paperBounds.z);
          float protect = mix(1.0,smoothstep(-.02,.36,outside),mistForeground);
          gl_FragColor.a *= protect;
          #include <tonemapping_fragment>`);
      };
      clouds.cloudMaterial.customProgramCacheKey = () => 'scroll-mist-v2-' + foreground;
      for (let side = -1; side <= 1; side += 2) {
        const cloud = new Cloud({seed:foreground ? 37+side : 81+side,
          segments:foreground ? 2 : 4,bounds:new THREE.Vector3(.40,1.2,.07),
          volume:2.8,smallestVolume:.65,growth:.24,speed:.08,fade:0,
          opacity:foreground ? .14 : .25,color:new THREE.Color(foreground ? '#838977' : '#7a8273')});
        cloud.scale.set(1.9,.62,1);
        cloud.position.set(side*1.75,0,foreground ? .65 : -.45);
        for(const state of cloud.cloudStateArray) state.rotation=(state.index%3-1)*.10;
        clouds.add(cloud);
        this.layers.push({cloud,clouds,uniforms,side,foreground,
          origins:cloud.cloudStateArray.map(c=>c.position.clone())});
      }
      this.group.add(clouds);
    }
  }
  setEnabled(value) { this.enabled = Boolean(value); this.group.visible = this.enabled; }
  update(camera,delta,{velocity=0,rollY=0,minY=0,maxY=0}={}) {
    if (!this.enabled) return;
    this.elapsed += delta;
    this.impulse += (Math.max(-2,Math.min(2,velocity))*2.8-this.impulse)*Math.min(1,delta*2.2);
    for (const layer of this.layers) {
      const {cloud,side,foreground,origins,uniforms} = layer;
      const time = this.elapsed;
      cloud.position.x = side*(1.75 + Math.sin(time*.13 + side)*.22);
      cloud.position.y = rollY*.85-.14 + Math.sin(time*.17+side)*.18;
      for (let i=0;i<cloud.cloudStateArray.length;i++) {
        const state = cloud.cloudStateArray[i], origin = origins[i];
        state.position.x = origin.x + Math.sin(time*.21+i*1.8)*.15;
        state.position.y = origin.y + Math.sin(time*.12+i)*.25 + this.impulse*.32;
        // Open/close displacement is strongest near the moving coil, then dissipates.
        const proximity = Math.exp(-Math.abs(cloud.position.y+origin.y-rollY)*.8);
        state.opacity = (foreground ? .14 : .25)*(1+Math.abs(this.impulse)*.30*proximity);
        state.rotationFactor = Math.sin(time*.12+state.index)*.003 + this.impulse*.012*proximity;
      }
      uniforms.mistTime.value = time;
      uniforms.paperBounds.value.set(2.25,(minY+maxY)/2,(maxY-minY)/2);
    }
    this.group.updateWorldMatrix(true,true);
    for (const clouds of this.group.children) clouds.update(camera,this.elapsed,delta);
  }
  dispose() {
    for (const clouds of this.group.children) {
      clouds.instance.geometry.dispose(); clouds.cloudMaterial.dispose();
    }
  }
}
