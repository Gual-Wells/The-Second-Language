// Reply arrival order never changes question order or invents a parent.
export function questionPairs(messages){
 const questions=messages.filter(m=>m.role==='user').sort((a,b)=>a.seq-b.seq);
 const replies=new Map();for(const m of messages)if(m.role==='assistant'&&m.replyTo)replies.set(m.replyTo,m);
 return questions.map(question=>({question,answer:replies.get(question.id)||null}));
}
