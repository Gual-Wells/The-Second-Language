"""Prepare a local self-contained viewer using pinned MIT Three.js sources."""
import pathlib,hashlib,json,shutil,requests
ROOT=pathlib.Path(__file__).resolve().parent
out=ROOT/'outputs'/'coin-viewer';vendor=out/'vendor';vendor.mkdir(parents=True,exist_ok=True)
existing=pathlib.Path('D:/CodexStorage/workspaces/second-language-maintenance/web/labs/certification/vendor')
for name in ['three.module.js','three.core.js','three-LICENSE.txt']:shutil.copy2(existing/name,vendor/name)
session=requests.Session();session.trust_env=False
for rel,name in [('examples/jsm/loaders/GLTFLoader.js','GLTFLoader.js'),('examples/jsm/utils/BufferGeometryUtils.js','BufferGeometryUtils.js'),('examples/jsm/utils/SkeletonUtils.js','SkeletonUtils.js'),('examples/jsm/environments/RoomEnvironment.js','RoomEnvironment.js')]:
    target=vendor/name
    if not target.exists():
        response=session.get('https://raw.githubusercontent.com/mrdoob/three.js/r186/'+rel,timeout=30);response.raise_for_status()
        source=response.text.replace('../utils/BufferGeometryUtils.js','./BufferGeometryUtils.js').replace('../utils/SkeletonUtils.js','./SkeletonUtils.js')
        target.write_text(source,encoding='utf-8')
    elif name=='GLTFLoader.js':
        target.write_text(target.read_text(encoding='utf-8').replace('../utils/SkeletonUtils.js','./SkeletonUtils.js'),encoding='utf-8')
manifest={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in vendor.iterdir() if p.is_file()}
(vendor/'source-manifest.json').write_text(json.dumps({'release':'r186','license':'MIT','files':manifest},indent=2))
print(json.dumps({'stage':'viewer_sources_ready','path':str(out)}))
