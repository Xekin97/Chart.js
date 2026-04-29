# chartjs-mcp

MCP server for Chart.js — exposes config-generation and documentation-querying tools to LLM clients (Claude Desktop, Claude Code, Cursor, etc.) over stdio.

## Tools

| Tool | Purpose |
| --- | --- |
| `list_chart_types` | List all supported chart types with description and expected data shape. |
| `get_chart_template` | Return a ready-to-use Chart.js v4 config for a given type. |
| `validate_chart_config` | Validate a Chart.js config (type, required fields, dataset shape per type). |
| `search_docs` | Keyword search across `docs/**/*.md` with line-level excerpts. |
| `get_doc` | Read a specific doc markdown file (sandboxed to `docs/`). |
| `list_docs` | List all available documentation paths. |

## Build

```bash
cd mcp
npm install
npm run build
```

## Smoke test

```bash
node scripts/smoke-test.mjs
```

## Wire it up

### Claude Desktop / Claude Code

Add to `~/.claude/mcp_servers.json` (or the equivalent config file):

```json
{
  "mcpServers": {
    "chartjs": {
      "command": "node",
      "args": ["/home/ubuntu/mcp-projects/Chart.js/mcp/dist/index.js"]
    }
  }
}
```

### Anything else that speaks MCP-stdio

Run `node dist/index.js` and pipe JSON-RPC over stdin/stdout.

## Notes

- The docs tools resolve paths relative to the repo root (two levels up from `dist/`). If you move the build output, update `REPO_ROOT` in `src/docs.ts`.
- `get_doc` is sandboxed to the `docs/` directory and rejects path traversal.
- Chart type metadata is hand-curated in `src/chart-types.ts` based on Chart.js v4. When adding new chart types or controllers upstream, update that file.
