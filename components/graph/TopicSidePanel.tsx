'use client';

import { X, Network, BrainCircuit, Activity, Link2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TopicNode } from '@/types/topic.types';
import { useEffect, useState } from 'react';

export function TopicSidePanel({ node, onClose }: { node: TopicNode | null, onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [topicDetails, setTopicDetails] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (node?.id) {
      setLoading(true);
      fetch(`/api/topics/${node.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.topic) setTopicDetails(data.topic);
          if (data.recentItems) setRecentItems(data.recentItems);
        })
        .catch(err => console.error("Failed to load topic details", err))
        .finally(() => setLoading(false));
    } else {
      setTopicDetails(null);
      setRecentItems([]);
    }
  }, [node?.id]);

  if (!mounted) return null;

  // Use topicDetails if fetched, otherwise fallback to node (which has basic data from graph)
  const displayData = topicDetails || node;

  return (
    <div
      className={cn(
        'absolute right-0 top-0 bottom-0 w-[400px] border-l border-border/50 glass-card rounded-none',
        'transform transition-transform duration-500 ease-out z-30 flex flex-col',
        node ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-3 h-3 rounded-full shadow-glow-blue animate-pulse',
            displayData?.glowState === 'gold' && 'bg-amber-500 shadow-glow-gold',
            displayData?.glowState === 'green' && 'bg-green-500 shadow-glow-green',
            displayData?.glowState === 'purple' && 'bg-purple-500 shadow-glow-purple',
            displayData?.glowState === 'red' && 'bg-red-500 shadow-glow-red',
            displayData?.glowState === 'blue' && 'bg-blue-500 shadow-glow-blue',
            displayData?.glowState === 'none' && 'bg-slate-500 shadow-none'
          )} />
          <h3 className="font-display font-bold text-lg text-foreground truncate max-w-[260px]">
            {displayData?.name || 'Topic Details'}
          </h3>
        </div>
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        {displayData && (
          <>
            {/* Meta tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-md bg-secondary text-xs font-medium font-mono text-muted-foreground border border-border">
                {displayData.domain}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-secondary text-xs font-medium font-mono text-muted-foreground border border-border">
                ID: {node?.id.slice(-6)}
              </span>
            </div>

            {/* AI Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                <BrainCircuit className="w-4 h-4" />
                <span>AI Synthesis</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {displayData.description || (
                  <>
                    This topic represents a cluster of knowledge in your second brain. You have 
                    <strong className="text-foreground"> {displayData.score?.itemCount || 0} </strong> 
                    items connected here, with a centrality score of {displayData.score?.centrality?.toFixed(2) || '0.00'}.
                  </>
                )}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-border bg-secondary/30">
                <div className="text-muted-foreground text-xs font-medium mb-1 flex items-center gap-1">
                  <Link2 className="w-3 h-3" /> Linked Items
                </div>
                <div className="text-2xl font-display font-bold">{displayData.score?.itemCount || 0}</div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-secondary/30">
                <div className="text-muted-foreground text-xs font-medium mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Centrality
                </div>
                <div className="text-2xl font-display font-bold">{(displayData.score?.centrality || 0).toFixed(2)}</div>
              </div>
            </div>

            {/* Linked Items list */}
            <div className="space-y-3">
              <div className="text-sm font-medium border-b border-border/50 pb-2">Recent Content</div>
              {loading ? (
                <div className="text-sm text-muted-foreground animate-pulse">Loading items...</div>
              ) : recentItems.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {recentItems.map(item => (
                    <a key={item._id} href={item.url || `/items/${item._id}`} target="_blank" rel="noreferrer" className="group flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-border hover:bg-secondary/30 transition-all cursor-pointer">
                      <div className="mt-0.5 w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
                        <ExternalLink className="w-3 h-3 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {new Date(item.createdAt).toLocaleDateString()} • {item.type}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">No items found for this topic.</div>
              )}
            </div>

            <button className="w-full py-2.5 rounded-lg border border-primary/30 text-primary font-medium text-sm hover:bg-primary/5 transition-all">
              Explore Full Cluster
            </button>
          </>
        )}
      </div>
    </div>
  );
}
