"""Rigid frame/rim fitting, before any sculpture clipping. No old model vertices are used."""
from pathlib import Path
import numpy as np,json,math
from scipy.optimize import least_squares
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'art';OUT=ROOT/'outputs';OUT.mkdir(exist_ok=True)
reports={}
for name in ['front','reverse']:
    d=np.load(SRC/(name+'.npz'));v=d['vertices'].astype(float);f=d['faces']
    if name=='front':v=v[:,[1,0,2]]*np.array([-1,1,1])
    else:v=v*np.array([-1,-1,1])
    # Cross the native coin body at its median-depth plane, extracting actual triangle intersections.
    tri=v[f];depth=.05 if name=='front' else 0.;p=[]
    for i,j in [(0,1),(1,2),(2,0)]:
        a=tri[:,i];b=tri[:,j];mask=(a[:,1]-depth)*(b[:,1]-depth)<0
        t=(depth-a[mask,1])/(b[mask,1]-a[mask,1]);p.append((a[mask]+(b[mask]-a[mask])*t[:,None])[:,[0,2]])
    p=np.concatenate(p);rng=np.random.default_rng(3821);best=None
    for _ in range(1600):
        pts=p[rng.choice(len(p),3,replace=False)];a=2*(pts[1:]-pts[0]);b=(pts[1:]**2).sum(1)-(pts[0]**2).sum()
        try:c=np.linalg.solve(a,b)
        except np.linalg.LinAlgError:continue
        r=np.linalg.norm(pts[0]-c)
        if not .455<r<.54 or np.linalg.norm(c)>.12:continue
        err=abs(np.linalg.norm(p-c,axis=1)-r);inlier=err<.004
        score=int(inlier.sum())
        if best is None or score>best[0]:best=(score,c,r,inlier)
    if best is None:raise RuntimeError('Could not identify coin rim from geometry')
    _,c,r,mask=best
    result=least_squares(lambda x:np.linalg.norm(p[mask]-x[:2],axis=1)-x[2],[*c,r]);c=result.x[:2];r=result.x[2]
    v[:,0]-=c[0];v[:,2]-=c[1];scale=20/r;v*=scale
    radius=np.linalg.norm(v[:,[0,2]],axis=1)
    ring=v[(radius>17.5)&(radius<19.5),1]
    hist,edges=np.histogram(ring,bins=120)
    neg=np.where((edges[:-1]+edges[1:])/2<0)[0];pos=np.where((edges[:-1]+edges[1:])/2>=0)[0]
    frontlevel=float(((edges[:-1]+edges[1:])/2)[neg[np.argmax(hist[neg])]])
    backlevel=float(((edges[:-1]+edges[1:])/2)[pos[np.argmax(hist[pos])]])
    np.savez_compressed(OUT/(name+'-aligned-unfitted.npz'),vertices=v,faces=f)
    facesv=v[f];centres=facesv.mean(1);normal=np.cross(facesv[:,1]-facesv[:,0],facesv[:,2]-facesv[:,0]);normal/=np.maximum(np.linalg.norm(normal,axis=1)[:,None],1e-20)
    planes={}
    rr=np.linalg.norm(centres[:,[0,2]],axis=1)
    for label,sign in [('negative',-1),('positive',1)]:
        pp=centres[(normal[:,1]*sign>.94)&(rr>15)&(rr<19.1)]
        if len(pp)>20000:pp=pp[rng.choice(len(pp),20000,replace=False)]
        aa=np.column_stack([pp[:,0],pp[:,2],np.ones(len(pp))]);bestplane=None
        for trial in range(400):
            ids=rng.choice(len(pp),3,replace=False)
            try:coef=np.linalg.solve(aa[ids],pp[ids,1])
            except np.linalg.LinAlgError:continue
            if np.linalg.norm(coef[:2])>.4:continue
            inside=abs(aa@coef-pp[:,1])<.055;score=int(inside.sum())
            if bestplane is None or score>bestplane[0]:bestplane=(score,coef,inside)
        score,coef,inside=bestplane;coef=np.linalg.lstsq(aa[inside],pp[inside,1],rcond=None)[0]
        planes[label]={'y_equals_ax_plus_bz_plus_c':coef.tolist(),'inliers':score,'candidates':len(pp),'tolerance_mm':.055}
    reports[name]={'native_rim_radius':r,'native_circle_center':c.tolist(),'scale_mm_per_source_unit':scale,'circle_inlier_count':int(mask.sum()),'slice_count':len(p),'front_body_level_mm':frontlevel,'back_body_level_mm':backlevel,'field_planes':planes,'aligned_bounds_mm':[v.min(0).tolist(),v.max(0).tolist()], 'histogram':{'centres':((edges[:-1]+edges[1:])/2).tolist(),'counts':hist.tolist()}}
(OUT/'art-registration.json').write_text(json.dumps(reports,indent=2),encoding='utf-8')
print(json.dumps({n:{k:r[k] for k in ['native_rim_radius','scale_mm_per_source_unit','front_body_level_mm','back_body_level_mm','aligned_bounds_mm']} for n,r in reports.items()},indent=2))

