import {ScrollObject as PhysicalScroll} from '../chapter-scroll-v17/scroll-object.js';
import {applyFinishing} from './finishing.js';
export class ScrollObject extends PhysicalScroll{
 constructor(...args){
  super(...args);const prepared=this.environmentReady;
  this.environmentReady=prepared.then(async()=>{
   const old=new Set(this.closure.maps);this.aging=await applyFinishing(this.closure,this.renderer);
   this.maps=this.maps.filter(t=>!old.has(t));this.maps.push(...this.closure.maps);
  });
 }
 snapshot(){return {...super.snapshot(),edition:'v19 multi-pass old keeper',aging:this.aging};}
}
