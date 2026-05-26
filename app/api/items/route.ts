import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { itemsRepo } from '@/lib/db/repositories/items.repo';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const type = searchParams.get('type') as any;

    const items = await itemsRepo.findByUserId(session.user.id, {
      limit,
      skip,
      type: type || undefined,
      sortBy: 'createdAt',
      sortDir: -1
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Items Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}
