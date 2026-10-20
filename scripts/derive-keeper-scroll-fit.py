"""Dimensioned fitting variant of the accepted assembly; no anisotropic scale.

Uses the existing DCC construction and exact Boolean/UV/rig pipeline. Hardware
dimensions and profile are unchanged. The loop radius is 30mm instead of 45mm,
so uniform fitting to the roll restores the intended visual buckle size.
The original asset and native file are never overwritten.
"""
from pathlib import Path
from hashlib import sha256
root=Path(__file__).resolve().parents[1]
base=root/'scripts/keeper-physical-build.py'
assert sha256(base.read_bytes()).hexdigest()=='d3aaa51365ded2a10727745bc9b9b6f0c7d377a5f944610f45f02de092ccbc3b','Review the changed base builder before deriving this asset'
source=base.read_text()
changes={
 "OUT=ROOT/'.cache/keeper-physical'":"MATERIALS=ROOT/'.cache/keeper-physical';OUT=ROOT/'.cache/keeper-v17-native'",
 "EVIDENCE=ROOT/'research/scroll-keeper-physical-2026-10-19'":"EVIDENCE=ROOT/'research/scroll-keeper-unfastening-2026-10-20'",
 "WEB=ROOT/'web/labs/keeper-physical-assembly/assets'":"WEB=ROOT/'web/labs/chapter-scroll-v17/assets'",
 "R=45.;T=2.5;W=18.":"R=30.;T=2.5;W=18.",
 "np.array([-22.,-43.2])":"np.array([-22.,-R+1.8])",
 "np.array([-32.,-40.])":"np.array([-32.,-R+5.])",
 "np.array([-36.,-34.])":"np.array([-36.,-R+11.])",
 "OUT/'leather-color.jpg'":"MATERIALS/'leather-color.jpg'",
 "OUT/'leather-roughness.jpg'":"MATERIALS/'leather-roughness.jpg'",
 "OUT/'leather-normal.jpg'":"MATERIALS/'leather-normal.jpg'",
 "OUT/f'bronze-{kind}.png'":"MATERIALS/f'bronze-{kind}.png'",
 "OUT/'bronze-Height.png'":"MATERIALS/'bronze-Height.png'",
 "def render(name,pos,look=(0,0,0),scale=.122):":"def render(name,pos,look=(0,0,0),scale=.122):\n if '--skip-renders' in sys.argv:return",
}
for before,after in changes.items():
 assert source.count(before)==1,(before,source.count(before))
 source=source.replace(before,after)
exec(compile(source,str(root/'scripts/keeper-physical-build.py'),'exec'))
import json
(WEB.parent/'keeper-path.json').write_text(json.dumps({
 'lengthMm':L,'foldEndMm':fold_end,'mainEndMm':main_end,
 'selectedHoleMm':float(hole_s),'radiusMm':R,'thicknessMm':T,'widthMm':W,
 'boneCount':count,'pointsMm':path.tolist(),
 'variant':'30mm loop; original 18mm strap and unchanged rigid hardware dimensions; uniform scene scale',
},separators=(',',':')))
