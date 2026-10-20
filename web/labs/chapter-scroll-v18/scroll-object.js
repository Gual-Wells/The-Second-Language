import {ScrollObject as PhysicalScroll} from '../chapter-scroll-v17/scroll-object.js';
import {applyKeeperAging} from './aging.js';

export class ScrollObject extends PhysicalScroll{
 constructor(...args){
  super(...args);
  const prepared=this.environmentReady;
  this.environmentReady=prepared.then(async()=>{
   this.aging=await applyKeeperAging(this.closure,this.renderer);
   // Base class captures its texture list before this sibling's material stage.
   this.maps.push(...this.closure.maps.filter(m=>!this.maps.includes(m)));
  });
 }
 snapshot(){return {...super.snapshot(),edition:'v18 aged material study',aging:this.aging};}
}
