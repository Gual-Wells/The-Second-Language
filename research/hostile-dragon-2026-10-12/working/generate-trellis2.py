import os,sys,pathlib,time,json
r=pathlib.Path('D:/CodexStorage/workspaces/hostile-dragon-coin');os.environ['HF_HOME']='D:/CodexStorage/tmp/dragon-coin/hf';os.environ['TEMP']=os.environ['TMP']='D:/CodexStorage/tmp/dragon-coin';sys.path.insert(0,'D:/CodexStorage/tools/dragon-python')
from gradio_client import Client,handle_file
c=Client('https://microsoft-trellis-2.hf.space',token=(r/'hf-token.txt').read_text().strip(),download_files=str(r/'working/trellis2'),httpx_kwargs={'timeout':240},verbose=False,analytics_enabled=False)?[TEMPORARY_QUERY_REMOVED]
def waitjob(j,label):
 while not j.done():
  s=j.status();print(label,s.code,'rank',s.rank,'eta',s.eta,flush=True);time.sleep(15)
 return j.result()
c.predict(api_name='/start_session');im=c.predict(handle_file(str(r/'concept-v1.png')),api_name='/preprocess_image');print('Image preprocessed',flush=True)
j=c.submit(image=handle_file(im),seed=38017,resolution='1536',ss_sampling_steps=12,shape_slat_sampling_steps=12,tex_slat_sampling_steps=12,api_name='/image_to_3d')
res=waitjob(j,'Generate');(r/'working/trellis2-preview.html').write_text(str(res),encoding='utf8');print('Generation complete; extracting model',flush=True)
j=c.submit(decimation_target=500000,texture_size=4096,api_name='/extract_glb');res=waitjob(j,'Extract');(r/'working/trellis2-result.json').write_text(json.dumps(res,default=str,indent=2));print('Saved model paths',str(res)[:700],flush=True)

