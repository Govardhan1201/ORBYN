import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { topicsRepo } from '@/lib/db/repositories/topics.repo';
import { itemsRepo } from '@/lib/db/repositories/items.repo';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // 1. Fetch topic details
    const topic = await topicsRepo.findById(id);
    
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    // Security: Only allow access if it's a global topic or created by the user
    if (!topic.isGlobal && topic.createdBy?.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized access to topic' }, { status: 403 });
    }

    // 2. Fetch recent items connected to this topic by this user
    const recentItems = await itemsRepo.findByTopicId(id, session.user.id, 10);

    return NextResponse.json({
      topic,
      recentItems,
    });
  } catch (error) {
    console.error('Error fetching topic details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
