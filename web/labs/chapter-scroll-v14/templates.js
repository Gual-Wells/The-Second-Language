const template=Object.freeze({id:'manuscript-memento-v14',width:4.5,height:6.3,coreRadius:.145,layerThickness:.035,
 fontFamily:'Aboensis',fontUrl:'../chapter-scroll/assets/Aboensis-Regular.otf',
 skin:'assets/parchment.webp',reverse:'assets/parchment.webp',keeper:'assets/unused-keeper.png',paperNormal:'assets/parchment-normal.jpg',paperRoughness:'assets/parchment-roughness.jpg',environment:'../chapter-scroll-v3/assets/studio.hdr',
 ornament:'../chapter-scroll-v13/assets/leaf-and-letter.png',ornamentDigest:'e5aa04af52dde8cc3f32d0d9dfac3fe1696ef6d275c0514d7e0c0065f517d9c5',planDigest:'3104ec4b67859f64268c11a327f37a65d1bdfc48c6f75adc24ee702d3f6318fb',ink:'#30251b',rubric:'#58372d'});
export function getTemplate(id){if(id!==template.id)throw Error('Unknown scroll series');return template;}
