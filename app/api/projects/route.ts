import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { projectsRepo } from '@/lib/db/repositories/projects.repo';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const projects = await projectsRepo.findByUser(session.user.id);
    return NextResponse.json({ projects: projects.map(p => ({
      ...p,
      _id: p._id.toString(),
      userId: p.userId.toString(),
      itemIds: p.itemIds.map(id => id.toString()),
      topicIds: p.topicIds.map(id => id.toString()),
      itemCount: p.itemIds.length,
    })) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, description, coverColor, icon } = body;
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const project = await projectsRepo.create({
      userId: session.user.id,
      name,
      description,
      coverColor,
      icon,
    });

    return NextResponse.json({ project: {
      ...project,
      _id: project._id.toString(),
      userId: project.userId.toString(),
      itemIds: [],
      topicIds: [],
    }}, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
