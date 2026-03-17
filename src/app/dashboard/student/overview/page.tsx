'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { mockAnnouncements } from '@/data/media';
import { Trophy, Calendar, Star, Bell } from 'lucide-react';

interface StudentSession {
  name: string;
  email: string;
  iarNo?: string;
  department?: string;
  year?: string;
  phone?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
}

export default function StudentOverviewPage() {
  const [session, setSession] = useState<StudentSession | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('gdgoc-student-session');
    if (raw) setSession(JSON.parse(raw));
  }, []);

  const name = session?.name || 'Student';
  const email = session?.email || '';
  const avatarSeed = encodeURIComponent(name.replace(/\s+/g, ''));
  const avatar = `https://api.dicebear.com/7.x/avataaars/png?seed=${avatarSeed}`;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-white/40 text-sm font-mono mt-1">Welcome back, {name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <GlassCard animate={false} className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-g-blue/30">
              <Image src={avatar} alt={name} fill className="object-cover" />
            </div>
            <div className="font-semibold text-white mb-0.5">{name}</div>
            <div className="text-white/35 text-xs font-mono mb-3">{email}</div>
            <Badge variant="blue" className="mb-4">Member</Badge>
            <div className="separator-line my-4" />
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-g-blue font-bold text-lg">0</div>
                <div className="text-white/30 text-[10px] font-mono uppercase">Points</div>
              </div>
              <div>
                <div className="text-g-green font-bold text-lg">—</div>
                <div className="text-white/30 text-[10px] font-mono uppercase">Rank</div>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/dashboard/student/profile" className="text-xs font-mono text-g-blue hover:text-white transition-colors uppercase tracking-widest">
                Edit Profile →
              </Link>
            </div>
          </GlassCard>
        </div>

        {/* Right column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <Calendar size={18} className="text-g-blue" />, value: '0', label: 'Events Attended', color: 'text-g-blue' },
              { icon: <Trophy size={18} className="text-g-yellow" />, value: '—', label: 'Leaderboard Rank', color: 'text-g-yellow' },
              { icon: <Star size={18} className="text-g-green" />, value: '0', label: 'Total Points', color: 'text-g-green' },
            ].map(({ icon, value, label, color }, i) => (
              <GlassCard key={i} animate={false} className="text-center p-4">
                <div className="flex justify-center mb-2">{icon}</div>
                <div className={`font-bold text-xl ${color}`}>{value}</div>
                <div className="text-white/30 text-[10px] font-mono uppercase mt-0.5">{label}</div>
              </GlassCard>
            ))}
          </div>

          {/* My Events */}
          <GlassCard animate={false}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-number">My Events</h2>
              <Link href="/dashboard/student/my-events" className="text-xs font-mono text-g-blue hover:text-white transition-colors">View All</Link>
            </div>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Calendar size={28} className="text-white/10 mb-3" />
              <p className="text-white/30 text-sm font-mono">You haven&apos;t registered for any events yet.</p>
              <Link href="/events" className="text-xs font-mono text-g-blue hover:text-white transition-colors mt-3 uppercase tracking-widest">
                Browse Events →
              </Link>
            </div>
          </GlassCard>

          {/* Announcements */}
          <GlassCard animate={false}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-number flex items-center gap-2"><Bell size={13} /> Announcements</h2>
            </div>
            <div className="space-y-3">
              {mockAnnouncements.slice(0, 3).map(ann => (
                <div key={ann.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-start gap-2">
                    {ann.pinned && <div className="w-1.5 h-1.5 rounded-full bg-g-yellow mt-1.5 flex-shrink-0" />}
                    <div>
                      <div className="text-sm text-white font-medium mb-0.5">{ann.title}</div>
                      <div className="text-xs text-white/35 leading-relaxed line-clamp-1">{ann.content}</div>
                      <div className="text-[10px] text-white/25 font-mono mt-1.5">{ann.createdAt} · {ann.author}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
