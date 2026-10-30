import {parseTeachingHeading} from '../web/teaching-units.js';

// No identity remapping or alternate content. Old open JS realms receive a
// useful upgrade message instead of an unparseable immutable chapter.
export function requiresFusedLayoutReader(markdown) {
  return [...markdown.matchAll(/^## (.+)$/gm)].some(match=>parseTeachingHeading(match[1])?.modern);
}
export function readerLayoutUpgrade(request,markdown,{isPublisher=false}={}) {
  return !isPublisher&&request.headers.get('x-reader-layout')!=='2'&&requiresFusedLayoutReader(markdown);
}
