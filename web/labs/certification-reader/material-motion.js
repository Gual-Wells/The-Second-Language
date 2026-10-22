// Sound parameters follow the same keeper coordinates used by the rendered
// material path. These are art-directed audio responses, not a force solver.
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const number=n=>Number.isFinite(n)?n:0;
export function materialMotion(current,previous,seconds){
 const silent={paper:0,leather:0,paperSpeed:0,leatherSpeed:0,contact:null};
 if(!previous||!current.active||seconds<=0||seconds>.3||Math.abs(current.progress-previous.progress)>.2)return silent;
 const a=previous.keeper,b=current.keeper;
 if(!a||!b)return silent;
 const paperSpeed=Math.abs(number(current.paperProgress)-number(previous.paperProgress))/seconds;
 // angle: leather folding; along/feed: hole release and tail withdrawal;
 // slide: the loosened band sliding across the closed parchment roll.
 const leatherSpeed=(Math.abs(number(b.angle)-number(a.angle))*.45
  +Math.abs(number(b.along)-number(a.along))*.025
  +Math.abs(number(b.feed)-number(a.feed))*.6
  +Math.abs(number(b.slide)-number(a.slide))*.12)/seconds;
 const paper=current.paperProgress>0&&b.r>=.999&&paperSpeed>.002?.8*Math.sqrt(clamp(paperSpeed/.6)):0;
 const leather=b.visible!==false&&b.r<.95&&current.paperProgress===0&&leatherSpeed>.002?.85*Math.sqrt(clamp(leatherSpeed/1.1)):0;
 // This buckle has no latch. A quiet metal contact occurs when its rigid
 // prong finishes parking on the frame, or seats again at the fastened end.
 const park=a.pin> -1.16&&b.pin<= -1.16&&b.r>a.r;
 const seat=a.r>.012&&b.r<=.012&&b.r<a.r;
 return {paper,leather,paperSpeed,leatherSpeed,contact:park?'prong-park':seat?'prong-seat':null};
}
