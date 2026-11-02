// Domain admission metadata, not a claim of truth, licensing or source quality.
// New publishers travel with each immutable original instead of five workers
// editing one global allowlist. The author still verifies publisher and rights.
import {createHash} from 'node:crypto';
const roles=new Set(['service-instruction','technical-discourse','reported-event','public-dialogue','narrative','primary-research','institutional-record']);
const text=(value,name)=>{if(typeof value!=='string'||!value.trim()||value.length>6000)throw Error('来源准入缺少'+name);return value;};
export function sourceHost(raw){return new URL(raw).hostname.toLowerCase().replace(/^www\./,'');}
function publicHome(raw){const u=new URL(raw);if(u.protocol!=='https:'||u.username||u.password||u.port&&u.port!=='443'||!u.hostname.includes('.')||/^[\d.]+$/.test(u.hostname)||u.hostname.includes(':')||/\.(?:local|localhost|internal)$/i.test(u.hostname))throw Error('来源准入须为已核验的公开HTTPS发布者');u.hash='';return u;}
export function sourceAdmissionId(home){return 'external-'+createHash('sha256').update(publicHome(home).origin.toLowerCase().replace('://www.','://')).digest('hex').slice(0,20);}
export function validateSourceAdmission(value){
  if(value?.schemaVersion!==1||value.id!==sourceAdmissionId(value.home)||!roles.has(value.role))throw Error('来源准入版本、身份或语篇角色无效');
  for(const key of ['name','publisherEvidence','editorialBasis','rightsBoundary'])text(value[key],key);
  if(typeof value.verifiedAt!=='string'||!/(?:Z|[+-]\d\d:\d\d)$/.test(value.verifiedAt)||!Number.isFinite(Date.parse(value.verifiedAt))||Date.parse(value.verifiedAt)>Date.now()+300000)throw Error('准入须保真实核验时间');
  if(!Array.isArray(value.articleHosts)||!value.articleHosts.length||new Set(value.articleHosts).size!==value.articleHosts.length||value.articleHosts.some(h=>typeof h!=='string'||h!==sourceHost(publicHome('https://'+h).href))||!value.articleHosts.includes(sourceHost(value.home)))throw Error('准入须逐一核实实际正文域名，不能使用通配符');
  return value;
}
export function admittedSource(value){validateSourceAdmission(value);return {id:value.id,name:value.name,home:value.home,entryUrl:value.home,role:value.role,articleHosts:value.articleHosts,sourceAdmission:value};}
