const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();
async function run(role,seed,label){const ctx=await b.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(({role,seed})=>{
  const store=new Map(Object.entries(seed));const subs=[];const lsn=(prefix,fn)=>{const f=()=>{const docs=[...store.entries()].filter(([k])=>k.startsWith(prefix)&&!k.slice(prefix.length).includes('/')).map(([k,d])=>({id:k.slice(prefix.length),data:()=>d}));fn({docs,size:docs.length})};subs.push(f);f()};
  const db={doc:path=>({set:async d=>{store.set(path,d);subs.forEach(f=>f())},get:async()=>({exists:store.has(path),data:()=>store.get(path)}),delete:async()=>{store.delete(path);subs.forEach(f=>f())}}),
   collection:path=>({orderBy(){return this},limit(){return this},onSnapshot:fn=>{lsn(path+'/',fn);return()=>{}}})};
  window.__store=store;
  const user={id:async()=>role.id,profiles:async ids=>Object.fromEntries(ids.map(i=>[i,{name:i===role.id?role.name:'Pessoa '+i}])),search:async q=>[{id:'u9',name:'Ian Novo'}],me:async()=>({email:role.email||null}),canEdit:()=>role.mgr,isOwner:()=>role.owner};
  window.claude={use:async k=>({db,user,mcp:null,downloads:null}[k]||null)};
 },{role,seed});
 await p.route('**/*',r=>{const u=r.request().url();const m={'xlsx.full.min.js':'node_modules/xlsx/dist/xlsx.full.min.js','jspdf.umd.min.js':'node_modules/jspdf/dist/jspdf.umd.min.js','jspdf.plugin.autotable.min.js':'node_modules/jspdf-autotable/dist/jspdf.plug'+'in.autotable.min.js'};for(const k in m)if(u.includes(k))return r.fulfill({body:fs.readFileSync(m[k]),contentType:'text/javascript'});if(u.startsWith('file:'))return r.continue();r.abort()});
 fs.writeFileSync('/tmp/pw.html','<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync('painel.html','utf8')+'</body></html>');
 await p.goto('file:///tmp/pw.html');await p.waitForTimeout(600);
 const gate1=await p.evaluate(()=>({locked:document.body.classList.contains('locked'),t:document.querySelector('#gate').innerText.slice(0,60)}));console.log('GATE',role.name,JSON.stringify(gate1));if(!(await p.$('#gateIn'))){console.log('DENIED',role.name);await ctx.close();return}await p.click('#gateIn');await p.waitForTimeout(200);console.log('after enter locked:',await p.evaluate(()=>document.body.classList.contains('locked')),'logout visible:',await p.evaluate(()=>!document.querySelector('#logoutBtn').hidden));
 await p.click('[data-view="rep"]').catch(()=>{});await p.waitForTimeout(300);
 if(role.mgr){await p.fill('#accIn','ian');await p.click('#accSearch');await p.waitForTimeout(300);await p.click('[data-addacc="u9"]');await p.waitForTimeout(400);console.log('ACL',JSON.stringify(await p.evaluate(()=>window.__store.get('config/acesso').ids)))}const out={label,who:await p.textContent('#whoami'),owners:await p.evaluate(()=>window.__painel&&window.__painel.S?0:0),rows:await p.evaluate(()=>document.querySelectorAll('#secHist tbody tr').length),sel:await p.evaluate(()=>!!document.querySelector('#fOwn')),errs};
 // register one import as this user
 await p.click('[data-view="proc"]');await p.setInputFiles('#file','/tmp/prod_test.xlsx');await p.waitForTimeout(500);await p.fill('#empresa','Teste '+label);
 await p.click('#regBtn').catch(()=>{});await p.waitForTimeout(500);
 out.keys=await p.evaluate(()=>[...window.__store.keys()]);console.log(JSON.stringify(out));if(role.id==='u1'){await p.click('#logoutBtn');await p.click('#logoutBtn');await p.waitForTimeout(800);console.log('after logout gate text:',await p.evaluate(()=>document.querySelector('#gate').innerText.slice(0,40)),'locked',await p.evaluate(()=>document.body.classList.contains('locked')))}await ctx.close()}
const rec=(o,e)=>({ts:'2026-10-26T10:00:00Z',empresa:e,tipo:'produtos',tipoNome:'Produtos / Estoque',arquivo:'a.xlsx',registros:3,ok:3,ajustados:0,atencao:0,ownerId:o});
const seed={'importacoes/u2':{idx:true,name:'Ana'},'importacoes/u2/itens/x1':rec('u2','Loja Ana'),'importacoes/u1':{idx:true,name:'Ian'},'importacoes/u1/itens/x2':rec('u1','Loja Ian'),'importacoes/old1':{ts:'2026-10-20T10:00:00Z',empresa:'Antiga',tipo:'clientes',tipoNome:'Clientes',arquivo:'o.xlsx',registros:5,ok:5,ajustados:0,atencao:0}};
const acl={'config/acesso':{ids:['u2']}};
await run({id:'u2',name:'Ana',mgr:false,owner:false},acl,'autorizada');
await run({id:'u3',name:'Beto',mgr:false,owner:false},acl,'negado');
await run({id:'u1',name:'Ian',mgr:true,owner:true},Object.assign({},seed,acl),'owner');
await b.close()})()
