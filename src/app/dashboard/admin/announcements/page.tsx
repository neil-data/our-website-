'use client';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Plus, Pin, Trash2, Bell } from 'lucide-react';
import { loadAnnouncements, createAnnouncement, deleteAnnouncement } from '@/lib/adminData';
import { Announcement } from '@/types';

const TYPE_COLORS: Record<string, string> = {
  general: 'text-white/60 border-white/15 bg-white/5',
  event: 'text-g-blue border-g-blue/30 bg-g-blue/10',
  urgent: 'text-g-red border-g-red/30 bg-g-red/10',
  achievement: 'text-g-yellow border-g-yellow/30 bg-g-yellow/10',
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [compose, setCompose] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState('general');

  const fetchAnnouncements = async () => {
    const data = await loadAnnouncements();
    setAnnouncements(data);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const post = async () => {
    if (!newTitle || !newContent) return;
    await createAnnouncement({
      title: newTitle,
      content: newContent,
      type: newType as 'general',
      author: 'Admin',
      pinned: false,
    });
    setNewTitle(''); setNewContent(''); setCompose(false);
    await fetchAnnouncements();
  };

  const remove = async (id: string) => {
    await deleteAnnouncement(id);
    await fetchAnnouncements();
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Announcements</h1>
          <p className="text-white/40 text-sm font-mono mt-1">Post and manage community announcements</p>
        </div>
        <button
          onClick={() => setCompose(!compose)}
          className="btn-skew bg-g-blue border border-g-blue text-white text-xs font-mono uppercase tracking-widest px-5 py-2.5 hover:bg-g-blue/80 transition-all flex items-center gap-2"
        >
          <span className="flex items-center gap-2"><Plus size={13} /> New Post</span>
        </button>
      </div>

      {/* Compose */}
      {compose && (
        <GlassCard animate={false} className="mb-6" glowColor="blue">
          <h2 className="section-number mb-4">Compose Announcement</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Title</label>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} className="form-input" placeholder="Announcement title..." />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Type</label>
                <select value={newType} onChange={e => setNewType(e.target.value)} className="form-input">
                  <option value="general" className="bg-dark-card">General</option>
                  <option value="event" className="bg-dark-card">Event</option>
                  <option value="urgent" className="bg-dark-card">Urgent</option>
                  <option value="achievement" className="bg-dark-card">Achievement</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Content</label>
              <textarea value={newContent} onChange={e => setNewContent(e.target.value)} className="form-input resize-none" rows={4} placeholder="Write your announcement..." />
            </div>
            <div className="flex gap-3">
              <button onClick={post} className="btn-skew bg-g-blue border border-g-blue text-white text-xs font-mono uppercase tracking-widest px-6 py-2.5 hover:bg-g-blue/80 transition-all">
                <span>Post Announcement</span>
              </button>
              <button onClick={() => setCompose(false)} className="btn-skew bg-transparent border border-white/15 text-white/60 text-xs font-mono uppercase tracking-widest px-6 py-2.5 hover:border-white/30 transition-all">
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* List */}
      <div className="space-y-3">
        {announcements.map((ann, i) => (
          <GlassCard key={ann.id} delay={i * 0.05} className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bell size={14} className="text-white/40" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {ann.pinned && <Pin size={12} className="text-g-yellow" />}
                <span className="font-semibold text-white text-sm">{ann.title}</span>
                <span className={`badge border text-[10px] ${TYPE_COLORS[ann.type]}`}>{ann.type}</span>
              </div>
              <p className="text-white/40 text-xs leading-relaxed mb-2 line-clamp-2">{ann.content}</p>
              <div className="text-[10px] text-white/25 font-mono">{ann.createdAt} · by {ann.author}</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => remove(ann.id)}
                className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-red hover:border-g-red/30 transition-colors"
              ><Trash2 size={12} /></button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
