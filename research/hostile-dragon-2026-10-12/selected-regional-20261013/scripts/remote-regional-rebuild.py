    # Regional geometry resampling from the ORIGINAL old model latent only.
    import requests,cv2,numpy as np,signal
    response=requests.get(APPROVED_URL,timeout=(15,60));response.raise_for_status()
    if hashlib.sha256(response.content).hexdigest()!=APPROVED_FILE_SHA:raise RuntimeError('Approved full drawing differs from immutable source')
    (OUT/'approved-front.png').write_bytes(response.content)
    picture=cv2.imdecode(np.frombuffer(response.content,np.uint8),cv2.IMREAD_COLOR)
    gray=cv2.cvtColor(picture,cv2.COLOR_BGR2GRAY)
    mask=np.full(gray.shape,cv2.GC_PR_BGD,np.uint8);mask[gray>95]=cv2.GC_PR_FGD;mask[gray>140]=cv2.GC_FGD
    mask[:30,:]=mask[-30:,:]=mask[:,:30]=mask[:,-30:]=cv2.GC_BGD
    cv2.setRNGSeed(38017);cv2.grabCut(picture,mask,None,np.zeros((1,65)),np.zeros((1,65)),5,cv2.GC_INIT_WITH_MASK)
    fg=np.isin(mask,[cv2.GC_FGD,cv2.GC_PR_FGD]).astype(np.uint8)
    rgba=cv2.cvtColor(picture,cv2.COLOR_BGR2RGBA);rgba[:,:,3]=fg*255
    ys,xs=np.where(fg);cx,cy=(xs.min()+xs.max())/2,(ys.min()+ys.max())/2;size=max(xs.max()-xs.min(),ys.max()-ys.min())+16
    cropped=np.asarray(Image.fromarray(rgba).crop((int(cx-size/2),int(cy-size/2),int(cx+size/2),int(cy+size/2)))).astype(np.float32)
    conditioning=(cropped[:,:,:3]*cropped[:,:,3:4]/255).astype(np.uint8)
    image=Image.fromarray(conditioning);image.save(OUT/'conditioning-full-coin.png')
    candidates=list(pathlib.Path('/kaggle/input').rglob('sample_shape_slat-checkpoint.pt'))
    latent_source=next((p for p in candidates if hashlib.sha256(p.read_bytes()).hexdigest()==ORIGINAL_LATENT_SHA),None)
    if latent_source is None:raise RuntimeError('No checkpoint matching original old geometry; never substitute rejected generated latent')
    original=torch.load(latent_source,map_location='cpu',weights_only=True)
    old_coords=original['coords'].to('cuda').int();old_feats=original['feats'].to('cuda').float()
    REPORT.update(original_latent_sha256=ORIGINAL_LATENT_SHA,original_tokens=len(old_coords),input='approved full drawing',regional_only=True,rejected_mesh_used=False,latent_grid=32);save()
    def edit_points(points):
        x,y,z=points.unbind(-1)
        upper=(x>=-.49)&(x<=-.16)&(z>=.095)&(z<=.385)&(y>=-.17)&(y<=.17)
        lower=(x>=.205)&(x<=.54)&(z>=-.445)&(z<=-.13)&(y>=-.17)&(y<=.17)
        return upper|lower
    def coord_edit(coords,res):return edit_points((coords[:,1:].float()+.5)/res-.5)
    def make_mask(res):
        grid=torch.stack(torch.meshgrid(*[torch.arange(res,device='cuda')]*3,indexing='ij'),-1)
        return edit_points((grid.float()+.5)/res-.5)[None,None]
    def masked_sampler(original_sampler,known,editable):
        base=type(original_sampler)
        def once(self,model,x_t,t,t_prev,cond=None,**kwargs):
            sparse=hasattr(x_t,'feats');xf=x_t.feats if sparse else x_t
            nf=self.original_noise.feats if sparse else self.original_noise
            k=known.feats if sparse else known
            mix=(1-t)*k+(self.sigma_min+(1-self.sigma_min)*t)*nf
            constrained=torch.where(editable,xf,mix)
            x_t=x_t.replace(feats=constrained) if sparse else constrained
            out=base.sample_once(self,model,x_t,t,t_prev,cond,**kwargs)
            next_f=out.pred_x_prev.feats if sparse else out.pred_x_prev
            next_known=k if t_prev==0 else (1-t_prev)*k+(self.sigma_min+(1-self.sigma_min)*t_prev)*nf
            next_f=torch.where(editable,next_f,next_known)
            out.pred_x_prev=out.pred_x_prev.replace(feats=next_f) if sparse else next_f
            return out
        cls=type('MaskedRegional'+base.__name__,(base,),{'sample_once':once})
        return cls(sigma_min=original_sampler.sigma_min)
    def expired(*a):raise TimeoutError('Bounded regional reconstruction timeout')
    signal.signal(signal.SIGALRM,expired);signal.alarm(max(1,int(6900-(time.monotonic()-START))))
    from trellis2 import models
    from trellis2.modules.sparse import SparseTensor
    torch.manual_seed(48203)
    with torch.no_grad():
        REPORT['stage']='encode_original_sparse_structure';save()
        vox=torch.zeros((1,1,32,32,32),device='cuda')
        vox[0,0,old_coords[:,1].long(),old_coords[:,2].long(),old_coords[:,3].long()]=1
        vox=torch.nn.functional.interpolate(vox,size=(64,64,64),mode='nearest')
        encoder=models.from_pretrained('microsoft/TRELLIS-image-large/ckpts/ss_enc_conv3d_16l8_fp16').eval().to('cuda')
        known_ss=encoder(vox,sample_posterior=False).float();encoder.cpu();del encoder,vox;torch.cuda.empty_cache()
        REPORT.update(ss_shape=list(known_ss.shape));save()
        cond=pipeline.get_cond([image],512)
        ss_flow=pipeline.models['sparse_structure_flow_model'];ss_flow.to('cuda')
        noise=torch.randn_like(known_ss);ss_mask=make_mask(known_ss.shape[-1])
        sampler=masked_sampler(pipeline.sparse_structure_sampler,known_ss,ss_mask);sampler.original_noise=noise
        REPORT['stage']='masked_sparse_structure_reconstruction';save()
        ss_params=dict(pipeline.sparse_structure_sampler_params);ss_params['steps']=20
        edited_ss=sampler.sample(ss_flow,noise,**cond,**ss_params,verbose=True,tqdm_desc='Rebuild changed sparse structure').samples
        if not torch.equal(edited_ss[~ss_mask.expand_as(edited_ss)],known_ss[~ss_mask.expand_as(known_ss)]):raise RuntimeError('Unchanged SS latent altered')
        ss_flow.cpu();decoder=pipeline.models['sparse_structure_decoder'];decoder.to('cuda')
        occupied=decoder(edited_ss)>0;decoder.cpu()
        if occupied.shape[-1]!=32:occupied=torch.nn.functional.max_pool3d(occupied.float(),occupied.shape[-1]//32)>0
        proposed=torch.argwhere(occupied)[:,[0,2,3,4]].int()
        old_keep=~coord_edit(old_coords,32)
        regional_proposed=proposed[coord_edit(proposed,32)]
        if REFERENCE_GUIDED:
            # Approved full drawing silhouettes define spatial support, not a new
            # isolated/generated claw design. Whole-image conditioning is retained.
            polygons=[
                [(147,315),(164,291),(199,285),(229,313),(251,349),(263,375),(271,407),(282,435),(287,459),(274,450),(255,422),(240,398),(224,370),(199,361),(182,353),(160,345)],
                [(236,227),(257,205),(287,199),(319,212),(341,244),(351,273),(352,303),(367,332),(383,371),(390,398),(380,403),(366,380),(348,356),(330,327),(310,310),(298,285),(270,288),(253,275),(237,249)],
                [(1130,780),(1150,816),(1140,844),(1120,859),(1085,851),(1054,840),(1020,844),(984,867),(947,890),(925,912),(908,918),(905,906),(914,875),(931,846),(956,821),(991,803),(1030,792),(1059,782),(1080,773),(1111,771)],
                [(1120,936),(1144,963),(1137,996),(1116,1027),(1100,1060),(1080,1080),(1057,1074),(1045,1047),(1021,1026),(992,1018),(959,1019),(924,1016),(900,1011),(889,1005),(906,988),(937,972),(978,953),(1018,945),(1050,938),(1082,933)]]
            grid=torch.stack(torch.meshgrid(*[torch.arange(32,device='cuda')]*3,indexing='ij'),-1).reshape(-1,3)
            pts=(grid.float()+.5)/32-.5
            source_px=torch.stack([pts[:,0]*1000+625,625-1000*(pts[:,2]*.9994449+pts[:,1]*.03331483),torch.ones(len(pts),device='cuda')],1)
            transform=torch.tensor(REFERENCE_SOURCE_TO_TARGET,device='cuda',dtype=torch.float32)
            target_px=source_px@transform.T;px,py=target_px[:,0],target_px[:,1]
            support=torch.zeros(len(grid),device='cuda',dtype=torch.bool)
            for polygon in polygons:
                p=torch.tensor(polygon,device='cuda',dtype=torch.float32);inside=torch.zeros_like(support);distance=torch.full((len(grid),),float('inf'),device='cuda')
                for a,b in zip(p,torch.roll(p,-1,0)):
                    inside^=((a[1]>py)!=(b[1]>py))&(px<(b[0]-a[0])*(py-a[1])/(b[1]-a[1]+1e-7)+a[0])
                    delta=b-a;u=((target_px-a)*delta).sum(1)/(delta*delta).sum();u=u.clamp(0,1)
                    distance=torch.minimum(distance,torch.linalg.vector_norm(target_px-a-u[:,None]*delta,dim=1))
                support|=inside|(distance<19)
            foreground=support&(pts[:,1]>=-.135)&(pts[:,1]<=-.015)&edit_points(pts)
            # The back/coin layers remain model-inferred; only the redesigned front
            # grasp supports are forced to their approved positions and extents.
            back=regional_proposed[((regional_proposed[:,2].float()+.5)/32-.5)>=-.015]
            guided=torch.cat([torch.zeros((int(foreground.sum()),1),device='cuda',dtype=torch.int32),grid[foreground].int()],1)
            regional_proposed=torch.unique(torch.cat([back,guided],0),dim=0)
            REPORT.update(reference_silhouette_guidance=True,guided_front_tokens=len(guided));save()
        coords=torch.cat([old_coords[old_keep],regional_proposed],0)
        if len(coords)>9000:raise RuntimeError('Token budget exceeds bounded T4 context')
        # Outside the replacement volumes, sparse coordinates and features come from original.
        protected=len(old_coords[old_keep]);editable=torch.zeros((len(coords),1),device='cuda',dtype=torch.bool);editable[protected:]=True
        std=torch.tensor(pipeline.shape_slat_normalization['std'],device='cuda')[None]
        mean=torch.tensor(pipeline.shape_slat_normalization['mean'],device='cuda')[None]
        known_feats=torch.zeros((len(coords),old_feats.shape[-1]),device='cuda');known_feats[:protected]=(old_feats[old_keep]-mean)/std
        known=SparseTensor(feats=known_feats,coords=coords)
        noise=SparseTensor(feats=torch.randn_like(known_feats),coords=coords)
        sampler=masked_sampler(pipeline.shape_slat_sampler,known,editable);sampler.original_noise=noise
        flow=pipeline.models['shape_slat_flow_model_512'];flow.to('cuda')
        REPORT.update(stage='masked_grip_geometry_reconstruction',tokens=len(coords),protected_tokens=protected,new_tokens=len(coords)-protected);save()
        shape_params=dict(pipeline.shape_slat_sampler_params);shape_params['steps']=24
        sample=sampler.sample(flow,noise,**cond,**shape_params,verbose=True,tqdm_desc='Rebuild changed grips in whole coin context').samples
        if not torch.equal(sample.feats[:protected],known.feats[:protected]):raise RuntimeError('Unchanged shape latent altered')
        flow.cpu();shape=sample*std+mean
        shape.feats[:protected]=old_feats[old_keep]
        torch.save({'feats':shape.feats.cpu(),'coords':shape.coords.cpu(),'protected_tokens':protected},OUT/'regional-shape-checkpoint.pt')
        REPORT.update(stage='decode_regional_candidate',protected_latents_exact=True);save()
        meshes,subs=pipeline.decode_shape_slat(shape,512)
        generated=meshes[0]
        if REFERENCE_GUIDED:
            # Reuse the already-proven official CuMesh/O-Voxel geometry repair
            # branch, without PBR/texture work. Original old mesh is never remeshed.
            import cumesh
            REPORT['stage']='repair_candidate_geometry';save()
            verts=generated.vertices.cuda();faces=generated.faces.cuda()
            handler=cumesh.CuMesh();handler.init(verts,faces);handler.fill_holes(max_hole_perimeter=3e-2)
            verts,faces=handler.read();bvh=cumesh.cuBVH(verts,faces)
            rebuilt=cumesh.remeshing.remesh_narrow_band_dc(verts,faces,center=torch.zeros(3,device='cuda'),scale=515/512,resolution=512,band=1,project_back=0,verbose=True,bvh=bvh)
            handler.init(*rebuilt);handler.simplify(1000000,verbose=True)
            verts,faces=handler.read();v=verts.cpu().numpy();f=faces.cpu().numpy()
            REPORT.update(candidate_repaired=True,repair_method='Official narrow-band dual-contouring, 512, project_back=0; old baseline untouched')
        else:v=generated.vertices.cpu().numpy();f=generated.faces.cpu().numpy()
        import trimesh
        trimesh.Trimesh(v,f,process=False).export(OUT/'regional-candidate.ply')
        np.savez_compressed(OUT/'regional-candidate.npz',vertices=v,faces=f)
        REPORT.update(stage='regional_candidate_saved',vertices=len(v),faces=len(f),full_scene_context=True,art_accepted=False,requires_old_outside_geometry_preservation=True);save()
    signal.alarm(0)
except Exception:
    REPORT['stage']='regional_reconstruction_failed';REPORT['error']=traceback.format_exc()[-6000:]
finally:
    save()
