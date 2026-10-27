// Reviewers receive data in stdin. Keep execution/connected tools disabled for
// the main reviewer and its inherited subagents; multi-agent reasoning is allowed.
// Never narrow the user's interactive Codex configuration.
export const qualityModelArgs=[
 ...['shell_tool','code_mode','code_mode_host','apps','plugins','browser_use','browser_use_external','computer_use','view_image','image_generation','workspace_dependencies','memories'].flatMap(name=>['--disable',name]),
 '-c','web_search="disabled"'
];
export function qualityModelEnvironment(source=process.env){
 const allowed=/^(PATH|SYSTEMROOT|WINDIR|COMSPEC|USERPROFILE|HOME|LOCALAPPDATA|APPDATA|CODEX_HOME|TEMP|TMP|PROGRAMFILES(?:\(X86\))?|PROGRAMDATA|USERNAME|USERDOMAIN|HTTPS?_PROXY|ALL_PROXY|NO_PROXY|SSL_CERT_FILE|NODE_EXTRA_CA_CERTS|TERM|COLORTERM)$/i;
 const env=Object.fromEntries(Object.entries(source).filter(([key])=>allowed.test(key)));
 if(process.platform==='win32')env.CODEX_HOME=source.CODEX_HOME||'D:/CodexData';
 return env;
}
