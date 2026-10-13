from pathlib import Path
import requests,json,sys,hashlib,zipfile,shutil,time
sys.stdout.reconfigure(encoding='utf-8')
root=Path(__file__).resolve().parent;downloads=root/'downloads';downloads.mkdir(parents=True,exist_ok=True)
s=requests.Session();s.trust_env=False
def get(url,path,expected=None):
 if path.exists() and (expected is None or hashlib.sha256(path.read_bytes()).hexdigest()==expected):return
 part=path.with_suffix(path.suffix+'.partial');start=time.monotonic();total=0;next_print=0
 with s.get(url,stream=True,timeout=(15,60)) as r:
  r.raise_for_status()
  length=int(r.headers.get('Content-Length',0))
  with part.open('wb') as f:
   for chunk in r.iter_content(1024*1024):
    f.write(chunk);total+=len(chunk)
    if time.monotonic()>next_print:
     print(json.dumps({'download':path.name,'bytes':total,'total':length}),flush=True);next_print=time.monotonic()+20
 if expected and hashlib.sha256(part.read_bytes()).hexdigest()!=expected:raise RuntimeError('Checksum mismatch: '+path.name)
 part.replace(path)
def extract(path,to):
 target=to.resolve();to.mkdir(parents=True,exist_ok=True)
 with zipfile.ZipFile(path) as z:
  size=sum(x.file_size for x in z.infolist())
  if shutil.disk_usage(root).free<size+2*1024**3:raise RuntimeError('Insufficient D free space')
  for x in z.infolist():
   resolved=(to/x.filename).resolve()
   if not resolved.is_relative_to(target):raise RuntimeError('Archive escaped task directory')
  z.extractall(to)
base='https://download.blender.org/release/Blender5.1/'
sha=s.get(base+'blender-5.1.2.sha256',timeout=30);sha.raise_for_status()
(downloads/'blender-5.1.2.sha256').write_text(sha.text,encoding='utf-8')
expected=next(line.split()[0] for line in sha.text.splitlines() if line.endswith('blender-5.1.2-windows-x64.zip'))
get(base+'blender-5.1.2-windows-x64.zip',downloads/'blender-5.1.2-windows-x64.zip',expected)
exe=Path('D:/CodexStorage/tools/blender-5.1.2-windows-x64/blender.exe')
if not exe.exists():extract(downloads/'blender-5.1.2-windows-x64.zip',Path('D:/CodexStorage/tools'))
release='https://projects.blender.org/lab/blender_mcp/releases/download/v1.0.3/'
for name in ['mcp-1.0.3.zip','blender-1.0.3.mcpb']:
 get(release+name,downloads/name)
extract(downloads/'blender-1.0.3.mcpb',root/'official-mcp-bundle')
extract(downloads/'mcp-1.0.3.zip',root/'config/scripts/addons/blender_mcp_addon')
for folder in ['config/config','config/datafiles','cache/pip','cache/pycache','tmp','logs','commands','outputs']:(root/folder).mkdir(parents=True,exist_ok=True)
result={'blender':str(exe),'blender_zip_sha256':expected,'mcp_version':'1.0.3','mcp_addon_sha256':hashlib.sha256((downloads/'mcp-1.0.3.zip').read_bytes()).hexdigest(),'storage_root':str(root),'installed_only_portable_files':True}
(root/'environment-install.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result),flush=True)
