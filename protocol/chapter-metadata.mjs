// Shared display-label contract for packers, local admission and the Worker.
// The server still assigns the real chapter sequence; a label is not an index.
export function assertChapterLabels(value){
 if(typeof value?.title!=='string'||!value.title.trim()||value.title.length>180)throw Error('章节 title 须为1–180字符的标题文本');
 if(typeof value.subtitle!=='string'||value.subtitle.length>300)throw Error('章节 subtitle 须为不超过300字符的文本');
 if(typeof value.number!=='string'||value.number.length>80)throw Error('章节 number 须为不超过80字符的章号文本，例如“第 1 章”；不能填写数字，正式序号由服务器确认');
 return value;
}
