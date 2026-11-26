const V='bgc-hub-v2';
const SHELL=['./','index.html','manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(u.hostname.endsWith('supabase.co'))return;
 const own=u.origin===location.origin;
 if(own&&(r.mode==='navigate'||u.pathname.endsWith('index.html'))){
  e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(ch=>ch.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));return}
 e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok||x.type==='opaque'){const c=x.clone();caches.open(V).then(ch=>ch.put(r,c))}return x})));
});

const SBU='https://caavuoxlnoqlqsabkqbd.supabase.co',SBK='sb_publishable_dI3cQZjgS2AN321tgGPy6A_G-1dU7v3';
self.addEventListener('push',e=>{e.waitUntil((async()=>{
 let body='عندك إشعار جديد في BGC-HUB';
 try{const sub=await self.registration.pushManager.getSubscription();
  if(sub){const r=await fetch(SBU+'/rest/v1/rpc/push_peek',{method:'POST',headers:{apikey:SBK,Authorization:'Bearer '+SBK,'Content-Type':'application/json'},body:JSON.stringify({p_endpoint:sub.endpoint})});
   const j=await r.json();if(Array.isArray(j)&&j.length){body=j.length>1?('لديك '+j.length+' إشعارات جديدة: '+j[j.length-1].t):j[0].t}}}catch(_){}
 await self.registration.showNotification('BGC-HUB',{body,tag:'bgc-hub',renotify:true,dir:'rtl',lang:'ar'});
})())});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c)return c.focus()}return clients.openWindow('./')}))});
