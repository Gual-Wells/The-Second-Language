import {parseTeachingHeading} from '../web/teaching-units.js';
export {READER_LAYOUT_CAPABILITY} from '../web/reader-capability.js';

// No identity remapping or alternate content. Old open JS realms receive a
// useful upgrade message instead of an unparseable immutable chapter.
export function requiresFusedLayoutReader(markdown) {
  return requiredReaderLayout(markdown)>0;
}
export function requiredReaderLayout(markdown) {
  let required=0;
  for(const match of markdown.matchAll(/^## (.+)$/gm)){
    const heading=parseTeachingHeading(match[1]);
    if(heading?.quickGloss)return 3;
    if(heading?.modern)required=2;
  }
  return required;
}
export function readerLayoutUpgrade(request,markdown,{isPublisher=false}={}) {
  const required=requiredReaderLayout(markdown),capability=Number(request.headers.get('x-reader-layout'));
  return !isPublisher&&required>0&&!(Number.isInteger(capability)&&capability>=required);
}
