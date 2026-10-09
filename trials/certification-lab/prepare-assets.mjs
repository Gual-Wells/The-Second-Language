import {mkdir,writeFile,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const packages=[['three','0.186.1','blFeqb49wRCSGUGj7gtpfnSGHy2lwDk94RhUmS1c/hTby70kvChbWpkJ4Pm1390LqzzvTmzgXKHPEafJwCb8jA=='],['@dimforge/rapier3d-compat','0.21.0','tCl1HPGwOhn5aCQbgqWbOH+Nx/5fnr3IPAnzQuR7zIhC/raqi2yxC6LhvZqjdI2El5hQgY5RDAwDrAjAi2FdPA==']];
const target='web/labs/certification/vendor';await mkdir(target,{recursive:true});
for(const [name,version,integrity]of packages){
 const short=name==='three'?'three':'rapier',root=`.cache/certification-lab/${short}`;await mkdir(root,{recursive:true});
 const meta=await(await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}/${version}`)).json();
 const bytes=Buffer.from(await(await fetch(meta.dist.tarball)).arrayBuffer());if(createHash('sha512').update(bytes).digest('base64')!==integrity)throw Error('Dependency integrity mismatch');
 await writeFile(root+'/package.tgz',bytes);
 const extracted=spawnSync('python',['-c',"import tarfile,sys; tarfile.open(sys.argv[1]).extractall(sys.argv[2],filter='data')",root+'/package.tgz',root],{windowsHide:true});if(extracted.status)throw Error('Dependency extraction failed');
 if(short==='three')for(const f of ['three.module.js','three.core.js'])await copyFile(root+'/package/build/'+f,target+'/'+f);
 else await copyFile(root+'/package/dist/rapier.mjs',target+'/rapier.js');
 await copyFile(root+'/package/LICENSE',target+'/'+short+'-LICENSE.txt');
 console.log(`${name} ${version}: verified`);
}
await writeFile(target+'/versions.json',JSON.stringify(packages.map(([name,version,integrity])=>({name,version,integrity:'sha512-'+integrity})),null,2));


