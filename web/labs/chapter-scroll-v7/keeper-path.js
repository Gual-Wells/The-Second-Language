import {rollRadius} from '../chapter-scroll/vendor/paperlab-roll.js';
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export const KEEPER=Object.freeze({width:.41,height:.77,releaseEnd:.18,normalClearance:.07,endClearance:.28});
export function keeperPose(progress,template){
 const r=Math.max(0,Math.min(1,progress/KEEPER.releaseEnd));
 const lift=smooth(0,.22,r),slide=smooth(.22,.82,r),exit=smooth(.82,1,r);
 const paperFront=2*rollRadius(template.height,template.coreRadius,template.layerThickness)+KEEPER.normalClearance;
 // Lift first along the camera axis. The paper remains wound throughout the
 // sideward slide. Fade begins only after the entire rigid keeper clears it.
 return {x:-(template.width/2+KEEPER.width/2+KEEPER.endClearance)*slide-.60*exit,
  y:-.01-.035*Math.sin(slide*Math.PI)-.14*exit,z:paperFront+.28*lift+.04*exit,
  rotationZ:-.10*slide,opacity:1-smooth(.84,1,r),visible:progress<KEEPER.releaseEnd,
  phase:r<.22?'lift':r<.82?'slide':r<1?'clear':'off',paperFront};
}
