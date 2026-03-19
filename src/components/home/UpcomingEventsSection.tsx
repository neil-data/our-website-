'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Badge } from '@/components/ui/Badge';
import { Event } from '@/types';
import { getCategoryColor, getStatusColor, formatDateShort } from '@/lib/utils';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

export default function UpcomingEventsSection({ events }: { events: Event[] }) {
  const upcomingEvents = events.filter(e => e.status !== 'completed').slice(0, 4);

  return (
    <section className="relative py-28 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <SectionTitle
            number="03"
            eyebrow="Upcoming Events"
            title="What's "
            highlight="Happening Next"
            description="Hackathons, workshops, bootcamps and talks — there's always something to build."
            className="mb-0"
          />
          <Link
            href="/events"
            className="hidden md:flex items-center gap-2 text-g-blue text-xs font-mono uppercase tracking-widest hover:gap-3 transition-all"
          >
            View All <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/events/${event.id}`} className="group block">
                <div className="glass-card rounded-xl overflow-hidden hover:border-g-blue/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-glow h-full flex flex-col">
                  {/* Banner */}
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={event.banner}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant={getCategoryColor(event.category)}>
                        {event.category}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant={getStatusColor(event.status)}>
                        {event.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-sm text-white leading-snug mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-white/40 text-xs leading-relaxed mb-3 line-clamp-2">
                      {event.shortDesc}
                    </p>
                    <div className="mt-auto space-y-1.5">
                      <div className="flex items-center gap-2 text-white/35 text-xs font-mono">
                        <Calendar size={11} />
                        <span>{formatDateShort(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/35 text-xs font-mono">
                        <MapPin size={11} />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/35 text-xs font-mono">
                        <Users size={11} />
                        <span>{event.registered}/{event.capacity} registered</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-g-blue text-xs font-mono uppercase tracking-widest"
          >
            View All Events <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
