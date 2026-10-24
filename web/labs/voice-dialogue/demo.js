// Original interface specimen only. Never a formal lesson or a VIX publication.
export async function demoChapter() {
  const markdown = [
    '<!-- PART:one -->',
    '<!-- WORD:W001 -->', '# clarify', '**词源**：clar- 有“清楚、明亮”的含义。',
    '<!-- USE:U001 -->', '## clarify · 说明 /ˈklærəfaɪ/', '`把不清楚的事情解释清楚`', '及物动词；可接问题、立场或需求，也可接疑问从句。',
    '<!-- WORD:W002 -->', '# compromise', '**词源**：相关词根有“共同承诺”的含义；现代含义依语境区分。',
    '<!-- USE:U002 -->', '## compromise · 折中 /ˈkɑːmprəmaɪz/', '`双方各作让步以达成协议`', '作动词可用 compromise on something；不是一方无条件服从。',
    '<!-- USE:U003 -->', '- **reach a compromise**：达成双方均作出让步的折中方案。',
    '<!-- USE:U004 -->', '## compromise · 损害 /ˈkɑːmprəmaɪz/', '`使安全、质量或原则等受到损害`', '及物动词；此处不是“折中”的意思。',
    '<!-- WORD:W003 -->', '# feasible', '**词源**：来自有“可以做”的含义的词。',
    '<!-- USE:U005 -->', '## feasible /ˈfiːzəbəl/', '`在实际条件下可以办到的`', '形容词；与值得做、理想等评价不同。',
    '<!-- WORD:W004 -->', '# postpone', '**词源**：相关词根有“放到后面”的含义。',
    '<!-- USE:U006 -->', '## postpone /poʊˈspoʊn/', '`把原定的事情推迟到较晚时候`', '可接名词或动名词；postpone something until a later date。',
    '<!-- WORD:W005 -->', '# priority', '**词源**：与“较早、在先”的词根有关。',
    '<!-- USE:U007 -->', '## priority /praɪˈɔːrəti/', '`应优先处理或最重视的事情`', '可数名词；说明重要性，不能仅表示时间最早。',
    '<!-- PART:two -->',
    '<!-- WORD:W001 -->', '# clarify', '<!-- EXAMPLE:U001 -->', 'Could you clarify what the room hire includes?', '`你能说清楚场地租金包括什么吗？`',
    '<!-- WORD:W002 -->', '# compromise', '<!-- EXAMPLE:U002 -->', 'We can compromise on the starting time.', '`我们可以就开始时间各作让步。`', '<!-- EXAMPLE:U003 -->', 'After a long discussion, the neighbours reached a compromise.', '`经过长时间讨论，邻居们达成了折中方案。`', '<!-- EXAMPLE:U004 -->', 'A cheaper lock could compromise security.', '`便宜一些的锁可能损害安全性。`',
    '<!-- WORD:W003 -->', '# feasible', '<!-- EXAMPLE:U005 -->', 'Is an outdoor meeting feasible in this weather?', '`这种天气在室外开会可行吗？`',
    '<!-- WORD:W004 -->', '# postpone', '<!-- EXAMPLE:U006 -->', 'We postponed painting the hall until Monday.', '`我们把粉刷礼堂推迟到了周一。`',
    '<!-- WORD:W005 -->', '# priority', '<!-- EXAMPLE:U007 -->', 'Keeping the entrance accessible is our first priority.', '`保持入口便于通行是我们最优先考虑的事。`',
    '<!-- PART:three -->', '<!-- ARTICLE:A01 -->', '# A Plan for the Neighbourhood Hall',
    '<!-- SENTENCE:S001 USE:U001 -->', 'Before booking the hall, Maya asked the caretaker to clarify which rooms were available.', '`预订礼堂前，玛雅请管理员说明哪些房间可以使用。`',
    '<!-- SENTENCE:S002 USE:U007 -->', 'An entrance without steps was a priority because several guests used wheelchairs.', '`无台阶的入口是优先事项，因为几位来宾使用轮椅。`',
    '<!-- SENTENCE:S003 USE:U005 -->', 'The smaller room was affordable, but fitting every table inside it was not feasible.', '`小房间租金在预算内，但把所有桌子摆进去并不可行。`',
    '<!-- SENTENCE:S004 USE:U006 -->', 'Rather than postpone the entire event, the group considered serving food in two sittings.', '`小组没有推迟整场活动，而是考虑分两轮供餐。`',
    '<!-- SENTENCE:S005 USE:U002 -->', 'The cooks were willing to compromise on the menu if the kitchen remained available all afternoon.', '`厨师们愿意在菜单上让步，条件是整个下午都能使用厨房。`',
    '<!-- SENTENCE:S006 USE:U004 -->', 'They would not compromise food safety to keep an earlier starting time.', '`他们不会为了保持较早的开始时间而损害食品安全。`',
    '<!-- SENTENCE:S007 USE:U003 -->', 'By the end of the meeting, they had reached a compromise that everyone could explain to the volunteers.', '`会议结束时，他们已达成一项人人都能向志愿者说明的折中方案。`',
  ].join('\n\n') + '\n';
  const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(markdown)))].map(n => n.toString(16).padStart(2, '0')).join('');
  return { id: 'voice-demo-v1', date: null, title: '口语设施示范：共同安排一场活动', number: '示范', kind: 'demo', digest, markdown, demo: true };
}
