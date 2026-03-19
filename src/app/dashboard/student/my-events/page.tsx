import Image from 'next/image';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { getEventsWithRegistrationCounts } from '@/lib/adminData';
import { getCategoryColor, getStatusColor, formatDateShort } from '@/lib/utils';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default async function StudentMyEventsPage() {
  const events = await getEventsWithRegistrationCounts();
  const upcomingEvents = events.filter(e => e.status !== 'completed').slice(0, 6);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-white">My Events</h1>
        <p className="text-white/40 text-sm font-mono mt-1">Events you&apos;ve registered for and upcoming opportunities</p>
      </div>

      <div className="space-y-8">
        {/* Registered events */}
        <div>
          <h2 className="section-number mb-4">Registered Events</h2>
          <div className="flex flex-col items-center justify-center py-12 text-center glass-card rounded-xl border border-white/5">
            <Calendar size={28} className="text-white/10 mb-3" />
            <p className="text-white/30 text-sm font-mono">You haven&apos;t registered for any events yet.</p>
            <p className="text-white/20 text-xs font-mono mt-1">Browse upcoming events below to get started.</p>
          </div>
        </div>

        {/* More upcoming */}
        <div>
          <h2 className="section-number mb-4">Upcoming Events</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {upcomingEvents.map((event, i) => (
              <GlassCard key={event.id} delay={i * 0.07} className="flex gap-3 py-3 px-4">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={event.banner} alt={event.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1 mb-1">
                    <Badge variant={getCategoryColor(event.category)} className="text-[10px] py-0">{event.category}</Badge>
                    <Badge variant={getStatusColor(event.status)} className="text-[10px] py-0">{event.status.replace('-', ' ')}</Badge>
                  </div>
                  <div className="text-sm font-medium text-white truncate mb-0.5">{event.title}</div>
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono text-white/35">
                    <span className="flex items-center gap-0.5"><Calendar size={9} />{formatDateShort(event.date)}</span>
                    <span className="flex items-center gap-0.5"><Clock size={9} />{event.time}</span>
                    <span className="flex items-center gap-0.5"><MapPin size={9} />{event.location}</span>
                  </div>
                </div>
                <Link href={`/events/${event.id}`} className="text-xs font-mono text-g-blue hover:text-white self-center flex-shrink-0">Details →</Link>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
