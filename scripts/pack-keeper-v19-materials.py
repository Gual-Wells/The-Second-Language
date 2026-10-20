"""Blender-native lossless WebP packing; verify decoded texels, retain PNGs on D."""
from pathlib import Path
import bpy, numpy as np, json, hashlib, shutil
ROOT=Path(__file__).resolve().parents[1];WEB=ROOT/'web/labs/chapter-scroll-v19/assets';CACHE=ROOT/'.cache/keeper-v19-native/png-masters';CACHE.mkdir(parents=True,exist_ok=True)
path=ROOT/'research/scroll-aging-v19-2026-10-20/material-manifest.json';report=json.loads(path.read_text());report['packedOutputs']=[]
scene=bpy.context.scene;scene.render.image_settings.file_format='WEBP';scene.render.image_settings.color_mode='RGB';scene.render.image_settings.quality=100
scene.view_settings.view_transform='Raw';scene.view_settings.look='None';scene.view_settings.exposure=0;scene.view_settings.gamma=1
for item in report['outputs']:
 source=WEB/item['file']
 if not source.exists():source=CACHE/item['file']
 assert hashlib.sha256(source.read_bytes()).hexdigest()==item['sha256']
 image=bpy.data.images.load(str(source));image.colorspace_settings.name='Non-Color'
 # Load saved 8bit masters, not the pre-quantization bake buffers. Normal and
 # material data must not be regraded by scene view transforms during packing.
 dest=WEB/(source.stem+'.webp');image.save_render(filepath=str(dest),scene=scene)
 encoded=dest.read_bytes();assert encoded[:4]==b'RIFF' and encoded[8:12]==b'WEBP','Encoder did not produce WebP'
 decoded=bpy.data.images.load(str(dest));decoded.colorspace_settings.name='Non-Color'
 a=np.empty(len(image.pixels),dtype=np.float32);b=np.empty(len(decoded.pixels),dtype=np.float32);image.pixels.foreach_get(a);decoded.pixels.foreach_get(b)
 error=float(np.max(np.abs(a-b)));assert error<1.e-6,(source.name,error)
 report['packedOutputs'].append({'file':dest.name,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'bytes':dest.stat().st_size,'maximumDecodedTexelError':error,'packing':'Blender WebP quality 100 lossless'})
 if source.parent==WEB:shutil.move(str(source),str(CACHE/source.name))
 bpy.data.images.remove(image);bpy.data.images.remove(decoded)
path.write_text(json.dumps(report,indent=2));print(json.dumps(report['packedOutputs']),flush=True)
