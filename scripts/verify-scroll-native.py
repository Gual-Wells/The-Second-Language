"""Run in Blender against a separately restored source tree, never originals."""
import bpy,sys,json
from pathlib import Path
args=sys.argv[sys.argv.index('--')+1:]
root=Path(args[0]).resolve()
reports=[]
for rel in ['.cache/keeper-v17-native/keeper-physical.blend','.cache/keeper-v19-native/keeper-finishing-workshop.blend']:
    bpy.ops.wm.open_mainfile(filepath=str(root/rel))
    missing=[]
    for image in list(bpy.data.images):
        if image.packed_file or image.source not in {'FILE','TILED'}: continue
        original=Path(bpy.path.abspath(image.filepath))
        # Do not read an external original to pretend recovery succeeded.
        candidates=list(root.rglob(original.name))
        if not candidates: missing.append(image.name);continue
        # Load a fresh datablock: an unused original image may stay lazily unloaded
        # after reload(). Force decoded pixels from the restored file itself.
        loaded=bpy.data.images.load(str(candidates[0]),check_existing=False)
        if not loaded.size[0] or not len(loaded.pixels): missing.append(image.name)
        image.filepath=str(candidates[0]);image.reload()
    objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
    report={'file':rel,'meshes':len(objects),'vertices':sum(len(o.data.vertices) for o in objects),'armatures':sum(o.type=='ARMATURE' for o in bpy.context.scene.objects),'images':len(bpy.data.images),'missingImages':missing}
    if missing or not objects: raise RuntimeError(json.dumps(report))
    destination=root/'relinked-native'/Path(rel).name
    destination.parent.mkdir(exist_ok=True)
    bpy.ops.file.pack_all()
    bpy.ops.wm.save_as_mainfile(filepath=str(destination))
    report['relinkedPackedCopy']=str(destination.relative_to(root))
    reports.append(report)
(root/'native-verification.json').write_text(json.dumps({'schema':'second-language.scroll-native-recovery.v1','files':reports},indent=2))
print('Restored native source, geometry, rig and material dependencies verified:',json.dumps(reports))
