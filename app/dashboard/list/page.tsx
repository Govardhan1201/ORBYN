'use client';

import { useState, useEffect } from 'react';
import { ItemCard } from '@/components/items/ItemCard';
import { Loader2, List, Filter, Search, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const url = typeFilter === 'all' ? '/api/items' : `/api/items?type=${typeFilter}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.items) {
          setItems(data.items);
        }
      } catch (e) {
        console.error('Failed to fetch items', e);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [typeFilter]);

  const FILTERS = ['all', 'link', 'note', 'document', 'image', 'video', 'reel'];

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto custom-scrollbar relative">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <List className="w-5 h-5" />
              </div>
              <h1 className="text-4xl font-display font-bold text-white tracking-tight">Timeline</h1>
            </div>
            <p className="text-gray-400 font-light ml-1">A chronological stream of your captured knowledge.</p>
          </div>
          
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md overflow-x-auto custom-scrollbar hide-scrollbar">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-lg capitalize transition-all duration-300 font-mono tracking-wider whitespace-nowrap",
                  typeFilter === f 
                    ? "bg-primary text-black shadow-[0_0_15px_rgba(0,240,255,0.3)] scale-105" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary animate-pulse" />
              </div>
            </div>
            <p className="text-primary font-mono text-xs tracking-widest uppercase animate-pulse">Syncing Database...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-black/20 border border-white/5 rounded-3xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative z-10">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-3 relative z-10">Void</h3>
            <p className="text-gray-400 font-light max-w-sm relative z-10">
              {typeFilter === 'all' 
                ? "Your knowledge nebula is empty. Start adding links and notes to build your universe."
                : `You haven't added any ${typeFilter}s to this sector yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
