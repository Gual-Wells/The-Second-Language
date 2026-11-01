// Project background invocations only. Do not alter the user's interactive
// configuration, service tier, model selection or existing task authorization.
export const BACKGROUND_REASONING_EFFORT='high';
export const BACKGROUND_SUBAGENT_EFFORT='high';
export const backgroundCodexArgs=Object.freeze([
 '-c',`model_reasoning_effort="${BACKGROUND_REASONING_EFFORT}"`,
 '-c','agents.enabled=true',
 '-c',`agents.default_subagent_reasoning_effort="${BACKGROUND_SUBAGENT_EFFORT}"`,
 '--enable','multi_agent'
]);
