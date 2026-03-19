'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Badge } from '@/components/ui/Badge';
import { GlassCard } from '@/components/ui/GlassCard';
import { loadUsers, StudentUser } from '@/lib/adminData';
import { getBadgeColor } from '@/lib/utils';
import { Trophy, Star, Users, Zap, Search } from 'lucide-react';

const podiumOrder = [1, 0, 2]; // Silver, Gold, Bronze visual order for podium

export default function LeaderboardPage() {
  const [users, setUsers] = useState<StudentUser[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const fetchedUsers = await loadUsers();
      if (mounted) {
        setUsers(fetchedUsers.sort((a, b) => b.points - a.points));
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Filter based on tab and search
  const filteredLeaderboard = users.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const dept = e.department || 'General';
    const matchesTab = activeTab === 'All' || dept === activeTab;
    return matchesSearch && matchesTab;
  });

  const top3 = filteredLeaderboard.slice(0, 3).map((e, index) => ({
    ...e,
    rank: index + 1,
    avatar: `https://api.dicebear.com/7.x/avataaars/png?seed=${e.name.replace(/ /g, '')}`
  }));
  const rest = filteredLeaderboard.slice(3);

  const COLORS = ['#FBBC05', '#9aa0a6', '#EA4335'];
  const PODIUM_HEIGHTS = ['h-32', 'h-24', 'h-16'];

  const teams = ['All', 'Leaders', 'Tech', 'Marketing', 'Design', 'Operations', 'Docs', 'Outreach', 'Student'];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="bg-number">RANK</div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="section-number mb-4">01 — Community Rankings</div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight leading-none mb-4">
            Community <span className="google-gradient-text">Leaderboard</span>
          </h1>
          <p className="text-white/45 text-lg max-w-xl">
            Earn points by attending events, contributing to projects, and growing the community. Rise through the ranks.
          </p>

          {/* Point methods */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { icon: <Zap size={11} />, label: 'Attending Events: +50 pts', color: 'text-g-blue' },
              { icon: <Star size={11} />, label: 'Speaking: +200 pts', color: 'text-g-yellow' },
              { icon: <Users size={11} />, label: 'Organizing: +150 pts', color: 'text-g-green' },
              { icon: <Trophy size={11} />, label: 'Winning Hackathon: +500 pts', color: 'text-g-red' },
            ].map(({ icon, label, color }) => (
              <div key={label} className={`flex items-center gap-1.5 text-xs font-mono ${color} bg-white/5 border border-white/10 px-3 py-1.5 rounded`}>
                {icon} {label}
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-8">
            {teams.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
                  activeTab === t
                    ? 'bg-g-blue text-white shadow-[0_0_15px_rgba(66,133,244,0.3)]'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Podium */}
      {top3.length > 0 && (
        <section className="py-16 border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-end justify-center gap-4">
              {podiumOrder.map((index) => {
                const entry = top3[index];
                if (!entry) return null;
                const isGold = index === 0;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  {/* Avatar + crown for #1 */}
                  <div className="relative mb-3">
                    {isGold && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl">👑</div>
                    )}
                    <div
                      className="w-16 h-16 rounded-full overflow-hidden relative border-2"
                      style={{ borderColor: COLORS[index] }}
                    >
                      <Image src={entry.avatar} alt={entry.name} fill className="object-cover" />
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono text-black"
                      style={{ backgroundColor: COLORS[index] }}
                    >
                      {entry.rank}
                    </div>
                  </div>
                  <div className="text-white text-sm font-semibold mb-0.5 text-center">{entry.name}</div>
                  <div className="text-white/35 text-xs font-mono mb-2">{entry.points.toLocaleString()} pts</div>
                  {/* Podium block */}
                  <div
                    className={`w-28 ${PODIUM_HEIGHTS[index]} rounded-t-lg flex items-center justify-center text-sm font-bold font-mono`}
                    style={{ backgroundColor: `${COLORS[index]}18`, borderTop: `3px solid ${COLORS[index]}` }}
                  >
                    <span style={{ color: COLORS[index] }}>#{entry.rank}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Table */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="section-number">All Rankings</h2>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search team members..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-input pl-9 py-2 text-xs w-full sm:w-[220px]"
              />
            </div>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Rank</th>
                  <th className="text-left">Member</th>
                  <th className="text-left hidden md:table-cell">Team</th>
                  <th className="text-left hidden sm:table-cell">Events</th>
                  <th className="text-left hidden md:table-cell">Badge</th>
                  <th className="text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaderboard.slice(3).map((entry, i) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td>
                      <span className="text-white/40 font-mono text-xs">#{i + 4}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                          <Image src={`https://api.dicebear.com/7.x/avataaars/png?seed=${entry.name.replace(/ /g, '')}`} alt={entry.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="text-sm text-white font-medium">{entry.name}</div>
                          <div className="text-xs text-white/30 font-mono hidden sm:block">{(entry.points / 25).toFixed(0)} events</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell">
                      <span className="text-white/40 text-xs font-mono">{entry.department || 'General'}</span>
                    </td>
                    <td className="hidden sm:table-cell">
                      <span className="text-white/70 text-sm">{(entry.points / 25).toFixed(0)}</span>
                    </td>
                    <td className="hidden md:table-cell">
                      <Badge variant={getBadgeColor(entry.points > 300 ? 'influencer' : entry.points > 100 ? 'core-team' : 'contributor')} className="capitalize text-[10px]">
                        {entry.points > 300 ? 'Influencer' : entry.points > 100 ? 'Core Team' : 'Contributor'}
                      </Badge>
                    </td>
                    <td className="text-right">
                      <span className="text-g-blue font-bold font-mono text-sm">{entry.points.toLocaleString()}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
