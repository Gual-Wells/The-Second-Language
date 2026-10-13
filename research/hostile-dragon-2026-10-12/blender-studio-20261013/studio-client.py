"""Use official socket client; commands must be saved below this task directory."""
import sys,os,json,importlib.util
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')
ROOT=Path(__file__).resolve().parent
source=ROOT/'official-mcp-bundle/blmcp/tools_helpers/connection.py'
spec=importlib.util.spec_from_file_location('official_blender_connection',source)
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
os.environ['BLENDER_MCP_HOST']='127.0.0.1';os.environ['BLENDER_MCP_PORT']='9879'
path=Path(sys.argv[1]).resolve()
if not path.is_relative_to(ROOT/'commands'):raise RuntimeError('Only task-scoped command files are accepted')
reply=module.send_code(path.read_text(encoding='utf-8'),strict_json=False)
(ROOT/'outputs'/('response-'+path.stem+'.json')).write_text(json.dumps(reply,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(reply,ensure_ascii=False))
if reply.get('status')!='ok':sys.exit(1)
