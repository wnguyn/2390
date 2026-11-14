export {};
// One command starts the Svelte/Vite frontend and the Bun/Elysia API.
const api = Bun.spawn(['bun', '--watch', 'server/index.ts'], {
  env: { ...process.env, PORT: '3001', DEMO_SEED: process.env.DEMO_SEED ?? 'true' }, stdout: 'inherit', stderr: 'inherit'
});
const ui = Bun.spawn(['bun', 'x', '--no-install', 'vite'], { env: process.env, stdout: 'inherit', stderr: 'inherit' });
let stopping = false;
function stop(code: number) { if (stopping) return; stopping=true; api.kill(); ui.kill(); process.exit(code); }
process.on('SIGINT', () => stop(0)); process.on('SIGTERM', () => stop(0));
const result = await Promise.race([api.exited, ui.exited]); stop(result || 0);
