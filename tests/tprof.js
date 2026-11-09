const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=r.request().url();const m={'xlsx.full.min.js':'node_modules/xlsx/dist/xlsx.full.min.js','jspdf.umd.min.js':'node_modules/jspdf/dist/jspdf.umd.min.js','jspdf.plugin.autotable.min.js':'node_modules/jspdf-autotable/dist/jspdf.plug'+'in.autotable.min.js'};for(const k in m)if(u.includes(k))return r.fulfill({body:fs.readFileSync(m[k]),contentType:'text/javascript'});if(u.startsWith('file:'))return r.continue();r.abort()});
fs.writeFileSync('/tmp/pw.html','<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync('/tmp/prof.html','utf8')+'</body></html>');
await p.goto('file:///tmp/pw.html');await p.waitForTimeout(500);await p.click('#gateGuest');
const t0=Date.now();await p.setInputFiles('#file','/tmp/big20k.xlsx');await p.waitForFunction(()=>window.__painel.S.rows&&window.__painel.S.rows.length>1000,null,{timeout:120000});const t1=Date.now();
console.log('carregar+processar 20k linhas ms',t1-t0);
const t2=Date.now();await p.evaluate(()=>{window.__painel.S.type='produtos'});await p.click('[data-t="servicos"]');await p.waitForTimeout(100);await p.click('[data-t="produtos"]');await p.waitForTimeout(100);console.log('2 trocas de tipo ms',Date.now()-t2);
console.log(JSON.stringify(await p.evaluate(()=>window.__T)));await b.close()})()
