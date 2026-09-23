const CACHE='ecomax-line-v1';
const SHELL=['/line.html','/manifest-line.json','/icons/ecomax-line.svg'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const u=new URL(event.request.url);
  if(u.origin!==location.origin)return;
  if(event.request.method!=='GET')return;
  if(u.pathname==='/line.html'){
    event.respondWith(fetch(event.request).then(r=>{
      const copy=r.clone(); caches.open(CACHE).then(c=>c.put(event.request,copy)); return r;
    }).catch(()=>caches.match('/line.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(r=>{
    if(r.ok)caches.open(CACHE).then(c=>c.put(event.request,r.clone()));
    return r;
  }).catch(()=>cached)));
});