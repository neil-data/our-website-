'use client';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { getGlobalStats } from '@/lib/adminData';
import { Users, Calendar, Inbox, Trophy, ArrowRight, UserPlus, FileText, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGlobalStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 rounded-full border-2 border-t-g-blue border-r-g-red border-b-g-yellow border-l-g-green animate-spin" />
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/40 text-sm font-mono tracking-wide uppercase">GDGOC IAR • Overview & Insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { icon: <Users className="text-g-blue" size={20} />, label: 'Total Members', value: stats.totalUsers, color: 'border-g-blue/30' },
          { icon: <Calendar className="text-g-red" size={20} />, label: 'Active Events', value: stats.activeEvents, color: 'border-g-red/30' },
          { icon: <FileText className="text-g-yellow" size={20} />, label: 'Registrations', value: stats.totalRegistrations, color: 'border-g-yellow/30' },
          { icon: <Inbox className="text-g-green" size={20} />, label: 'Open Queries', value: stats.openQueries, color: 'border-g-green/30' },
        ].map((item, i) => (
          <GlassCard key={i} animate={true} delay={i * 0.1} className={`p-6 ${item.color}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/5">{item.icon}</div>
              <Activity size={14} className="text-white/10" />
            </div>
            <div className="text-3xl font-bold text-white mb-1 tracking-tight">{item.value}</div>
            <div className="text-[10px] font-mono uppercase text-white/30 tracking-widest">{item.label}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Events */}
        <div className="lg:col-span-2">
          <GlassCard animate={false} className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-number">Recent Events</h2>
              <Link href="/dashboard/admin/events" className="text-xs font-mono text-g-blue hover:text-white transition-colors">Manage All</Link>
            </div>
            <div className="space-y-4">
              {stats.events.slice(0, 4).map((event: any) => (
                <div key={event.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-xs font-mono text-white/20 text-center leading-none">
                      <div className="mb-1">{new Date(event.date).toLocaleString('en-US', { month: 'short' }).toUpperCase()}</div>
                      <div className="text-lg font-bold text-white/60">{new Date(event.date).getDate()}</div>
                    </div>
                    <div className="w-[1px] h-8 bg-white/5" />
                    <div>
                      <div className="text-sm font-medium text-white">{event.title}</div>
                      <div className="text-[10px] text-white/25 font-mono uppercase mt-0.5">{event.category} • {event.time}</div>
                    </div>
                  </div>
                  <Badge variant={event.status === 'upcoming' ? 'blue' : 'gray'}>{event.status}</Badge>
                </div>
              ))}
              {stats.events.length === 0 && <p className="text-center py-10 text-white/20 text-sm font-mono italic">No events found.</p>}
            </div>
          </GlassCard>
        </div>

        {/* Recent Members */}
        <div>
          <GlassCard animate={false} className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-number">New Members</h2>
              <Link href="/dashboard/admin/users" className="text-xs font-mono text-g-blue hover:text-white transition-colors">View All</Link>
            </div>
            <div className="space-y-4">
              {stats.users.slice(0, 5).map((user: any) => (
                <div key={user.id} className="flex items-center gap-3 p-2 group">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                    <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/png?seed=${user.id}`} alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate group-hover:text-g-blue transition-colors">{user.name}</div>
                    <div className="text-[10px] text-white/25 font-mono truncate">{user.email}</div>
                  </div>
                  <Trophy size={14} className="text-g-yellow/40 group-hover:text-g-yellow transition-colors" />
                </div>
              ))}
              {stats.users.length === 0 && <p className="text-center py-10 text-white/20 text-sm font-mono italic">No members yet.</p>}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
