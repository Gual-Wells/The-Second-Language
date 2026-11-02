import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {createHash} from 'node:crypto';
import {prepareDigrProject,inspectDigrProject,preflightDigrPublication,studyDate,currentDigrInputs} from './lib/digr-project.mjs';
import {acquireDigrRuntime} from './lib/digr-transport.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),[action,...args]=process.argv.slice(2);
if(action==='daily'){
 if(args.length!==1)throw Error('用法：digr-project.mjs daily DATE');const date=studyDate(args[0]),task=(await fs.readFile(path.join(root,'protocol/daily-prompt.txt'),'utf8')).replaceAll('{STUDY_DATE}',date);console.log(JSON.stringify(await prepareDigrProject({root,kind:'daily',date,task})));
}else if(action==='prepare'){
 const options={};for(let i=0;i<args.length;i+=2){if(!['--kind','--date','--task-file'].includes(args[i])||!args[i+1]||options[args[i]]!=null)throw Error('未知或重复参数');options[args[i]]=args[i+1];}
 if(!options['--task-file'])throw Error('需明确的任务文件');console.log(JSON.stringify(await prepareDigrProject({root,kind:options['--kind']||'research',date:options['--date'],task:await fs.readFile(path.resolve(options['--task-file']),'utf8')})));
}else if(action==='acquire'){
 if(args.length!==1)throw Error('用法：digr-project.mjs acquire PACKET');const packetFile=path.resolve(args[0]);await inspectDigrProject(packetFile);const bytes=await fs.readFile(packetFile),message=await fs.readFile(path.join(path.dirname(packetFile),'prompt.txt'),'utf8');const receipt=await acquireDigrRuntime({message});await inspectDigrProject(packetFile);if(!bytes.equals(await fs.readFile(packetFile)))throw Error('获取期间项目材料发生改变');receipt.projectPacketSha256=createHash('sha256').update(bytes).digest('hex');const target=path.join(path.dirname(packetFile),'acquisition-'+randomUUID()+'.json');await fs.writeFile(target,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({acquisition:target,pinnedCommit:receipt.pinnedCommit,runtimeDirectory:receipt.runtimeDirectory}));
}else if(action==='inspect'){
 if(args.length!==1)throw Error('用法：digr-project.mjs inspect PACKET');const packet=await inspectDigrProject(path.resolve(args[0]));console.log(JSON.stringify({id:packet.id,kind:packet.kind,studyDate:packet.studyDate,immutableInputs:packet.immutableInputs.length,contentAuthority:packet.contentAuthority,observedChapter:packet.observedChapter}));
}else if(action==='inputs'){
 if(args.length!==1)throw Error('用法：digr-project.mjs inputs PACKET');const packet=await inspectDigrProject(path.resolve(args[0]));console.log(JSON.stringify(await currentDigrInputs({root:packet.projectRoot,date:packet.studyDate})));
}else if(action==='preflight'){
 if(args.length!==1&&!(args.length===3&&args[1]==='--root'))throw Error('用法：digr-project.mjs preflight DATE [--root PATH]');console.log(JSON.stringify(await preflightDigrPublication({root:args[2]?path.resolve(args[2]):root,date:args[0]})));
}else throw Error('用法：digr-project.mjs daily DATE | prepare --task-file FILE [--kind research|revision] [--date DATE] | acquire PACKET | inspect PACKET | preflight DATE');
