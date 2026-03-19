'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ContactQuery, loadContactQueries, replyToContactQuery } from '@/lib/adminData';
import { MessageSquare, Send, Search } from 'lucide-react';

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [notice, setNotice] = useState('');

  const refresh = async () => {
    const next = (await loadContactQueries()).sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
    setQueries(next);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return queries;
    return queries.filter(query =>
      query.name.toLowerCase().includes(term) ||
      query.email.toLowerCase().includes(term) ||
      query.subject.toLowerCase().includes(term) ||
      query.message.toLowerCase().includes(term)
    );
  }, [queries, search]);

  const selectedQuery = useMemo(
    () => filtered.find(query => query.id === selectedId) || filtered[0] || null,
    [filtered, selectedId]
  );

  useEffect(() => {
    if (!selectedQuery) {
      setSelectedId(null);
      setReplyText('');
      return;
    }
    setSelectedId(selectedQuery.id);
    setReplyText(selectedQuery.adminReply || '');
  }, [selectedQuery?.id]);

  const handleReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedQuery) return;

    const adminSessionRaw = localStorage.getItem('gdgoc-admin-session');
    const adminSession = adminSessionRaw ? JSON.parse(adminSessionRaw) as { name?: string; email?: string } : null;
    const adminName = adminSession?.name || adminSession?.email || 'Admin';

    const result = await replyToContactQuery(selectedQuery.id, replyText, adminName);
    if (!result.ok) {
      setNotice(result.error || 'Unable to send reply.');
      return;
    }

    setNotice('Reply sent. Student can now view it in dashboard queries.');
    await refresh();
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-white">Queries</h1>
        <p className="text-white/40 text-sm font-mono mt-1">Contact form submissions and admin replies</p>
      </div>

      {notice && <p className="text-xs font-mono text-g-green mb-4">{notice}</p>}

      <div className="grid lg:grid-cols-[340px_1fr] gap-6">
        <GlassCard animate={false} className="h-fit">
          <div className="relative mb-4">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input pl-9 text-xs"
              placeholder="Search name, email, subject"
            />
          </div>

          <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
            {filtered.length === 0 && (
              <div className="text-xs text-white/35 font-mono border border-white/10 rounded-lg p-3">No queries found.</div>
            )}

            {filtered.map(query => {
              const active = selectedQuery?.id === query.id;
              return (
                <button
                  key={query.id}
                  onClick={() => {
                    setSelectedId(query.id);
                    setReplyText(query.adminReply || '');
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    active ? 'border-g-blue/40 bg-g-blue/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="text-sm text-white truncate">{query.name}</div>
                    <span className={`text-[10px] font-mono uppercase ${query.status === 'replied' ? 'text-g-green' : 'text-g-yellow'}`}>
                      {query.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/35 font-mono truncate">{query.email}</div>
                  <div className="text-xs text-white/55 mt-1 line-clamp-1">{query.subject}</div>
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard animate={false}>
          {!selectedQuery ? (
            <div className="py-16 text-center">
              <MessageSquare size={26} className="mx-auto text-white/20 mb-3" />
              <p className="text-sm text-white/45">Select a query to view and reply.</p>
            </div>
          ) : (
            <div>
              <div className="mb-4 pb-4 border-b border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-heading text-lg text-white">{selectedQuery.subject}</h2>
                  <span className="text-[10px] font-mono text-white/35">{new Date(selectedQuery.submittedAt).toLocaleString()}</span>
                </div>
                <p className="text-xs font-mono text-white/40 mt-1">{selectedQuery.name} • {selectedQuery.email}</p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 mb-4">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/35 mb-2">Student Message</h3>
                <p className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap">{selectedQuery.message}</p>
              </div>

              {selectedQuery.adminReply && (
                <div className="rounded-lg border border-g-green/25 bg-g-green/10 p-4 mb-4">
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-g-green/80 mb-2">Current Admin Reply</h3>
                  <p className="text-sm text-white/80 whitespace-pre-wrap">{selectedQuery.adminReply}</p>
                  <p className="text-[10px] font-mono text-white/35 mt-2">
                    {selectedQuery.repliedBy || 'Admin'} • {selectedQuery.repliedAt ? new Date(selectedQuery.repliedAt).toLocaleString() : ''}
                  </p>
                </div>
              )}

              <form onSubmit={handleReply} className="space-y-3">
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40">Reply Message</label>
                <textarea
                  rows={5}
                  className="form-input resize-none"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Write your response to this query..."
                />
                <button
                  type="submit"
                  className="btn-skew bg-g-blue border border-g-blue text-white text-xs font-mono uppercase tracking-widest px-6 py-2.5 hover:bg-g-blue/80 transition-all flex items-center gap-2"
                >
                  <span className="flex items-center gap-2"><Send size={12} /> Send Reply</span>
                </button>
              </form>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
