import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createServer} from './serve-scroll-lab.mjs';
import {chromium} from 'file:///D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs';
const scratch='D:/CodexStorage/workspaces/second-language-scroll-lab/.cache/scroll-v6/browser-temp';await mkdir(scratch,{recursive:true});process.env.TEMP=scratch;process.env.TMP=scratch;
const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
try{
 const page=await browser.newPage();await page.goto(`http://127.0.0.1:${server.address().port}/labs/chapter-scroll/CREDITS.md`);
 const sources=[];for(const version of ['v5','v6']){const src=await readFile(`web/labs/chapter-scroll-${version}/scroll-object.js`,'utf8');sources.push({version,shader:src.match(/(?:export )?const deformation=`([\s\S]*?)`;/)[1]});}
 const result=await page.evaluate(sources=>{
  const gl=document.createElement('canvas').getContext('webgl2');
  function sample(shader,p){
   const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
   const vs=compile(gl.VERTEX_SHADER,`#version 300 es\nprecision highp float;in vec3 q;out vec3 samplePosition;\n${shader}\nvoid main(){samplePosition=parchment(q);gl_Position=vec4(0.,0.,0.,1.);}`),fs=compile(gl.FRAGMENT_SHADER,'#version 300 es\nprecision highp float;out vec4 c;void main(){c=vec4(1.);}');
   const prog=gl.createProgram();gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.transformFeedbackVaryings(prog,['samplePosition'],gl.INTERLEAVED_ATTRIBS);gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);
   const h=6.3,w=4.5,b=-h/2+p*h,rad=Math.sqrt(.145**2+h*(1-p)*.035/Math.PI),eps=.00002;
   for(const [name,value] of Object.entries({scrollBoundary:b,scrollRadius:rad,scrollThickness:.035,scrollHeight:h,scrollWidth:w,scrollOpen:p}))gl.uniform1f(gl.getUniformLocation(prog,name),value);
   const q=[];for(const x of [-2.1,-1.1,0,1.1,2.1])q.push(x,-b-eps,0,x,-b+eps,0);
   const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vbo=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vbo);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(q),gl.STATIC_DRAW);const loc=gl.getAttribLocation(prog,'q');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);
   const tf=gl.createTransformFeedback(),buf=gl.createBuffer();gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,tf);gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER,buf);gl.bufferData(gl.TRANSFORM_FEEDBACK_BUFFER,q.length*4,gl.STREAM_READ);gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER,0,buf);gl.enable(gl.RASTERIZER_DISCARD);gl.beginTransformFeedback(gl.POINTS);gl.drawArrays(gl.POINTS,0,q.length/3);gl.endTransformFeedback();gl.disable(gl.RASTERIZER_DISCARD);const values=new Float32Array(q.length);gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER,0,values);
   let maxGap=0;for(let i=0;i<values.length;i+=6)maxGap=Math.max(maxGap,Math.hypot(values[i]-values[i+3],values[i+1]-values[i+4],values[i+2]-values[i+5]));
   gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,null);gl.deleteTransformFeedback(tf);gl.deleteBuffer(buf);gl.deleteBuffer(vbo);gl.deleteVertexArray(vao);gl.deleteProgram(prog);gl.deleteShader(vs);gl.deleteShader(fs);return {paperProgress:p,gap:maxGap,epsilon:eps};
  }
  return sources.map(({version,shader})=>({version,samples:[.90,.93,.95,.97,.98,.99,.995].map(p=>sample(shader,p))}));
 },sources);
 const before=Math.max(...result[0].samples.map(x=>x.gap)),after=Math.max(...result[1].samples.map(x=>x.gap));if(!(before>.01&&after<.0002))throw Error(JSON.stringify(result));
 await writeFile('research/scroll-lab-v6/continuity.json',JSON.stringify({method:'Actual vertex shader sampled through WebGL2 transform feedback on both sides of winding boundary; no replacement CPU deformation',beforeMaxGap:before,afterMaxGap:after,result},null,2)+'\n');console.log(JSON.stringify({beforeMaxGap:before,afterMaxGap:after}));
}finally{await browser.close();await new Promise(r=>server.close(r));}
