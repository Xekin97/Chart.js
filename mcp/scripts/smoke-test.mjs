#!/usr/bin/env node
// Minimal MCP stdio client: spawn the server, exchange JSON-RPC, print results.
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const server = spawn('node', [path.join(here, '..', 'dist', 'index.js')], {
  stdio: ['pipe', 'pipe', 'inherit'],
});

let buf = '';
const pending = new Map();
let nextId = 1;

server.stdout.on('data', (chunk) => {
  buf += chunk.toString('utf8');
  let nl;
  while ((nl = buf.indexOf('\n')) !== -1) {
    const line = buf.slice(0, nl).trim();
    buf = buf.slice(nl + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    const resolver = pending.get(msg.id);
    if (resolver) {
      pending.delete(msg.id);
      resolver(msg);
    }
  }
});

function call(method, params = {}) {
  return new Promise((resolve) => {
    const id = nextId++;
    pending.set(id, resolve);
    server.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  });
}

async function main() {
  const init = await call('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'smoke-test', version: '0.0.1' },
  });
  console.log('=== initialize ===');
  console.log(JSON.stringify(init.result, null, 2));

  server.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');

  const tools = await call('tools/list', {});
  console.log('\n=== tools/list ===');
  console.log(tools.result.tools.map((t) => `- ${t.name}`).join('\n'));

  const types = await call('tools/call', { name: 'list_chart_types', arguments: {} });
  console.log('\n=== list_chart_types (first 200 chars) ===');
  console.log(types.result.content[0].text.slice(0, 200) + '...');

  const tpl = await call('tools/call', { name: 'get_chart_template', arguments: { type: 'bar' } });
  console.log('\n=== get_chart_template(bar) (first 300 chars) ===');
  console.log(tpl.result.content[0].text.slice(0, 300) + '...');

  // Bad config — wrong type, missing data
  const bad = await call('tools/call', {
    name: 'validate_chart_config',
    arguments: { config: { type: 'pieChart', data: { datasets: [{ data: 'oops' }] } } },
  });
  console.log('\n=== validate_chart_config (bad) ===');
  console.log(bad.result.content[0].text);

  // Good config
  const good = await call('tools/call', {
    name: 'validate_chart_config',
    arguments: {
      config: {
        type: 'bar',
        data: { labels: ['A', 'B'], datasets: [{ data: [1, 2] }] },
      },
    },
  });
  console.log('\n=== validate_chart_config (good) ===');
  console.log(good.result.content[0].text);

  const search = await call('tools/call', {
    name: 'search_docs',
    arguments: { query: 'tooltip callbacks', maxHits: 3 },
  });
  console.log('\n=== search_docs("tooltip callbacks") ===');
  console.log(search.result.content[0].text);

  const doc = await call('tools/call', {
    name: 'get_doc',
    arguments: { path: 'docs/charts/bar.md' },
  });
  console.log('\n=== get_doc(docs/charts/bar.md) (first 200 chars) ===');
  console.log(doc.result.content[0].text.slice(0, 200) + '...');

  // Path traversal attempt — must reject
  const evil = await call('tools/call', {
    name: 'get_doc',
    arguments: { path: '../package.json' },
  });
  console.log('\n=== get_doc(traversal) — should error ===');
  console.log(JSON.stringify(evil.result, null, 2));

  server.stdin.end();
  server.on('exit', (code) => process.exit(code ?? 0));
}

main().catch((e) => { console.error(e); process.exit(1); });
