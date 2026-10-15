"""Hash, validate and ZIP the original design package, without including runtime caches."""
from pathlib import Path
import json,hashlib,zipfile,subprocess,sys,os
ROOT=Path(__file__).resolve().parents[1]
output=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else ROOT.parent/'Second-Language-Coin-Original-Design-v1-20261015.zip'
if output.is_relative_to(ROOT):raise RuntimeError('ZIP output must be outside package root')
files=sorted(p for p in ROOT.rglob('*') if p.is_file() and p.name!='MANIFEST.json' and '__pycache__' not in p.parts and p.suffix!='.pyc')
records=[]
for p in files:
    b=p.read_bytes()
    records.append({'path':p.relative_to(ROOT).as_posix(),'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'git_blob_sha':hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()})
spec=json.loads((ROOT/'spec/design-spec.json').read_text(encoding='utf-8'))
manifest={'schema':'tsl.original-design-manifest/1','version':spec['version'],'date':'2026-10-15','profiles':list(spec['profiles']),'status':'common + chapter-series + foundation fixed-design handoff; organic 3D not completed; user aesthetic approval pending','exclude':['MANIFEST.json itself','runtime caches outside package'],'files':records}
(ROOT/'MANIFEST.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
subprocess.run([sys.executable,str(ROOT/'scripts/validate_package.py')],check=True)
temp=output.with_name(output.name+'.tmp')
with zipfile.ZipFile(temp,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for p in files+[ROOT/'MANIFEST.json']:z.write(p,ROOT.name+'/'+p.relative_to(ROOT).as_posix())
with zipfile.ZipFile(temp) as z:
    if z.testzip() is not None:raise RuntimeError('ZIP CRC failure')
    for row in records:
        b=z.read(ROOT.name+'/'+row['path'])
        if hashlib.sha256(b).hexdigest()!=row['sha256']:raise RuntimeError('Archive hash mismatch '+row['path'])
    check_manifest=json.loads(z.read(ROOT.name+'/MANIFEST.json'))
    if check_manifest!=manifest:raise RuntimeError('Archive manifest differs')
os.replace(temp,output)
print(json.dumps({'archive':str(output),'bytes':output.stat().st_size,'sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'verified_files':len(records),'zip_entries':len(records)+1,'zip_crc':True,'all_extracted_hashes_match':True},indent=2))

