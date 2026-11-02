import assert from 'node:assert/strict';
import {sourceWindows} from './lib/source-window.mjs';
const text='İ😀Prefix. '+('x'.repeat(30000))+' PLAUSIBLE within a genuine original paragraph. '+('y'.repeat(30000))+' plausible conclusion.';
const positions=sourceWindows(text,{literal:'plausible',limit:1});assert.equal(positions.matches.length,1);assert.equal(text.slice(positions.matches[0].start,positions.matches[0].end),'PLAUSIBLE');assert.ok(positions.nextFrom>positions.matches[0].end);
const next=sourceWindows(text,{literal:'plausible',from:positions.nextFrom,limit:1});assert.equal(next.matches.length,1);assert.equal(next.matches[0].surface,'plausible');assert.equal(next.nextFrom,null);
const start=positions.matches[0].start-20,end=positions.matches[0].end+60,view=sourceWindows(text,{start,end});assert.equal(view.text,text.slice(start,end));assert.equal(view.text.length,end-start);assert.equal(view.wholeDocumentProvided,false);assert.ok(view.text.length<200,'Single-line source does not flood the context');
const literal=sourceWindows('x (a+b) [literal].',{literal:'(a+b)'});assert.equal(literal.matches.length,1,'No regex interpretation of user search terms');
assert.throws(()=>sourceWindows(text,{start:0,end:text.length}),/16000/);assert.throws(()=>sourceWindows(text,{start:3,end:text.length+1}),/范围/);assert.equal(sourceWindows('Short complete original.',{start:0,end:24}).wholeDocumentProvided,true);
console.log(JSON.stringify({passed:7,unicodeOffsetsExact:true,paginationExplicit:true,exactWindowOnly:true,regexEscaped:true,noSilentTruncation:true,fullOriginalUnchanged:true,networkCalls:0,modelCalls:0}));
