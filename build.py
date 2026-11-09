import json
s=open('src.html',encoding='utf-8').read()
m=json.load(open('/home/claude/models.json'))
mm={k:[{'sheet':x['sheet'],'hr':x['hr'],'cols':x['cols']} for x in v] for k,v in m.items()}
import base64,os
tp={}
for k in mm:
    f=os.path.join(os.path.dirname(os.path.abspath(__file__)),'templates',k+'.xlsx')
    if os.path.exists(f): tp[k]=base64.b64encode(open(f,'rb').read()).decode()
p=s.replace('/*MODELS*/','window.MODELS='+json.dumps(mm,ensure_ascii=False)+';window.TPL='+json.dumps(tp)+';')
assert chr(0xfffd) not in p
open('painel.html','w',encoding='utf-8').write(p)
