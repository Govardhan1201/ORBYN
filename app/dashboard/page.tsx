import { auth } from '@/lib/auth/config';
import { GraphService } from '@/lib/services/graph.service';
import { DashboardClient } from './DashboardClient';
import clientPromise from '@/lib/db/mongodb';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null; // Will be redirected by layout
  }

  // Ensure DB connection
  await clientPromise;
  
  let data;
  try {
    data = await GraphService.getUserGraphData(session.user.id);
  } catch (error) {
    console.error('Error fetching graph data', error);
    data = { nodes: [], links: [] };
  }

  return <DashboardClient initialData={data} session={session} />;
}
