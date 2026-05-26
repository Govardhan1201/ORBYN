import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { itemsRepo } from '@/lib/db/repositories/items.repo';
import { topicsRepo } from '@/lib/db/repositories/topics.repo';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.trim() === '') {
      return NextResponse.json({ results: [] });
    }

    // Attempt text search. (Fails gracefully if no text index exists yet)
    let itemResults = [];
    let topicResults = [];

    try {
      itemResults = await itemsRepo.textSearch(session.user.id, query, 5);
    } catch (err: any) {
      console.warn("Item Text search failed (likely missing index), falling back to title regex:", err.message);
      // Fallback if no $text index is present
      const allItems = await itemsRepo.findByUserId(session.user.id, { limit: 100 });
      itemResults = allItems.filter(i => 
        i.title.toLowerCase().includes(query.toLowerCase()) || 
        i.ai?.summary?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
    }

    try {
      topicResults = await topicsRepo.search(query, 3);
    } catch (err: any) {
      console.warn("Topic Text search failed (likely missing index), falling back to name regex:", err.message);
      // Fallback if no $text index is present
      const allTopics = await topicsRepo.findAll(100);
      topicResults = allTopics.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3);
    }

    // Format results for the frontend dropdown
    const results = [
      ...topicResults.map(t => ({
        _id: t._id.toString(),
        type: 'topic',
        name: t.name,
        description: t.description || `Domain: ${t.domain}`,
      })),
      ...itemResults.map(i => ({
        _id: i._id.toString(),
        type: i.type,
        title: i.title,
        ai: i.ai,
        meta: i.meta,
        url: i.url
      }))
    ];

    return NextResponse.json({ results });

  } catch (error: any) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
