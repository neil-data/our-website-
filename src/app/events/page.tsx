'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { getEventsWithRegistrationCounts } from '@/lib/adminData';
import { getCategoryColor, getStatusColor, formatDateShort } from '@/lib/utils';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';
import { Event } from '@/types';

const CATEGORIES = ['all', 'hackathon', 'workshop', 'talk', 'bootcamp', 'community', 'webinar'];
const STATUSES = ['all', 'upcoming', 'live', 'registration-open', 'completed'];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    setEvents(getEventsWithRegistrationCounts());
  }, []);

  const filtered = events.filter((e: Event) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.shortDesc.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || e.category === category;
    const matchStatus = status === 'all' || e.status === status;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="bg-number">EVENTS</div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="section-number mb-4">01 — Event Platform</div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight leading-none mb-4">
            Events & <span className="google-gradient-text">Programs</span>
          </h1>
          <p className="text-white/45 text-lg max-w-xl">
            Hackathons, workshops, bootcamps, and more. Find your next learning adventure.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-white/5 sticky top-16 bg-dark-bg/90 backdrop-blur-xl z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-input pl-9 py-2"
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded border transition-all ${
                    category === cat
                      ? 'bg-g-blue/20 border-g-blue/40 text-g-blue'
                      : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-white/30" />
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="form-input py-2 text-xs pr-8 max-w-[160px]"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s} className="bg-dark-card">{s.replace('-', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Event Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-white/30">
              <div className="text-4xl mb-4">🔍</div>
              <div className="font-mono text-sm uppercase tracking-widest">No events found</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/events/${event.id}`} className="group block h-full">
                    <div className="glass-card rounded-xl overflow-hidden hover:border-g-blue/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-glow h-full flex flex-col">
                      {/* Banner */}
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={event.banner}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-card/90 via-dark-card/20 to-transparent" />
                        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                          <Badge variant={getCategoryColor(event.category)}>{event.category}</Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge variant={getStatusColor(event.status)}>{event.status.replace('-', ' ')}</Badge>
                        </div>
                        {/* Registration bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                          <div
                            className="h-full bg-g-blue transition-all"
                            style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-semibold text-sm text-white leading-snug mb-2 line-clamp-2 group-hover:text-g-blue transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-white/40 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">{event.shortDesc}</p>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-white/35 text-xs font-mono">
                            <Calendar size={11} className="text-g-blue/60" />{formatDateShort(event.date)}
                            {event.endDate && ` – ${formatDateShort(event.endDate)}`}
                          </div>
                          <div className="flex items-center gap-2 text-white/35 text-xs font-mono">
                            <MapPin size={11} className="text-g-red/60" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-mono mt-3 pt-3 border-t border-white/5">
                            <div className="flex items-center gap-1.5 text-white/35">
                              <Users size={11} />
                              <span>{event.registered}/{event.capacity}</span>
                            </div>
                            <span className="text-g-blue hover:text-white transition-colors uppercase tracking-widest text-[10px]">
                              View Details →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
