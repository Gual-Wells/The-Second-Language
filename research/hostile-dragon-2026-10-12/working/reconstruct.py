import os,sys,json,pathlib,time
root=pathlib.Path('D:/CodexStorage/workspaces/hostile-dragon-coin');os.environ['HF_HOME']='D:/CodexStorage/tmp/dragon-coin/hf';os.environ['TEMP']=os.environ['TMP']='D:/CodexStorage/tmp/dragon-coin';sys.path.insert(0,'D:/CodexStorage/tools/dragon-python')
from gradio_client import Client,handle_file
print('Connecting',flush=True)
c=Client('https://tencent-hunyuan3d-2-1.hf.space',download_files=str(root/'working/reconstruction'))
job=c.submit(image=handle_file(str(root/'concept-v1.png')),steps=40,guidance_scale=5,seed=38017,octree_resolution=512,check_box_rembg=True,num_chunks=8000,randomize_seed=False,api_name='/shape_generation')
print('Submitted',flush=True)
while not job.done():
 print(str(job.status()),flush=True);time.sleep(15)
result=job.result();(root/'working/reconstruction-result.json').write_text(json.dumps(result,ensure_ascii=False,default=str,indent=2));print(str(result)[:2000],flush=True)
