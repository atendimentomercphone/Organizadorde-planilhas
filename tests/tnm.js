const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.route('**/*',r=>{const u=r.request().url();const m={'xlsx.full.min.js':'node_modules/xlsx/dist/xlsx.full.min.js','jspdf.umd.min.js':'node_modules/jspdf/dist/jspdf.umd.min.js','jspdf.plugin.aut':'node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.min.js','jszip.min.js':'node_modules/jszip/dist/jszip.min.js'};const k=Object.keys(m).find(x=>u.includes(x));if(k)return r.fulfill({body:fs.readFileSync(m[k]),contentType:'application/javascript'});if(u.startsWith('file:'))return r.continue();r.abort()});
fs.writeFileSync('/tmp/pw2.html','<!doctype html><html><head><meta charset=utf8></head><body>'+fs.readFileSync('painel.html','utf8')+'</body></html>');
await p.addInitScript(()=>{window.claude={use:async()=>null}});
await p.goto('file:///tmp/pw2.html');await p.waitForTimeout(800);
const r=await p.evaluate(()=>['IPHONE17PRO256GB','17PROMAX256GB(ATACADO)','14PROMAX(ATACADO)','IPHONE16128GB(ATACADO)','IPHONE16E','IPHONE 16 Atacado','16E','IPHONE15PROMAX512GB','Galaxy S25 256GB'].map(n=>{const c=window.__painel.cleanName(n);return [n,c.name,c.info.gb,c.info.obs.join('|')]}));
console.log(JSON.stringify(r,null,0));await b.close()})()
