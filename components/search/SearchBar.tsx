'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Link2, FileText, ImageIcon, BrainCircuit, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
          setIsOpen(true);
        }
      } catch (e) {
        console.error('Search failed:', e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: any) => {
    setIsOpen(false);
    setQuery('');
    if (item.type === 'topic') {
      router.push(`/dashboard/topics`);
    } else {
      window.open(item.url || `/dashboard`, '_blank');
    }
  };

  return (
    <div ref={wrapperRef} className="flex-1 max-w-xl relative">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          placeholder="Search your mind (Cmd+K)" 
          className="flex-1 bg-transparent border-none outline-none text-sm placeholder-muted-foreground text-foreground"
        />
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground shrink-0" />}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-panel border border-border/50 rounded-xl shadow-2xl overflow-hidden z-50 animate-scale-in">
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
            <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Results
            </div>
            {results.map((result) => (
              <button
                key={result._id}
                onClick={() => handleSelect(result)}
                className="w-full flex items-start gap-3 p-3 text-left rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="mt-0.5 shrink-0 text-primary">
                  {result.type === 'topic' ? <BrainCircuit className="w-4 h-4" /> :
                   result.type === 'link' ? <Link2 className="w-4 h-4" /> :
                   result.type === 'note' ? <FileText className="w-4 h-4" /> :
                   <ImageIcon className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{result.title || result.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {result.ai?.summary || result.description || result.meta?.description || `A ${result.type} in your nebula`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isOpen && results.length === 0 && !loading && query.trim() && (
        <div className="absolute top-full mt-2 w-full glass-panel border border-border/50 rounded-xl shadow-2xl p-6 text-center z-50">
          <p className="text-sm text-muted-foreground">No matches found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
