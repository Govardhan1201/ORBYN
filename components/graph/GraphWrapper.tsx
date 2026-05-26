'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { GraphData, TopicNode } from '@/types/topic.types';
import { Loader2, MonitorPlay, Zap } from 'lucide-react';

const ForceGraph2D = dynamic(() => import('./KnowledgeGraph'), {
  ssr: false,
  loading: () => <LoadingState type="2D" />,
});

const ForceGraph3D = dynamic(() => import('./KnowledgeGraph3D'), {
  ssr: false,
  loading: () => <LoadingState type="3D WebGL" />,
});

function LoadingState({ type }: { type: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium animate-pulse">Initializing {type} physics engine...</p>
      </div>
    </div>
  );
}

export function GraphWrapper({ data, onNodeClick }: { data: GraphData, onNodeClick?: (node: TopicNode) => void }) {
  const [is3D, setIs3D] = useState(true);

  return (
    <div className="w-full h-full relative">
      {is3D ? (
        <ForceGraph3D data={data} onNodeClick={onNodeClick} />
      ) : (
        <ForceGraph2D data={data} onNodeClick={onNodeClick} />
      )}
      
      {/* Performance Toggle Overlay */}
      <div className="absolute top-6 left-6 z-20">
        <div className="glass-panel flex items-center p-1 rounded-lg border border-border/50 shadow-lg bg-background/30 backdrop-blur-md">
          <button
            onClick={() => setIs3D(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${is3D ? 'bg-primary text-primary-foreground shadow-glow-blue' : 'text-muted-foreground hover:text-foreground'}`}
            title="Premium 3D Engine"
          >
            <MonitorPlay className="w-4 h-4" /> 3D Mode
          </button>
          <button
            onClick={() => setIs3D(false)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${!is3D ? 'bg-background text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
            title="Lightweight 2D Canvas Engine"
          >
            <Zap className="w-4 h-4" /> Performance
          </button>
        </div>
      </div>
    </div>
  );
}
