import path from 'node:path';
import {fileURLToPath} from 'node:url';
// Existing checkout may remain on C while its production services are active.
// New Windows build payloads live on D; publish and build share the same path.
export function pagesBuildDirectory(){
 const base=path.dirname(fileURLToPath(import.meta.url));
 if(process.platform!=='win32')return path.resolve(base,'dist');
 const root=path.resolve(process.env.SECOND_LANGUAGE_BUILD_ROOT||'D:/CodexStorage/builds/the-second-language');
 if(!/^D:\\/i.test(root))throw Error('Windows build storage must use D');
 return path.join(root,'pages');
}
