import {getTemplate as original} from '../chapter-scroll-v14/templates.js';
export function getTemplate(id){const t={...original(id)};for(const key of ['fontUrl','skin','reverse','keeper','paperNormal','paperRoughness','environment','ornament'])t[key]=new URL(t[key],new URL('../chapter-scroll-v14/',import.meta.url)).href;return t;}
