const templates=Object.freeze({
 'archival-vellum-v3':Object.freeze({id:'archival-vellum-v3',width:4.5,height:6.75,coreRadius:.145,layerThickness:.035,
  fontFamily:'Aboensis',fontUrl:'../chapter-scroll/assets/Aboensis-Regular.otf',
  skin:'assets/vellum.webp',reverse:'assets/reverse.webp',keeper:'assets/keeper.webp',environment:'assets/studio.hdr',
  ink:'#39291e',rubric:'#752f29'})
});
export function getTemplate(id){if(!Object.hasOwn(templates,id))throw Error('Unknown scroll series');return templates[id];}
