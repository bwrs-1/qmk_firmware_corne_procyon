import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { listDocs, fetchDoc, searchDocs } from './qmk.js';

const mcp = new McpServer({ name: 'mcp-qmk-docs', version: '0.1.0' });

mcp.registerTool('qmk_list_docs', {
  description: 'QMKドキュメントの一覧(URLと更新日)を返す。sitemap.xmlを元にします。',
  inputSchema: {
    limit: z.number().min(1).max(1000).default(100)
  }
}, async ({ limit }) => {
  const list = await listDocs(limit ?? 100);
  return { content: [{ type: 'text', text: JSON.stringify(list, null, 2) }] };
});

mcp.registerTool('qmk_get_doc', {
  description: '指定URL(またはパス)のQMKドキュメント本文を取得し、タイトル・テキスト・HTMLを返す。',
  inputSchema: {
    urlOrPath: z.string()
  }
}, async ({ urlOrPath }) => {
  const doc = await fetchDoc(urlOrPath);
  return { content: [{ type: 'text', text: JSON.stringify(doc, null, 2) }] };
});

mcp.registerTool('qmk_search_docs', {
  description: 'QMKドキュメントを検索する。title/urlの部分一致、または簡易な本文検索に対応。',
  inputSchema: {
    query: z.string(),
    limit: z.number().min(1).max(100).optional(),
    mode: z.enum(['title','url','content']).default('title').optional(),
    contentSample: z.number().min(1).max(200).optional()
  }
}, async ({ query, limit, mode, contentSample }) => {
  const results = await searchDocs(query, { limit, mode: mode as any, contentSample });
  return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
});

async function main() {
  const transport = new StdioServerTransport();
  await mcp.connect(transport);
}

main().catch((err) => {
  console.error(err);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});


