"""Chapter-series design branch. Uses the same real font outlines and frame as the special coin.

All dimensions are working design choices, not measurements recovered from the concept image.
No artwork generation, award allocation, database writes or clock reads occur here.
"""
from pathlib import Path
from datetime import datetime, timezone
import json, re, math, csv, copy, xml.etree.ElementTree as ET


def validate_record(record):
    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key.lower() in {'sequence', 'sequence_number', 'issuesequence', 'issue', 'issueno', 'edition_fraction'}:
                    raise ValueError('Series has no issue/sequence field: '+key)
                walk(child)
        elif isinstance(value, list):
            for child in value: walk(child)
    walk(record)
    if record.get('coin_type') != 'chapter-certification': raise ValueError('Wrong coin type')
    n=record['chapter']['number']
    if type(n) is not int or n < 1: raise ValueError('Chapter number must be a positive integer')
    for key in ['title_zh', 'title_en']:
        text=record['chapter'][key]
        if not isinstance(text,str) or not text.strip() or text!=text.strip() or '\n' in text:
            raise ValueError('Supply a complete, trimmed, single-string title: '+key)
    raw=record['identity']['raw_hex']
    if not re.fullmatch(r'[0-9A-F]{16}',raw): raise ValueError('Identity must be 16 uppercase hex characters')
    stamp=record['certification']['passed_at']
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(?:Z|[+-]\d{2}:\d{2})',stamp):
        raise ValueError('Use an explicit RFC3339 offset and three fractional second digits')
    if stamp.endswith('-00:00'): raise ValueError('Unknown UTC offset is not an exact event instant')
    dt=datetime.fromisoformat(stamp.replace('Z','+00:00'))
    utc=datetime.fromisoformat(record['certification']['passed_at_utc'].replace('Z','+00:00'))
    if dt.astimezone(timezone.utc)!=utc: raise ValueError('Local and UTC certification instants differ')
    if not isinstance(record.get('sample_only'),bool): raise ValueError('sample_only must be explicit')
    return dt


def resolve_record(record, policy, text_geometry):
    dt=validate_record(record)
    cnfont=policy['fonts']['title']; latin=policy['fonts']['inscription']
    def measure(text,font,height,tracking): return text_geometry(text,font,height,tracking)[1]
    def wrap_title(text,font,preferred,minimum,width,tracking,chinese):
        actual=measure(text,font,preferred,tracking)
        if actual<=width: return [text],preferred
        # Uniform font-size reduction only. Never squeeze horizontally or widen tracking to fill.
        lo,hi=minimum,preferred
        if measure(text,font,lo,tracking)<=width:
            for _ in range(32):
                mid=(lo+hi)/2
                if measure(text,font,mid,tracking)<=width: lo=mid
                else: hi=mid
            return [text],lo
        candidates=[]
        for i in range(1,len(text)):
            if chinese:
                if text[i] in '，。！？：；、）》」』' or text[i-1] in '（《「『': continue
                a,b=text[:i],text[i:]
            else:
                if text[i]!=' ': continue
                a,b=text[:i],text[i+1:]
            if not a or not b: continue
            # Source text reconstruction is checked independently; no abbreviation is allowed.
            for height in [minimum]:
                wa=measure(a,font,height,tracking); wb=measure(b,font,height,tracking)
                if max(wa,wb)<=width: candidates.append((abs(wa-wb),a,b,height))
        if not candidates: raise ValueError('Title needs a reviewed alternate layout; no truncation or tiny type: '+text)
        _,a,b,height=min(candidates,key=lambda t:t[0])
        return [a,b],height
    cp=policy['title_zh'];ep=policy['title_en']
    zh,zhh=wrap_title(record['chapter']['title_zh'],cnfont,cp['preferred_height'],cp['minimum_height'],cp['max_width'],cp['tracking'],True)
    en,enh=wrap_title(record['chapter']['title_en'],cnfont,ep['preferred_height'],ep['minimum_height'],ep['max_width'],ep['tracking'],False)
    compact=len(zh)>1 or len(en)>1
    positions=policy['compact'] if compact else policy['standard']
    zhc=positions['title_zh_two'] if len(zh)>1 else [positions['title_zh_one']]
    enc=positions['title_en_two'] if len(en)>1 else [positions['title_en_one']]
    rows=[];glyphs=[]
    def row(rid,text,font,height,tracking,z,maxwidth):
        its,width=text_geometry(text,font,height,tracking)
        if width>maxwidth+1e-7: raise ValueError(rid+' exceeds its layout region')
        boxes=[it['bbox'] for it in its if it['bbox']]
        bbox=[min(b[0] for b in boxes),min(b[1] for b in boxes)+z,max(b[2] for b in boxes),max(b[3] for b in boxes)+z]
        r={'id':rid,'text':text,'font':font,'ink_height':height,'tracking':tracking,'center_q':0,'center_z':z,'width_mm':width,'max_width':maxwidth,'bbox_qz':bbox}
        rows.append(r)
        for it in its:
            b=it['bbox']
            glyphs.append({'id':rid+'-G'+str(it['index']+1).zfill(2),'row_id':rid,'character':it['char'],'glyph':it['glyph'],'font':font,
                'font_scale_mm_per_unit':it['scale'],'font_translate_qz':[it['tx'],z+it['ty']],
                'ink_bbox_qz':None if b is None else [b[0],b[1]+z,b[2],b[3]+z],
                'svg_path_font_units':it['path'],'contours_qz_mm':[[(q,zz+z) for q,zz in c] for c in it['contours']]})
    row('SER-CHAPTER','CHAPTER '+str(record['chapter']['number']).zfill(2),latin,1.22,.035,.20,14)
    for i,(text,z) in enumerate(zip(zh,zhc),1): row('SER-ZH-'+str(i),text,cnfont,zhh,cp['tracking'],z,cp['max_width'])
    for i,(text,z) in enumerate(zip(en,enc),1): row('SER-EN-'+str(i),text,cnfont,enh,ep['tracking'],z,ep['max_width'])
    raw=record['identity']['raw_hex'];display=' '.join(raw[i:i+4] for i in range(0,16,4))
    row('SER-HASH',display,latin,positions['hash_height'],.015,positions['hash_z'],20)
    date='CERTIFIED · '+dt.strftime('%Y.%m.%d')
    offset=dt.strftime('%z');offset=offset[:3]+':'+offset[3:]
    clock=dt.strftime('%H:%M:%S.')+f'{dt.microsecond//1000:03d}'+'  '+offset
    row('SER-DATE',date,latin,positions['date_height'],.018,positions['date_z'],23.5)
    row('SER-TIME',clock,latin,positions['time_height'],.015,positions['time_z'],22)
    # Compare real outlined ink regions, not text-element boxes.
    ordered=sorted(rows,key=lambda r:-r['center_z'])
    clearances=[]
    for a,b in zip(ordered,ordered[1:]):
        gap=a['bbox_qz'][1]-b['bbox_qz'][3]
        if gap<policy['minimum_row_gap']-1e-8: raise ValueError('Rows collide or crowd: '+a['id']+' / '+b['id'])
        clearances.append({'upper':a['id'],'lower':b['id'],'gap_mm':gap})
    for r in rows:
        x0,z0,x1,z1=r['bbox_qz']
        # The adopted cartouche narrows linearly below z=-8.7.
        allowed=14.6 if z0>=-8.7 else 14.6-(min(-z0,13.8)-8.7)*(2.8/5.1)
        if z0 < -13.35 or z1>1.55 or max(abs(x0),abs(x1))>allowed-.4:
            raise ValueError('Ink leaves safe cartouche: '+r['id'])
    delta=dt.astimezone(timezone.utc)-datetime(1970,1,1,tzinfo=timezone.utc)
    return {'schema':'tsl.series.resolved/1','record':record,'layout_mode':'compact' if compact else 'standard',
        'rows':rows,'glyphs':glyphs,'row_clearances':clearances,'divider_z':positions['divider_z'],
        'identity_display':display,'certification_epoch_ms':delta.days*86400000+delta.seconds*1000+delta.microseconds//1000,
        'identity_is_sequence':False,'organic_front':'not designed in this blank/master package',
        'foundation_overrides_applied':False,'repeat_edge_master':'vectors/edge-layout-mm.svg'}


def build_series(ctx):
    root=ctx['ROOT'];spec=ctx['S'];policy=spec['series'];tg=ctx['text_geometry'];num=ctx['num']
    sample=json.loads((root/policy['sample_record']).read_text(encoding='utf-8'))
    resolved=resolve_record(sample,policy,tg)
    # Default package is the reproducible chapter-one specimen. CLI overrides must use an explicit output directory.
    import argparse
    parser=argparse.ArgumentParser(description='Build common/foundation sheets and a chapter-series design instance')
    parser.add_argument('--series-record',type=Path);parser.add_argument('--series-output',type=Path)
    args=parser.parse_args()
    if bool(args.series_record)!=bool(args.series_output): raise ValueError('Use --series-record together with --series-output')
    if args.series_record:
        output=args.series_output.resolve()
        if output.is_relative_to(root): raise ValueError('Custom series output must be outside the canonical package')
        output.mkdir(parents=True,exist_ok=True)
        resolved=resolve_record(json.loads(args.series_record.read_text(encoding='utf-8')),policy,tg)
        target=output
    else: target=root
    (target/'spec').mkdir(exist_ok=True);(target/'vectors').mkdir(exist_ok=True)
    def write(rel,data):
        (target/rel).write_text(data,encoding='utf-8')
    write('spec/series-resolved.json',json.dumps(resolved,ensure_ascii=False,indent=2)+'\n')
    ns={'s':'http://www.w3.org/2000/svg'}
    frame=(root/'vectors/reverse-common-frame-mm.svg').read_text(encoding='utf-8')
    framebody=re.sub(r'^<svg[^>]*>','',frame).removesuffix('</svg>')
    glyphbody=''
    for g in resolved['glyphs']:
        if not g['svg_path_font_units']:continue
        q,z=g['font_translate_qz']
        glyphbody+=f'<path id="{g["id"]}" d="{g["svg_path_font_units"]}" transform="translate({num(q)} {num(z)}) scale({num(g["font_scale_mm_per_unit"])})" fill="#263546"/>'
    def diamond(q,z,size):return f'<path d="M {q-size} {z} L {q} {z+size} L {q+size} {z} L {q} {z-size} Z" fill="#3d4d53"/>'
    decor='<g transform="scale(1 -1)">'
    # Two small chapter-line ornaments; same real foliate master, not a new AI ornament per coin.
    for q in [-8.9,8.9]:
        decor+=f'<g transform="translate({q} .2) scale(.40 .40) translate(0 {-ctx["motif_center_y"]})">{ctx["motif_svg"]()}</g>'
    decor+='<path d="M -11.5 -.90 L 11.5 -.90" fill="none" stroke="#526972" stroke-width=".055"/>'
    hz=next(r['center_z'] for r in resolved['rows'] if r['id']=='SER-HASH')
    hw=next(r['width_mm']/2 for r in resolved['rows'] if r['id']=='SER-HASH')
    for sign in [-1,1]:
        decor+=f'<path d="M {sign*(hw+.65)} {hz} L {sign*11.5} {hz}" stroke="#526972" stroke-width=".055"/>'
        decor+=diamond(sign*11.15,hz,.10)
    dz=resolved['divider_z']
    decor+=f'<path d="M -11.5 {dz} L -.32 {dz} M .32 {dz} L 11.5 {dz}" stroke="#526972" fill="none" stroke-width=".055"/>'+diamond(0,dz,.18)+'</g>'
    lettering='<g transform="scale(1 -1)" fill-rule="nonzero">'+glyphbody+'</g>'
    simple=ctx['simple_svg']
    write('vectors/series-reverse-lettering-mm.svg',simple('40mm','40mm','-20 -20 40 40',lettering))
    combined=framebody+decor+lettering
    write('vectors/series-reverse-fixed-components-mm.svg',simple('40mm','40mm','-20 -20 40 40',combined))
    write('vectors/series-blank-front-mm.svg',simple('40mm','40mm','-20 -20 40 40','<circle cx="0" cy="0" r="20" fill="none" stroke="#263546" stroke-width=".08"/><circle cx="0" cy="0" r="19.2" fill="none" stroke="#65787a" stroke-width=".06"/>'))
    world=[]
    for g in resolved['glyphs']:
        if g['contours_qz_mm']:
            world.append({'id':g['id'],'row_id':g['row_id'],'contours_xyz_mm':[[[-q,spec['reverse']['face_y'],z] for q,z in poly] for poly in g['contours_qz_mm']],
                'incuse_direction':[0,-1,0],'depth_mm':spec['reverse']['incuse_text_depth']})
    write('vectors/series-reverse-world-guides.json',json.dumps({'schema':'tsl.series.reverse-guides/1','coordinate':'X=-q; Y=+1.4; Z=z; incise toward -Y','curves':world},ensure_ascii=False,separators=(',',':'))+'\n')
    with (target/'spec/series-glyph-placement.csv').open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.writer(f);w.writerow(['ID','ROW','CHAR','Q_MIN_MM','Z_MIN_MM','Q_MAX_MM','Z_MAX_MM','FONT','SCALE_MM_PER_FONT_UNIT'])
        for g in resolved['glyphs']:
            w.writerow([g['id'],g['row_id'],'SPACE' if g['character']==' ' else g['character'],*(['']*4 if g['ink_bbox_qz'] is None else g['ink_bbox_qz']),g['font'],g['font_scale_mm_per_unit']])
    if args.series_record:
        # Include immutable common sources so a custom instance has usable SVG even outside this package.
        write('vectors/reverse-common-frame-mm.svg',frame)
        print(json.dumps({'custom_series_output':str(target),'layout':resolved['layout_mode'],'rows':len(resolved['rows'])},ensure_ascii=False));return
    board=ctx['board'];txt=ctx['txt'];line=ctx['line'];circle=ctx['circle']
    def diagram_coin(body,x,y,scale):return f'<g transform="translate({x} {y}) scale({scale})">{body}</g>'
    body=diagram_coin(combined,480,550,17)
    body+=circle(480,550,340,'none','#58696e',1)
    for i,row in enumerate(resolved['rows']):
        z=row['center_z']; yy=550-z*17
        body+=line(480+row['width_mm']/2*17+8,yy,970,yy,'guide')
        body+=txt(985,yy+5,f'{row["id"]}  z {z:+.2f} / h {row["ink_height"]:.2f}','small')
    for i,t in enumerate(['统一框架、原书徽、放射底与币侧共用；','系列章币独立绑定章号、双语章题、随机码、通过时刻。','CHAPTER 01 是章节号，不是认证顺序号。','身份码 16 位大写十六进制，四组四位、整行居中。','只显示 CERTIFIED；不刻 HASH、ID、ISSUE 或流水号。']):body+=txt(990,170+i*37,t,'label')
    body+=txt(80,1020,'样张：第一章「地图上的那条线」；时间和码沿用已选试样，不伪造历史认证或重新发币。','label')
    body+=txt(80,1060,'有机卷草仍由完整系列参考约束；本图固定身份文字与排版，不用框线替代艺术细雕。','label')
    board('09-series-reverse-layout','09 / 系列认证币背：第一章完整身份排版','章号保留 · 删除认证顺序码 · 中文主标题 · 英文副标题 · 居中随机码 · 首次通过时间',body)
    body=''
    for i,row in enumerate(resolved['rows']):
        y=180+i*95
        body+=txt(80,y,row['id'])+txt(330,y,row['text'])
        body+=txt(330,y+30,f'字体 {Path(row["font"]).stem} / 实宽 {row["width_mm"]:.5f} / 高 {row["ink_height"]:.3f} / z {row["center_z"]:+.3f}','small')
        body+=line(75,y+52,1710,y+52,'guide')
    for y,t in [(925,'原始码 2AD2CC008F6F0647；显示分组仅排版，不改身份值。组内正常字距，禁止撑满。'),(970,'认证试样：2026-10-14T10:35:15.314+08:00 = 2026-10-14T02:35:15.314Z。'),(1015,'后续排版、生成、领取、重考均不重置首次通过时间或身份码；本包不写生产记录。'),(1060,'每字源轮廓、实际毫米框及世界坐标见 series-resolved.json / CSV / reverse-world-guides.json。')]:body+=txt(80,y,t,'label')
    board('10-series-fields-and-identity','10 / 系列字段、字形度量与永久身份','使用真实字体轮廓 · 无 XXX 占位 · 样张时刻固定而非每次构建取当前时间',body)
    body=diagram_coin((root/'vectors/series-blank-front-mm.svg').read_text().split('>',1)[1].removesuffix('</svg>'),410,410,10.8)
    body+=diagram_coin(combined,1240,410,10.8)
    body+=txt(410,150,'系列币胚 · 正面留空','label','middle')+txt(1240,150,'系列币胚 · 第一章背面','label','middle')
    for i,t in enumerate(['正面空白是币胚母版的有意留空，不是已完成第一章的主题作品。','共用结构：D40 / 平场 2.8 / 包边 3.2 / 圆肩 R0.2 / 三组铭文与三组短草纹。','系列默认无龙爪、无龙币缺口、无启程纪念；题材越界需单枚设计明确授权。','章币的主体应从章节有象征性的词汇／义项提取，不被迫等于章名或范文情节。','特别币独立使用启程纪念／仇视之龙，禁止承接章号、随机码和 CERTIFIED 时间。','常规交接由同一共用框架 + 系列字段实例 + 单枚完整主题稿组成；不从龙币复制破口。']):body+=txt(100,730+i*58,t,'label')
    board('11-series-master-and-variants','11 / 系列母版与特别币的边界','系列正面留空的完整币胚视图 · 不是把特别币的无身份背面误作系列母版',body)
    # A short, useful set of title/identity cases verifies actual future-layout behavior.
    checks=[]
    def ck(name,ok,detail):
        checks.append({'name':name,'passed':bool(ok),'detail':detail})
        if not ok:raise ValueError(name)
    ck('source_titles_preserved',sample['chapter']['title_zh']=='地图上的那条线' and sample['chapter']['title_en']=='The Line on the Map','Verified chapter-one source, no improvised English translation')
    ck('six_identity_rows',len(resolved['rows'])==6,[r['id'] for r in resolved['rows']])
    ck('identity_no_issue_sequence',not resolved['identity_is_sequence'] and not resolved['foundation_overrides_applied'],'No issue number, dragon override, date substitution or production write')
    ck('sample_timezone_ms',resolved['certification_epoch_ms']==1791945315314,resolved['certification_epoch_ms'])
    for suffix,titlezh,titleen,numchapter in [('cn-long','地图上的那条线地图上的那条线','The Line on the Map',1200),('en-long','地图上的那条线',' and '.join(['The Line on the Map']*4),1)]:
        rec=copy.deepcopy(sample);rec['chapter'].update(title_zh=titlezh,title_en=titleen,number=numchapter)
        candidate=resolve_record(rec,policy,tg)
        ck('wrap_'+suffix,candidate['layout_mode']=='compact',[(r['id'],r['text']) for r in candidate['rows']])
        zhs=''.join(r['text'] for r in candidate['rows'] if r['id'].startswith('SER-ZH'))
        ens=' '.join(r['text'] for r in candidate['rows'] if r['id'].startswith('SER-EN'))
        ck('complete_'+suffix,zhs==titlezh and ens==titleen,'No dropped title words or CJK characters')
    for name,change in [('missing_ms',lambda r:r['certification'].update(passed_at='2026-10-14T10:35:15+08:00')),
                        ('utc_mismatch',lambda r:r['certification'].update(passed_at_utc='2026-10-14T02:35:16.314Z')),
                        ('bad_hex',lambda r:r['identity'].update(raw_hex='2AD2CC008F6F064X')),
                        ('restored_sequence',lambda r:r.update(sequence=1)),
                        ('oversize_title',lambda r:r['chapter'].update(title_en=' and '.join(['The Line on the Map']*20)))]:
        rec=copy.deepcopy(sample);change(rec)
        try:resolve_record(rec,policy,tg)
        except ValueError:ck('reject_'+name,True,'Rejected before export')
        else:ck('reject_'+name,False,'Invalid record accepted')
    (root/'checks/series-checks.json').write_text(json.dumps({'passed':True,'checks':checks,'scope':'Fixed series typography, identity and data consistency, not artistic or 3D approval'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'series_rows':len(resolved['rows']),'series_glyph_positions':len(resolved['glyphs']),'series_world_curves':len(world),'series_checks':len(checks)},ensure_ascii=False))
