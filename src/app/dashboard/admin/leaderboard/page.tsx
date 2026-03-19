'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { loadUsers, adjustUserPoints, StudentUser } from '@/lib/adminData';
import { getBadgeColor } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Plus, Minus, Trophy } from 'lucide-react';

export default function AdminLeaderboardPage() {
  const [entries, setEntries] = useState<StudentUser[]>([]);

  const fetchData = async () => {
    const users = await loadUsers();
    setEntries(users.sort((a, b) => b.points - a.points));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdjustPoints = async (userId: string, delta: number) => {
    await adjustUserPoints(userId, delta);
    await fetchData();
  };
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-white">Leaderboard Management</h1>
        <p className="text-white/40 text-sm font-mono mt-1">View rankings and adjust community points</p>
      </div>

      <GlassCard animate={false}>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="text-left">Rank</th>
                <th className="text-left">Member</th>
                <th className="text-left hidden md:table-cell">Badge</th>
                <th className="text-left hidden sm:table-cell">Events</th>
                <th className="text-right">Points</th>
                <th className="text-right">Adjust</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <motion.tr key={entry.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                  <td>
                    <div className="flex items-center gap-1">
                      {i + 1 <= 3 && <Trophy size={12} className={i + 1 === 1 ? 'text-g-yellow' : i + 1 === 2 ? 'text-[#9aa0a6]' : 'text-g-red'} />}
                      <span className="font-mono text-xs text-white/40">#{i + 1}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                        <Image src={`https://api.dicebear.com/7.x/avataaars/png?seed=${entry.name.replace(/ /g, '')}`} alt={entry.name} fill className="object-cover" />
                      </div>
                      <span className="text-sm text-white font-medium">{entry.name}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <Badge variant={getBadgeColor(entry.points > 300 ? 'influencer' : entry.points > 100 ? 'core-team' : 'contributor')} className="capitalize text-[10px]">
                      {entry.points > 300 ? 'Influencer' : entry.points > 100 ? 'Core Team' : 'Contributor'}
                    </Badge>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="text-white/60 text-sm">{(entry.points / 25).toFixed(0)}</span>
                  </td>
                  <td className="text-right">
                    <span className="text-g-blue font-bold font-mono">{entry.points.toLocaleString()}</span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => void handleAdjustPoints(entry.id, -50)}
                        className="w-6 h-6 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-red hover:border-g-red/30 transition-colors"
                      ><Minus size={10} /></button>
                      <span className="text-[10px] text-white/20 font-mono w-8 text-center">±50</span>
                      <button
                        onClick={() => void handleAdjustPoints(entry.id, 50)}
                        className="w-6 h-6 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-green hover:border-g-green/30 transition-colors"
                      ><Plus size={10} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
