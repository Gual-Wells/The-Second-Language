import bpy,json
from pathlib import Path
OUT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/studio-20261013/outputs/user-selected-regional/deliverable')
s=bpy.context.scene;c=s.camera
s.render.resolution_x=s.render.resolution_y=900;s.render.image_settings.file_format='JPEG';s.render.image_settings.quality=91
for name,pos in [('front-review',(0,-3,.1)),('quarter-review',(1.65,-3,.65)),('back-review',(0,3,.1))]:
 c.location=pos;c.rotation_euler=(-c.location).to_track_quat('-Z','Y').to_euler();s.render.filepath=str(OUT/(name+'.jpg'));bpy.ops.render.render(write_still=True)
s.render.resolution_x=s.render.resolution_y=1250;s.render.image_settings.file_format='PNG'
c.location=(0,-3,.1);c.rotation_euler=(-c.location).to_track_quat('-Z','Y').to_euler()
result={'native_review_files':[(p.name,p.stat().st_size) for p in OUT.glob('*-review.jpg')]}
