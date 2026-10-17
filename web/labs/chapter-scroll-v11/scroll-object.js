import {ScrollObject as PreviousScroll} from '../chapter-scroll-v8/scroll-object.js';
export class ScrollObject extends PreviousScroll {
 constructor(...args){super(...args);this.material.bumpScale=.0045;}
}
