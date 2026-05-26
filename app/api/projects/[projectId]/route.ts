import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { projectsRepo } from '@/lib/db/repositories/projects.repo';
import { itemsRepo } from '@/lib/db/repositories/items.repo';

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const project = await projectsRepo.findById(params.projectId);
    if (!project || project.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    // Fetch the actual item data for this project
    const items = await Promise.all(
      project.itemIds.map(id => itemsRepo.findById(id.toString()))
    );
    const validItems = items.filter(Boolean);

    return NextResponse.json({
      project: {
        ...project,
        _id: project._id.toString(),
        userId: project.userId.toString(),
        itemIds: project.itemIds.map(id => id.toString()),
        topicIds: project.topicIds.map(id => id.toString()),
      },
      items: validItems,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { projectId: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const success = await projectsRepo.delete(params.projectId, session.user.id);
    if (!success) return NextResponse.json({ error: 'Not Found or unauthorized' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
