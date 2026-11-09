const {chromium}=require('playwright-core');const fs=require('fs');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1200,height:900}});
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.addInitScript(()=>{
 const store=new Map(),subs=[];window.__saved=[];window.__calls=[];
 const snap=()=>({docs:[...store.entries()].map(([id,d])=>({id,data:()=>d})),size:store.size});
 const db={doc:path=>({set:async d=>{store.set(path.split('/')[1],d);subs.forEach(f=>f(snap()))},delete:async()=>{store.delete(path.split('/')[1]);subs.forEach(f=>f(snap()))}}),
  collection:()=>({orderBy(){return this},limit(){return this},onSnapshot:(n)=>{subs.push(n);n(snap());return()=>{}}})};
 const folders={};let n=0;
 const mcp={listTools:async()=>({servers:[],fileArgs:true}),callTool:async(s,t,i)=>{window.__calls.push([t,JSON.stringify(i).slice(0,160)]);
   if(t==='search_files')return {payload:{}};
   if(t==='create_file'){n++;return {payload:{id:'id'+n,title:i.title,viewUrl:'https://drive.google.com/x/'+n}}}}};
 const dl={save:async r=>{window.__saved.push([r.filename,r.data.size||r.data.byteLength]);return {status:'saved'}}};
 window.claude={use:async k=>({db,mcp,downloads:dl}[k]||null)};
});
await p.route('**/*',r=>{const u=r.request().url();const m={'xlsx.full.min.js':'node_modules/xlsx/dist/xlsx.full.min.js','jspdf.umd.min.js':'node_modules/jspdf/dist/jspdf.umd.min.js','jspdf.plugin.autotable.min.js':'node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.min.js'};for(const k in m)if(u.endsWith(k))return r.fulfill({path:m[k],contentType:'text/javascript'});if(u.startsWith('file:'))return r.continue();return r.abort()});
fs.writeFileSync('/tmp/pw.html','<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync('painel.html','utf8')+'</body></html>');
await p.goto('file:///tmp/pw.html');await p.waitForTimeout(500);
await p.setInputFiles('#file','/tmp/prod_test.xlsx');await p.waitForTimeout(500);
await p.fill('#empresa','Furlan São Bernardo');
await p.click('#driveBtn');await p.waitForTimeout(800);
console.log(await p.evaluate(()=>[...document.querySelectorAll('.log li')].map(l=>l.innerText).join(' | ')));
await p.click('[data-lot="0"]');await p.waitForTimeout(400);
await p.setInputFiles('#file','/tmp/cli_test.xlsx');await p.waitForTimeout(400);
await p.fill('#empresa','Loja Beta');await p.click('#regBtn');await p.waitForTimeout(300);
await p.click('[data-view="rep"]');await p.waitForTimeout(300);
console.log(await p.evaluate(()=>document.querySelector('#secHist').innerText.replace(/\n+/g,' | ').slice(0,900)));
await p.click('#expXls');await p.waitForTimeout(300);await p.click('#expPdf');await p.waitForTimeout(600);
console.log(await p.evaluate(()=>JSON.stringify(window.__saved)));
console.log(await p.evaluate(()=>JSON.stringify(window.__calls.map(c=>c[0]+':'+c[1].slice(0,110)))));
await p.screenshot({path:'/tmp/s4.png',fullPage:true});
console.log(errs);await b.close()})();
