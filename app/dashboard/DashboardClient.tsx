'use client';

import { useState } from 'react';
import { GraphWrapper } from '@/components/graph/GraphWrapper';
import { TopicSidePanel } from '@/components/graph/TopicSidePanel';
import type { GraphData, TopicNode } from '@/types/topic.types';
import type { Session } from 'next-auth';

export function DashboardClient({ 
  initialData, 
  session 
}: { 
  initialData: GraphData;
  session: Session | null;
}) {
  const [selectedNode, setSelectedNode] = useState<TopicNode | null>(null);

  return (
    <div className="absolute inset-0 bg-background/50 flex">
      {/* Graph Area */}
      <div className="flex-1 relative">
        <GraphWrapper 
          data={initialData} 
          onNodeClick={(node) => setSelectedNode(node)}
        />
        
        {/* Floating Info Overlay */}
        <div className="absolute bottom-6 left-6 pointer-events-none z-10">
          <h2 className="font-display text-2xl font-bold">{session?.user?.name}'s Nebula</h2>
          <p className="text-muted-foreground text-sm mt-1">{initialData.nodes.length} Topics • {initialData.links.length} Connections</p>
        </div>
      </div>

      {/* Side Panel */}
      <TopicSidePanel 
        node={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />
    </div>
  );
}
