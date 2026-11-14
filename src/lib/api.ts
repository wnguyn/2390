import type { Feed, Report, ReportInput } from './types';
async function request<T>(path:string,init?:RequestInit):Promise<T> {
  const response=await fetch('/api'+path,{...init,headers:{'content-type':'application/json',...init?.headers},signal:AbortSignal.timeout(8000)});
  const body=await response.json();if(!response.ok)throw Error(body.error||'The server could not complete this request.');return body as T;
}
export const api={
  feed:()=>request<Feed>('/reports'),
  report:(input:ReportInput)=>request<{report:Report;feed:Feed}>('/reports',{method:'POST',body:JSON.stringify(input)}),
  confirm:(id:string)=>request<Feed>(`/reports/${id}/confirm`,{method:'POST',body:'{}'}),
  clearMine:()=>request<Feed>('/my-contributions',{method:'DELETE'})
};
