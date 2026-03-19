'use client';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Announcement } from '@/types';
import { loadAnnouncements } from '@/lib/adminData';
import { Bell, Pin, Clock, User, Info, AlertTriangle, Trophy } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements().then(items => {
      setAnnouncements(items);
      setLoading(false);
    });
  }, []);

  const getTypeIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'urgent': return <AlertTriangle size={16} className="text-g-red" />;
      case 'achievement': return <Trophy size={16} className="text-g-yellow" />;
      case 'event': return <Bell size={16} className="text-g-blue" />;
      default: return <Info size={16} className="text-g-green" />;
    }
  };

  const getTypeColor = (type: Announcement['type']) => {
    switch (type) {
      case 'urgent': return 'border-g-red/30 text-g-red';
      case 'achievement': return 'border-g-yellow/30 text-g-yellow';
      case 'event': return 'border-g-blue/30 text-g-blue';
      default: return 'border-g-green/30 text-g-green';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-white mb-2">Announcements</h1>
        <p className="text-white/40 text-sm font-mono">Stay updated with the latest news, events, and achievements from GDGOC IAR.</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 w-full glass-card animate-pulse rounded-xl" />
          ))}
        </div>
      ) : announcements.length > 0 ? (
        <div className="grid gap-6">
          {announcements.map((ann, i) => (
            <GlassCard 
              key={ann.id} 
              animate={true} 
              delay={i * 0.1}
              className={`relative overflow-hidden ${ann.pinned ? 'border-g-yellow/20 bg-g-yellow/5' : ''}`}
            >
              {ann.pinned && (
                <div className="absolute top-0 right-0 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-g-yellow uppercase tracking-widest">
                    <Pin size={10} fill="currentColor" /> Pinned
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={`mt-1 p-2 rounded-lg bg-white/5 border ${getTypeColor(ann.type)}`}>
                  {getTypeIcon(ann.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-bold text-white">{ann.title}</h2>
                    <Badge variant={ann.type === 'urgent' ? 'red' : ann.type === 'achievement' ? 'yellow' : 'blue'}>
                      {ann.type}
                    </Badge>
                  </div>
                  
                  <p className="text-white/60 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                    {ann.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <User size={12} /> {ann.author}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} /> {new Date(ann.createdAt).toLocaleDateString()} at {new Date(ann.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card rounded-2xl border-dashed border-white/10">
          <Bell size={48} className="mx-auto text-white/10 mb-4" />
          <h3 className="text-white font-medium mb-1">No announcements yet</h3>
          <p className="text-white/30 text-sm font-mono">Check back later for updates!</p>
        </div>
      )}
    </div>
  );
}
