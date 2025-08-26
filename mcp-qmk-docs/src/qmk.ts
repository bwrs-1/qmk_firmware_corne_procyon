import { XMLParser } from 'fast-xml-parser';
import { parse as parseHtml } from 'node-html-parser';

export type QmkDocMeta = {
  url: string;
  title?: string;
  lastmod?: string;
};

const QMK_BASE = 'https://docs.qmk.fm';
const SITEMAP_URL = `${QMK_BASE}/sitemap.xml`;

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'user-agent': 'mcp-qmk-docs/0.1 (+github.com/modelcontextprotocol)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

export async function fetchSitemap(): Promise<QmkDocMeta[]> {
  const xml = await fetchText(SITEMAP_URL);
  const parser = new XMLParser({ ignoreAttributes: false });
  const data = parser.parse(xml);
  const urls: QmkDocMeta[] = [];
  const urlset = data.urlset?.url || [];
  const list = Array.isArray(urlset) ? urlset : [urlset];
  for (const entry of list) {
    if (!entry?.loc) continue;
    const url: string = entry.loc;
    if (!url.startsWith(QMK_BASE)) continue;
    urls.push({ url, lastmod: entry.lastmod });
  }
  return urls;
}

async function listFromSidebar(): Promise<QmkDocMeta[]> {
  const html = await fetchText(QMK_BASE);
  const root = parseHtml(html);
  const anchors = root.querySelectorAll('a');
  const urlsSet = new Set<string>();
  for (const a of anchors) {
    const href = a.getAttribute('href') || '';
    if (!href) continue;
    // docsify-like links use #/path
    if (href.startsWith('#/')) {
      urlsSet.add(`${QMK_BASE}/${href}`);
    } else if (href.startsWith('/')) {
      urlsSet.add(`${QMK_BASE}${href}`);
    } else if (href.startsWith('http') && href.startsWith(QMK_BASE)) {
      urlsSet.add(href);
    }
  }
  return Array.from(urlsSet).map((url) => ({ url }));
}

export async function fetchDoc(urlOrPath: string): Promise<{ url: string; title: string; text: string; html: string }>{
  const url = urlOrPath.startsWith('http') ? urlOrPath : `${QMK_BASE}/${urlOrPath.replace(/^\//, '')}`;
  const html = await fetchText(url);
  const root = parseHtml(html);
  // Docusaurus typical selectors
  const titleEl = root.querySelector('h1') || root.querySelector('title');
  const contentEl = root.querySelector('article') || root.querySelector('main') || root.querySelector('.theme-doc-markdown');
  const title = titleEl?.text?.trim() || url;
  const text = (contentEl?.text || root.text).replace(/\s+/g, ' ').trim();
  return { url, title, text, html };
}

export async function listDocs(limit = 100): Promise<QmkDocMeta[]> {
  try {
    const all = await fetchSitemap();
    if (all.length > 0) return all.slice(0, limit);
  } catch {
    // ignore and fallback
  }
  const fallback = await listFromSidebar();
  return fallback.slice(0, limit);
}

export type SearchMode = 'title' | 'url' | 'content';

export async function searchDocs(query: string, options?: { limit?: number; mode?: SearchMode; contentSample?: number }) {
  const limit = options?.limit ?? 20;
  const mode = options?.mode ?? 'title';
  const sample = options?.contentSample ?? 20; // number of pages to scan content for
  const q = query.toLowerCase();
  let entries: QmkDocMeta[] = [];
  try {
    entries = await fetchSitemap();
  } catch {
    // ignore
  }
  if (entries.length === 0) {
    entries = await listFromSidebar();
  }

  const byMeta = entries.filter(e => {
    const t = e.title?.toLowerCase() || '';
    const u = e.url.toLowerCase();
    if (mode === 'url') return u.includes(q);
    if (mode === 'title') return t.includes(q) || u.includes(q);
    return false;
  });

  if (mode !== 'content' && byMeta.length >= limit) {
    return byMeta.slice(0, limit);
  }

  // For content search, scan first N pages (or all if small)
  const toScan = entries.slice(0, sample);
  const results: QmkDocMeta[] = [];
  const concurrency = 5;
  let index = 0;
  async function worker() {
    while (index < toScan.length && results.length < limit) {
      const i = index++;
      const item = toScan[i];
      try {
        const page = await fetchDoc(item.url);
        if (page.text.toLowerCase().includes(q)) {
          results.push({ url: page.url, title: page.title });
        }
      } catch {
        // ignore errors per page
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return (mode === 'content' ? results : [...byMeta, ...results]).slice(0, limit);
}


