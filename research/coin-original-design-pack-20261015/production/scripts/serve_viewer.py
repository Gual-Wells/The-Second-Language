from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 extensions_map={**SimpleHTTPRequestHandler.extensions_map,'.js':'text/javascript','.mjs':'text/javascript','.glb':'model/gltf-binary','.wasm':'application/wasm'}
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
ThreadingHTTPServer(("127.0.0.1",8124),Handler).serve_forever()
