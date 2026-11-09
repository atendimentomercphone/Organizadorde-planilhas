const {chromium}=require('playwright-core');const fs=require('fs');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1200,height:900}});
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text())});
await p.route('**/*',r=>{const u=r.request().url();if(u.includes('xlsx.full.min.js'))return r.fulfill({path:'node_modules/xlsx/dist/xlsx.full.min.js',contentType:'text/javascript'});if(u.startsWith('file:'))return r.continue();return r.abort()});
const html='<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync('painel.html','utf8')+'</body></html>';
fs.writeFileSync('/tmp/pw.html',html);
await p.goto('file:///tmp/pw.html');await p.waitForTimeout(800);
console.log(errs);
console.log(await p.evaluate(()=>document.querySelector('#secType').innerText.replace(/\n+/g,' | ')));
console.log(await p.evaluate(()=>document.querySelector('#secRep').innerText.replace(/\n+/g,' | ')));
console.log(await p.evaluate(()=>[...document.querySelectorAll('#secRec tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ')).join('\n')));
await p.screenshot({path:'/tmp/s1.png',fullPage:true});
await b.close()})();
