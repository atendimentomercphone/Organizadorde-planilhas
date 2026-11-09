const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/painel/painel.html');await p.waitForTimeout(500);await p.click('#gateGuest');
await p.setInputFiles('#file',['/tmp/prod_test.xlsx','/tmp/cli_test.xlsx']);await p.waitForTimeout(800);
const st=()=>p.evaluate(()=>({type:window.__painel.S.type,f:window.__painel.S.fileName,q:window.__painel.S.qmode,chips:[...document.querySelectorAll('[data-q]')].map(x=>x.textContent)}));
console.log(1,JSON.stringify(await st()));
await p.click('[data-q="1"]');await p.waitForTimeout(500);console.log(2,JSON.stringify(await st()));
await p.check('input[name=qm][value=join]');await p.waitForTimeout(500);console.log(3,JSON.stringify(await st()));
await p.check('input[name=qm][value=sep]');await p.waitForTimeout(500);console.log(4,JSON.stringify(await st()));
await p.screenshot({path:'/tmp/q.png',clip:{x:0,y:100,width:1280,height:500}});
console.log('errs',errs);await b.close()})()
