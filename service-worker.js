const CACHE = "frontier-static-v1.0-final";
const SHELL = ["./", "./index.html", "./css/styles.css", "./js/backend.js", "./js/charts.js", "./js/app.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch", event => {
  const req=event.request;if(req.method!=="GET")return;const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.endsWith("/js/config.js")){event.respondWith(fetch(req));return;}
  if(req.mode==="navigate"){event.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(cache=>cache.put("./index.html",c));return r}).catch(()=>caches.match("./index.html")));return;}
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(r=>{const copy=r.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));return r})));
});
