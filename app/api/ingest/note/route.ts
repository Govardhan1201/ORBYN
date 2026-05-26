import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { ingestItem } from '@/lib/services/ingestion/core.service';
import clientPromise from '@/lib/db/mongodb';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    await clientPromise; // Ensure DB connection

    // Process through unified ingestion pipeline
    const result = await ingestItem({
      userId: session.user.id,
      type: 'note',
      title,
      content,
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Note Ingestion Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
