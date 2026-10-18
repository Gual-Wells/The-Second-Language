import {ScrollObject as PreviousScroll} from '../chapter-scroll-v8/scroll-object.js';
export class ScrollObject extends PreviousScroll {
 constructor(...args){super(...args);this.material.bumpScale=.0045;}
 setSurfaces(surfaces){
  this.maps[0].image=surfaces.front;this.maps[0].needsUpdate=true;
  this.maps[1].image=surfaces.back;this.maps[1].needsUpdate=true;
  this.sealBump.image=surfaces.relief;this.sealBump.needsUpdate=true;this.dirty=true;
 }
}
