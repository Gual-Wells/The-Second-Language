export const trialId='question-voices-20261004';
export const samples=[
 {id:'personal',title:'日常提问',part:'Part 1',text:'Do you prefer studying on your own or with other people? Why? Can you tell me about a time when studying with someone else helped you understand something better?'},
 {id:'long-turn',title:'考官引导',part:'Part 2',text:'Now, I would like you to talk about a useful skill you have learned. You have one minute to prepare, and you can make some notes if you wish. Then I will ask you to speak for one to two minutes.',card:'Describe a useful skill you have learned.\nYou should say:\n• what the skill is\n• how you learned it\n• when you use it\nand explain why this skill is important to you.'},
 {id:'discussion',title:'讨论追问',part:'Part 3',text:'Some people think schools should spend more time teaching practical skills. Others believe academic subjects are more important. What do you think? How might the skills people need at work change in the future?'},
];
export const voices=[
 {id:'a',label:'声音 A',model:'microsoft/mai-voice-2.1',voice:'en-GB-Harry:MAI-Voice-2.1'},
 {id:'b',label:'声音 B',model:'hexgrad/kokoro-82m',voice:'bm_george'},
 {id:'c',label:'声音 C',model:'@cf/deepgram/aura-2-en',voice:'apollo',kind:'workers-ai',generationPrefix:'c-aura'},
];
