"""Local preview with explicit module MIME types (Windows registers .js as text/plain)."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
ROOT=Path(__file__).resolve().parent/'outputs'
class Handler(SimpleHTTPRequestHandler):
    extensions_map={**SimpleHTTPRequestHandler.extensions_map,'.js':'text/javascript','.mjs':'text/javascript','.glb':'model/gltf-binary'}
    def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
if __name__=='__main__':ThreadingHTTPServer(('127.0.0.1',8767),Handler).serve_forever()
