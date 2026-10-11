"""Obtain a licensed existing lighting asset for material review, with provenance."""
import pathlib,json,hashlib,requests
ROOT=pathlib.Path(__file__).resolve().parent;out=ROOT/'inputs'/'studio';out.mkdir(parents=True,exist_ok=True)
s=requests.Session();s.trust_env=False;s.headers['User-Agent']='DragonCoinStudioReview/1.0'
asset='studio_small_09';r=s.get('https://api.polyhaven.com/files/'+asset,timeout=25);r.raise_for_status();meta=r.json()
entry=meta['hdri']['2k']['hdr'];url=entry['url'];expected=entry.get('size')
target=out/(asset+'_2k.hdr')
if not target.exists():
    result=s.get(url,timeout=45);result.raise_for_status();target.write_bytes(result.content)
if expected and target.stat().st_size!=expected:raise RuntimeError('Lighting file size mismatch')
record={'provider':'Poly Haven','asset':asset,'asset_page':'https://polyhaven.com/a/'+asset,'license':'CC0','license_evidence':'https://docs.polyhaven.com/en/faq','file':target.name,'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'url':url}
(out/'provenance.json').write_text(json.dumps(record,indent=2));print(json.dumps(record))
