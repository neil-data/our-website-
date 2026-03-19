'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { TeamMember } from '@/types';
import { loadTeamMembers } from '@/lib/adminData';
import { Github, Linkedin, Twitter, ArrowRight } from 'lucide-react';

export default function TeamPreviewSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    loadTeamMembers().then(setTeam);
  }, []);

  const leaders = useMemo(() => team.filter(m => m.team === 'leader').slice(0, 3), [team]);

  return (
    <section className="relative py-28 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <SectionTitle
            number="06"
            eyebrow="Leadership"
            title="The People "
            highlight="Behind It All"
            description="Meet the dedicated leaders steering GDGOC IAR's vision and growth."
            className="mb-0"
          />
          <Link
            href="/team"
            className="hidden md:flex items-center gap-2 text-g-red text-xs font-mono uppercase tracking-widest hover:gap-3 transition-all"
          >
            Full Team <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {leaders.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="glass-card rounded-xl p-6 text-center hover:border-g-red/30 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-g-red/30 group-hover:border-g-red/60 transition-colors">
                <Image src={member.avatar} alt={member.name} fill className="object-cover" />
              </div>
              <div className="font-semibold text-white mb-1">{member.name}</div>
              <div className="text-g-red text-xs font-mono uppercase tracking-widest mb-3">{member.role}</div>
              <p className="text-white/35 text-xs leading-relaxed mb-4 line-clamp-2">{member.bio}</p>
              <div className="flex justify-center gap-3">
                {member.socials.linkedin && (
                  <a href={member.socials.linkedin} className="text-white/25 hover:text-g-blue transition-colors"><Linkedin size={14} /></a>
                )}
                {member.socials.github && (
                  <a href={member.socials.github} className="text-white/25 hover:text-white transition-colors"><Github size={14} /></a>
                )}
                {member.socials.twitter && (
                  <a href={member.socials.twitter} className="text-white/25 hover:text-g-blue transition-colors"><Twitter size={14} /></a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
