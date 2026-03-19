'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { MediaItem } from '@/types';
import { ArrowRight, Camera } from 'lucide-react';

export default function MediaPreviewSection({ media = [] }: { media?: MediaItem[] }) {
  const preview = media.slice(0, 6);
  return (
    <section className="relative py-28 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <SectionTitle
            number="05"
            eyebrow="Media Gallery"
            title="Moments That "
            highlight="Define Us"
            description="Snapshots from our hackathons, workshops, and community events."
            className="mb-0"
          />
          <Link
            href="/media"
            className="hidden md:flex items-center gap-2 text-g-green text-xs font-mono uppercase tracking-widest hover:gap-3 transition-all"
          >
            Full Gallery <ArrowRight size={12} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {preview.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`relative overflow-hidden rounded-xl group cursor-pointer
                ${i === 0 ? 'row-span-2' : ''}
              `}
              style={{ aspectRatio: i === 0 ? '1/1' : '4/3' }}
            >
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-dark-bg/20 group-hover:bg-dark-bg/10 transition-colors" />
              <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="glass-card rounded-lg p-2 w-full">
                  <div className="text-xs text-white font-semibold line-clamp-1">{item.title}</div>
                </div>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 rounded glass-card flex items-center justify-center">
                  <Camera size={10} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/media"
            className="inline-flex items-center gap-2 text-g-green text-xs font-mono uppercase tracking-widest"
          >
            View Full Gallery <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
