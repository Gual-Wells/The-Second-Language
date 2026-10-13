from pathlib import Path
import requests,json,sys,re
sys.stdout.reconfigure(encoding='utf-8')
root=Path(__file__).resolve().parent
sources=root/'sources';sources.mkdir(parents=True,exist_ok=True)
s=requests.Session();s.trust_env=False
urls={
 'blender51-index':'https://download.blender.org/release/Blender5.1/',
 'mcp-readme':'https://projects.blender.org/lab/blender_mcp/raw/branch/main/README.md',
 'mcp-tree':'https://projects.blender.org/api/v1/repos/lab/blender_mcp/git/trees/main?recursive=true',
 'mcp-setup':'https://projects.blender.org/lab/blender_mcp/wiki/Setup',
 'mcp-releases':'https://projects.blender.org/api/v1/repos/lab/blender_mcp/releases',
}
rows=[]
for name,url in urls.items():
 try:
  r=s.get(url,timeout=(10,30));row={'name':name,'url':url,'status':r.status_code}
  if r.status_code==200:
   (sources/(name+'.txt')).write_text(r.text,encoding='utf-8')
   if name=='blender51-index':row['assets']=sorted(set(re.findall(r'href="([^"]*(?:windows-x64.zip|sha256)[^"]*)"',r.text)))
   elif name=='mcp-tree':row['files']=[x['path'] for x in r.json().get('tree',[]) if x['type']=='blob']
   elif name=='mcp-releases':row['releases']=[{'tag':x['tag_name'],'assets':[{'name':a['name'],'url':a['browser_download_url'],'size':a['size']} for a in x['assets']]} for x in r.json()[:3]]
   else:row['text']=r.text[:12000]
  rows.append(row)
 except Exception as e:rows.append({'name':name,'error':type(e).__name__+': '+str(e)})
(sources/'discovery.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(rows,ensure_ascii=False))
