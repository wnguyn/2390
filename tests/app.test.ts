import { test, expect } from 'bun:test';
import { Store } from '../server/store';
import { createApp } from '../server/app';
import { communityStatus, recentReports, feedbackFor } from '../src/lib/model';
import { question, percent } from '../src/lib/survey';
import type { Feed, Report } from '../src/lib/types';
const now=1800000000000;
const input={building:'ecsw',condition:'slow',area:'Study area',note:'Pages are slow.'};
const request=(path:string,method='GET',body?:unknown,cookie?:string)=>new Request('http://localhost'+path,{method,headers:{host:'localhost',...(body===undefined?{}:{'content-type':'application/json'}),...(cookie?{cookie}:{})},body:body===undefined?undefined:JSON.stringify(body)});
const session=(res:Response)=>res.headers.get('set-cookie')!.split(';')[0];
test('reports persist and appear to another browser; confirmation is deduplicated',async()=>{
  const store=new Store(':memory:');const app=createApp(store,()=>now);
  try {
    const result=await app.handle(request('/api/reports','POST',input));expect(result.status).toBe(201);
    const owner=session(result), created=await result.json() as {report:Report;feed:Feed};
    expect(created.report.mine).toBe(true);expect(created.feed.reports.length).toBe(1);
    const second=await app.handle(request('/api/reports'));const guest=session(second);
    const feed=await second.json() as Feed;expect(feed.reports[0].mine).toBe(false);
    expect(feed.reports[0]).not.toHaveProperty('owner');
    const confirm=()=>app.handle(request(`/api/reports/${created.report.id}/confirm`,'POST',{},guest));
    expect((await (await confirm()).json() as Feed).reports[0].confirmations).toBe(1);
    expect((await (await confirm()).json() as Feed).reports[0].confirmations).toBe(1);
    expect((await app.handle(request(`/api/reports/${created.report.id}/confirm`,'POST',{},owner))).status).toBe(409);
    // Clearing another browser's contributions cannot delete the creator's report.
    await app.handle(request('/api/my-contributions','DELETE',undefined,guest));
    expect(store.feed('x',now).reports.length).toBe(1);
    await app.handle(request('/api/my-contributions','DELETE',undefined,owner));
    expect(store.feed('x',now).reports.length).toBe(0);
  } finally {store.close();}
});
test('API rejects malformed reports and cross-origin writes',async()=>{
  const store=new Store(':memory:');const app=createApp(store,()=>now);
  try {
    expect((await app.handle(request('/api/reports','POST',{...input,building:'other'}))).status).toBe(422);
    expect((await app.handle(request('/api/reports','POST',{...input,note:'a'.repeat(281)}))).status).toBe(422);
    const cross=request('/api/reports','POST',input);cross.headers.set('origin','https://elsewhere.example');
    expect((await app.handle(cross)).status).toBe(403);
  } finally {store.close();}
});
test('expired data does not imply a healthy building; 24h cleanup removes confirmations',()=>{
  const store=new Store(':memory:',true,now);
  try {
    const feed=store.feed('x',now);expect(feed.reports.length).toBe(8);
    expect(communityStatus(recentReports(feed.reports,now,60,'ecsw'))).toBe('slow');
    expect(communityStatus([])).toBe('unknown');
    const report=store.create({...input,building:'ecsw',condition:'slow'},'owner',now);
    expect(feedbackFor(report,store.feed('owner',now).reports,now)).toEqual({others:3,similar:2});
    expect(store.feed('x',now+4*3600000).reports.length).toBe(0);
    store.prune(now+86400001);
    expect(store.db.query('SELECT COUNT(*) AS n FROM reports').get()).toEqual({n:0});
  } finally {store.close();}
});
test('survey counts retain question-specific denominators and known inconsistencies',()=>{
  expect(percent(19,question('q11').n)).toBe('27.5');expect(percent(30,question('q3').n)).toBe('60.0');
  expect(question('q9').n).toBe(8);expect(question('q10').n).toBe(66);
  expect(question('q4').options.at(-1)?.[1]).toBe(1);
  expect(question('q6').options.find(([label])=>label==='Reported the issue to OIT')?.[1]).toBe(0);
});
