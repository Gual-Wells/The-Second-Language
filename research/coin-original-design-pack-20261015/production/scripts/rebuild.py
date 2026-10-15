"""Rebuild this fitted sample from included source meshes; no API or new GPU generation."""
from pathlib import Path
import subprocess,sys,os,argparse
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--blender',required=True,help='Blender 5.1 executable');a=p.parse_args()
(ROOT/'tmp').mkdir(exist_ok=True)
env=dict(os.environ,PYTHONUTF8='1',PYTHONDONTWRITEBYTECODE='1',TEMP=str(ROOT/'tmp'),TMP=str(ROOT/'tmp'),BLENDER_USER_CONFIG=str(ROOT/'blender-config'))
for name in ['build_blank','align_art','fit_coin','repair_grip_support','clean_reconstruction_debris','verify_model']:
    subprocess.run([sys.executable,str(ROOT/'scripts'/(name+'.py'))],cwd=ROOT,env=env,check=True)
subprocess.run([a.blender,'--background','--python',str(ROOT/'scripts/assemble_blender.py')],cwd=ROOT,env=env,check=True)
print('Rebuilt editable Blend, GLB and real camera renders. Artistic adoption remains a user decision.')
