'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GlassCard } from '@/components/ui/GlassCard';
import { mockTeam } from '@/data/team';
import { AdminRole } from '@/types';
import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';

type TeamCategory = AdminRole | 'all';

const CATEGORIES: { key: TeamCategory; label: string; color: string }[] = [
  { key: 'all', label: 'All Members', color: 'gray-300' },
  { key: 'leader', label: 'Leadership', color: 'g-red' },
  { key: 'tech', label: 'Tech Team', color: 'g-blue' },
  { key: 'marketing', label: 'Marketing', color: 'g-yellow' },
  { key: 'documentation', label: 'Docs', color: 'g-green' },
  { key: 'operations', label: 'Operations', color: 'purple-400' },
  { key: 'outreach', label: 'Outreach', color: 'cyan-400' },
];

const COLOR_MAP: Record<string, string> = {
  'gray-300': 'border-gray-500/30 text-gray-300',
  'g-red': 'border-g-red/30 text-g-red',
  'g-blue': 'border-g-blue/30 text-g-blue',
  'g-yellow': 'border-g-yellow/30 text-g-yellow',
  'g-green': 'border-g-green/30 text-g-green',
  'purple-400': 'border-purple-400/30 text-purple-400',
  'cyan-400': 'border-cyan-400/30 text-cyan-400',
};

export default function TeamPage() {
  const [active, setActive] = useState<TeamCategory>('all');

  const activeCategory = CATEGORIES.find(c => c.key === active)!;
  const members = active === 'all' 
    ? mockTeam 
    : mockTeam.filter(m => m.team === active);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="bg-number">TEAM</div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="section-number mb-4">01 — The People</div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight leading-none mb-4">
            Meet the <span className="google-gradient-text">Team</span>
          </h1>
          <p className="text-white/45 text-lg max-w-xl">
            The dedicated students and faculty who make GDGOC IAR a thriving developer community.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-6 border-b border-white/5 sticky top-16 bg-dark-bg/90 backdrop-blur-xl z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActive(cat.key)}
                className={`text-xs font-mono uppercase tracking-widest px-4 py-2 rounded border transition-all ${
                  active === cat.key
                    ? `${COLOR_MAP[cat.color]} bg-white/5`
                    : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {members.map((member, i) => (
                <GlassCard
                  key={member.id}
                  delay={i * 0.08}
                  className="text-center group"
                  glowColor={
                    active === 'leader' ? 'red' :
                    active === 'tech' ? 'blue' :
                    active === 'marketing' ? 'yellow' : 'green'
                  }
                >
                  {/* Avatar */}
                  <div className={`relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 transition-colors ${COLOR_MAP[activeCategory.color]}`}>
                    <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                  </div>

                  <div className="font-semibold text-white text-sm mb-0.5">{member.name}</div>
                  <div className={`text-xs font-mono uppercase tracking-widest mb-3 ${COLOR_MAP[activeCategory.color].split(' ')[1]}`}>
                    {member.role}
                  </div>
                  <p className="text-white/35 text-xs leading-relaxed mb-4 line-clamp-3">{member.bio}</p>

                  {/* Socials */}
                  <div className="flex justify-center gap-3">
                    {member.socials.linkedin && (
                      <a href={member.socials.linkedin} className="text-white/25 hover:text-g-blue transition-colors" aria-label="LinkedIn">
                        <Linkedin size={14} />
                      </a>
                    )}
                    {member.socials.github && (
                      <a href={member.socials.github} className="text-white/25 hover:text-white transition-colors" aria-label="GitHub">
                        <Github size={14} />
                      </a>
                    )}
                    {member.socials.twitter && (
                      <a href={member.socials.twitter} className="text-white/25 hover:text-g-blue transition-colors" aria-label="Twitter">
                        <Twitter size={14} />
                      </a>
                    )}
                    {member.socials.instagram && (
                      <a href={member.socials.instagram} className="text-white/25 hover:text-g-red transition-colors" aria-label="Instagram">
                        <Instagram size={14} />
                      </a>
                    )}
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
