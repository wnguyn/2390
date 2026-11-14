import type { Building, BuildingId, CommunityStatus, Report, ReportInput } from './types';
export const buildings: Building[] = [
  {id:'ecsw',code:'ECSW',name:'Engineering & Computer Science West',x:225,y:320},
  {id:'ecsn',code:'ECSN',name:'Engineering & Computer Science North',x:365,y:185},
  {id:'atec',code:'ATEC',name:'Arts & Technology (ATC)',x:660,y:320},
  {id:'jsom',code:'JSOM',name:'Jindal School of Management',x:710,y:455}
];
export const conditions: Record<CommunityStatus,string> = {slow:'Slow or unstable',down:'Cannot connect / pages will not load',good:'Connecting well',unknown:'No recent observations'};
export function recentReports(reports: Report[], now: number, minutes=60, building?: BuildingId): Report[] {
  return reports.filter(r => (!building || r.building===building) && r.time<=now && now-r.time<minutes*60000).sort((a,b)=>b.time-a.time);
}
export function communityStatus(reports: Report[]): CommunityStatus {
  if (!reports.length) return 'unknown';
  const sorted=[...reports].sort((a,b)=>b.time-a.time);
  const totals={slow:0,down:0,good:0};
  for (const r of sorted) totals[r.condition]+=1+r.confirmations;
  return (Object.keys(totals) as (keyof typeof totals)[]).sort((a,b)=>totals[b]-totals[a] || sorted.findIndex(r=>r.condition===a)-sorted.findIndex(r=>r.condition===b))[0];
}
export function validateInput(input: ReportInput): ReportInput {
  if (!buildings.some(b=>b.id===input.building)) throw Error('Choose a campus building.');
  if (!['slow','down','good'].includes(input.condition)) throw Error('Choose your connection experience.');
  if (typeof input.area!=='string'||typeof input.note!=='string'||input.area.length>60||input.note.length>280) throw Error('Please shorten your note or area.');
  return {...input, area:input.area.trim(),note:input.note.trim()};
}
export function feedbackFor(report: Report, all: Report[], now: number) {
  const others=recentReports(all,now,60,report.building).filter(r=>r.id!==report.id);
  return {others:others.length, similar:others.filter(r=>r.condition===report.condition).length};
}
export function age(time: number, now: number) { const n=Math.max(0,Math.floor((now-time)/60000)); return n<1?'Just now':`${n} min ago`; }
