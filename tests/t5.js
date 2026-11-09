const {chromium}=require('playwright-core');const fs=require('fs');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1200,height:900}});
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.route('**/*',r=>{const u=r.request().url();const m={'xlsx.full.min.js':'node_modules/xlsx/dist/xlsx.full.min.js','jspdf.umd.min.js':'node_modules/jspdf/dist/jspdf.umd.min.js','jspdf.plugin.autotable.min.js':'node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.min.js'};for(const k in m)if(u.endsWith(k))return r.fulfill({path:m[k],contentType:'text/javascript'});if(u.startsWith('file:'))return r.continue();return r.abort()});
fs.writeFileSync('/tmp/pw.html','<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync('painel.html','utf8')+'</body></html>');
await p.goto('file:///tmp/pw.html');await p.waitForTimeout(500);
for(const f of [null,'/tmp/ok_test.xlsx','/tmp/prod_test.xlsx','/tmp/cli_test.xlsx','/tmp/bad_test.xlsx']){
 if(f){await p.setInputFiles('#file',f);await p.waitForTimeout(500)}
 console.log('==',f);console.log(await p.evaluate(()=>document.querySelector('#secVer').innerText.replace(/\n+/g,' | ')));}
await p.screenshot({path:'/tmp/s5.png',clip:{x:0,y:0,width:1200,height:1400},fullPage:true});
console.log(errs);await b.close()})();
