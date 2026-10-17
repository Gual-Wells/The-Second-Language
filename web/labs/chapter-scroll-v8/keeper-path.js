import {rollRadius} from '../chapter-scroll/vendor/paperlab-roll.js';
export const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export const KEEPER=Object.freeze({releaseEnd:.24,width:.41,height:.77,bandWidth:.216,closedGap:.058,looseGap:.13});
// Keep the loop threaded until its right edge clears the paper's left end.
export function keeperPose(progress,template){
 const r=Math.max(0,Math.min(1,progress/KEEPER.releaseEnd));
 const loosen=smooth(0,.27,r),slide=smooth(.27,.82,r),depart=smooth(.82,1,r);
 const radius=rollRadius(template.height,template.coreRadius,template.layerThickness);
 return {x:-(template.width/2+KEEPER.width/2+.11)*slide-.70*depart,
  y:-.025*depart,z:.045*loosen+.85*depart,rotationZ:-.11*depart,rotationY:.16*depart,
  loosen,opacity:1-smooth(.89,1,r),visible:progress<KEEPER.releaseEnd,
  phase:r<.27?'loosen':r<.82?'unthread':r<1?'depart':'off',radius,
  paperProgress:Math.max(0,Math.min(1,(progress-KEEPER.releaseEnd)/(1-KEEPER.releaseEnd)))};
}
