// A series selects an existing skin. Chapter data never supplies executable code or remote assets.
const templates = Object.freeze({
  'late-medieval-parchment-v1': Object.freeze({
    id:'late-medieval-parchment-v1', width:4.5, height:6.2,
    layerThickness:.018, coreRadius:.08,
    fontFamily:'Aboensis', fontUrl:'assets/Aboensis-Regular.otf',
    parchmentUrl:'assets/parchment-cron.png'
  })
});
export function getTemplate(id) {
  if (!Object.hasOwn(templates,id)) throw new Error('卷轴样式暂不可用。');
  return templates[id];
}
