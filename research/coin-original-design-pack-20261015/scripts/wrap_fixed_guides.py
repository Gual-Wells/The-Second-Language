"""Export fixed curve guides to world XYZ millimetres. Does not build the artistic coin."""
from pathlib import Path
import json,math
root=Path(__file__).resolve().parents[1]
spec=json.loads((root/'spec/design-spec.json').read_text(encoding='utf-8'))
data=json.loads((root/'vectors/edge-curves.json').read_text(encoding='utf-8'))
R=data['radius']; cut=data['cut_theta'];rows=[]
max_error=0
for shape in data['projection_polylines']:
    lines=[]
    for contour in shape['contours']:
        pts=[]
        for u,v in contour:
            theta=math.radians(cut)-u/R
            p=[R*math.sin(theta),-v,R*math.cos(theta)]
            max_error=max(max_error,abs(math.hypot(p[0],p[2])-R))
            pts.append(p)
        lines.append(pts)
    rows.append({'id':shape['id'],'kind':shape['type'],'closed':shape['type']=='fill','stroke_width_mm':shape.get('width'),'contours_xyz_mm':lines})
out={'schema':'tsl.fixed-curve-guides/1','units':'mm','sampling':'Exact original Bezier data remains in edge-curves.json/SVG. These polylines are placement guides, not final bevels or sculpture.','frame':spec['frame'],'radial_surface':R,'curves':rows,'max_radius_error_mm':max_error,'depth_instruction':{'letters_mm':spec['edge']['incuse_depth'],'ornaments_mm':spec['edge']['ornament_incuse_depth'],'direction':'negative radial normal, local to each curve point'}}
(root/'vectors/edge-world-guides.json').write_text(json.dumps(out,separators=(',',':'))+'\n',encoding='utf-8')
if max_error>1e-10:raise RuntimeError(max_error)
print(json.dumps({'curves':len(rows),'max_radius_error_mm':max_error}))

