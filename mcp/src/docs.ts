import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// mcp/dist/docs.js  ->  repo root is two levels up
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const DOCS_ROOT = path.join(REPO_ROOT, 'docs');

let docCache: string[] | null = null;

async function listDocs(): Promise<string[]> {
  if (docCache) return docCache;
  const out: string[] = [];
  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (e.isFile() && e.name.endsWith('.md')) {
        out.push(path.relative(REPO_ROOT, full));
      }
    }
  }
  await walk(DOCS_ROOT);
  docCache = out.sort();
  return docCache;
}

export interface SearchHit {
  path: string;
  score: number;
  matches: { line: number; text: string }[];
}

export async function searchDocs(query: string, maxHits = 10): Promise<SearchHit[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const docs = await listDocs();
  const hits: SearchHit[] = [];

  for (const rel of docs) {
    const full = path.join(REPO_ROOT, rel);
    const content = await fs.readFile(full, 'utf8');
    const lower = content.toLowerCase();
    let score = 0;
    for (const t of terms) {
      let idx = 0;
      while ((idx = lower.indexOf(t, idx)) !== -1) {
        score += 1;
        idx += t.length;
      }
    }
    // Path-name boost
    const relLower = rel.toLowerCase();
    for (const t of terms) {
      if (relLower.includes(t)) score += 5;
    }
    if (score === 0) continue;

    const lines = content.split('\n');
    const matches: { line: number; text: string }[] = [];
    for (let i = 0; i < lines.length && matches.length < 3; i++) {
      const ll = lines[i].toLowerCase();
      if (terms.some((t) => ll.includes(t))) {
        matches.push({ line: i + 1, text: lines[i].trim().slice(0, 200) });
      }
    }
    hits.push({ path: rel, score, matches });
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, maxHits);
}

export async function getDoc(relPath: string): Promise<string> {
  // Prevent traversal: must stay under docs/
  const normalized = path.posix.normalize(relPath.replace(/\\/g, '/'));
  if (normalized.startsWith('..') || path.isAbsolute(normalized)) {
    throw new Error(`Invalid doc path: ${relPath}`);
  }
  const full = path.resolve(REPO_ROOT, normalized);
  if (!full.startsWith(DOCS_ROOT + path.sep) && full !== DOCS_ROOT) {
    throw new Error(`Path is outside docs/: ${relPath}`);
  }
  if (!full.endsWith('.md')) {
    throw new Error(`Only .md files are readable via this tool: ${relPath}`);
  }
  return fs.readFile(full, 'utf8');
}

export async function listAllDocs(): Promise<string[]> {
  return listDocs();
}
