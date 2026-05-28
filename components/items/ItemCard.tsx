'use client';

import { useState } from 'react';
import { ChevronDown, Link2, FileText, ImageIcon, Sparkles, Clock, ExternalLink, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ItemCardProps {
  item: any;
}

export function ItemCard({ item }: ItemCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getIconInfo = () => {
    switch (item.type) {
      case 'link': return { icon: <Link2 className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' };
      case 'note': return { icon: <FileText className="w-5 h-5" />, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' };
      case 'image': return { icon: <ImageIcon className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' };
      default: return { icon: <Activity className="w-5 h-5" />, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' };
    }
  };

  const { icon, color, bg, border } = getIconInfo();
  const hasImage = item.meta?.previewImage || (item.type !== 'note' && item.type !== 'link' && item.url);

  return (
    <div 
      className={cn(
        "group relative rounded-2xl overflow-hidden transition-all duration-500",
        expanded 
          ? "bg-[#0a0a0c]/80 border border-primary/30 shadow-[0_0_30px_rgba(0,240,255,0.1)]" 
          : "bg-[#0a0a0c]/40 border border-white/5 hover:bg-[#0a0a0c]/60 hover:border-white/10 hover:shadow-lg cursor-pointer backdrop-blur-md"
      )}
      onClick={() => !expanded && setExpanded(true)}
    >
      {/* Subtle hover gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="p-5 flex flex-col sm:flex-row gap-5 relative z-10">
        {/* Icon/Thumbnail */}
        <div className={cn(
          "w-16 h-16 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner",
          bg, border, "border"
        )}>
          {hasImage ? (
             <img src={item.meta?.previewImage || item.url} alt="thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110" />
          ) : (
            <div className={cn("transition-transform duration-500 group-hover:scale-110 group-hover:animate-pulse", color)}>
              {icon}
            </div>
          )}
        </div>

        {/* Header content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-display font-semibold text-white text-lg tracking-tight truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all duration-300">
              {item.title || "Untitled Node"}
            </h3>
            
            <div className="flex items-center gap-2 shrink-0">
              {item.url && (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary/20 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300"
                  title="Open Source"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-300"
              >
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-500", expanded && "rotate-180")} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-xs font-medium text-gray-400/80 uppercase tracking-wider font-mono">
            <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/10 bg-black/40", color)}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {item.type}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Content (AI Summary & Tags) */}
      <div 
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          expanded ? "max-h-[800px] opacity-100 border-t border-white/10" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-6 bg-black/40 space-y-6 relative">
          
          {/* Subtle grid background for the expanded area */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* AI Summary */}
          {item.ai?.summary && (
            <div className="relative z-10 space-y-3 p-5 rounded-xl border border-primary/20 bg-primary/5 shadow-[inset_0_0_30px_rgba(0,240,255,0.02)]">
              <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase">
                <Sparkles className="w-4 h-4 animate-pulse" /> Intelligence Summary
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-light">
                {item.ai.summary}
              </p>
            </div>
          )}

          {/* Topics/Tags */}
          {item.topics?.tags && item.topics.tags.length > 0 && (
            <div className="relative z-10 flex flex-wrap gap-2 pt-1">
              {item.topics.tags.map((tag: string) => (
                <span key={tag} className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 border border-white/10 hover:border-primary/40 hover:text-primary transition-colors cursor-default">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Fallback for no AI data */}
          {!item.ai?.summary && (!item.topics?.tags || item.topics.tags.length === 0) && (
            <p className="relative z-10 text-sm text-gray-500 italic font-light px-2">No intelligence data synthesized yet.</p>
          )}

        </div>
      </div>
    </div>
  );
}
