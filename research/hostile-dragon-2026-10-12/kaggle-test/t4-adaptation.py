"""Reviewed T4 adaptations; preserve trained BF16/FP16 weights and attention semantics."""
import gc,pathlib

def patch_source(repo):
    config=repo/'trellis2/modules/sparse/config.py'
    text=config.read_text()
    old="env_sparse_attn_backend in ['xformers', 'flash_attn', 'flash_attn_3']"
    if text.count(old)!=1:raise RuntimeError('Sparse config anchor changed')
    config.write_text(text.replace(old,old[:-1]+", 'sdpa']"))
    target=repo/'trellis2/modules/sparse/attention/full_attn.py'
    text=target.read_text()
    anchor='    else:\n        raise ValueError(f"Unknown attention module: {config.ATTN}")'
    if text.count(anchor)!=1:raise RuntimeError('Sparse attention anchor changed')
    branch='''    elif config.ATTN == 'sdpa':
        from torch.nn.functional import scaled_dot_product_attention as sdpa
        if num_all_args == 1:
            q, k, v = qkv.unbind(dim=1)
        elif num_all_args == 2:
            k, v = kv.unbind(dim=1)
        outputs = []
        q_start = kv_start = 0
        for q_len, kv_len in zip(q_seqlen, kv_seqlen):
            qi = q[q_start:q_start+q_len].unsqueeze(0).transpose(1, 2)
            ki = k[kv_start:kv_start+kv_len].unsqueeze(0).transpose(1, 2)
            vi = v[kv_start:kv_start+kv_len].unsqueeze(0).transpose(1, 2)
            outputs.append(sdpa(qi, ki, vi).transpose(1, 2).squeeze(0))
            q_start += q_len
            kv_start += kv_len
        out = torch.cat(outputs, dim=0)
'''
    target.write_text(text.replace(anchor,branch+anchor))
    pipeline=repo/'trellis2/pipelines/trellis2_image_to_3d.py'
    text=pipeline.read_text()
    old="pipeline.rembg_model = getattr(rembg, args['rembg_model']['name'])(**args['rembg_model']['args'])"
    if text.count(old)!=1:raise RuntimeError('Background loader anchor changed')
    pipeline.write_text(text.replace(old,'pipeline.rembg_model = None  # input was already background-removed'))

def install_runtime(model_pins,report,save):
    import torch,huggingface_hub
    import torch.nn.functional as F
    from torch.nn.attention import sdpa_kernel,SDPBackend
    original_sdpa=F.scaled_dot_product_attention
    def efficient(q,k,v,*args,**kwargs):
        if q.is_cuda and q.dtype==torch.bfloat16:
            with sdpa_kernel(SDPBackend.EFFICIENT_ATTENTION):
                output=original_sdpa(q.float(),k.float(),v.float(),*args,**kwargs)
            return output.to(q.dtype)
        return original_sdpa(q,k,v,*args,**kwargs)
    F.scaled_dot_product_attention=efficient
    original_download=huggingface_hub.hf_hub_download
    def pinned_download(repo_id,filename,*args,**kwargs):
        if repo_id not in model_pins:raise ValueError('Model outside pinned repositories')
        kwargs['revision']=model_pins[repo_id]['revision']
        return original_download(repo_id,filename,*args,**kwargs)
    huggingface_hub.hf_hub_download=pinned_download
    from trellis2 import models
    original_load=models.from_pretrained
    class LazyModel(torch.nn.Module):
        def __init__(self,path,kwargs):
            super().__init__()
            object.__setattr__(self,'path',path);object.__setattr__(self,'kwargs',kwargs)
            object.__setattr__(self,'loaded',None);object.__setattr__(self,'overrides',{})
        def _load(self):
            if self.loaded is None:
                report['loading_model']=self.path;save()
                # Constructors initialize CPU tensors before loading the checkpoint.
                # Preserve the sampling RNG when moving eager construction into a later stage.
                with torch.random.fork_rng(devices=[]):
                    model=original_load(self.path,**self.kwargs).eval()
                for key,value in self.overrides.items():setattr(model,key,value)
                object.__setattr__(self,'loaded',model)
            return self.loaded
        def eval(self):object.__setattr__(self,'training',False);return self
        def to(self,*args,**kwargs):self._load().to(*args,**kwargs);return self
        def cpu(self):
            object.__setattr__(self,'loaded',None);gc.collect();torch.cuda.empty_cache();return self
        def __call__(self,*args,**kwargs):return self._load()(*args,**kwargs)
        def __getattr__(self,name):return getattr(self._load(),name)
        def __setattr__(self,name,value):
            if name in ['path','kwargs','loaded','overrides']:object.__setattr__(self,name,value)
            else:
                self.overrides[name]=value
                if self.loaded is not None:setattr(self.loaded,name,value)
    def lazy_load(path,**kwargs):
        marker=path.find('microsoft/')
        if marker<0:raise ValueError('Checkpoint outside pinned Microsoft models')
        return LazyModel(path[marker:],kwargs)
    models.from_pretrained=lazy_load
    from trellis2.modules.sparse.conv import config as conv_config
    conv_config.FLEX_GEMM_ALGO='explicit_gemm'
    from flex_gemm.ops.spconv.submanifold_conv3d import SubMConv3dFunction
    from flex_gemm.ops.spconv import Algorithm
    import flex_gemm.ops.spconv as spconv
    original_conv=SubMConv3dFunction._sparse_submanifold_conv_forward
    def bounded_conv(feats,neighbor_cache,weight,bias=None):
        if spconv.ALGORITHM!=Algorithm.EXPLICIT_GEMM:return original_conv(feats,neighbor_cache,weight,bias)
        n=len(feats);co,kw,kh,kd,ci=weight.shape;volume=kw*kh*kd
        neighbor=neighbor_cache['neighbor_map'];flat_weight=weight.reshape(co,volume*ci).transpose(0,1)
        output=torch.empty((n,co),device=feats.device,dtype=feats.dtype)
        rows=max(64,min(8192,(128*2**20)//max(1,volume*ci*feats.element_size())))
        for start in range(0,n,rows):
            end=min(n,start+rows);ids=neighbor[start:end].reshape(-1);mask=ids!=0xffffffff
            cols=torch.zeros(((end-start)*volume,ci),device=feats.device,dtype=feats.dtype)
            cols[mask]=feats[ids.long()[mask]];cols=cols.reshape(end-start,volume*ci)
            output[start:end]=torch.addmm(bias,cols,flat_weight) if bias is not None else cols@flat_weight
        return output
    SubMConv3dFunction._sparse_submanifold_conv_forward=staticmethod(bounded_conv)
    report['adaptations']=['BF16 attention evaluated in FP32 efficient kernel then returned as BF16','per-sequence sparse SDPA','stage-wise checkpoint reload from disk','bounded explicit im2col','preprocessed input: no background model']
    return original_sdpa
