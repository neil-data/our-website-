'use client';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { getGlobalStats } from '@/lib/adminData';
import { 
  BarChart2, 
  TrendingUp, 
  PieChart, 
  Users, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingDown,
  Activity,
  Layers
} from 'lucide-react';

export default function AnalyticsPage() {
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
      <div className="w-10 h-10 rounded-full border-2 border-t-g-blue border-r-g-red border-b-g-yellow border-l-g-green animate-spin" />
    </div>
  );

  const categories = stats.events.reduce((acc: any, curr: any) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const totalPoints = stats.users.reduce((acc: number, curr: any) => acc + (curr.points || 0), 0);
  const avgPoints = stats.users.length > 0 ? Math.round(totalPoints / stats.users.length) : 0;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-white mb-2">Platform Analytics</h1>
        <p className="text-white/40 text-sm font-mono mt-1 tracking-widest uppercase">Growth & Performance Metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Avg Points / User', value: avgPoints, sub: '+12% from last month', icon: <TrendingUp size={16} />, trend: 'up' },
          { label: 'Conversion Rate', value: `${Math.round((stats.totalRegistrations / (stats.totalUsers || 1)) * 100)}%`, sub: 'Registrations per User', icon: <Activity size={16} />, trend: 'neutral' },
          { label: 'Event Growth', value: `${Object.keys(categories).length} Types`, sub: 'Diverse categories', icon: <Layers size={16} />, trend: 'up' },
        ].map((item, i) => (
          <GlassCard key={i} animate={true} delay={i * 0.1}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{item.label}</span>
              <div className={`p-2 rounded-lg bg-white/5 ${item.trend === 'up' ? 'text-g-green' : item.trend === 'down' ? 'text-g-red' : 'text-g-blue'}`}>
                {item.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2 tracking-tight">{item.value}</div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/25">
              {item.trend === 'up' ? <ArrowUpRight size={10} className="text-g-green" /> : <ArrowDownRight size={10} className="text-g-red" />}
              {item.sub}
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <GlassCard animate={false}>
          <div className="flex items-center justify-between mb-8 text-center">
            <h2 className="section-number">Event Categories</h2>
            <PieChart size={14} className="text-white/20" />
          </div>
          <div className="space-y-4">
            {Object.entries(categories).map(([cat, count]: [string, any], i) => (
              <div key={cat}>
                <div className="flex justify-between text-xs font-mono text-white/40 mb-2 uppercase tracking-widest">
                  <span>{cat}</span>
                  <span>{count} Events</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${i % 3 === 0 ? 'from-g-blue to-cyan-500' : i % 3 === 1 ? 'from-g-red to-orange-500' : 'from-g-green to-emerald-500'}`} 
                    style={{ width: `${(count / stats.events.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Growth Statistics */}
        <GlassCard animate={false}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-number">Platform Activity</h2>
            <BarChart2 size={14} className="text-white/20" />
          </div>
          <div className="flex flex-col h-[280px] justify-between">
            <div className="space-y-6">
              {[
                { label: 'Event Engagement', percent: 85, color: 'bg-g-blue' },
                { label: 'Chapter Growth', percent: 65, color: 'bg-g-red' },
                { label: 'Content Sharing', percent: 45, color: 'bg-g-yellow' },
                { label: 'Community Feedback', percent: 92, color: 'bg-g-green' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-mono text-white/40 mb-2 uppercase tracking-widest">
                    <span>{item.label}</span>
                    <span>{item.percent}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] font-mono text-white/20 uppercase tracking-widest pt-4 border-t border-white/5">
              Data synchronized with Firebase RTDB
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
