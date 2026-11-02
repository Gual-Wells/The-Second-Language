// JSON-RPC transport only. Native Codex owns goals, turns, tools and model work.
import {spawn} from 'node:child_process';
import {EventEmitter} from 'node:events';
import {createInterface} from 'node:readline';
import {backgroundCodexArgs} from '../../protocol/background-codex.mjs';

export function codexGoalServerArgs(){
  return ['--search','-a','never','app-server','--stdio','-c','model="gpt-6.1-sol"',
    ...backgroundCodexArgs,'--enable','goals','-c','sandbox_mode="danger-full-access"'];
}

export class CodexAppServer extends EventEmitter {
  constructor({executable,root,spawnImpl=spawn,onMessage=()=>{},onStderr=()=>{},env=process.env}){
    super();this.nextId=1;this.pending=new Map();this.closed=false;this.stopping=false;
    this.child=spawnImpl(executable,codexGoalServerArgs(),{cwd:root,env,windowsHide:true,stdio:['pipe','pipe','pipe']});
    this.child.stdin.on('error',error=>this.fail(error));
    this.child.stderr.on('data',chunk=>{try{onStderr(chunk);}catch(error){this.fail(error);}});
    this.lines=createInterface({input:this.child.stdout,crlfDelay:Infinity});
    this.lines.on('error',error=>this.fail(error));
    this.lines.on('line',line=>{
      if(!line.trim())return;
      let message;try{message=JSON.parse(line);}catch{this.fail(Error('Codex app-server returned invalid JSON'));return;}
      try{onMessage(message);}catch(error){this.fail(error);return;}
      if(message.method){
        // Unexpected interactive requests must remain visible. Never invent an answer.
        if(message.id!=null){this.emit('request',message);return;}
        this.emit('notification',message);return;
      }
      const pending=this.pending.get(message.id);if(!pending)return;
      this.pending.delete(message.id);clearTimeout(pending.timer);
      if(message.error)pending.reject(Object.assign(Error(message.error.message||'Codex RPC failed'),{rpcError:message.error}));
      else pending.resolve(message.result);
    });
    this.child.on('error',error=>this.fail(error));
    this.terminal=new Promise(resolve=>this.child.on('close',(code,signal)=>{
      this.closed=true;this.fail(Error('Codex app-server closed before pending work finished'));
      this.emit('closed',{code,signal});resolve({code,signal});
    }));
  }
  fail(error){
    for(const pending of this.pending.values()){clearTimeout(pending.timer);pending.reject(error);}
    this.pending.clear();if(!this.stopping)this.emit('failure',error);
  }
  async request(method,params={},timeoutMs=45000){
    if(this.closed)throw Error('Codex app-server is closed');
    const id=this.nextId++;
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{this.pending.delete(id);reject(Error('Codex RPC response unknown: '+method));},timeoutMs);
      this.pending.set(id,{resolve,reject,timer});
      this.child.stdin.write(JSON.stringify({id,method,params})+'\n',error=>{if(error){clearTimeout(timer);this.pending.delete(id);reject(error);}});
    });
  }
  notify(method,params){this.child.stdin.write(JSON.stringify({method,...(params?{params}:{})})+'\n');}
  async initialize(){
    const result=await this.request('initialize',{clientInfo:{name:'second_language_daily_goal',version:'1.0.0'},capabilities:{experimentalApi:true}});
    this.notify('initialized');return result;
  }
  async stop(){
    if(this.stopPromise)return this.stopPromise;
    this.stopping=true;
    this.stopPromise=(async()=>{
      if(!this.closed){this.child.stdin.end();const timer=setTimeout(()=>{if(!this.closed)this.child.kill();},3000);try{await this.terminal;}finally{clearTimeout(timer);}}
      return this.terminal;
    })();return this.stopPromise;
  }
}
