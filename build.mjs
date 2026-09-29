import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
const root=path.dirname(fileURLToPath(import.meta.url));
const dist=path.join(root,'dist');
const files=['index.html','console.css','app.js'];
const deployFiles=new Map([
  ['_redirects','/* /index.html 200\n'],
  ['_headers','/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n\n/index.html\n  Cache-Control: no-cache\n\n/app.js\n  Cache-Control: no-cache\n\n/console.css\n  Cache-Control: no-cache\n']
]);
await fs.rm(dist,{recursive:true,force:true});
await fs.mkdir(dist,{recursive:true});
let total=0,compressed=0;
for(const f of files){const data=await fs.readFile(path.join(root,f));await fs.writeFile(path.join(dist,f),data);total+=data.length;compressed+=gzipSync(data).length;}
for(const [name,body] of deployFiles){const data=Buffer.from(body);await fs.writeFile(path.join(dist,name),data);total+=data.length;compressed+=gzipSync(data).length;}
console.log(`Built ${files.length+deployFiles.size} Netlify-ready files. ${(total/1024).toFixed(1)} KB raw; ${(compressed/1024).toFixed(1)} KB gzip. No build dependencies or API calls.`);
