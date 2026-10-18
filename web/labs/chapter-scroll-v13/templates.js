const template=Object.freeze({id:'manuscript-memento-v13',width:4.5,height:6.3,coreRadius:.145,layerThickness:.035,
 fontFamily:'Aboensis',fontUrl:'../chapter-scroll/assets/Aboensis-Regular.otf',
 skin:'../chapter-scroll-v6/assets/charter.webp',reverse:'../chapter-scroll-v6/assets/charter.webp',keeper:'../chapter-scroll-v4/assets/keeper.webp',environment:'../chapter-scroll-v3/assets/studio.hdr',
 ornament:'assets/leaf-and-letter.png',ornamentDigest:'e5aa04af52dde8cc3f32d0d9dfac3fe1696ef6d275c0514d7e0c0065f517d9c5',planDigest:'babdc4fa311113df30933e359998798c84fe8b329fd8b591ddeb7009973e220a',ink:'#30251b',rubric:'#58372d'});
export function getTemplate(id){if(id!==template.id)throw Error('Unknown scroll series');return template;}
