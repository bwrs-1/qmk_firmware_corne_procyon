import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/server.js'],
    cwd: process.cwd(),
    stderr: 'inherit'
  });
  const client = new Client({ name: 'test-client', version: '0.0.1' });
  await client.connect(transport);

  // list
  const list: any = await client.callTool({
    name: 'qmk_list_docs',
    arguments: { limit: 5 }
  });
  console.log('qmk_list_docs:', list);

  // get_doc of first
  const firstUrl = (() => {
    try {
      const txt = list?.content?.[0]?.text ?? '[]';
      const arr = JSON.parse(txt);
      return arr[0]?.url as string | undefined;
    } catch {
      return undefined;
    }
  })();

  if (firstUrl) {
    const doc: any = await client.callTool({
      name: 'qmk_get_doc',
      arguments: { urlOrPath: firstUrl }
    });
    const docText = doc?.content?.[0]?.text ?? '';
    console.log('qmk_get_doc:', String(docText).slice(0, 400) + '...');
  }

  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


