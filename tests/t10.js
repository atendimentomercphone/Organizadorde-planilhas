const {chromium}=require('playwright-core');const fs=require('fs');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const errs=[];
async function shot(w,scheme,name,extra){const p=await b.newPage({viewport:{width:w,height:900},colorScheme:scheme});p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.route('**/*',r=>{const u=r.request().url();const m={'xlsx.full.min.js':'node_modules/xlsx/dist/xlsx.full.min.js','jspdf.umd.min.js':'node_modules/jspdf/dist/jspdf.umd.min.js','jspdf.plugin.autotable.min.js':'node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.min.js'};for(const k in m)if(u.endsWith(k))return r.fulfill({path:m[k],contentType:'text/javascript'});if(u.startsWith('file:'))return r.continue();return r.abort()});
fs.writeFileSync('/tmp/pw.html','<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync('painel.html','utf8')+'</body></html>');
await p.goto('file:///tmp/pw.html');await p.waitForTimeout(500);
await p.setInputFiles('#file','/tmp/prod_test.xlsx');await p.waitForTimeout(600);
if(extra)await extra(p);
await p.screenshot({path:name,fullPage:true});
console.log(name,'overflowX:',await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth));await p.close()}
await shot(1280,'light','/tmp/d_light.png');
await shot(1280,'dark','/tmp/d_dark.png');
await shot(400,'light','/tmp/d_mobile.png');
await shot(1280,'light','/tmp/d_rep.png',async p=>{await p.fill('#empresa','Furlan São Bernardo');await p.click('#regBtn');await p.waitForTimeout(300);await p.click('[data-view="rep"]');await p.waitForTimeout(300)});
console.log(errs);await b.close()})();
