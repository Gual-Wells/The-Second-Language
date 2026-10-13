import bpy,sys,json,os,addon_utils
from pathlib import Path
ROOT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/studio-20261013')
resume=os.environ.get('COIN_STUDIO_RESUME','')
if resume:
 resume_path=Path(resume).resolve()
 if not resume_path.is_relative_to(ROOT/'outputs') or resume_path.suffix!='.blend' or not resume_path.is_file():raise RuntimeError('Resume file must be a saved task-owned studio')
 bpy.ops.wm.open_mainfile(filepath=str(resume_path))
sys.path.insert(0,str(ROOT/'config/scripts/addons'))
bpy.context.preferences.filepaths.temporary_directory=str(ROOT/'tmp')
addon_utils.enable('blender_mcp_addon',default_set=True,persistent=False)
prefs=bpy.context.preferences.addons['blender_mcp_addon'].preferences
prefs.use_autostart=False;prefs.host='127.0.0.1';prefs.port=9879
import blender_mcp_addon
if bpy.app.timers.is_registered(blender_mcp_addon._autostart_timer):bpy.app.timers.unregister(blender_mcp_addon._autostart_timer)
bpy.ops.blmcp.server_start()
record={'version':bpy.app.version_string,'python':sys.version,'background':bpy.app.background,'temp':bpy.app.tempdir,'config':bpy.utils.user_resource('CONFIG'),'scripts':bpy.utils.user_resource('SCRIPTS'),'pid':os.getpid(),'host':'127.0.0.1','port':9879,'control':'official MCP addon interactive timer'}
(ROOT/'outputs/runtime-interactive.json').write_text(json.dumps(record,indent=2),encoding='utf-8')
print(json.dumps(record),flush=True)
# Hide only this process's UI after its window has been created; no desktop input.
def hide_owned_window():
 import ctypes
 user32=ctypes.windll.user32
 callback_type=ctypes.WINFUNCTYPE(ctypes.c_bool,ctypes.c_void_p,ctypes.c_void_p)
 @callback_type
 def visit(hwnd,_):
  owner=ctypes.c_ulong();user32.GetWindowThreadProcessId(hwnd,ctypes.byref(owner))
  if owner.value==os.getpid():user32.ShowWindow(hwnd,0)
  return True
 user32.EnumWindows(visit,0)
 return None
bpy.app.timers.register(hide_owned_window,first_interval=1.0)
