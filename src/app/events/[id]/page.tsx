'use client';
import { useState } from 'react';
import { useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getEventsWithRegistrationCounts } from '@/lib/adminData';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import RegistrationModal from '@/components/RegistrationModal';
import { getCategoryColor, getStatusColor, formatDate } from '@/lib/utils';
import { Calendar, MapPin, Users, Clock, ChevronDown, ArrowLeft, ExternalLink } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Event } from '@/types';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-white">{question}</span>
        <ChevronDown size={16} className={`text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-white/45 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const scheduleColors: Record<string, string> = {
  talk: 'bg-g-blue/10 border-g-blue/30 text-g-blue',
  workshop: 'bg-g-green/10 border-g-green/30 text-g-green',
  break: 'bg-white/5 border-white/10 text-white/40',
  panel: 'bg-g-yellow/10 border-g-yellow/30 text-g-yellow',
};

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const nextEvents = await getEventsWithRegistrationCounts();
      if (mounted) {
        setEvents(nextEvents);
        setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-g-blue border-r-g-red border-b-g-yellow border-l-g-green animate-spin mx-auto mb-4" />
        <p className="text-white/40 text-sm font-mono uppercase tracking-widest">Loading Event Details...</p>
      </div>
    );
  }

  const event = events.find(e => e.id === id);
  if (!event) notFound();

  const registrationPercent = Math.round((event.registered / event.capacity) * 100);

  return (
    <div className="pt-20">
      {/* Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <Image src={event.banner} alt={event.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <Link href="/events" className="inline-flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest hover:text-white transition-colors mb-4">
            <ArrowLeft size={12} /> All Events
          </Link>
          <div className="flex gap-2 mb-3">
            <Badge variant={getCategoryColor(event.category)}>{event.category}</Badge>
            <Badge variant={getStatusColor(event.status)}>{event.status.replace('-', ' ')}</Badge>
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-white/50 text-xs font-mono">
            <span className="flex items-center gap-1.5"><Calendar size={12} />{formatDate(event.date)}</span>
            <span className="flex items-center gap-1.5"><Clock size={12} />{event.time}</span>
            <span className="flex items-center gap-1.5"><MapPin size={12} />{event.location}</span>
            <span className="flex items-center gap-1.5"><Users size={12} />{event.registered}/{event.capacity} registered</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <GlassCard animate={false}>
              <h2 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="section-number">About this Event</span>
              </h2>
              <p className="text-white/50 text-sm leading-relaxed">{event.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {event.tags.map(tag => (
                  <span key={tag} className="text-xs font-mono bg-g-blue/10 border border-g-blue/20 text-g-blue px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Speakers */}
            {event.speakers.length > 0 && (
              <div>
                <h2 className="section-number mb-4">Speakers</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {event.speakers.map((speaker, i) => (
                    <GlassCard key={i} delay={i * 0.1} className="text-center p-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-g-blue/20 mx-auto mb-3">
                        <Image src={speaker.avatar} alt={speaker.name} fill className="object-cover" />
                      </div>
                      <div className="font-semibold text-white text-sm">{speaker.name}</div>
                      <div className="text-g-blue text-xs font-mono mt-0.5">{speaker.title}</div>
                      <div className="text-white/35 text-xs mt-0.5">{speaker.company}</div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule */}
            {event.schedule.length > 0 && (
              <div>
                <h2 className="section-number mb-4">Schedule</h2>
                <div className="space-y-2">
                  {event.schedule.map((item, i) => (
                    <GlassCard key={i} delay={i * 0.05} className="flex items-start gap-4 py-3 px-4">
                      <div className="font-mono text-xs text-white/40 whitespace-nowrap min-w-[80px]">{item.time}</div>
                      <div className="flex-1">
                        <div className="text-sm text-white font-medium">{item.title}</div>
                        {item.speaker && <div className="text-xs text-white/35 font-mono mt-0.5">{item.speaker}</div>}
                      </div>
                      <span className={`badge border text-[10px] ${scheduleColors[item.type]}`}>{item.type}</span>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {event.faq.length > 0 && (
              <GlassCard animate={false}>
                <h2 className="section-number mb-4">Frequently Asked Questions</h2>
                {event.faq.map((item, i) => (
                  <FAQItem key={i} question={item.question} answer={item.answer} />
                ))}
              </GlassCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Register card */}
            <GlassCard animate={false} className="sticky top-20">
              <h3 className="font-heading font-bold text-white mb-4">Registration</h3>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-white/40">{event.registered} registered</span>
                  <span className="text-white/40">{event.capacity - event.registered} spots left</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${registrationPercent}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-g-blue to-g-green rounded-full"
                  />
                </div>
                <div className="text-xs text-white/30 font-mono mt-1">{registrationPercent}% filled</div>
              </div>

              <div className="space-y-2 mb-6 text-xs text-white/45 font-mono">
                <div className="flex items-center gap-2"><Calendar size={11} />{formatDate(event.date)}</div>
                <div className="flex items-center gap-2"><Clock size={11} />{event.time}</div>
                <div className="flex items-center gap-2"><MapPin size={11} />{event.location}</div>
              </div>

              <Button
                onClick={() => setIsRegisterOpen(true)}
                className="w-full justify-center"
                disabled={event.status === 'completed' || event.registered >= event.capacity}
              >
                {event.status === 'completed' ? 'Event Ended' : event.registered >= event.capacity ? 'Sold Out' : 'Register Now'}
              </Button>

              {event.status !== 'completed' && event.registered < event.capacity && (
                <p className="text-xs text-white/25 text-center mt-3 font-mono">Free • No hidden charges</p>
              )}

              {(event.joinLink || event.registrationFormUrl) && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  {event.registrationFormUrl && (
                    <a
                      href={event.registrationFormUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest border border-g-green/40 text-g-green py-2 rounded hover:bg-g-green/10 transition-colors"
                    >
                      <ExternalLink size={12} /> Open Registration Form
                    </a>
                  )}
                  {event.joinLink && (
                    <a
                      href={event.joinLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest border border-g-blue/40 text-g-blue py-2 rounded hover:bg-g-blue/10 transition-colors"
                    >
                      <ExternalLink size={12} /> Join Event Link
                    </a>
                  )}
                </div>
              )}
            </GlassCard>

            {/* Share */}
            <GlassCard animate={false} className="text-center">
              <div className="text-xs text-white/40 font-mono mb-3 uppercase tracking-widest">Share Event</div>
              <div className="flex justify-center gap-3">
                <a href="#" className="text-xs font-mono text-white/40 hover:text-white transition-colors flex items-center gap-1"><ExternalLink size={11} /> Twitter</a>
                <a href="#" className="text-xs font-mono text-white/40 hover:text-white transition-colors flex items-center gap-1"><ExternalLink size={11} /> LinkedIn</a>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
      
      {/* Registration Modal */}
      <RegistrationModal
        eventId={event.id}
        event={event}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegistered={async () => setEvents(await getEventsWithRegistrationCounts())}
        eventTitle={event.title}
        eventDate={formatDate(event.date)}
      />
    </div>
  );
}
