import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';
import crypto from 'node:crypto';
import {root} from './content.mjs';
import {build} from './build.mjs';
build();
const dist=path.join(root,'dist'),clients=new Set();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.pdf':'application/pdf','.json':'application/json; charset=utf-8'};
const live=`<script>(()=>{const events=new EventSource('/__events');events.onmessage=()=>location.reload();})();</script>`;
const server=http.createServer((req,res)=>{
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);}catch{res.writeHead(400).end('Invalid path');return;}
  if(pathname==='/__events'){res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});res.write(': connected\n\n');clients.add(res);req.on('close',()=>clients.delete(res));return;}
  const file=path.resolve(dist,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(dist+path.sep)){res.writeHead(403).end('Forbidden');return;}
  fs.stat(file,(error,stat)=>{
    if(error||!stat.isFile()){res.writeHead(404,{'Content-Type':'text/plain'}).end('Page not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    if(path.extname(file)==='.html')res.end(fs.readFileSync(file,'utf8').replace('</body>',live+'</body>'));
    else fs.createReadStream(file).pipe(res);
  });
});
const requestedPort=Number(process.env.PORT||4173);let port=requestedPort;
server.on('error',error=>{if(error.code==='EADDRINUSE'&&port<requestedPort+10){port++;server.listen(port,'127.0.0.1');}else{console.error(error.message);process.exit(1);}});
server.listen(port,'127.0.0.1',()=>{
  const url=`http://127.0.0.1:${port}`;console.log(`\nAvatar portfolio: ${url}\nEdit Markdown or images, save, and the browser refreshes automatically.\nPress Ctrl+C to stop.\n`);
  if(process.argv.includes('--open')){
    if(process.platform==='win32')spawn('rundll32.exe',['url.dll,FileProtocolHandler',url],{detached:true,stdio:'ignore',windowsHide:true}).unref();
    else spawn(process.platform==='darwin'?'open':'xdg-open',[url],{detached:true,stdio:'ignore'}).unref();
  }
});
let timer;
function inputDigest(){
  const hash=crypto.createHash('sha256');
  function add(file){const stat=fs.statSync(file);if(stat.isDirectory()){for(const name of fs.readdirSync(file).sort())add(path.join(file,name));}else if(!/\.tmp$|~$/.test(file)){hash.update(file);hash.update(fs.readFileSync(file));}}
  for(const file of ['MAIN.md','ABOUT.md','DESIGN.md','projects','profile','links','collections','downloads','site'])add(path.join(root,file));
  return hash.digest('hex');
}
let lastDigest=inputDigest();
const watchers=[];
function schedule(){clearTimeout(timer);timer=setTimeout(()=>{try{const digest=inputDigest();if(digest===lastDigest)return;build();lastDigest=digest;for(const client of clients)client.write('data: updated\n\n');}catch(error){console.error(`\nContent could not rebuild: ${error.message}\nFix the edited file and save again.\n`);}},350);}
for(const dir of ['projects','profile','links','collections','downloads','site'])watchers.push(fs.watch(path.join(root,dir),{recursive:true},(event,file)=>{if(file&&!/\.tmp$|~$/.test(file))schedule();}));
watchers.push(fs.watch(root,(event,file)=>{if(['MAIN.md','ABOUT.md','DESIGN.md'].includes(file))schedule();}));
function stop(){watchers.forEach(w=>w.close());clients.forEach(c=>c.end());server.close(()=>process.exit(0));}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
