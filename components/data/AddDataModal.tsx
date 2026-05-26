'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, FileText, Image as ImageIcon, FileVideo, Music, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MEDIA_TYPES = [
  { id: 'link', label: 'Web Link', icon: LinkIcon, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
  { id: 'pdf', label: 'Document', icon: FileText, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
  { id: 'image', label: 'Image', icon: ImageIcon, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
  { id: 'video', label: 'Video', icon: FileVideo, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/30' },
  { id: 'audio', label: 'Audio', icon: Music, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
];

export function AddDataModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type: selectedType || 'link' }),
      });
      if (res.ok) {
        onClose();
        setUrl('');
        setSelectedType(null);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
        >
          {/* Intense glass backdrop */}
          <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-3xl" onClick={onClose} />
          
          <motion.div 
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-[#09090b]/80"
          >
            {/* Top accent glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 shadow-glow-blue mb-6">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Feed your Nebula</h2>
                <p className="text-muted-foreground text-lg">Select a format and drop your data into the void.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                {MEDIA_TYPES.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                        isSelected 
                          ? `${type.bg} ${type.border} ${type.color} ring-2 ring-${type.color.split('-')[1]}-500/50 shadow-lg` 
                          : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <type.icon className="w-8 h-8 mb-3" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {selectedType && (
                  <motion.form 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="relative group">
                      <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl group-focus-within:bg-primary/30 transition-all opacity-50" />
                      <input
                        type="url"
                        placeholder="Paste your URL here..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        className="relative w-full bg-[#020617] border border-white/20 px-6 py-4 rounded-xl text-white placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-glow-blue flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Extracting Meaning...</span>
                        </>
                      ) : (
                        <span>Synthesize Data</span>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
