#!/usr/bin/env python3
"""Mantém painel e manual sincronizados a partir de CHANGELOG.tsv (versão<TAB>data<TAB>mudança, mais nova primeiro).
  python3 sync_manual.py          -> grava versão/data no src.html (PROC_VER) e no docs/manual.html (meta + tabela do histórico)
  python3 sync_manual.py --check  -> só confere; sai com erro se painel e manual estiverem diferentes
Para uma nova versão: adicione UMA linha no topo do CHANGELOG.tsv e rode sem argumentos."""
import re,sys,os
D=os.path.dirname(os.path.abspath(__file__));os.chdir(D)
rows=[l.rstrip('\n').split('\t') for l in open('CHANGELOG.tsv',encoding='utf-8') if l.strip()]
ver,data,_=rows[0]
src=open('src.html',encoding='utf-8').read();man=open('docs/manual.html',encoding='utf-8').read()
pv=re.search(r"const PROC_VER='(v\d+) · ([\d/]+)'",src);mv=re.search(r'Versão do painel: (v\d+)</span><span>Atualizado em ([\d/]+)',man)
th=re.search(r'<tr><th>Painel</th>.*?</tr>\n<tr><td>(v\d+)</td>',man,re.S)
cur=(pv.group(1),pv.group(2)),(mv.group(1),mv.group(2)),th.group(1)
ok=cur[0]==(ver,data) and cur[1]==(ver,data) and cur[2]==ver
if '--check' in sys.argv:
    if ok: print('manual em dia:',ver,data);sys.exit(0)
    print('MANUAL DESATUALIZADO. changelog=%s %s | painel=%s | manual=%s | tabela=%s'%(ver,data,cur[0],cur[1],cur[2]));print('Rode: python3 sync_manual.py  (e refaça os prints: node tests/shots.js)');sys.exit(1)
src=re.sub(r"const PROC_VER='[^']*'","const PROC_VER='%s · %s'"%(ver,data),src,1)
man=re.sub(r'Versão do painel: v\d+</span><span>Atualizado em [\d/]+','Versão do painel: %s</span><span>Atualizado em %s'%(ver,data),man,1)
body='\n'.join('<tr><td>%s</td><td>%s</td><td>%s</td></tr>'%tuple(r[:3]) for r in rows)
man=re.sub(r'(<tr><th>Painel</th><th>Data</th><th>Mudança no painel</th></tr>\n).*?(</table>)',lambda m:m.group(1)+body+'\n'+m.group(2),man,1,flags=re.S)
open('src.html','w',encoding='utf-8').write(src);open('docs/manual.html','w',encoding='utf-8').write(man)
print('sincronizado:',ver,data,'(%d versões no histórico)'%len(rows))
