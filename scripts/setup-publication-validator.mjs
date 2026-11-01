// Creates a local validation signing key, never a provider/API credential.
// Private key bytes are not printed and must never enter the repository.
import fs from 'node:fs/promises';
import path from 'node:path';
import {generateKeyPairSync,createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {DEFAULT_PUBLICATION_VALIDATOR_DIRECTORY} from './lib/publication-attestation.mjs';
const directory=DEFAULT_PUBLICATION_VALIDATOR_DIRECTORY;
await fs.mkdir(directory,{recursive:true});const physical=await fs.realpath(directory);
if(process.platform==='win32'&&!/^D:[\\/]/i.test(physical))throw Error('出版验证私钥目录必须实际存D盘');
if(process.platform==='win32'){
 const literal=physical.replaceAll("'","''");
 // A fresh protected ACL replaces inherited AND old explicit grants. It grants
 // only this Windows identity and SYSTEM, before private bytes are written.
 const script=`$ErrorActionPreference='Stop';$current=[System.Security.Principal.WindowsIdentity]::GetCurrent().User;$system=New-Object System.Security.Principal.SecurityIdentifier('S-1-5-18');$acl=New-Object System.Security.AccessControl.DirectorySecurity;$acl.SetAccessRuleProtection($true,$false);foreach($sid in @($current,$system)){$rule=New-Object System.Security.AccessControl.FileSystemAccessRule($sid,'FullControl','ContainerInherit,ObjectInherit','None','Allow');$acl.AddAccessRule($rule)};[System.IO.Directory]::SetAccessControl('${literal}',$acl);$actual=[System.IO.Directory]::GetAccessControl('${literal}');$allowed=@($current.Value,$system.Value);foreach($rule in $actual.Access){$sid=$rule.IdentityReference.Translate([System.Security.Principal.SecurityIdentifier]).Value;if($sid -notin $allowed -or $rule.AccessControlType -ne 'Allow'){throw 'Unexpected publication validator ACL'}};if(-not $actual.AreAccessRulesProtected){throw 'Publication validator ACL is inherited'}`;
 execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',script],{windowsHide:true,stdio:['ignore','pipe','pipe']});
}else await fs.chmod(physical,0o700);
const names=['ed25519-private.pk8','public-keyring.json','validator.json'];
for(const name of names)try{await fs.access(path.join(physical,name));throw Error('验证器文件已存在，拒绝覆盖；请复用原公开配置。');}catch(error){if(error.code!=='ENOENT')throw error;}
const {privateKey,publicKey}=generateKeyPairSync('ed25519'),spki=publicKey.export({format:'der',type:'spki'}),keyId='ed25519-'+createHash('sha256').update(spki).digest('hex').slice(0,24),privateBytes=privateKey.export({format:'der',type:'pkcs8'});
try{await fs.writeFile(path.join(physical,names[0]),privateBytes,{flag:'wx',mode:0o600});}finally{privateBytes.fill(0);}
const publicKeyringPath=path.join(physical,names[1]),keyring={[keyId]:spki.toString('base64')};
await fs.writeFile(publicKeyringPath,JSON.stringify(keyring,null,2)+'\n',{flag:'wx',mode:0o600});
await fs.writeFile(path.join(physical,names[2]),JSON.stringify({schemaVersion:1,keyId,createdAt:new Date().toISOString(),privateKeyFile:names[0]},null,2)+'\n',{flag:'wx',mode:0o600});
console.log(JSON.stringify({keyId,publicKeyringPath,publicKeyring:keyring,privateKeyPrinted:false,physicalStorage:'D',acl:process.platform==='win32'?'current-user-and-SYSTEM-only':'owner-only'}));
