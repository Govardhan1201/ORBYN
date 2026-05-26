'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { useCallback, useRef, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import type { GraphData, TopicNode } from '@/types/topic.types';
import { ZoomIn, ZoomOut, Maximize, Crosshair } from 'lucide-react';

export default function KnowledgeGraph({ data, onNodeClick }: { data: GraphData, onNodeClick?: (node: TopicNode) => void }) {
  const { theme } = useTheme();
  const graphRef = useRef<ForceGraphMethods>();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const handleZoomIn = useCallback(() => {
    const currentZoom = graphRef.current?.zoom() || 1;
    graphRef.current?.zoom(currentZoom * 1.5, 400);
  }, []);

  const handleZoomOut = useCallback(() => {
    const currentZoom = graphRef.current?.zoom() || 1;
    graphRef.current?.zoom(currentZoom / 1.5, 400);
  }, []);

  const handleFit = useCallback(() => {
    graphRef.current?.zoomToFit(800, 50, (node) => true);
  }, []);

  const handleCenter = useCallback(() => {
    graphRef.current?.centerAt(0, 0, 800);
    graphRef.current?.zoom(1.2, 800);
  }, []);

  // Handle resize
  const onResize = useCallback(() => {
    if (container) {
      setDimensions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    }
  }, [container]);

  // Paint custom nodes
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name as string;
    const fontSize = 12 / globalScale;
    const r = node.val || 4;
    
    // Node color logic based on glowState and theme
    let color = '#6366f1'; // Primary default
    if (node.glowState === 'blue') color = '#3b82f6';
    if (node.glowState === 'gold') color = '#f59e0b';
    if (node.glowState === 'green') color = '#10b981';
    if (node.glowState === 'purple') color = '#8b5cf6';
    if (node.glowState === 'red') color = '#ef4444';

    // Draw Node
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
    
    // Add glow effect if not 'none'
    if (node.glowState !== 'none') {
      ctx.shadowColor = color;
      ctx.shadowBlur = 10 * globalScale;
    } else {
      ctx.shadowBlur = 0;
    }
    
    ctx.fillStyle = color;
    ctx.fill();
    
    // Draw Border (Glass effect)
    ctx.lineWidth = 0.5 / globalScale;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw Text Label if globalScale > threshold
    if (globalScale >= 1.5) {
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(label, node.x, node.y + r + (4 / globalScale));
    }
  }, []);

  return (
    <div 
      className="w-full h-full relative" 
      ref={(el) => {
        setContainer(el);
        if (el) {
          setDimensions({ width: el.clientWidth, height: el.clientHeight });
          // Optional: Add resize observer here if needed
          const resizeObserver = new ResizeObserver(() => {
            setDimensions({ width: el.clientWidth, height: el.clientHeight });
          });
          resizeObserver.observe(el);
        }
      }}
    >
      <ForceGraph2D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={data}
        nodeLabel="name"
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          ctx.fillStyle = color;
          const r = node.val || 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
        linkColor={(link: any) => {
          return link.edgeType === 'co-occurrence' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.1)';
        }}
        linkWidth={(link: any) => link.weight || 1}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={(link: any) => link.edgeType === 'parent' ? 2 : 0}
        onNodeClick={(node) => {
          graphRef.current?.centerAt(node.x, node.y, 1000);
          graphRef.current?.zoom(4, 2000);
          if (onNodeClick) onNodeClick(node as TopicNode);
        }}
        d3VelocityDecay={0.3}
        backgroundColor="transparent"
      />
      
      {/* Graph Controls Overlay */}
      <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
        <div className="glass-panel flex flex-col p-1 rounded-lg border border-border/50 shadow-lg bg-background/30 backdrop-blur-md">
          <button 
            onClick={handleZoomIn}
            className="p-2 hover:bg-white/10 rounded-md transition-colors text-foreground"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="h-px bg-border/50 mx-2 my-1" />
          <button 
            onClick={handleZoomOut}
            className="p-2 hover:bg-white/10 rounded-md transition-colors text-foreground"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>

        <div className="glass-panel flex flex-col p-1 rounded-lg border border-border/50 shadow-lg bg-background/30 backdrop-blur-md mt-2">
          <button 
            onClick={handleFit}
            className="p-2 hover:bg-white/10 rounded-md transition-colors text-foreground"
            title="Fit to Screen"
          >
            <Maximize className="w-5 h-5" />
          </button>
          <div className="h-px bg-border/50 mx-2 my-1" />
          <button 
            onClick={handleCenter}
            className="p-2 hover:bg-white/10 rounded-md transition-colors text-foreground"
            title="Center Graph"
          >
            <Crosshair className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
