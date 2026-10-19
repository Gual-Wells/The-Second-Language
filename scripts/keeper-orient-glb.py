"""Add a display-axis root rotation, preserving mesh and texture buffers byte-for-byte."""
from pathlib import Path
import struct,json,math,hashlib
ROOT=Path(__file__).resolve().parents[1]
src=ROOT/'.cache/keeper-author-export/output/keeper-author-export/keeper-author-source.glb'
dst=ROOT/'web/labs/keeper-belt-model/assets/keeper-model.glb'
data=src.read_bytes();magic,version,total=struct.unpack_from('<III',data)
if magic!=0x46546c67 or version!=2 or total!=len(data):raise RuntimeError('Invalid GLB')
n,typ=struct.unpack_from('<II',data,12)
if typ!=0x4e4f534a:raise RuntimeError('No JSON chunk')
gltf=json.loads(data[20:20+n]);rest=data[20+n:]
for scene in gltf['scenes']:
 node={'name':'Keeper display axis +90deg X','children':scene.get('nodes',[]),'rotation':[math.sqrt(.5),0,0,math.sqrt(.5)]}
 scene['nodes']=[len(gltf['nodes'])];gltf['nodes'].append(node)
encoded=json.dumps(gltf,separators=(',',':')).encode();encoded+=b' '*((-len(encoded))%4)
output=struct.pack('<III',magic,version,20+len(encoded)+len(rest))+struct.pack('<II',len(encoded),typ)+encoded+rest
dst.parent.mkdir(parents=True,exist_ok=True);dst.write_bytes(output)
report={'source_sha256':hashlib.sha256(data).hexdigest(),'display_sha256':hashlib.sha256(output).hexdigest(),'operation':'Root rotation +90deg X; display front +Z, up +Y','geometry_and_texture_binary_unchanged':True,'bytes':len(output)}
(ROOT/'.cache/keeper-engineering').mkdir(exist_ok=True)
(ROOT/'.cache/keeper-engineering/orientation.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
