'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Badge } from '@/components/ui/Badge';
import { StudentUser } from '@/lib/adminData';
import { getBadgeColor } from '@/lib/utils';
import { Trophy, ArrowRight, Star } from 'lucide-react';

const RANK_COLORS = ['#FBBC05', '#9aa0a6', '#EA4335', '#4285F4', '#34A853'];
const RANK_LABELS = ['1st', '2nd', '3rd', '4th', '5th'];

export default function LeaderboardPreviewSection({ users = [] }: { users?: StudentUser[] }) {
  const topFive = [...users].sort((a, b) => b.points - a.points).slice(0, 5);
  return (
    <section className="relative py-28 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <SectionTitle
            number="04"
            eyebrow="Community Leaderboard"
            title="Top "
            highlight="Contributors"
            description="Earn points by attending events, contributing to projects, and helping the community grow."
            className="mb-0"
          />
          <Link
            href="/leaderboard"
            className="hidden md:flex items-center gap-2 text-g-yellow text-xs font-mono uppercase tracking-widest hover:gap-3 transition-all"
          >
            Full Rankings <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-2">
          {topFive.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-xl px-5 py-4 flex items-center gap-4 hover:border-g-yellow/20 transition-all duration-300 group"
            >
              {/* Rank */}
              <div
                className="w-8 h-8 rounded flex items-center justify-center text-xs font-mono font-bold flex-shrink-0"
                style={{ background: `${RANK_COLORS[i]}20`, color: RANK_COLORS[i] }}
              >
                {i === 0 ? <Trophy size={14} /> : RANK_LABELS[i]}
              </div>

              {/* Avatar */}
              <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                <Image src={`https://api.dicebear.com/7.x/avataaars/png?seed=${entry.name.replace(/ /g, '')}`} alt={entry.name} fill className="object-cover" />
              </div>

              {/* Name + team */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white leading-tight">{entry.name}</div>
                <div className="text-xs text-white/35 font-mono">{entry.department || 'General'} Dept</div>
              </div>

              {/* Badge */}
              <Badge variant={getBadgeColor(entry.points > 300 ? 'influencer' : entry.points > 100 ? 'core-team' : 'contributor')} className="hidden sm:inline-flex capitalize">
                {entry.points > 300 ? 'Influencer' : entry.points > 100 ? 'Core Team' : 'Contributor'}
              </Badge>

              {/* Stats */}
              <div className="hidden md:flex items-center gap-6 text-right">
                <div>
                  <div className="text-xs text-white/30 font-mono uppercase">Events</div>
                  <div className="text-sm font-semibold text-white">{(entry.points / 25).toFixed(0)}</div>
                </div>
                <div>
                  <div className="text-xs text-white/30 font-mono uppercase">Pts</div>
                  <div className="text-sm font-bold" style={{ color: RANK_COLORS[i] }}>
                    {entry.points.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Mobile points */}
              <div className="md:hidden ml-auto flex items-center gap-1 text-sm font-bold" style={{ color: RANK_COLORS[i] }}>
                <Star size={12} />
                {entry.points.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 text-g-yellow text-xs font-mono uppercase tracking-widest hover:gap-3 transition-all"
          >
            See Full Leaderboard <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
