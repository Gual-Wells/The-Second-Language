"""Quantify spatial edit-scope overlap with a jaw review area; no semantic claim."""
from pathlib import Path
import numpy as np,json
ROOT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin')
v=np.load(ROOT/'studio-20261013/outputs/prepared-grip.npz')['vertices']
registration=json.loads((ROOT/'kaggle-test/outputs/retarget-old-20261013/image-registration.json').read_text())
source=np.stack([1000*v[:,0]+625,625-1000*(v[:,2]*.9994449+v[:,1]*.03331483),np.ones(len(v))],1)
target=source@np.array(registration['source_to_target']).T
region=(target[:,0]>825)&(target[:,0]<900)&(target[:,1]>760)&(target[:,1]<890)&(v[:,1]<-.035)
lower=(v[:,0]>=.205)&(v[:,0]<=.54)&(v[:,2]>=-.445)&(v[:,2]<=-.13)&(v[:,1]>=-.17)&(v[:,1]<=.17)
r={'purpose':'Review scope overlap, not automatic jaw face segmentation','target_image_review_rect':[825,760,900,890],'front_old_vertices_in_review_area':int(region.sum()),'also_inside_lower_grip_edit_box':int((region&lower).sum()),'interpretation':'The lower spatial box does not by itself prove complete head/jaw protection.'}
(Path(__file__).resolve().parent/'construction-scope-audit.json').write_text(json.dumps(r,indent=2));print(json.dumps(r))
