const template=Object.freeze({id:'manuscript-memento-v12',width:4.5,height:6.3,coreRadius:.145,layerThickness:.035,
 fontFamily:'Aboensis',fontUrl:'../chapter-scroll/assets/Aboensis-Regular.otf',
 skin:'../chapter-scroll-v6/assets/charter.webp',reverse:'../chapter-scroll-v6/assets/charter.webp',keeper:'../chapter-scroll-v4/assets/keeper.webp',environment:'../chapter-scroll-v3/assets/studio.hdr',
 ornament:'assets/river-margin.png',ornamentDigest:'94462f7c5a469568ee4f68ac9c3de418ab7645832cbd81006f6b34619acca3d1',ink:'#30251b',rubric:'#58372d'});
export function getTemplate(id){if(id!==template.id)throw Error('Unknown scroll series');return template;}
