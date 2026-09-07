const http=require('http');
const fs=require('fs');
const path=require('path');
const PORT=process.env.PORT||10000;
const root=__dirname;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
  let url;
  try{url=new URL(req.url,'http://localhost')}catch(e){res.writeHead(400);return res.end('Bad Request')}
  let file=decodeURIComponent(url.pathname);
  if(file==='/'||file==='') file='/index.html';
  const safe=path.normalize(file).replace(/^(..[/\\])+/, '');
  const target=path.join(root,safe);
  fs.stat(target,(err,st)=>{
    if(!err&&st.isFile()){
      const ext=path.extname(target).toLowerCase();
      res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','Cache-Control':'no-cache'});
      fs.createReadStream(target).pipe(res);
    }else{
      const index=path.join(root,'index.html');
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'});
      fs.createReadStream(index).pipe(res);
    }
  });
});
server.listen(PORT,'0.0.0.0',()=>console.log('ECOMAX listening on '+PORT));