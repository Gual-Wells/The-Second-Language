import {ScrollObject as PreviousScroll} from '../chapter-scroll-v6/scroll-object.js';
import {keeperPose} from './keeper-path.js';
export class ScrollObject extends PreviousScroll {
 setProgress(value){
  super.setProgress(value);this.pose=keeperPose(this.progress,this.template);
  const p=this.pose;this.keeper.position.set(p.x,p.y,p.z);this.keeper.rotation.set(0,0,p.rotationZ);
  this.keeper.material.opacity=p.opacity;this.keeper.visible=p.visible;
 }
 snapshot(){return {...super.snapshot(),keeperMotion:'lift, slide clear, depart; reverse on closing',keeperPose:this.pose};}
}
