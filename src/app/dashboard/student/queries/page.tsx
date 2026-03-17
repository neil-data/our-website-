'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ContactQuery, getQueriesForStudent } from '@/lib/adminData';
import { MessageSquare, Clock4, CheckCircle2 } from 'lucide-react';

export default function StudentQueriesPage() {
  const [queries, setQueries] = useState<ContactQuery[]>([]);

  useEffect(() => {
    const sessionRaw = localStorage.getItem('gdgoc-student-session');
    if (!sessionRaw) return;

    try {
      const session = JSON.parse(sessionRaw) as { email?: string };
      if (!session.email) return;
      const mine = getQueriesForStudent(session.email).sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
      setQueries(mine);
    } catch {
      setQueries([]);
    }
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-white">My Queries</h1>
        <p className="text-white/40 text-sm font-mono mt-1">Messages you sent from contact form and admin replies</p>
      </div>

      {queries.length === 0 ? (
        <GlassCard animate={false} className="text-center py-12">
          <MessageSquare size={30} className="mx-auto text-white/15 mb-3" />
          <p className="text-white/35 text-sm">No queries yet.</p>
          <p className="text-white/25 text-xs font-mono mt-1">Use the contact form to send a message to admin.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {queries.map(query => (
            <GlassCard key={query.id} animate={false}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h2 className="text-white font-semibold text-sm">{query.subject}</h2>
                <span className={`text-[10px] font-mono uppercase ${query.status === 'replied' ? 'text-g-green' : 'text-g-yellow'}`}>
                  {query.status}
                </span>
              </div>

              <div className="text-[10px] font-mono text-white/35 mb-3">{new Date(query.submittedAt).toLocaleString()}</div>

              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 mb-3">
                <div className="text-[10px] font-mono uppercase tracking-widest text-white/35 mb-2 flex items-center gap-1">
                  <Clock4 size={10} /> Your Message
                </div>
                <p className="text-sm text-white/75 whitespace-pre-wrap">{query.message}</p>
              </div>

              <div className={`rounded-lg p-3 border ${query.adminReply ? 'border-g-green/25 bg-g-green/10' : 'border-white/10 bg-white/[0.01]'}`}>
                <div className="text-[10px] font-mono uppercase tracking-widest mb-2 flex items-center gap-1 text-white/45">
                  <CheckCircle2 size={10} /> Admin Reply
                </div>
                {query.adminReply ? (
                  <>
                    <p className="text-sm text-white/80 whitespace-pre-wrap">{query.adminReply}</p>
                    <p className="text-[10px] font-mono text-white/35 mt-2">
                      {query.repliedBy || 'Admin'} • {query.repliedAt ? new Date(query.repliedAt).toLocaleString() : ''}
                    </p>
                  </>
                ) : (
                  <p className="text-xs font-mono text-white/35">Waiting for admin response.</p>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
