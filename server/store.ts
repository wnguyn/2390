import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { BuildingId, Condition, Feed, Report, ReportInput } from '../src/lib/types';
import { validateInput } from '../src/lib/model';
interface Row { id:string; building:BuildingId; condition:Condition; area:string; note:string; time:number; owner:string; origin:'sample'|'community'; confirmations:number; confirmed:number }
export class Store {
  readonly db: Database;
  constructor(path: string, seed=false, now=Date.now()) {
    if(path!==':memory:') mkdirSync(dirname(path),{recursive:true});
    this.db=new Database(path,{create:true});
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY, building TEXT NOT NULL, condition TEXT NOT NULL,
        area TEXT NOT NULL, note TEXT NOT NULL, time INTEGER NOT NULL,
        owner TEXT NOT NULL, origin TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS confirmations (
        report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
        owner TEXT NOT NULL, PRIMARY KEY(report_id, owner)
      );
      CREATE INDEX IF NOT EXISTS report_time ON reports(time);`);
    this.prune(now);
    if(seed && (this.db.query('SELECT COUNT(*) AS n FROM reports').get() as {n:number}).n===0) this.seed(now);
  }
  prune(now:number) { this.db.query('DELETE FROM reports WHERE time <= ?').run(now-86400000); }
  feed(owner:string, now=Date.now()):Feed {
    this.prune(now);
    const rows=this.db.query<Row,[string,number,number]>(`SELECT r.*, (SELECT COUNT(*) FROM confirmations c WHERE c.report_id=r.id) AS confirmations,
      EXISTS(SELECT 1 FROM confirmations c WHERE c.report_id=r.id AND c.owner=?) AS confirmed
      FROM reports r WHERE r.time>? AND r.time<=? ORDER BY r.time DESC LIMIT 200`).all(owner,now-14400000,now);
    return {reports:rows.map(({owner:creator,confirmed,...r})=>({...r,mine:creator===owner,confirmed:!!confirmed})),serverTime:now,seeded:rows.some(r=>r.origin==='sample')};
  }
  create(input:ReportInput, owner:string, now=Date.now()):Report {
    const clean=validateInput(input), id=crypto.randomUUID();
    this.db.query('INSERT INTO reports VALUES (?,?,?,?,?,?,?,?)').run(id,clean.building,clean.condition,clean.area,clean.note,now,owner,'community');
    return {...clean,id,time:now,origin:'community',mine:true,confirmed:false,confirmations:0};
  }
  limited(owner:string,now:number) { return (this.db.query('SELECT COUNT(*) AS n FROM reports WHERE owner=? AND time>?').get(owner,now-3600000) as {n:number}).n>=30; }
  confirm(id:string,owner:string,now=Date.now()):'ok'|'missing'|'own' {
    const row=this.db.query('SELECT owner FROM reports WHERE id=? AND time>?').get(id,now-14400000) as {owner:string}|null;
    if(!row)return 'missing'; if(row.owner===owner)return 'own';
    this.db.query('INSERT OR IGNORE INTO confirmations VALUES (?,?)').run(id,owner);return 'ok';
  }
  removeMine(owner:string) { this.db.query("DELETE FROM reports WHERE owner=? AND origin='community'").run(owner); this.db.query('DELETE FROM confirmations WHERE owner=?').run(owner); }
  seed(now:number) {
    const samples:[BuildingId,Condition,number,string,string][]=[
      ['ecsw','slow',3,'2nd floor','Course page took a long time to load.'],
      ['ecsw','down',9,'Study area','Connected to CometNet, but pages would not open.'],
      ['ecsw','slow',14,'Lobby','Call kept freezing during group work.'],
      ['ecsn','down',5,'1st floor','Could not get online before class.'],
      ['ecsn','down',12,'Common area','Repeatedly disconnected while browsing.'],
      ['atec','good',7,'Lobby','Coursework and video are loading here.'],
      ['atec','good',18,'Study area','Stable during a group call.'],
      ['jsom','slow',22,'2nd floor','Downloads are taking longer than usual.']
    ];
    this.db.transaction(()=>{for(const [b,s,m,a,n] of samples)this.db.query('INSERT INTO reports VALUES (?,?,?,?,?,?,?,?)').run(crypto.randomUUID(),b,s,a,n,now-m*60000,'scenario','sample');})();
  }
  close(){this.db.close();}
}
