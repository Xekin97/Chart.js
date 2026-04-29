#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  CHART_TYPES,
  getChartTemplate,
  listChartTypes,
  validateChartConfig,
} from './chart-types.js';
import { getDoc, listAllDocs, searchDocs } from './docs.js';

const TYPE_ENUM = Object.keys(CHART_TYPES);

const TOOLS = [
  {
    name: 'list_chart_types',
    description:
      'List all Chart.js chart types (bar, line, pie, doughnut, radar, polarArea, scatter, bubble) with a short description and the data shape each expects.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_chart_template',
    description:
      'Return a ready-to-use Chart.js v4 config for a given chart type. The template includes sample data, basic styling, and recommended options.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: TYPE_ENUM,
          description: 'The chart type to scaffold.',
        },
      },
      required: ['type'],
      additionalProperties: false,
    },
  },
  {
    name: 'validate_chart_config',
    description:
      'Validate a Chart.js v4 config object. Checks for required fields (type, data, datasets), correct chart type, and per-type dataset shape (numeric arrays vs {x,y} vs {x,y,r}). Returns a list of error and warning issues.',
    inputSchema: {
      type: 'object',
      properties: {
        config: {
          type: 'object',
          description:
            'The full Chart.js config object as you would pass to `new Chart(ctx, config)`.',
        },
      },
      required: ['config'],
      additionalProperties: false,
    },
  },
  {
    name: 'search_docs',
    description:
      'Keyword search across the Chart.js docs/ markdown files. Returns matching files ranked by hit count, with up to 3 line excerpts per file.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Whitespace-separated keywords.' },
        maxHits: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_doc',
    description:
      'Read a specific Chart.js documentation markdown file. Path must be relative to the repository root and within the docs/ directory (e.g. "docs/charts/bar.md"). Use list_docs or search_docs to discover paths.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Repo-relative .md path under docs/, e.g. "docs/charts/bar.md".',
        },
      },
      required: ['path'],
      additionalProperties: false,
    },
  },
  {
    name: 'list_docs',
    description: 'List all available Chart.js documentation markdown file paths.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
];

const server = new Server(
  { name: 'chartjs-mcp', version: '0.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params;

  try {
    switch (name) {
      case 'list_chart_types': {
        return jsonContent(listChartTypes());
      }

      case 'get_chart_template': {
        const type = String((args as any).type ?? '');
        const meta = getChartTemplate(type);
        if (!meta) {
          return errorContent(
            `Unknown chart type "${type}". Valid: ${TYPE_ENUM.join(', ')}.`
          );
        }
        return jsonContent({
          type: meta.type,
          description: meta.description,
          dataShape: meta.dataShape,
          docPath: meta.docPath,
          config: meta.template,
        });
      }

      case 'validate_chart_config': {
        const config = (args as any).config;
        const issues = validateChartConfig(config);
        const errors = issues.filter((i) => i.severity === 'error').length;
        const warnings = issues.filter((i) => i.severity === 'warning').length;
        return jsonContent({
          valid: errors === 0,
          summary: `${errors} error(s), ${warnings} warning(s)`,
          issues,
        });
      }

      case 'search_docs': {
        const query = String((args as any).query ?? '');
        const maxHits = Number((args as any).maxHits ?? 10);
        const hits = await searchDocs(query, maxHits);
        return jsonContent({ query, count: hits.length, hits });
      }

      case 'get_doc': {
        const p = String((args as any).path ?? '');
        const content = await getDoc(p);
        return { content: [{ type: 'text', text: content }] };
      }

      case 'list_docs': {
        const docs = await listAllDocs();
        return jsonContent({ count: docs.length, docs });
      }

      default:
        return errorContent(`Unknown tool: ${name}`);
    }
  } catch (err) {
    return errorContent(err instanceof Error ? err.message : String(err));
  }
});

function jsonContent(value: unknown) {
  return {
    content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
  };
}

function errorContent(message: string) {
  return {
    isError: true,
    content: [{ type: 'text', text: message }],
  };
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stderr only — stdio transport owns stdout
  console.error('chartjs-mcp running on stdio');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
