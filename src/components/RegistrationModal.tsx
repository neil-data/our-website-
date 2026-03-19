'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { registerForEventWithDetails } from '@/lib/adminData';
import { Event } from '@/types';

interface RegistrationModalProps {
  eventId: string;
  event: Event;
  eventTitle: string;
  eventDate: string;
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: () => void;
}

export default function RegistrationModal({ eventId, event, eventTitle, eventDate, isOpen, onClose, onRegistered }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    iarNo: '',
    department: '',
    year: '',
    agreeTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([{ name: '', email: '' }]);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});

  const teamEnabled = Boolean(event.teamRegistration);
  const minTeamSize = event.teamMinSize || 2;
  const maxTeamSize = event.teamMaxSize || 4;
  const customFields = event.registrationFields || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = formData.email.trim().toLowerCase();

    if (!cleanEmail.endsWith('@iar.ac.in')) {
      setError('Please use your @iar.ac.in email.');
      return;
    }

    if (!formData.agreeTerms) {
      alert('Please agree to terms and conditions');
      return;
    }

    setError('');

    setIsSubmitting(true);
    if (teamEnabled) {
      const activeMembers = members.filter(m => m.email.trim());
      const totalSize = 1 + activeMembers.length;
      if (!teamName.trim()) {
        setError('Team name is required.');
        setIsSubmitting(false);
        return;
      }
      if (totalSize < minTeamSize || totalSize > maxTeamSize) {
        setError(`Team size must be between ${minTeamSize} and ${maxTeamSize}.`);
        setIsSubmitting(false);
        return;
      }
      const invalidMember = activeMembers.find(m => !m.email.trim().toLowerCase().endsWith('@iar.ac.in'));
      if (invalidMember) {
        setError('All member emails must be @iar.ac.in');
        setIsSubmitting(false);
        return;
      }
    }

    const result = await registerForEventWithDetails(eventId, {
      name: formData.name,
      email: cleanEmail,
      iarNo: formData.iarNo,
      department: formData.department,
      year: formData.year,
    }, {
      teamName: teamEnabled ? teamName : undefined,
      members: teamEnabled
        ? members.filter(m => m.email.trim()).map(m => ({ name: m.name, email: m.email }))
        : undefined,
      customFieldValues,
    });

    if (!result.ok) {
      setIsSubmitting(false);
      setError(result.error || 'Registration failed.');
      return;
    }

    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        iarNo: '',
        department: '',
        year: '',
        agreeTerms: false,
      });
      setTeamName('');
      setMembers([{ name: '', email: '' }]);
      setCustomFieldValues({});
      setSubmitted(false);
      onRegistered?.();
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Register Now</h2>
              <p className="text-sm text-white/50">{eventTitle}</p>
              <p className="text-xs text-white/30 font-mono mt-1">{eventDate}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-white/60 font-semibold mb-2 uppercase tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-g-blue/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 font-semibold mb-2 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.name@iar.ac.in"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-g-blue/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 font-semibold mb-2 uppercase tracking-wide">
                  IAR No
                </label>
                <input
                  type="text"
                  name="iarNo"
                  value={formData.iarNo}
                  onChange={handleChange}
                  required
                  placeholder="IAR student number"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-g-blue/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 font-semibold mb-2 uppercase tracking-wide">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    placeholder="e.g., CSE"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-g-blue/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 font-semibold mb-2 uppercase tracking-wide">
                    Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-g-blue/50 transition-all text-sm"
                  >
                    <option value="">Select</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                </div>
              </div>

              {teamEnabled && (
                <div className="space-y-3 border border-white/10 rounded-lg p-3">
                  <div>
                    <label className="block text-xs text-white/60 font-semibold mb-2 uppercase tracking-wide">Team Name</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={e => setTeamName(e.target.value)}
                      placeholder="Your team name"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                      required
                    />
                    <p className="text-[10px] text-white/35 mt-1">Team size for this event: {minTeamSize} to {maxTeamSize}</p>
                  </div>
                  {members.map((member, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={member.name}
                        onChange={e => setMembers(prev => prev.map((m, i) => (i === index ? { ...m, name: e.target.value } : m)))}
                        placeholder="Member name (optional)"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                      />
                      <input
                        type="email"
                        value={member.email}
                        onChange={e => setMembers(prev => prev.map((m, i) => (i === index ? { ...m, email: e.target.value } : m)))}
                        placeholder="member@iar.ac.in"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                      />
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (members.length + 1 < maxTeamSize) {
                          setMembers(prev => [...prev, { name: '', email: '' }]);
                        }
                      }}
                      className="text-xs text-g-blue hover:text-white"
                    >
                      + Add Member
                    </button>
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setMembers(prev => prev.slice(0, -1))}
                        className="text-xs text-g-red hover:text-white"
                      >
                        Remove Last
                      </button>
                    )}
                  </div>
                </div>
              )}

              {customFields.length > 0 && (
                <div className="space-y-2 border border-white/10 rounded-lg p-3">
                  {customFields.map(field => (
                    <div key={field.id}>
                      <label className="block text-xs text-white/60 font-semibold mb-1 uppercase tracking-wide">
                        {field.label} {field.required ? '*' : ''}
                      </label>
                      <input
                        type="text"
                        value={customFieldValues[field.id] || ''}
                        onChange={e => setCustomFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                        required={field.required}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}

              {error && <p className="text-xs text-g-red">{error}</p>}

              <label className="flex items-start gap-2 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded border border-white/20 bg-white/5 accent-g-blue cursor-pointer"
                />
                <span className="text-xs text-white/50">
                  I agree to the terms and conditions and privacy policy of GDGOC IAR
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.email || !formData.iarNo || !formData.department || !formData.year}
                className="w-full mt-6 py-3 bg-gradient-to-r from-g-blue to-g-green text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
              </button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-12 h-12 bg-g-green/20 border border-g-green/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-g-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Registration Successful!</h3>
            <p className="text-sm text-white/50">Check your email for confirmation details.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
