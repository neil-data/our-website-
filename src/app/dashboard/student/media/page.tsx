import Image from 'next/image';
import { GlassCard } from '@/components/ui/GlassCard';
import { loadMedia } from '@/lib/adminData';
import { Camera } from 'lucide-react';

export default async function StudentMediaPage() {
  const allMedia = await loadMedia();
  const galleryItems = allMedia.slice(0, 6);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-white">Media</h1>
        <p className="text-white/40 text-sm font-mono mt-1">Event photos and community moments</p>
      </div>

      <h2 className="section-number mb-4">Event Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
        {galleryItems.map((item, i) => (
          <GlassCard key={item.id} delay={i * 0.06} className="p-0 overflow-hidden" glowColor="green">
            <div className="relative h-40 group">
              <Image src={item.thumbnail} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-dark-bg/0 group-hover:bg-dark-bg/40 transition-colors flex items-end">
                <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-xs text-white font-semibold line-clamp-1">{item.title}</div>
                  <div className="text-[10px] text-white/50 font-mono">{item.date}</div>
                </div>
              </div>
              <div className="absolute top-2 left-2">
                <div className="flex items-center gap-1 text-[10px] font-mono text-white/70 bg-black/40 px-1.5 py-0.5 rounded">
                  <Camera size={8} />
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
