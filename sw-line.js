const CACHE='ecomax-line-v3';
const SHELL=['/line.html','/manifest-line.json','/icons/ecomax-line.svg'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(SHELL))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys
          .filter(k=>k.startsWith('ecomax-line-') && k!==CACHE)
          .map(k=>caches.delete(k))
      ))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);

  if(url.origin!==self.location.origin || request.method!=='GET') return;

  const isLineRequest =
    url.pathname === '/line.html' ||
    url.pathname === '/manifest-line.json' ||
    url.pathname.startsWith('/icons/ecomax-line') ||
    url.pathname === '/sw-line.js';

  if(!isLineRequest) return;

  event.respondWith((async()=>{
    try{
      const response=await fetch(request);

      if(response && response.ok && url.pathname!=='/sw-line.js'){
        const cache=await caches.open(CACHE);
        await cache.put(request,response.clone());
      }

      return response;
    }catch(error){
      const cached=await caches.match(request);
      if(cached) return cached;

      if(request.mode==='navigate'){
        const fallback=await caches.match('/line.html');
        if(fallback) return fallback;
      }

      throw error;
    }
  })());
});
