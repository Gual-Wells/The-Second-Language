import * as T from '../certification/vendor/three.module.js';

// One owner for one mounted viewer. Late, non-cancellable decoder results are
// registered before the liveness check, so disposing during decode is safe.
export class ViewerResources {
 constructor(){this.controller=new AbortController();this.items=new Set();this.images=new WeakSet();this.loadedImages=new Set();this.fonts=new Set();this.disposed=false;}
 assertAlive(){if(this.disposed)throw new DOMException('The scroll viewer was disposed','AbortError');}
 own(item){if(!item)return item;if(this.disposed){this.release(item);return item;}if(this.items.has(item))return item;this.items.add(item);return item;}
 release(item){try{item.dispose?.();}catch{}if(item.isTexture)this.releaseImage(item.image);}
 releaseImage(image){if(!image)return;this.loadedImages.delete(image);if(this.images.has(image))return;this.images.add(image);if(image instanceof HTMLImageElement)image.removeAttribute('src');else image.close?.();}
 material(material){for(const m of Array.isArray(material)?material:[material]){if(!m)continue;this.own(m);for(const value of Object.values(m))if(value?.isTexture)this.own(value);for(const uniform of Object.values(m.uniforms||{}))if(uniform?.value?.isTexture)this.own(uniform.value);}}
 scene(scene){scene?.traverse(o=>{this.own(o.geometry);this.material(o.material);this.material(o.customDepthMaterial);this.material(o.customDistanceMaterial);this.own(o.skeleton?.boneTexture);this.own(o.shadow);});return scene;}
 async bytes(url){this.assertAlive();const response=await fetch(url,{signal:AbortSignal.any([this.controller.signal,AbortSignal.timeout(30000)])});if(!response.ok)throw Error(`Scroll resource unavailable (${response.status}): ${new URL(url,location.href).pathname}`);const data=await response.arrayBuffer();this.assertAlive();return data;}
 async json(url){return JSON.parse(new TextDecoder().decode(await this.bytes(url)));}
 async text(url){return new TextDecoder().decode(await this.bytes(url));}
 async image(url){return this.imageBytes(await this.bytes(url));}
 async imageBytes(bytes){this.assertAlive();const objectUrl=URL.createObjectURL(new Blob([bytes])),image=new Image();this.loadedImages.add(image);try{image.src=objectUrl;await image.decode();if(this.disposed){this.releaseImage(image);this.assertAlive();}return image;}finally{URL.revokeObjectURL(objectUrl);}}
 async texture(url,configure){const image=await this.image(url);const texture=this.own(new T.Texture(image));texture.needsUpdate=true;configure?.(texture);this.assertAlive();return texture;}
 async font(family,url){const face=new FontFace(family,await this.bytes(url));await face.load();this.assertAlive();document.fonts.add(face);this.fonts.add(face);return face;}
 dispose(){if(this.disposed)return;this.disposed=true;this.controller.abort();for(const face of this.fonts)document.fonts.delete(face);this.fonts.clear();for(const item of this.items)if(!item.isWebGLRenderer)this.release(item);for(const image of this.loadedImages)this.releaseImage(image);for(const item of this.items)if(item.isWebGLRenderer)this.release(item);this.items.clear();this.loadedImages.clear();}
}
