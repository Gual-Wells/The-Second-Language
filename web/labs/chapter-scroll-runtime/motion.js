// Count presented animation time; a cold frame must not skip the keeper path.
export class Motion {
 constructor(from,to,now){this.from=from;this.to=to;this.duration=Math.max(280,Math.abs(to-from)*5600);this.elapsed=0;this.previous=now;}
 sample(now){
  this.elapsed+=Math.max(0,Math.min(50,now-this.previous));this.previous=now;
  const t=Math.min(1,this.elapsed/this.duration),e=t*t*(3-2*t);
  return {progress:this.from+(this.to-this.from)*e,done:t===1};
 }
 resume(now){this.previous=now;}
}
