'use client';

import { useState, useEffect } from 'react';
import { ItemCard } from '@/components/items/ItemCard';
import { Loader2, List, Filter } from 'lucide-react';

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
    <div className="h-full flex flex-col p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient">Timeline</h1>
            <p className="text-muted-foreground mt-1">A chronological view of all your saved knowledge.</p>
          </div>
          
          <div className="flex items-center gap-2 glass-panel p-1 rounded-lg">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                  typeFilter === f ? 'bg-primary text-primary-foreground shadow-glow-blue' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-xl border border-border/50">
            <List className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">
              {typeFilter === 'all' 
                ? "You haven't added anything to your nebula yet."
                : `You don't have any ${typeFilter}s saved.`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
