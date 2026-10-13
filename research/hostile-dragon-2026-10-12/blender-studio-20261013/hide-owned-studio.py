import ctypes,json
from pathlib import Path
root=Path(__file__).resolve().parent
pid=json.loads((root/'outputs/runtime-interactive.json').read_text())['pid']
u=ctypes.windll.user32;rows=[]
CALLBACK=ctypes.WINFUNCTYPE(ctypes.c_bool,ctypes.c_void_p,ctypes.c_void_p)
@CALLBACK
def visit(hwnd,_):
 owner=ctypes.c_ulong();u.GetWindowThreadProcessId(hwnd,ctypes.byref(owner))
 if owner.value==pid:
  was=bool(u.IsWindowVisible(hwnd))
  if was:u.ShowWindow(hwnd,0)
  rows.append({'handle':int(hwnd),'was_visible':was,'is_visible':bool(u.IsWindowVisible(hwnd))})
 return True
u.EnumWindows(visit,0)
(root/'outputs/window-state.json').write_text(json.dumps({'pid':pid,'windows':rows},indent=2))
print(json.dumps({'pid':pid,'visible_windows_remaining':sum(r['is_visible'] for r in rows)}))
