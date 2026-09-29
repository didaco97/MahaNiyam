import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),process.argv.includes('--dist')?'dist':'');
const port=Number(process.env.PORT||5174);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.woff2':'font/woff2','.svg':'image/svg+xml'};
const allowed=new Set(['index.html','console.css','app.js']);
const cache=new Map();
http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    const name=decodeURIComponent(url.pathname).replace(/^\/+/, '')||'index.html';
    if(!allowed.has(name)){res.writeHead(404);res.end('Not found');return;}
    const file=path.join(root,name),stat=await fs.stat(file);
    let data=cache.get(name);
    if(!data||data.time!==stat.mtimeMs){const bytes=await fs.readFile(file);data={bytes,gzip:gzipSync(bytes),time:stat.mtimeMs};cache.set(name,data);}
    const zipped=(req.headers['accept-encoding']||'').includes('gzip');
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':zipped?data.gzip.length:data.bytes.length,'Cache-Control':name.startsWith('assets/')?'public, max-age=86400':'no-cache','Vary':'Accept-Encoding','X-Content-Type-Options':'nosniff',...(zipped?{'Content-Encoding':'gzip'}:{})});
    res.end(req.method==='HEAD'?undefined:zipped?data.gzip:data.bytes);
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`MahaNiyam demo: http://127.0.0.1:${port} (${root})`));
