const {chromium}=require('playwright');const fs=require('fs');const X=require('xlsx');
const M=JSON.parse(fs.readFileSync('/home/claude/models.json','utf8'));
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=r.request().url();const m={'xlsx.full.min.js':'node_modules/xlsx/dist/xlsx.full.min.js','jspdf.umd.min.js':'node_modules/jspdf/dist/jspdf.umd.min.js','jspdf.plugin.autotable.min.js':'node_modules/jspdf-autotable/dist/jspdf.plug'+'in.autotable.min.js'};for(const k in m)if(u.includes(k))return r.fulfill({body:fs.readFileSync(m[k]),contentType:'text/javascript'});if(u.startsWith('file:'))return r.continue();r.abort()});
fs.writeFileSync('/tmp/pw.html','<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync('painel.html','utf8')+'</body></html>');
await p.goto('file:///tmp/pw.html');await p.waitForTimeout(600);await p.click('#gateGuest');
const cases=[];
for(const k of Object.keys(M)){const cols=M[k][0].cols.map(c=>Array.isArray(c)?c[1]:c);cases.push([k,'doc'+k.length+Math.floor(Math.random()*1e4)+'.xlsx',cols])}
cases.push(['produtos','ESTOQUE--PRODUTOS.xls',['Descrição','Qtd','Custo','Preço venda','IMEI','Marca']]);
cases.push(['clientes','lista.xlsx',['Nome','CPF','Telefone','E-mail','Endereço','Cidade']]);
cases.push(['vendas','export.xlsx',['Pedido','Data','Cliente','Vendedor','Forma de Pagamento','Total']]);
cases.push(['os','x.xlsx',['OS','Cliente','Aparelho','Defeito','Técnico','Situação','Entrada']]);
cases.push(['financeiro','y.xlsx',['Vencimento','Descrição','Valor','Categoria','Pagar/Receber']]);
cases.push(['servicos','z.xlsx',['Serviço','Valor','Garantia','Tempo']]);
cases.push(['fornecedores','w.xlsx',['Razão Social','CNPJ','Contato','Telefone']]);
let ok=0;for(const [exp,name,cols] of cases){
 const wb=X.utils.book_new();X.utils.book_append_sheet(wb,X.utils.aoa_to_sheet([cols,cols.map((c,i)=>'x'+i),cols.map((c,i)=>'y'+i)]),'P');const path='/tmp/det_'+name.replace(/[^\w.]/g,'_');X.writeFile(wb,path.endsWith('.xls')?path+'x':path);
 await p.setInputFiles('#file',path.endsWith('.xls')?path+'x':path);await p.waitForTimeout(400);
 const got=await p.evaluate(()=>({t:window.__painel.S.type,low:window.__painel.S.detect&&window.__painel.S.detect.low}));if(got.t===exp)ok++;else console.log('MISS',name,'esperado',exp,'obtido',got.t,JSON.stringify(cols.slice(0,6)));}
console.log('acertos',ok,'de',cases.length,errs);await b.close()})()
