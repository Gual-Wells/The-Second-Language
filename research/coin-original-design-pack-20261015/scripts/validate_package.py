"""Validate fixed design and a complete local bundle. Artistic approval is outside this check."""
from pathlib import Path
import json,hashlib,math,csv,sys
ROOT=Path(__file__).resolve().parents[1]
def check(ok,msg):
    if not ok:raise RuntimeError(msg)
spec=json.loads((ROOT/'spec/design-spec.json').read_text(encoding='utf-8'))
curves=json.loads((ROOT/'vectors/edge-curves.json').read_text(encoding='utf-8'))
guides=json.loads((ROOT/'vectors/edge-world-guides.json').read_text(encoding='utf-8'))
glyphs=curves['glyphs']
for rep in range(3):
    part=sorted((g for g in glyphs if g['repeat']==rep),key=lambda g:g['character_index'])
    check(''.join(g['character'] for g in part)==spec['edge']['text'],'Wrong or incomplete inscription group')
check(len(glyphs)==57,'Expected 57 character positions including spaces')
csvrows=list(csv.DictReader((ROOT/'spec/glyph-placement.csv').open(encoding='utf-8-sig')))
check(len(csvrows)==57,'CSV position count')
byid={g['id']:g for g in glyphs}
for row in csvrows:
    g=byid[row['ID']];b=g['ink_bbox_uv']
    if b:
        values=[float(row[x]) for x in ['U_MIN_MM','U_MAX_MM','V_MIN_MM','V_MAX_MM']]
        check(max(abs(a-bb) for a,bb in zip(values,[b[0],b[2],b[1],b[3]]))<1e-5,'CSV/curve bounds mismatch')
        check(-.700001<=b[1]<=b[3]<=.700001,'Text outside cap-height band')
        check(0<=b[0]<=b[2]<=2*math.pi*20,'Text crosses data cut')
    else:check(row['CHAR']=='SPACE','Empty glyph not marked as space')
check(abs(spec['blank']['rim_flat_outer_radius']+spec['blank']['shoulder_radius']-20)<1e-9,'Shoulder does not reach R20')
check(abs(spec['blank']['rim_half_thickness']-spec['blank']['shoulder_radius']-1.4)<1e-9,'Double-counted thickness')
check(spec['blank']['reeding_count']==0 and not spec['blank']['extra_face_teeth'],'Unexpected teeth')
check(spec['foundation']['chapter'] is None and spec['foundation']['hash'] is None and spec['foundation']['certification_timestamp'] is None,'Chapter identity leaked into foundation coin')
rerr=max(abs(math.hypot(p[0],p[2])-20) for c in guides['curves'] for loop in c['contours_xyz_mm'] for p in loop)
check(rerr<1e-9,'World guides not on R20')
check(len(guides['curves'])==81,'Unexpected fixed-curve count')
audit=json.loads((ROOT/'spec/audit-and-removal.json').read_text(encoding='utf-8'))
names={p.name for p in ROOT.rglob('*') if p.is_file()}
for old in audit['removed']:check(Path(old['path']).name not in names,'Withdrawn image mixed into new package')
for i,name in enumerate(['datum-and-orientation','edge-distribution','four-side-elevations','shared-section','reverse-layout','foundation-overrides','glyph-schedule','foliate-master'],1):
    for ext in ['svg','png']:check((ROOT/'drawings'/f'{i:02d}-{name}.{ext}').is_file(),'Drawing missing')
for p in ['visuals/foundation-refined.png','fonts/Cinzel-OFL.txt','fonts/NotoSerifSC-OFL.txt','sources/approved-dragon-front.png','sources/project-icon.svg','index.html']:
    check((ROOT/p).is_file(),'Missing '+p)

# Series is a required peer of foundation, not inferred from shared blank geometry.
from datetime import datetime,timezone
record=json.loads((ROOT/'spec/series-sample.json').read_text(encoding='utf-8'))
series=json.loads((ROOT/'spec/series-resolved.json').read_text(encoding='utf-8'))
check(series['record']==record,'Series uses a stale record')
check(set(spec['profiles'])=={'common','series','foundation'},'Missing design profile')
check(record['sample_only'] is True,'This specimen must not allocate a real award')
check(''.join(r['text'] for r in series['rows'] if r['id'].startswith('SER-ZH'))==record['chapter']['title_zh'],'Incomplete Chinese title')
check(' '.join(r['text'] for r in series['rows'] if r['id'].startswith('SER-EN'))==record['chapter']['title_en'],'Incomplete English title')
rowmap={r['id']:r for r in series['rows']}
check(rowmap['SER-CHAPTER']['text']=='CHAPTER 01','Chapter number lost or mistaken for issue sequence')
check(rowmap['SER-HASH']['text'].replace(' ','')==record['identity']['raw_hex'],'Identity changed while formatting')
check(rowmap['SER-HASH']['text']=='2AD2 CC00 8F6F 0647','Chosen design specimen changed')
check(rowmap['SER-DATE']['text']=='CERTIFIED · 2026.10.14' and rowmap['SER-TIME']['text']=='10:35:15.314  +08:00','First-passage specimen timestamp changed')
dt=datetime.fromisoformat(record['certification']['passed_at'])
check(dt.astimezone(timezone.utc).isoformat(timespec='milliseconds').replace('+00:00','Z')==record['certification']['passed_at_utc'],'Inconsistent event instant')
check(not series['foundation_overrides_applied'] and not series['identity_is_sequence'],'Special coin or sequence leaked into series')
for r in series['rows']:
    b=r['bbox_qz']
    check(abs(b[0]+b[2])<1e-8,'Identity row not centered by real ink bounds')
    check(r['width_mm']<=r['max_width']+1e-7,'Series row overflow')
for clearance in series['row_clearances']:
    check(clearance['gap_mm']>=spec['series']['minimum_row_gap']-1e-8,'Series ink regions crowd')
rows=list(csv.DictReader((ROOT/'spec/series-glyph-placement.csv').open(encoding='utf-8-sig')))
check(len(rows)==len(series['glyphs']),'Series glyph schedule incomplete')
glyphmap={g['id']:g for g in series['glyphs']}
for r in rows:
    g=glyphmap[r['ID']]
    if g['ink_bbox_qz']:
        check(max(abs(float(r[k])-v) for k,v in zip(['Q_MIN_MM','Z_MIN_MM','Q_MAX_MM','Z_MAX_MM'],g['ink_bbox_qz']))<1e-7,'Series CSV/outline mismatch')
world=json.loads((ROOT/'vectors/series-reverse-world-guides.json').read_text(encoding='utf-8'))
for g in world['curves']:
    source=glyphmap[g['id']]
    for poly,original in zip(g['contours_xyz_mm'],source['contours_qz_mm']):
        check(len(poly)==len(original),'Guide lost outline samples')
        for (x,y,z),(q,zz) in zip(poly,original):
            check(max(abs(x+q),abs(y-spec['reverse']['face_y']),abs(z-zz))<1e-9,'Reverse/XYZ mapping error')
for basename in ['09-series-reverse-layout','10-series-fields-and-identity','11-series-master-and-variants']:
    for ext in ['svg','png']:check((ROOT/'drawings'/(basename+'.'+ext)).is_file(),'Series drawing missing')
for p in ['vectors/series-reverse-fixed-components-mm.svg','vectors/series-reverse-lettering-mm.svg','vectors/reverse-common-frame-mm.svg','vectors/series-blank-front-mm.svg','sources/user-blank-reference.png','SERIES_HANDOFF.md']:
    check((ROOT/p).is_file(),'Missing series deliverable '+p)
serieschecks=json.loads((ROOT/'checks/series-checks.json').read_text(encoding='utf-8'))
check(serieschecks['passed'] and all(c['passed'] for c in serieschecks['checks']),'Series design checks failed')
manifest_path=ROOT/'MANIFEST.json'
checked=0
if manifest_path.exists():
    manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
    expected={e['path'] for e in manifest['files']}
    actual={p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*') if p.is_file() and p.name!='MANIFEST.json' and '__pycache__' not in p.parts and p.suffix!='.pyc'}
    check(expected==actual,'Manifest file set differs from package')
    for entry in manifest['files']:
        path=(ROOT/entry['path']).resolve()
        check(path.is_relative_to(ROOT),'Path escapes package')
        data=path.read_bytes()
        check(hashlib.sha256(data).hexdigest()==entry['sha256'],'Hash mismatch '+entry['path'])
        check(len(data)==entry['bytes'],'Length mismatch')
        checked+=1
print(json.dumps({'passed':True,'profiles':list(spec['profiles']),'glyph_positions':len(glyphs),'world_curves':len(guides['curves']),'series_rows':len(series['rows']),'series_glyph_positions':len(series['glyphs']),'series_world_curves':len(world['curves']),'max_world_radius_error_mm':rerr,'manifest_files_checked':checked,'artistic_approval':False},indent=2))

