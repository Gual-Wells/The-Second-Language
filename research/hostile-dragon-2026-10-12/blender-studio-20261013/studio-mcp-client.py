import asyncio,json,os,sys
from pathlib import Path
from mcp import ClientSession,StdioServerParameters
from mcp.client.stdio import stdio_client
ROOT=Path(__file__).resolve().parent
sys.stdout.reconfigure(encoding='utf-8')
async def main():
 env=dict(os.environ);env.update({'PYTHONPATH':str(ROOT/'official-mcp-bundle'),'BLENDER_MCP_HOST':'127.0.0.1','BLENDER_MCP_PORT':'9879','BLENDER_PATH':'D:/CodexStorage/tools/blender-5.1.2-windows-x64/blender.exe','TEMP':str(ROOT/'tmp'),'TMP':str(ROOT/'tmp'),'PYTHONPYCACHEPREFIX':str(ROOT/'cache/pycache')})
 params=StdioServerParameters(command=str(ROOT/'analysis-venv/Scripts/python.exe'),args=['-m','blmcp'],env=env)
 async with stdio_client(params) as (read,write):
  async with ClientSession(read,write) as session:
   await session.initialize()
   if len(sys.argv)==1:
    ts=await session.list_tools();names=[t.name for t in ts.tools]
    r=await session.call_tool('execute_blender_code',{'code':'import bpy\nresult={"version":bpy.app.version_string,"objects":[o.name for o in bpy.context.scene.objects],"file":bpy.data.filepath}'} )
    report={'tools':names,'live_scene':r.model_dump(mode='json')}
    (ROOT/'outputs/mcp-protocol-verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report))
   else:
    path=Path(sys.argv[1]).resolve()
    if not path.is_relative_to(ROOT/'commands'):raise RuntimeError('Only task command files accepted')
    r=await session.call_tool('execute_blender_code',{'code':path.read_text(encoding='utf-8')})
    report=r.model_dump(mode='json');(ROOT/'outputs'/('mcp-'+path.stem+'.json')).write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report))
    if r.isError:raise RuntimeError('MCP tool execution failed')
asyncio.run(main())
