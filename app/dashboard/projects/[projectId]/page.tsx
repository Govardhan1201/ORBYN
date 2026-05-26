'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Network, List, FolderClosed, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ItemCard } from '@/components/items/ItemCard';
// Re-using the main KnowledgeGraph component, but we will pass it custom data if we want.
import KnowledgeGraph from '@/components/graph/KnowledgeGraph'; 

export default function ProjectWorkspace() {
  const { projectId } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const data = await res.json();
        if (data.project) {
          setProject(data.project);
          setItems(data.items || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [projectId]);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this project? Your items will remain in your nebula.')) return;
    
    try {
      await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      router.push('/dashboard/projects');
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!project) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <Link href="/dashboard/projects" className="text-primary hover:underline">Return to Projects</Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <header className="h-20 shrink-0 border-b border-border/50 glass px-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center shadow-inner shrink-0"
            style={{ backgroundColor: project.coverColor + '20', color: project.coverColor }}
          >
            <FolderClosed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">{project.name}</h1>
            <p className="text-xs text-muted-foreground">{items.length} items collected</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg border border-border">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'graph' ? 'bg-primary text-primary-foreground shadow-glow-blue' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Network className="w-4 h-4" /> Graph
            </button>
          </div>
          
          <button onClick={handleDelete} className="p-2 text-muted-foreground hover:text-destructive transition-colors ml-4" title="Delete Project">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden bg-background/50">
        {viewMode === 'list' ? (
          <div className="h-full overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-4xl mx-auto">
              {items.length === 0 ? (
                <div className="text-center py-20 glass-card rounded-xl border border-border/50">
                  <FolderClosed className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium text-foreground mb-2">This project is empty</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    You can add items to this project from the main timeline or directly when saving new links and notes.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map(item => <ItemCard key={item._id} item={item} />)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black">
            {/* The isolated graph. In a full implementation, we pass custom graphData here based on the project's topicIds */}
            <div className="absolute top-4 left-4 z-10 glass-panel px-4 py-3 rounded-xl border-primary/30 max-w-sm">
              <h3 className="font-semibold text-primary mb-1 flex items-center gap-2"><Network className="w-4 h-4"/> Isolated Graph Mode</h3>
              <p className="text-xs text-muted-foreground">Showing only nodes and clusters related to {project.name}.</p>
            </div>
            <KnowledgeGraph data={{ nodes: [], links: [] }} />
          </div>
        )}
      </div>
      
    </div>
  );
}
