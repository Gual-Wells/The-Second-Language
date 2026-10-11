"""Validate a durable GLB without importing a credential-bearing runner."""
import hashlib
import json
import struct

def check_glb(path):
    with path.open('rb') as stream:
        magic, version, length = struct.unpack('<4sII', stream.read(12))
        if magic != b'glTF' or version != 2 or length != path.stat().st_size:
            raise RuntimeError('Invalid or incomplete GLB')
        size, chunk_type = struct.unpack('<II', stream.read(8))
        if chunk_type != 0x4E4F534A:
            raise RuntimeError('GLB JSON chunk missing')
        doc = json.loads(stream.read(size))
    if not doc.get('meshes') or not doc.get('buffers'):
        raise RuntimeError('GLB contains no mesh/buffer')
    if any(b.get('uri') for b in doc.get('buffers', [])):
        raise RuntimeError('Export requires external buffer')
    if any(im.get('uri') and not im['uri'].startswith('data:') for im in doc.get('images', [])):
        raise RuntimeError('Export requires external image')
    return {'bytes': length, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'meshes': len(doc['meshes']), 'materials': len(doc.get('materials', [])),
            'images': len(doc.get('images', [])), 'extensions': doc.get('extensionsUsed', [])}
