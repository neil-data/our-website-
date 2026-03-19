'use client';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { motion } from 'framer-motion';

export default function CommunityImpactSection({
  membersCount = 100,
  eventsCount = 2,
  workshopsCount = 1,
  prizeMoney = 10,
}: {
  membersCount?: number;
  eventsCount?: number;
  workshopsCount?: number;
  prizeMoney?: number;
}) {
  const counters = [
    { value: membersCount, suffix: '+', label: 'Community Members', color: 'blue' as const },
    { value: eventsCount, suffix: '+', label: 'Events Organized', color: 'green' as const },
    { value: workshopsCount, suffix: '+', label: 'Workshops & Bootcamps', color: 'yellow' as const },
    { value: prizeMoney, suffix: 'L+', prefix: '₹', label: 'Prize Money Award', color: 'red' as const },
  ];

  return (
    <section className="relative py-28 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number="02"
          eyebrow="Community Impact"
          title="Numbers That "
          highlight="Speak Loud"
          description="Our community has grown exponentially since 2023. Every workshop, hackathon, and study session adds to the story."
          center
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/5">
          {counters.map(({ value, suffix, prefix, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center py-8"
            >
              <AnimatedCounter
                value={value}
                suffix={suffix}
                prefix={prefix}
                label={label}
                color={color}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
