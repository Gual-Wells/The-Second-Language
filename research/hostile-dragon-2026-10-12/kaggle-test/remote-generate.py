"""Private bounded TRELLIS.2 generation, with original assets saved before export."""
import datetime,gc,hashlib,json,os,pathlib,subprocess,sys,time,traceback
START=time.monotonic();OUT=pathlib.Path('/kaggle/working/dragon-generation');OUT.mkdir(parents=True,exist_ok=True)
SCRATCH=pathlib.Path('/kaggle/temp/dragon-generation');SCRATCH.mkdir(parents=True,exist_ok=True)
for name in ['tmp','hf','pip']:(SCRATCH/name).mkdir(exist_ok=True)
os.environ.update(TMPDIR=str(SCRATCH/'tmp'),HF_HOME=str(SCRATCH/'hf'),PIP_CACHE_DIR=str(SCRATCH/'pip'),TORCH_CUDA_ARCH_LIST='7.5',ATTN_BACKEND='sdpa',SPARSE_ATTN_BACKEND='sdpa',SPARSE_CONV_BACKEND='flex_gemm',PYTORCH_CUDA_ALLOC_CONF='expandable_segments:True',OPENCV_IO_ENABLE_OPENEXR='1')
REPORT={'started_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'stage':'setup','art_accepted':False,'pipeline_type':PIPELINE_TYPE,'seed':38017,'source_sha':SOURCE_SHA,'model_revisions':{k:v['revision'] for k,v in MODEL_PINS.items()},'phase_seconds':{}}
def save():
    REPORT['elapsed_seconds']=round(time.monotonic()-START,2)
    (OUT/'generation.json').write_text(json.dumps(REPORT,indent=2),encoding='utf-8');print(json.dumps(REPORT),flush=True)
def command(args,label,timeout,cwd=None):
    with (OUT/(label+'.log')).open('w') as log:result=subprocess.run(args,cwd=cwd,stdout=log,stderr=subprocess.STDOUT,timeout=timeout)
    if result.returncode:raise RuntimeError(label+': '+(OUT/(label+'.log')).read_text()[-3000:])
try:
    import torch
    if not torch.cuda.is_available():raise RuntimeError('GPU missing')
    REPORT.update(torch=torch.__version__,gpu=torch.cuda.get_device_name(),vram_gib=torch.cuda.get_device_properties(0).total_memory/2**30);save()
    command([sys.executable,'-m','pip','install','trimesh','opencv-python-headless','pillow','scipy','zstandard','tqdm','plyfile','easydict','transformers==4.56.2','safetensors','imageio','imageio-ffmpeg','kornia','timm'],'python-dependencies',240)
    command([sys.executable,'-m','pip','install','git+https://github.com/EasternJournalist/utils3d.git@9a4eb15e4021b67b12c460c7057d642626897ec8'],'utils3d',180)
    checked=[]
    for name,sha in EXPECTED_WHEELS.items():
        wheel=next(pathlib.Path('/kaggle/input').rglob(name))
        if hashlib.sha256(wheel.read_bytes()).hexdigest()!=sha:raise RuntimeError('Wheel checksum mismatch')
        checked.append(str(wheel))
    command([sys.executable,'-m','pip','install','--no-deps',*checked],'preserved-wheels',90)
    repo=SCRATCH/'TRELLIS.2'
    command(['git','clone','--filter=blob:none','https://github.com/microsoft/TRELLIS.2.git',str(repo)],'clone',120)
    command(['git','checkout',SOURCE_SHA],'checkout',60,cwd=repo)
    import importlib.util
    spec=importlib.util.spec_from_file_location('t4_adapter',ADAPTATION_FILE);adapter=importlib.util.module_from_spec(spec);spec.loader.exec_module(adapter)
    adapter.patch_source(repo);sys.path.insert(0,str(repo))
    original_sdpa=adapter.install_runtime(MODEL_PINS,REPORT,save)
    REPORT['stage']='sparse_attention_validation';save()
    from trellis2.modules.sparse import VarLenTensor
    from trellis2.modules.sparse.attention.full_attn import sparse_scaled_dot_product_attention
    seq=[torch.randn((n,3,4,64),device='cuda',dtype=torch.bfloat16) for n in [17,29]]
    actual=sparse_scaled_dot_product_attention(VarLenTensor.from_tensor_list(seq)).to_tensor_list()
    errors=[]
    for qkv,got in zip(seq,actual):
        q,k,v=qkv.unbind(1)
        expected=original_sdpa(q.transpose(0,1).unsqueeze(0).float(),k.transpose(0,1).unsqueeze(0).float(),v.transpose(0,1).unsqueeze(0).float()).squeeze(0).transpose(0,1)
        if not torch.isfinite(got).all():raise RuntimeError('Nonfinite sparse attention')
        errors.append((got.float()-expected).abs().max().item())
    REPORT['attention_validation']={'max_abs_vs_fp32':errors,'dtype':'BF16'}
    if max(errors)>.04:raise RuntimeError('Attention reference mismatch')
    del seq,actual;torch.cuda.empty_cache()
    # Confirm the bounded im2col implementation against its original matrix expression.
    from flex_gemm.ops.spconv.submanifold_conv3d import SubMConv3dFunction
    import flex_gemm.ops.spconv as spconv
    spconv.set_algorithm('explicit_gemm')
    conv_errors=[]
    for dtype in [torch.float16,torch.bfloat16]:
        feats=torch.randn((9000,8),device='cuda',dtype=dtype)
        ids=torch.randint(0,len(feats),(9000,27),device='cuda',dtype=torch.int64)
        mask=torch.rand(ids.shape,device='cuda')>.15
        ids[~mask]=0xffffffff
        weight=torch.randn((12,3,3,3,8),device='cuda',dtype=dtype)*.1
        bias=torch.randn(12,device='cuda',dtype=dtype)
        got=SubMConv3dFunction._sparse_submanifold_conv_forward(feats,{'neighbor_map':ids},weight,bias)
        cols=torch.zeros((9000*27,8),device='cuda',dtype=dtype)
        cols[mask.reshape(-1)]=feats[ids.reshape(-1)[mask.reshape(-1)]]
        expected=torch.addmm(bias,cols.reshape(9000,27*8),weight.reshape(12,27*8).transpose(0,1))
        error=(got.float()-expected.float()).abs().max().item()
        if not torch.isfinite(got).all() or error>.04:raise RuntimeError('Bounded convolution reference mismatch')
        conv_errors.append({'dtype':str(dtype),'max_abs':error})
    REPORT['bounded_convolution_validation']=conv_errors
    del feats,ids,mask,weight,bias,got,cols,expected;torch.cuda.empty_cache();save()
    if VALIDATION_ONLY:
        from trellis2.pipelines import Trellis2ImageTo3DPipeline
        from transformers import DINOv3ViTModel
        REPORT['stage']='adaptation_preflight_completed';save();raise SystemExit(0)
    source=next(pathlib.Path('/kaggle/input').rglob('input-manifest.json')).parent
    manifest=json.loads((source/'input-manifest.json').read_text())
    dino=source/'dino'
    if not dino.is_dir():
        import zipfile
        archive=source/'dino.zip';dino=SCRATCH/'dino';dino.mkdir()
        with zipfile.ZipFile(archive) as z:
            for entry in z.infolist():
                target=(dino/entry.filename).resolve()
                if not target.is_relative_to(dino.resolve()):raise RuntimeError('Unsafe input archive path')
            z.extractall(dino)
        if not (dino/'config.json').exists() and (dino/'dino'/'config.json').exists():dino=dino/'dino'
    if USE_CACHED_INPUT and not (dino/'model.safetensors').exists():
        import shutil
        writable=SCRATCH/'licensed-dino-config';shutil.copytree(dino,writable);dino=writable
        candidates=[p for p in pathlib.Path('/kaggle/input').rglob('model.safetensors') if p.stat().st_size==manifest['files']['model.safetensors']['bytes']]
        approved=None
        for candidate in candidates:
            if hashlib.sha256(candidate.read_bytes()).hexdigest()==manifest['files']['model.safetensors']['sha256']:approved=candidate;break
        if approved is None:raise RuntimeError('No cached DINO weight matches the authorized official SHA')
        (dino/'model.safetensors').symlink_to(approved)
        REPORT['dino_copy']={'server_source':'hark99/facebookdinov3-vitl16-pretrain-lvd1689m/transformers/default/1','original_official_sha_verified':True,'license':'original Meta DINOv3 license; authorized account'}
    if hashlib.sha256((dino/'model.safetensors').read_bytes()).hexdigest()!=manifest['files']['model.safetensors']['sha256']:raise RuntimeError('DINO input checksum mismatch')
    # Resolve config at the pinned public revision; keep credentials out of this notebook.
    import huggingface_hub
    config_file=huggingface_hub.hf_hub_download('microsoft/TRELLIS.2-4B','pipeline.json')
    config=json.loads(pathlib.Path(config_file).read_text());args=config['args']
    args['image_cond_model']['args']['model_name']=str(dino);args['low_vram']=True
    args['models']={k:(v if v.startswith('microsoft/') else 'microsoft/TRELLIS.2-4B/'+v) for k,v in args['models'].items()}
    if PIPELINE_TYPE=='512':args['models']={k:v for k,v in args['models'].items() if not k.endswith('_1024')}
    else:args['models'].pop('tex_slat_flow_model_512',None)
    config_dir=SCRATCH/'config';config_dir.mkdir();(config_dir/'pipeline.json').write_text(json.dumps(config))
    from trellis2.pipelines import Trellis2ImageTo3DPipeline
    from PIL import Image
    pipeline=Trellis2ImageTo3DPipeline.from_pretrained(str(config_dir));pipeline.cuda()
    for name in ['get_cond','sample_sparse_structure','sample_shape_slat','sample_shape_slat_cascade','decode_shape_slat','sample_tex_slat','decode_tex_slat']:
        original=getattr(pipeline,name)
        def hook(*a,_name=name,_original=original,**kw):
            REPORT['stage']=_name;save();start=time.monotonic();value=_original(*a,**kw)
            REPORT['phase_seconds'][_name]=REPORT['phase_seconds'].get(_name,0)+round(time.monotonic()-start,2)
            if _name in ['sample_shape_slat','sample_shape_slat_cascade','sample_tex_slat']:
                slat=value[0] if isinstance(value,tuple) else value
                checkpoint={'feats':slat.feats.cpu(),'coords':slat.coords.cpu()}
                checkpoint['cpu_rng_state']=torch.get_rng_state();checkpoint['cuda_rng_state']=torch.cuda.get_rng_state()
                if isinstance(value,tuple):checkpoint['resolution']=value[1]
                torch.save(checkpoint,OUT/(_name+'-checkpoint.pt'))
                REPORT.setdefault('checkpoints',[]).append(_name+'-checkpoint.pt')
            if _name=='decode_shape_slat':
                import trimesh
                raw=value[0][0]
                trimesh.Trimesh(raw.vertices.cpu().numpy(),raw.faces.cpu().numpy(),process=False).export(OUT/'decoded-shape-checkpoint.ply')
                REPORT.setdefault('checkpoints',[]).append('decoded-shape-checkpoint.ply')
            save();return value
        setattr(pipeline,name,hook)
    image=Image.open(source/'generation-input.png').convert('RGB')
    REPORT['input_sha256']=hashlib.sha256((source/'generation-input.png').read_bytes()).hexdigest()
    REPORT['stage']='generating';save()
    if RESUME_SHAPE:
        checkpoint=next(p for p in pathlib.Path('/kaggle/input').rglob('sample_shape_slat-checkpoint.pt') if hashlib.sha256(p.read_bytes()).hexdigest()==SHAPE_CHECKPOINT_SHA)
        saved=torch.load(checkpoint,map_location='cpu',weights_only=True)
        from trellis2.modules.sparse import SparseTensor
        shape=SparseTensor(feats=saved['feats'].cuda(),coords=saved['coords'].cuda())
        REPORT['resume']={'source_kernel':'gualwells/hostile-dragon-generation-20261011/1','shape_checkpoint_sha256':SHAPE_CHECKPOINT_SHA,'geometry_resampled':False}
        with torch.no_grad():
            condition=pipeline.get_cond([image],512)
            if 'cpu_rng_state' in saved:
                torch.set_rng_state(saved['cpu_rng_state']);torch.cuda.set_rng_state(saved['cuda_rng_state']);REPORT['resume']['rng_restored']=True
            else:torch.manual_seed(38018);REPORT['resume']['texture_seed']=38018
            tex=pipeline.sample_tex_slat(condition,pipeline.models['tex_slat_flow_model_512'],shape)
            meshes=pipeline.decode_latent(shape,tex,512)
        latent=(shape,tex,512)
    else:meshes,latent=pipeline.run(image,seed=38017,preprocess_image=False,pipeline_type=PIPELINE_TYPE,return_latent=True)
    shape,tex,res=latent
    torch.save({'shape_feats':shape.feats.cpu(),'shape_coords':shape.coords.cpu(),'tex_feats':tex.feats.cpu(),'tex_coords':tex.coords.cpu(),'resolution':res},OUT/'latents.pt')
    mesh=meshes[0]
    import numpy as np,trimesh
    vertices=mesh.vertices.cpu().numpy();faces=mesh.faces.cpu().numpy()
    trimesh.Trimesh(vertices,faces,process=False).export(OUT/'source-geometry.ply')
    np.savez_compressed(OUT/'source-volume.npz',vertices=vertices,faces=faces,attrs=mesh.attrs.cpu().numpy(),coords=mesh.coords.cpu().numpy(),voxel_size=mesh.voxel_size)
    (OUT/'source-volume-layout.json').write_text(json.dumps({'origin':mesh.origin.tolist(),'voxel_shape':list(mesh.voxel_shape),'layout':{k:[v.start,v.stop,v.step] for k,v in mesh.layout.items()}},indent=2))
    REPORT.update(actual_resolution=res,vertices=len(vertices),faces=len(faces),source_assets_saved=True);REPORT['stage']='exporting';save()
    import o_voxel.postprocess
    glb=o_voxel.postprocess.to_glb(vertices=mesh.vertices,faces=mesh.faces,attr_volume=mesh.attrs,coords=mesh.coords,attr_layout=mesh.layout,voxel_size=mesh.voxel_size,aabb=[[-.5,-.5,-.5],[.5,.5,.5]],decimation_target=500000,texture_size=2048 if PIPELINE_TYPE=='512' else 4096,remesh=False,verbose=True)
    target=OUT/'hostile-dragon-source.glb';glb.export(target,extension_webp=True)
    REPORT['glb']={'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
    REPORT['stage']='editable_candidate_saved'
except Exception:REPORT['stage']='generation_failed';REPORT['error']=traceback.format_exc()[-6000:]
finally:save()
