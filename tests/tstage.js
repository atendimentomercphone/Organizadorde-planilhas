const {chromium}=require('playwright-core');const fs=require('fs');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1200,height:900}});
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.addInitScript(()=>{
 const store=new Map(),subs=[];window.__calls=[];window.__pdf=null;
 const snap=()=>({docs:[...store.entries()].filter(([k])=>k.startsWith('importacoes/')).map(([k,d])=>({id:k.split('/')[1],data:()=>d})),size:store.size});
 const db={doc:path=>({set:async d=>{store.set(path,d);subs.forEach(f=>f(snap()))},get:async()=>({exists:store.has(path),data:()=>store.get(path)}),delete:async()=>{store.delete(path)}}),
  collection:()=>({orderBy(){return this},limit(){return this},onSnapshot:(n)=>{subs.push(n);n({docs:[...store.entries()].filter(([k])=>k.startsWith('importacoes/')).map(([k,d])=>({id:k.split('/')[1],data:()=>d})),size:0});return()=>{}}})};
 let n=0;
 const mcp={listTools:async()=>({servers:[],fileArgs:true}),
  describeTool:async(s,t)=>({inputSchema:{properties:t==='slack_send_message'?{channel_id:{},message:{}}:{keywords:{},natural_language_query:{},channel_types:{}}}}),
  callTool:async(s,t,i)=>{window.__calls.push([s,t,JSON.stringify(i)]);if(t==='cc_call'&&i.tool==='retention_update_challenge_store')return i.args.confirmation_token?{payload:{ok:true}}:{payload:{status:'confirmation_required',confirmation_token:'TKN1'}};if(t==='cc_call')return {payload:{}};
   if(t==="retention_list_migration_requests")return {payload:{data:[{storeId:"339",storeName:"DM STORE",contents:["Clientes"],sourceSystem:"FoneNinja",stage:"dados_recebidos",actionId:"A1",stageLabel:"Dados recebidos",files:1,deadline:{dueOn:"2026-10-27"}}]}};
   if(t==="cc_call"){}
   if(t==="search_files")return {payload:{}};
   if(t==='create_file'){n++;return {payload:{id:'id'+n,title:i.title,viewUrl:'https://drive.google.com/x/'+n}}}
   if(t==='slack_search_channels')return {payload:{results:'1. #importações-de-dados (C0CBDDVET70) - private_channel'}};
   if(t==='slack_send_message')return {payload:{ok:true}}}};
 const dl={save:async r=>{const buf=await new Response(r.data).arrayBuffer();let s='';new Uint8Array(buf).forEach(c=>s+=String.fromCharCode(c));window.__pdf=[r.filename,btoa(s)];return {status:'saved'}}};
 window.claude={use:async k=>({db,mcp,downloads:dl}[k]||null)};
});
await p.route('**/*',r=>{const u=r.request().url();const m={'xlsx.full.min.js':'node_modules/xlsx/dist/xlsx.full.min.js','jspdf.umd.min.js':'node_modules/jspdf/dist/jspdf.umd.min.js','jspdf.plugin.autotable.min.js':'node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.min.js'};for(const k in m)if(u.endsWith(k))return r.fulfill({path:m[k],contentType:'text/javascript'});if(u.startsWith('file:'))return r.continue();return r.abort()});
fs.writeFileSync('/tmp/pw.html','<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync('painel.html','utf8')+'</body></html>');
await p.goto('file:///tmp/pw.html');await p.waitForTimeout(800);
console.log('CC card:',await p.evaluate(()=>({hidden:document.querySelector('#secCC').hidden,txt:document.querySelector('#secCC').innerText.slice(0,200)})));
await p.evaluate(()=>document.querySelector('[data-cc="0"]').click());await p.waitForTimeout(300);
await p.setInputFiles('#file','/tmp/cli_test.xlsx');await p.waitForTimeout(600);
console.log('emp+type:',await p.evaluate(()=>[document.querySelector('#empresa').value,window.__painel.S.type]));
await p.waitForTimeout(800);console.log(await p.evaluate(()=>window.__calls.filter(c=>c[2].includes('retention_update')).map(c=>c[2])));console.log('card',await p.evaluate(()=>document.querySelector('#secCC').innerText.includes('Em andamento')));process.exit(0);

})();
