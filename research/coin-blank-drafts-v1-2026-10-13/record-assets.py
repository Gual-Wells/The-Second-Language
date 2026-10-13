from pathlib import Path
from PIL import Image
import hashlib,json

root=Path(__file__).resolve().parent
records=[]
parents={'g-master-v1':'web/icon-512.png','g-master-v2':'g-master-v1','g-angles':'g-master-v2','f-master-v1':'g-master-v2','f-master-v2':'f-master-v1','f-angles':['g-angles','f-master-v2'],'g-details':'g-master-v2'}
final={'g-master-v2','g-angles','f-master-v2','f-angles','g-details'}
for p in sorted((root/'assets').glob('*.png')):
    raw=p.read_bytes()
    with Image.open(p) as im: size=list(im.size)
    records.append({'path':'assets/'+p.name,'size':size,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'gitBlobSha1':hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest(),'parent':parents[p.stem],'state':'current-draft' if p.stem in final else 'archived-iteration'})
doc={'type':'AI-design-reference-not-model-render','date':'2026-10-13','repositoryBaseline':'edd026e98e003dd314eecc0ddf7d399435506d16','tool':'built-in imagegen','generationCalls':7,'currentSheets':5,'currentViewPositions':28,'obverse':'empty field + necessary manufacturing rim only','reverseStatic':'THE SECOND LANGUAGE + project open-book','reverseDynamic':'XXX · XXX','aura':'none for empty common base','canonicalPromoted':False,'images':records}
(root/'manifest.json').write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'sheets':doc['currentSheets'],'views':doc['currentViewPositions'],'images':[{'path':r['path'],'bytes':r['bytes'],'sha':r['gitBlobSha1']} for r in records]},ensure_ascii=False))
