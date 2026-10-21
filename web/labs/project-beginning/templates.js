const source=new URL('../project-beginning/',import.meta.url);
const url=path=>new URL(path,source).href;
const paperFolds=Object.freeze({
 provenance:'Trial approximation from the actual paper image; not precision measurement or artistic acceptance',
 diagonal:Object.freeze({offset:.229,slope:.179,width:.009,depth:.008}),
 lower:Object.freeze({offset:.655,sine:.021,slope:.005,width:.010,depth:.009})
});
const template=Object.freeze({
 id:'project-commemorative-beginning-v1',width:4.5,height:6.3,coreRadius:.145,layerThickness:.035,
 nominalSizeMM:Object.freeze([300,420]),fontFamily:'Aboensis',
 fontUrl:url('../chapter-scroll/assets/Aboensis-Regular.otf'),
 skin:url('assets/parchment.webp'),reverse:url('assets/parchment.webp'),
 paperNormal:url('../chapter-scroll-v4/assets/skin-normal.jpg'),paperRoughness:url('../chapter-scroll-v4/assets/skin-roughness.jpg'),
 keeper:url('../chapter-scroll-v14/assets/unused-keeper.png'),
 environment:url('../chapter-scroll-v3/assets/studio.hdr'),ornament:url('assets/daily-miniature.png'),
 ink:'#30251b',rubric:'#58372d',paperFolds,
 paperMicrostructure:Object.freeze({repeat:Object.freeze([1.4,2.1]),normalScale:.035,impressionScale:.0045})
});
export function getTemplate(id){if(id!==template.id)throw Error('Unknown project beginning template');return template;}
