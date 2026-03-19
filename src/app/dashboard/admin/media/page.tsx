'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { MediaCategory, MediaItem } from '@/types';
import { loadMedia, createMedia, deleteMedia } from '@/lib/adminData';
import { Upload, Trash2 } from 'lucide-react';

const CATEGORIES: MediaCategory[] = ['hackathon', 'workshop', 'community', 'highlights', 'team'];

const toDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MediaCategory>('community');
  const [link, setLink] = useState('');
  const [uploadData, setUploadData] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    const data = await loadMedia();
    setItems(data);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handlePickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await toDataUrl(file);
      setUploadData(dataUrl);
      setFileName(file.name);
    } catch {
      setUploadData('');
      setFileName('');
    }
  };

  const handleAddMedia = async () => {
    if (!title.trim() || !link.trim() || !uploadData) return;

    await createMedia({
      type: 'photo',
      category,
      title: title.trim(),
      src: uploadData,
      thumbnail: uploadData,
      link: link.trim(),
    });

    setTitle('');
    setCategory('community');
    setLink('');
    setUploadData('');
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    await fetchMedia();
  };

  const handleRemove = async (id: string) => {
    await deleteMedia(id);
    await fetchMedia();
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Media Management</h1>
          <p className="text-white/40 text-sm font-mono mt-1">Upload and manage event photos and videos</p>
        </div>
      </div>

      {/* Upload form */}
      <GlassCard animate={false} className="mb-8" glowColor="green">
        <h2 className="section-number mb-4">Add Media Item</h2>
        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="form-input" placeholder="Media title" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as MediaCategory)} className="form-input">
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-dark-card">{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Upload</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePickFile}
              className="form-input file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-2 file:py-1 file:text-white"
            />
            {fileName && <p className="text-[10px] text-white/35 mt-1 font-mono truncate">{fileName}</p>}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Social Link</label>
          <input value={link} onChange={e => setLink(e.target.value)} className="form-input" placeholder="https://instagram.com/..." />
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => void handleAddMedia()}
            className="btn-skew bg-g-green border border-g-green text-white text-xs font-mono uppercase tracking-widest px-5 py-2.5 hover:bg-g-green/80 transition-all flex items-center gap-2"
          >
            <span className="flex items-center gap-2"><Upload size={13} /> Add Media</span>
          </button>
        </div>
      </GlassCard>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className="relative group"
          >
            <div className="relative rounded-xl overflow-hidden border border-white/5 bg-dark-card">
              <Image src={item.thumbnail} alt={item.title} width={300} height={200} className="w-full object-cover h-36 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-dark-bg/0 group-hover:bg-dark-bg/60 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => void handleRemove(item.id)}
                  className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-white/70 hover:text-g-red"
                ><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="mt-1.5 px-1">
              <div className="text-xs text-white/60 truncate">{item.title}</div>
              <div className="text-[10px] text-white/25 font-mono">{item.category} · {item.date}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
