import {createFluid} from './vendor/fluid.js';
// Host direction for the existing stable-fluid solver. The dye stays behind the
// opaque document, so motion cannot wash out the lettering. No particle puffs.
export class Atmosphere {
 constructor(canvas){this.canvas=canvas;this.elapsed=0;this.count=0;this.next=0;this.previous=0;this.enabled=true;
  try{this.fluid=createFluid(canvas);}catch(error){console.warn('Atmosphere unavailable:',error);this.fluid=null;canvas.hidden=true;}
 }
 setEnabled(value){this.enabled=value;this.canvas.hidden=!value||!this.fluid;}
 tick(dt,progress,bounds,viewHeight){if(!this.enabled||!this.fluid)return;
  this.elapsed+=dt;this.count++;
  if(this.elapsed>this.next){
   this.next=this.elapsed+.22;
   // Perimeter streams arrive from opposing margins, never emit onto the text.
   const t=this.elapsed;
   this.fluid.inject(.055,.26+.12*Math.sin(t*.41),65+30*Math.sin(t),100,.22);
   this.fluid.inject(.945,.31+.14*Math.cos(t*.37),-65+30*Math.cos(t),100,.22);
  }
  const change=progress-this.previous;this.previous=progress;
  if(Math.abs(change)>.0002&&bounds&&viewHeight){
   const y=.5+bounds.bottom/viewHeight;
   this.fluid.inject(.17,y,-65,change>0?-80:80,.14);
   this.fluid.inject(.83,y,65,change>0?-80:80,.14);
  }
  this.fluid.tick(dt);
 }
 snapshot(){return {available:Boolean(this.fluid),enabled:this.enabled,frames:this.count};}
 dispose(){this.fluid?.dispose();}
}
