import re,base64,pathlib
r=pathlib.Path('D:/CodexStorage/workspaces/hostile-dragon-coin');s=(r/'working/trellis2-preview.html').read_text(encoding="utf8");p=r/'working/trellis2-server-renders';p.mkdir(exist_ok=True)
for match in re.finditer(r'id="(view-m\d-s\d)"[\s\S]*?src="data:image/jpeg;base64,([^"]+)"',s):(p/(match[1]+'.jpg')).write_bytes(base64.b64decode(match[2]))
print('Saved',len(list(p.glob('*.jpg'))),'unaltered server renders')

