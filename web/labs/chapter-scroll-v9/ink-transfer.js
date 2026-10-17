// Standard value-noise, mask morphology and optical-density compositing.
// These are art-directed contact/aging fields, not a fluid or chemical solver.
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export function hash(x,y,seed=0){let v=Math.imul(x,374761393)^Math.imul(y,668265263)^seed;v=Math.imul(v^(v>>>13),1274126177);return ((v^(v>>>16))>>>0)/4294967295;}
export function noise(x,y,seed=0){const i=Math.floor(x),j=Math.floor(y),u=x-i,v=y-j,a=u*u*(3-2*u),b=v*v*(3-2*v),mix=(x,y,t)=>x+(y-x)*t;return mix(mix(hash(i,j,seed),hash(i+1,j,seed),a),mix(hash(i,j+1,seed),hash(i+1,j+1,seed),a),b);}
const ellipse=(x,y,cx,cy,rx,ry)=>Math.exp(-(((x-cx)/rx)**2+((y-cy)/ry)**2));
export function transferMasks(mask,seed){
 const {width:w,height:h}=mask,p=mask.getContext('2d',{willReadFrequently:true}),src=p.getImageData(0,0,w,h),canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
 const q=canvas.getContext('2d'),dst=q.createImageData(w,h);let missing=0,uneven=0,coverage=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=(y*w+x)*4,a=src.data[i+3]/255;
  // Contact varies over tens/hundreds of pixels, with sparse pinhole-sized
  // misses. A legible letter is not randomly deleted to manufacture damage.
  const broad=.79+.37*(noise(x/100,y/100,seed)-.5),grain=noise(x/3.5,y/3.5,seed^8127);
  const dry=ellipse(x,y,546,435,28,78)*.62+ellipse(x,y,111,180,44,66)*.44+ellipse(x,y,464,722,39,18)*.42;
  let contact=clamp(broad+.23*(grain-.5)-dry,.12,.99);
  const pit=noise(x/2.0,y/2.0,seed^451);if(pit>.74&&grain>.58)contact*=.12;
  const age=.5+.5*noise(x/49,y/49,seed^713),alpha=clamp(a*contact);
  dst.data[i]=Math.round(48+age*21);dst.data[i+1]=Math.round(29+age*12);dst.data[i+2]=Math.round(17+age*6);dst.data[i+3]=Math.round(alpha*255);
  if(a>.4){coverage++;if(contact<.5)missing++;if(contact<.72)uneven++;}
 }q.putImageData(dst,0,0);return {ink:canvas,stats:{markedPixels:coverage,lowContactPixels:missing,variableContactPixels:uneven}};
}
export function opticalInk(paper,ink){
 const out=new Uint8ClampedArray(paper.data),w=paper.width,h=paper.height;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=(y*w+x)*4,a=ink.data[i+3]/255;if(!a)continue;
  // Local texture is only a visual proxy for roughness/contact, not a measured
  // parchment height field. Preserve the substrate beneath translucent ink.
  const n=((Math.min(h-1,y+2)*w+Math.min(w-1,x+2))*4),l=(paper.data[i]+paper.data[i+1]+paper.data[i+2])/3,
   near=(paper.data[n]+paper.data[n+1]+paper.data[n+2])/3,contact=clamp(.98+(l-near)*.004,.77,1.04),density=a*contact;
  for(let c=0;c<3;c++)out[i+c]=Math.round(paper.data[i+c]*(1-density*(1-ink.data[i+c]/255)));
 }return new ImageData(out,w,h);
}
