export const RELEASE_END=.34;
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
// Keep the accepted fastened pose intact while it slips along the roll axis.
// Rotation/approach only start after its whole width clears the paper.
export function fittingPose(progress,width,halfWidth){
 const r=Math.max(0,Math.min(1,progress/RELEASE_END)),slide=smooth(0,.8,r),depart=smooth(.8,1,r),clearDistance=width/2+halfWidth+.14;
 return {x:-clearDistance*slide-.85*depart,z:.10*depart,rotationY:.08*depart,rotationZ:-.1*depart,visible:progress<RELEASE_END,phase:r===0?'fastened':r<.8?'axial-slip':r<1?'depart':'off',axiallyClear:slide===1,slide,depart,pin:0,feed:0,liftMm:0,opacity:1};
}
