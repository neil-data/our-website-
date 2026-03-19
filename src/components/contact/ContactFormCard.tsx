'use client';

import { FormEvent, useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { submitContactQuery } from '@/lib/adminData';

const defaultSubject = 'General Inquiry';

export function ContactFormCard() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const sessionRaw = localStorage.getItem('gdgoc-student-session');
    if (!sessionRaw) return;

    try {
      const session = JSON.parse(sessionRaw) as { name?: string; email?: string };
      if (session.name) setName(session.name);
      if (session.email) setEmail(session.email);
    } catch {
      // no-op: invalid session payload
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await submitContactQuery({ name, email, subject, message });
    if (!result.ok) {
      setStatus({ type: 'error', text: result.error || 'Unable to send your message right now.' });
      setSubmitting(false);
      return;
    }

    setStatus({ type: 'success', text: 'Query submitted. Admin reply will appear in your dashboard query section.' });
    setMessage('');
    setSubject(defaultSubject);
    setSubmitting(false);
  };

  return (
    <GlassCard animate={false}>
      <h2 className="font-heading text-lg font-bold text-white mb-6">Send a Message</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Your Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="form-input" required />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@iar.ac.in" className="form-input" required />
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Subject</label>
          <select value={subject} onChange={e => setSubject(e.target.value)} className="form-input" required>
            <option className="bg-dark-card">General Inquiry</option>
            <option className="bg-dark-card">Event Collaboration</option>
            <option className="bg-dark-card">Partnership / Sponsorship</option>
            <option className="bg-dark-card">Feedback</option>
            <option className="bg-dark-card">Join the Team</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Message</label>
          <textarea
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Tell us how we can help..."
            className="form-input resize-none"
            required
          />
        </div>

        {status && (
          <p className={`text-xs font-mono ${status.type === 'success' ? 'text-g-green' : 'text-g-red'}`}>
            {status.text}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-skew bg-g-blue border border-g-blue text-white text-xs font-mono uppercase tracking-widest px-8 py-3 hover:bg-g-blue/80 transition-all w-full disabled:opacity-60"
        >
          <span>{submitting ? 'Sending...' : 'Send Message'}</span>
        </button>
      </form>
    </GlassCard>
  );
}
