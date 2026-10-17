const template=Object.freeze({id:'memorial-charter-v11',width:4.7,height:6.2666666667,coreRadius:.145,layerThickness:.035,
 fontFamily:'Aboensis',fontUrl:'../chapter-scroll/assets/Aboensis-Regular.otf',
 skin:'../chapter-scroll-v6/assets/charter.webp',reverse:'../chapter-scroll-v6/assets/charter.webp',keeper:'../chapter-scroll-v4/assets/keeper.webp',environment:'../chapter-scroll-v3/assets/studio.hdr',
 ink:'#30251b',rubric:'#493020'});
export function getTemplate(id){if(id!==template.id)throw Error('Unknown scroll series');return template;}
