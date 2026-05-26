/**
 * Link ingestion service — fetches metadata from URLs
 * Uses cheerio for HTML parsing, falls back gracefully.
 */
import * as cheerio from 'cheerio';
import axios from 'axios';

export interface LinkMeta {
  title: string;
  description: string;
  domain: string;
  favicon: string;
  previewImage: string;
  extractedText: string;
}

export async function fetchLinkMeta(url: string): Promise<LinkMeta> {
  let html = '';
  try {
    const resp = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OrbynBot/1.0; +https://orbyn.app)',
      },
      maxContentLength: 500_000,
    });
    html = resp.data as string;
  } catch {
    // If fetch fails, return minimal metadata from URL
    const parsed = new URL(url);
    return {
      title: parsed.hostname,
      description: '',
      domain: parsed.hostname.replace('www.', ''),
      favicon: `https://www.google.com/s2/favicons?sz=64&domain=${parsed.hostname}`,
      previewImage: '',
      extractedText: '',
    };
  }

  const $ = cheerio.load(html);
  const parsed = new URL(url);
  const domain = parsed.hostname.replace('www.', '');

  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    $('title').text().trim() ||
    domain;

  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    $('meta[name="twitter:description"]').attr('content') ||
    '';

  const previewImage =
    $('meta[property="og:image"]').attr('content') ||
    $('meta[name="twitter:image"]').attr('content') ||
    '';

  const favicon = `https://www.google.com/s2/favicons?sz=64&domain=${parsed.hostname}`;

  // Extract readable text
  $('script, style, nav, footer, header, aside, .ad, .advertisement').remove();
  const bodyText = $('article, main, .content, .post, [role="main"]').text() ||
    $('body').text();
  const extractedText = bodyText.replace(/\s+/g, ' ').trim().slice(0, 5000);

  return {
    title: title.trim().slice(0, 300),
    description: description.trim().slice(0, 500),
    domain,
    favicon,
    previewImage: previewImage.slice(0, 500),
    extractedText,
  };
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
}
