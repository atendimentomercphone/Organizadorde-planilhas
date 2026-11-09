const {chromium}=require('playwright-core');const fs=require('fs');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1200,height:900}});
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.route('**/*',r=>{const u=r.request().url();if(u.includes('xlsx.full.min.js'))return r.fulfill({path:'node_modules/xlsx/dist/xlsx.full.min.js',contentType:'text/javascript'});if(u.startsWith('file:'))return r.continue();return r.abort()});
fs.writeFileSync('/tmp/pw.html','<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync('painel.html','utf8')+'</body></html>');
await p.goto('file:///tmp/pw.html');await p.waitForTimeout(500);
await p.screenshot({path:'/tmp/s1.png',fullPage:true});
// export sample (vendas) and produtos test
const out=await p.evaluate(()=>{const {S,buildWorkbook}=window.__painel;const wb=buildWorkbook(0);return Object.fromEntries(wb.SheetNames.map(n=>[n,XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1}).slice(7,12)]))});
console.log(JSON.stringify(out).slice(0,1800));
await p.setInputFiles('#file','/tmp/prod_test.xlsx');await p.waitForTimeout(500);
const o2=await p.evaluate(()=>{const {buildWorkbook}=window.__painel;const wb=buildWorkbook(0);return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1}).slice(16,21)});
console.log(JSON.stringify(o2));
await p.setViewportSize({width:400,height:800});await p.screenshot({path:'/tmp/s3.png',fullPage:true});
console.log(await p.evaluate(()=>document.documentElement.scrollWidth+' vs '+innerWidth));
console.log(errs);await b.close()})();
