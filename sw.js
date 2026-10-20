const V='croupier-v19',CORE=['./','index.html','manifest.webmanifest','icon-180.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!=location.origin&&!/(^|\.)(googleapis|gstatic)\.com$/.test(u.hostname))return;
  const upd=caches.open(V).then(c=>fetch(e.request).then(r=>{if(r.ok||r.type=='opaque')c.put(e.request,r.clone());return r}));
  e.waitUntil(upd.catch(()=>{}));
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||upd));
});
