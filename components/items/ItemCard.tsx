'use client';

import { useState } from 'react';
import { ChevronDown, Link2, FileText, ImageIcon, Sparkles, Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ItemCardProps {
  item: any;
}

export function ItemCard({ item }: ItemCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getIcon = () => {
    switch (item.type) {
      case 'link': return <Link2 className="w-5 h-5" />;
      case 'note': return <FileText className="w-5 h-5" />;
      default: return <ImageIcon className="w-5 h-5" />;
    }
  };

  return (
    <div 
      className={cn(
        "glass-card border border-border/50 rounded-xl overflow-hidden transition-all duration-300",
        expanded ? "shadow-glow-blue bg-secondary/10" : "hover:bg-secondary/20 hover:border-border cursor-pointer"
      )}
      onClick={() => !expanded && setExpanded(true)}
    >
      <div className="p-4 flex items-start gap-4">
        {/* Icon/Thumbnail */}
        <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 overflow-hidden relative">
          {(item.meta?.previewImage || (item.type !== 'note' && item.type !== 'link' && item.url)) ? (
             <img src={item.meta?.previewImage || item.url} alt="thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-80" />
          ) : getIcon()}
        </div>

        {/* Header content */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-medium text-foreground truncate text-base">{item.title}</h3>
            {item.url && (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                title="Open original"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 bg-secondary px-2 py-0.5 rounded-full capitalize">
              {item.type}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Expand toggle */}
        <button 
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", expanded && "rotate-180")} />
        </button>
      </div>

      {/* Expanded Content (AI Summary & Tags) */}
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          expanded ? "max-h-[500px] opacity-100 border-t border-border/50" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-5 bg-background/30 space-y-4">
          
          {/* AI Summary */}
          {item.ai?.summary && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-medium text-xs tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" /> AI Summary
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.ai.summary}
              </p>
            </div>
          )}

          {/* Topics/Tags */}
          {item.topics?.tags && item.topics.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {item.topics.tags.map((tag: string) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-secondary/80 text-foreground border border-border/50">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Fallback for no AI data */}
          {!item.ai?.summary && (!item.topics?.tags || item.topics.tags.length === 0) && (
            <p className="text-sm text-muted-foreground italic">No AI insights generated for this item yet.</p>
          )}

        </div>
      </div>
    </div>
  );
}
