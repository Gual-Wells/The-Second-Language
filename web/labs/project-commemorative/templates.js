const source=new URL('../project-commemorative/',import.meta.url);
const url=path=>new URL(path,source).href;
const template=Object.freeze({
 id:'project-commemorative-returning-thread-v1',width:4.5,height:6.3,coreRadius:.145,layerThickness:.035,
 nominalSizeMM:Object.freeze([300,420]),fontFamily:'Aboensis',
 fontUrl:url('../chapter-scroll/assets/Aboensis-Regular.otf'),
 skin:url('assets/parchment.webp'),reverse:url('assets/parchment.webp'),
 paperNormal:url('assets/parchment-normal.jpg'),paperRoughness:url('assets/parchment-roughness.jpg'),
 keeper:url('../chapter-scroll-v14/assets/unused-keeper.png'),
 environment:url('../chapter-scroll-v3/assets/studio.hdr'),ornament:url('assets/returning-thread.png'),
 ink:'#30261f',rubric:'#6b4339',
 paperFold:Object.freeze({position:2190/2868,width:.010,depth:.005})
});
export function getTemplate(id){if(id!==template.id)throw Error('Unknown project commemorative template');return template;}
