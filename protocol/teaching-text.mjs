// Hidden identities support navigation; explanations must use their meanings.
export function assertTeachingText(parsed){
 const visible=parsed.parts.one.replace(/<!--[^]*?-->/g,''),words=new Set(parsed.words.map(w=>w.id));
 for(const match of visible.matchAll(/\b(?:[UWS]\d{3,}|NEW_W\d+_\d+)\b/g))if(parsed.uses.has(match[0])||words.has(match[0]))throw Error('第一部分不能显示内部编码：'+match[0]);
 return parsed;
}
