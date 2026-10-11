"""Reuse the verified native reverse cut on the official repaired source."""
import ast,pathlib,hashlib,json
root=pathlib.Path(__file__).resolve().parent
template=(root/'rebuild-reverse.py').read_text(encoding='utf-8')
assert template.count('\ndef relief(')==1 and template.count('\nreport.update(stage=')==1
base=template.split('\ndef relief(')[0]
eye=r'''
# User correction: the original eye is valid. Preserve it. The local crop
# diagnosis was wrong and the v4 ocular additions have been withdrawn.
report.update(stage='quiet_reverse_preserving_original_eye',design='supporting satin reverse; original eye preserved; no ocular additions')
save()
'''
tail=template[template.index('\nscene=bpy.context.scene;scene.render.engine='):]
tail=tail.replace('scene.cycles.samples=32','scene.cycles.samples=24').replace('resolution_y=1100','resolution_y=1000')
tail=tail.replace("[('back',(0,3,.10),'pbr'),('back-quarter',(.9,3,.12),'pbr'),('side',(3,.25,.1),'pbr'),('front',(0,-3,.1),'pbr'),('back-clay',(0,3,.1),'clay')]","[('front',(0,-3,.1),'pbr'),('back',(0,3,.1),'pbr'),('side',(3,.25,.1),'pbr'),('front-clay',(0,-3,.1),'clay')]")
code=base+eye+tail
ast.parse(code)
(root/'quiet-repaired-study.py').write_text(code,encoding='utf-8')
(root/'outputs/quiet-study-code.json').write_text(json.dumps({'source_template_sha256':hashlib.sha256(template.encode()).hexdigest(),'script_sha256':hashlib.sha256(code.encode()).hexdigest(),'user_decisions':'quiet supporting reverse; explicit front objects; verify global structure; not final accepted art'},indent=2))
print('Quiet reverse prepared; original eye preserved; no ocular additions.')
