"""Reopen the saved edge study files and inspect actual coordinates."""
import bpy,pathlib,json,math,collections
ROOT=pathlib.Path(__file__).resolve().parent
out=[]
for v in ['A','B','C']:
    path=ROOT/'outputs'/(v+'-edge-study.blend')
    bpy.ops.wm.open_mainfile(filepath=str(path))
    obj=bpy.data.objects['EdgeStudy_'+v]
    violations=0;max_over=0.
    for vertex in obj.data.vertices:
        x,y,z=[q*1000 for q in vertex.co]
        r=math.hypot(x,y)
        if r<.01:continue
        deg=math.degrees(math.atan2(y,x))%360.
        d=0.
        if v!='C' and not(v=='B' and deg%30>=20):
            distance=abs((deg%2.5)-1.25)*math.pi/180*20
            if distance<.15:d=.1*math.cos(math.pi*distance/.30)**2
        over=r-(20-d)
        max_over=max(over,max_over)
        if over>2e-5:violations+=1
    incidence=collections.Counter()
    for p in obj.data.polygons:
        ids=list(p.vertices)
        for a,b in zip(ids,ids[1:]+ids[:1]):incidence[tuple(sorted((a,b)))]+=1
    result={'variant':v,'savedFile':path.name,'actualVertexCount':len(obj.data.vertices),
      'nonmanifoldEdges':sum(n!=2 for n in incidence.values()),
      'axialCollarEnvelopeViolations':violations,'maxEnvelopeOvershootMm':max_over}
    assert result['nonmanifoldEdges']==0,result
    assert violations==0,result
    out.append(result)
(ROOT/'outputs'/'saved-model-checks.json').write_text(json.dumps(out,indent=2),encoding='utf-8')
print(json.dumps(out),flush=True)

