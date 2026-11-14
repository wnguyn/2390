import { Elysia, t } from 'elysia';
import { resolve, sep } from 'node:path';
import type { Store } from './store';
const reportSchema=t.Object({building:t.Union([t.Literal('ecsw'),t.Literal('ecsn'),t.Literal('atec'),t.Literal('jsom')]),condition:t.Union([t.Literal('slow'),t.Literal('down'),t.Literal('good')]),area:t.String({maxLength:60}),note:t.String({maxLength:280})},{additionalProperties:false});
export function createApp(store:Store, now:()=>number=Date.now) {
  return new Elysia({serve:{maxRequestBodySize:8192}})
    .onRequest(({request,set})=>{
      if(request.url.includes('/api/'))set.headers['cache-control']='no-store';
      const origin=request.headers.get('origin');
      if(!['GET','HEAD'].includes(request.method)&&origin&&request.headers.get('sec-fetch-site')!=='same-origin'&&new URL(origin).host!==request.headers.get('host')) {
        set.status=403;return {error:'Cross-origin writes are not allowed.'};
      }
    })
    .derive(({cookie,request})=>{
      let session=String(cookie.cometpulse?.value||'');
      if(!/^[a-f\d-]{36}$/.test(session)) {
        session=crypto.randomUUID();
        cookie.cometpulse.set({value:session,httpOnly:true,sameSite:'lax',secure:new URL(request.url).protocol==='https:',path:'/',maxAge:86400});
      }
      return {session};
    })
    .get('/api/health',()=>({ok:true,storage:'sqlite',reportRetentionHours:24}))
    .get('/api/reports',({session})=>store.feed(session,now()))
    .post('/api/reports',({body,session,set})=>{
      if(store.limited(session,now())){set.status=429;return {error:'Demo limit reached: 30 reports per browser per hour.'};}
      const report=store.create(body,session,now());set.status=201;return {report,feed:store.feed(session,now())};
    },{body:reportSchema})
    .post('/api/reports/:id/confirm',({params,session,set})=>{
      const result=store.confirm(params.id,session,now());
      if(result==='missing'){set.status=404;return {error:'That report has expired or no longer exists.'};}
      if(result==='own'){set.status=409;return {error:'You have already contributed this report.'};}
      return store.feed(session,now());
    },{body:t.Object({}),params:t.Object({id:t.String({format:'uuid'})})})
    .delete('/api/my-contributions',({session})=>{store.removeMine(session);return store.feed(session,now());})
    .get('/',()=>Bun.file('dist/index.html'))
    .get('/*',async ({params,set})=>{
      const root=resolve('dist'),path=resolve(root,params['*']);
      if(!path.startsWith(root+sep)){set.status=403;return 'Forbidden';}
      const file=Bun.file(path);if(!await file.exists()){set.status=404;return 'Not found';}return file;
    })
    .onError(({code,set})=>{
      if(code==='VALIDATION'){set.status=422;return {error:'Check the building, connection status, and note length.'};}
      if(code==='NOT_FOUND'){set.status=404;return {error:'Not found.'};}
      if(code==='INTERNAL_SERVER_ERROR'){set.status=500;return {error:'Could not complete this request. Please try again.'};}
    });
}
