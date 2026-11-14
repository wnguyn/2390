import { createApp } from './app';
import { Store } from './store';
const store=new Store(process.env.DATABASE_PATH||'./data/cometpulse.sqlite',process.env.DEMO_SEED==='true');
const app=createApp(store).listen({port:Number(process.env.PORT||3000),hostname:'0.0.0.0'});
console.log(`CometPulse Elysia API listening on port ${app.server?.port}`);
for(const signal of ['SIGINT','SIGTERM'] as const)process.on(signal,async()=>{await app.stop();store.close();process.exit(0);});
