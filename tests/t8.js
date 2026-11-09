const {chromium}=require('playwright-core');const fs=require('fs');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});const p=await b.newPage();const e=[];p.on('pageerror',x=>e.push(x.message));
await p.route('**/*',r=>{const u=r.request().url();const m={'xlsx.full.min.js':'node_modules/xlsx/dist/xlsx.full.min.js','jspdf.umd.min.js':'node_modules/jspdf/dist/jspdf.umd.min.js','jspdf.plugin.autotable.min.js':'node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.min.js'};for(const k in m)if(u.endsWith(k))return r.fulfill({path:m[k],contentType:'text/javascript'});if(u.startsWith('file:'))return r.continue();return r.abort()});
fs.writeFileSync('/tmp/pw.html','<!doctype html><html><head><meta charset=utf8></head><body>'+fs.readFileSync('painel.html','utf8')+'</body></html>');
await p.goto('file:///tmp/pw.html');await p.waitForTimeout(400);
const L=fs.readFileSync('/tmp/names.txt','utf8').split('\n').filter(Boolean);
const out=await p.evaluate(L=>L.map(x=>{const r=window.__painel.cleanName(x);return x+'  =>  '+r.name+'   ['+r.info.gb+'|'+r.info.cor+'|'+r.info.estado+'|'+r.info.bat+']'}),L);
console.log(out.join('\n'),e);await b.close()})();
