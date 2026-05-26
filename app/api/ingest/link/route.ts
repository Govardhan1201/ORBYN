import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import * as cheerio from 'cheerio';
import { ingestItem } from '@/lib/services/ingestion/core.service';
import clientPromise from '@/lib/db/mongodb';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    await clientPromise; // Ensure DB connection

    // Fetch the URL
    const response = await fetch(url, {
      headers: { 'User-Agent': 'OrbynBot/1.0' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch URL content');
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract basic meta
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || url;
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
    const favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
    const previewImage = $('meta[property="og:image"]').attr('content');
    
    // Extract main text for AI processing
    $('script, style, nav, footer, header, aside').remove();
    const mainText = $('article, main, body').text().replace(/\s+/g, ' ').substring(0, 3000);

    // Process through unified ingestion pipeline
    const result = await ingestItem({
      userId: session.user.id,
      type: 'link',
      title,
      url,
      content: `Description: ${description}\n\nContent: ${mainText}`
    });

    // Update item with specific link metadata
    // We could do this inside ingestItem if we passed full metadata, but for now we can update it
    const { itemsRepo } = await import('@/lib/db/repositories/items.repo');
    await itemsRepo.update(result.item._id.toString(), session.user.id, {
      meta: {
        description,
        favicon,
        previewImage,
        domain: new URL(url).hostname,
        wordCount: mainText.split(/\s+/).length,
      }
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Ingestion Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
