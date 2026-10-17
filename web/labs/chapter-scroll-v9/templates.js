const templates=Object.freeze({
 'solemn-charter-v9':Object.freeze({id:'solemn-charter-v9',width:4.5,height:6.3,coreRadius:.145,layerThickness:.035,
  fontFamily:'Aboensis',fontUrl:'../chapter-scroll/assets/Aboensis-Regular.otf',
  skin:'../chapter-scroll-v6/assets/charter.webp',reverse:'../chapter-scroll-v6/assets/charter.webp',keeper:'../chapter-scroll-v4/assets/keeper.webp',environment:'../chapter-scroll-v3/assets/studio.hdr',
  ink:'#30281f',rubric:'#382b21'})
});
export function getTemplate(id){if(!Object.hasOwn(templates,id))throw Error('Unknown scroll series');return templates[id];}
