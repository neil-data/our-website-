'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { loadMedia } from '@/lib/adminData';
import { MediaItem } from '@/types';
import { X, Play, Camera } from 'lucide-react';

const CATEGORIES = ['all', 'hackathon', 'workshop', 'community', 'highlights', 'team'];

export default function MediaPage() {
  const [category, setCategory] = useState('all');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    loadMedia().then(setItems);
  }, []);

  const filtered = items.filter(m => category === 'all' || m.category === category);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="bg-number">MEDIA</div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="section-number mb-4">01 — Media Gallery</div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight leading-none mb-4">
            Capturing <span className="google-gradient-text">Moments</span>
          </h1>
          <p className="text-white/45 text-lg max-w-xl">
            Photos and highlights from our events, workshops, and community activities.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 border-b border-white/5 sticky top-16 bg-dark-bg/90 backdrop-blur-xl z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs font-mono uppercase tracking-widest px-4 py-2 rounded border transition-all ${
                  category === cat
                    ? 'bg-g-green/20 border-g-green/40 text-g-green'
                    : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="media-grid">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="media-grid-item relative group"
              >
                <a
                  href={item.link || item.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block rounded-xl overflow-hidden bg-dark-card border border-white/5"
                  onClick={e => {
                    if (!item.link) {
                      e.preventDefault();
                      setLightbox(item.src);
                    }
                  }}
                >
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-dark-bg/0 group-hover:bg-dark-bg/40 transition-colors" />
                  {/* Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-xs text-white font-semibold line-clamp-1 mb-1">{item.title}</div>
                    <div className="text-[10px] text-white/50 font-mono">{item.date}</div>
                  </div>
                  {/* Type badge */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.type === 'video' ? (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-white bg-g-red/80 px-2 py-0.5 rounded">
                        <Play size={8} /> VIDEO
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-white bg-black/50 px-2 py-0.5 rounded">
                        <Camera size={8} /> PHOTO
                      </div>
                    )}
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/70 hover:text-white z-10"
              onClick={() => setLightbox(null)}
            >
              <X size={18} />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={lightbox}
                alt="Media preview"
                width={1200}
                height={800}
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
