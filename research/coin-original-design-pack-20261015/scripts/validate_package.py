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
print(json.dumps({'passed':True,'glyph_positions':len(glyphs),'world_curves':len(guides['curves']),'max_world_radius_error_mm':rerr,'manifest_files_checked':checked,'artistic_approval':False},indent=2))

