'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import {
  addMemberToTeam,
  addUserToEvent,
  adjustUserPoints,
  banUserPermanently,
  createManagedEvent,
  deleteManagedEvent,
  getEventsWithRegistrationCounts,
  getRegistrationsForEvent,
  getTeamsForEvent,
  loadUsers,
  removeMemberFromTeam,
  removeRegistration,
  updateRegistrationDetails,
} from '@/lib/adminData';
import { getCategoryColor, getStatusColor, formatDateShort } from '@/lib/utils';
import { Event, EventRegistrationField, EventRegistrationWithUser, EventTeam, StudentUser } from '@/types';
import { Plus, Trash2, Eye, X, Ban, Download, UserPlus, Minus, PlusCircle, Pencil } from 'lucide-react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<StudentUser[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistrationWithUser[]>([]);
  const [teams, setTeams] = useState<EventTeam[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCategory, setEventCategory] = useState<Event['category']>('workshop');
  const [eventStatus, setEventStatus] = useState<Event['status']>('registration-open');
  const [eventLocation, setEventLocation] = useState('IAR Campus');
  const [eventJoinLink, setEventJoinLink] = useState('');
  const [eventRegistrationFormUrl, setEventRegistrationFormUrl] = useState('');
  const [eventBanner, setEventBanner] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventCapacity, setEventCapacity] = useState(100);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [message, setMessage] = useState('');
  const [teamEnabled, setTeamEnabled] = useState(false);
  const [teamMin, setTeamMin] = useState(2);
  const [teamMax, setTeamMax] = useState(4);
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldRequired, setFieldRequired] = useState(false);
  const [registrationFields, setRegistrationFields] = useState<EventRegistrationField[]>([]);
  const [teamTarget, setTeamTarget] = useState('');
  const [teamMemberName, setTeamMemberName] = useState('');
  const [teamMemberEmail, setTeamMemberEmail] = useState('');

  const refreshData = async () => {
    const [nextEvents, nextUsers] = await Promise.all([
      getEventsWithRegistrationCounts(),
      loadUsers(),
    ]);
    setEvents(nextEvents);
    setUsers(nextUsers);

    if (selectedEventId) {
      const [nextRegistrations, nextTeams] = await Promise.all([
        getRegistrationsForEvent(selectedEventId),
        getTeamsForEvent(selectedEventId),
      ]);
      setRegistrations(nextRegistrations);
      setTeams(nextTeams);
    } else {
      setRegistrations([]);
      setTeams([]);
    }
  };

  useEffect(() => {
    void refreshData();
  }, [selectedEventId]);

  const selectedEvent = useMemo(() => events.find(event => event.id === selectedEventId) || null, [events, selectedEventId]);
  const availableUsers = users.filter(user => !user.banned);

  const showNotice = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 2500);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate || !eventDescription.trim()) {
      showNotice('Please fill in title, date, and description.');
      return;
    }
    await createManagedEvent({
      title: eventTitle.trim(),
      date: eventDate,
      category: eventCategory,
      status: eventStatus,
      location: eventLocation.trim(),
      joinLink: eventJoinLink.trim() || undefined,
      registrationFormUrl: eventRegistrationFormUrl.trim() || undefined,
      banner: eventBanner.trim() || undefined,
      description: eventDescription.trim(),
      shortDesc: eventDescription.trim().slice(0, 110),
      capacity: eventCapacity,
      tags: [eventCategory],
      teamRegistration: teamEnabled,
      teamMinSize: teamMin,
      teamMaxSize: teamMax,
      registrationFields,
    });
    setShowCreateModal(false);
    setEventTitle('');
    setEventDate('');
    setEventLocation('IAR Campus');
    setEventJoinLink('');
    setEventRegistrationFormUrl('');
    setEventBanner('');
    setEventDescription('');
    setEventCapacity(100);
    setTeamEnabled(false);
    setTeamMin(2);
    setTeamMax(4);
    setRegistrationFields([]);
    setFieldLabel('');
    setFieldRequired(false);
    await refreshData();
  };

  const handleOpenEvent = async (eventId: string) => {
    setSelectedEventId(eventId);
    const [nextRegistrations, nextTeams] = await Promise.all([
      getRegistrationsForEvent(eventId),
      getTeamsForEvent(eventId),
    ]);
    setRegistrations(nextRegistrations);
    setTeams(nextTeams);
  };

  const handleAddUser = async () => {
    if (!selectedEventId || !selectedUserId) return;
    const result = await addUserToEvent(selectedEventId, selectedUserId);
    if (!result.ok) {
      showNotice(result.error || 'Unable to add user.');
      return;
    }
    setSelectedUserId('');
    await refreshData();
    showNotice('User added to event.');
  };

  const handleDownloadPdf = async () => {
    if (!selectedEvent) return;
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`${selectedEvent.title} - Registered Students`, 14, 14);
    autoTable(doc, {
      head: [['Name', 'Email', 'Team', 'IAR No', 'Department', 'Year', 'Points']],
      body: registrations.map(reg => [
        reg.name,
        reg.email,
        reg.teamName || '-',
        reg.iarNo || '-',
        reg.department || '-',
        reg.year || '-',
        String(reg.user.points),
      ]),
      startY: 20,
    });
    doc.save(`${selectedEvent.title.replace(/\s+/g, '-')}-students.pdf`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Events Management</h1>
          <p className="text-white/40 text-sm font-mono mt-1">Per-event team setup, custom fields, and full admin control</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-skew bg-g-blue border border-g-blue text-white text-xs font-mono uppercase tracking-widest px-5 py-2.5 hover:bg-g-blue/80 transition-all flex items-center gap-2"
        >
          <span className="flex items-center gap-2"><Plus size={13} /> Create Event</span>
        </button>
      </div>

      {message && <p className="text-xs font-mono text-g-yellow mb-4">{message}</p>}

      <GlassCard animate={false}>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="text-left">Event</th>
                <th className="text-left hidden md:table-cell">Date</th>
                <th className="text-left hidden lg:table-cell">Category</th>
                <th className="text-left hidden sm:table-cell">Status</th>
                <th className="text-left hidden lg:table-cell">Registered</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, i) => (
                <motion.tr key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                        <Image src={event.banner} alt={event.title} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="text-sm text-white font-medium line-clamp-1 max-w-[240px]">{event.title}</div>
                        <div className="text-xs text-white/30 font-mono hidden sm:block">{event.location}</div>
                        {event.teamRegistration && (
                          <div className="text-[10px] text-g-green font-mono mt-0.5">Team Event ({event.teamMinSize}-{event.teamMaxSize})</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell"><span className="text-white/60 text-xs font-mono">{formatDateShort(event.date)}</span></td>
                  <td className="hidden lg:table-cell"><Badge variant={getCategoryColor(event.category)}>{event.category}</Badge></td>
                  <td className="hidden sm:table-cell"><Badge variant={getStatusColor(event.status)}>{event.status.replace('-', ' ')}</Badge></td>
                  <td className="hidden lg:table-cell"><span className="text-xs text-white/40 font-mono">{event.registered}/{event.capacity}</span></td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => void handleOpenEvent(event.id)} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-blue hover:border-g-blue/30 transition-colors"><Eye size={12} /></button>
                      <button
                        onClick={async () => {
                          await deleteManagedEvent(event.id);
                          if (selectedEventId === event.id) setSelectedEventId(null);
                          await refreshData();
                        }}
                        className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-red hover:border-g-red/30 transition-colors"
                      ><Trash2 size={12} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {selectedEvent && (
        <GlassCard animate={false} className="mt-6" glowColor="blue">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="section-number">Event Admin: {selectedEvent.title}</h2>
              <p className="text-white/40 text-xs font-mono mt-1">{registrations.length} registered students</p>
              {selectedEvent.registrationFields && selectedEvent.registrationFields.length > 0 && (
                <p className="text-[10px] text-white/35 font-mono mt-1">
                  Extra Fields: {selectedEvent.registrationFields.map(f => f.label).join(', ')}
                </p>
              )}
            </div>
            <button onClick={handleDownloadPdf} className="btn-skew bg-transparent border border-white/20 text-white text-xs font-mono uppercase tracking-widest px-4 py-2 hover:border-white/40 transition-all flex items-center gap-2">
              <span className="flex items-center gap-2"><Download size={12} /> Download PDF</span>
            </button>
          </div>

          <div className="grid md:grid-cols-[1fr_auto] gap-3 mb-4">
            <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} className="form-input">
              <option value="" className="bg-dark-card">Select user to add in this event</option>
              {availableUsers.map(user => (
                <option key={user.id} value={user.id} className="bg-dark-card">{user.name} ({user.email})</option>
              ))}
            </select>
            <button onClick={() => void handleAddUser()} className="btn-skew bg-g-green border border-g-green text-white text-xs font-mono uppercase tracking-widest px-5 py-2.5 hover:bg-g-green/80 transition-all flex items-center gap-2">
              <span className="flex items-center gap-2"><UserPlus size={12} /> Add User</span>
            </button>
          </div>

          {selectedEvent.teamRegistration && teams.length > 0 && (
            <div className="mb-6 border border-white/10 rounded-lg p-4">
              <h3 className="text-sm text-white font-semibold mb-3">Team Management</h3>
              <div className="grid md:grid-cols-3 gap-3 mb-3">
                <select value={teamTarget} onChange={e => setTeamTarget(e.target.value)} className="form-input">
                  <option value="" className="bg-dark-card">Select team</option>
                  {teams.map(team => (
                    <option key={team.teamId} value={team.teamId} className="bg-dark-card">
                      {team.teamName} ({team.members.length})
                    </option>
                  ))}
                </select>
                <input value={teamMemberName} onChange={e => setTeamMemberName(e.target.value)} className="form-input" placeholder="Member name" />
                <input value={teamMemberEmail} onChange={e => setTeamMemberEmail(e.target.value)} className="form-input" placeholder="member@iar.ac.in" />
              </div>
              <button
                onClick={async () => {
                  if (!selectedEventId || !teamTarget || !teamMemberEmail.trim()) return;
                  const result = await addMemberToTeam(selectedEventId, teamTarget, { name: teamMemberName, email: teamMemberEmail });
                  if (!result.ok) {
                    showNotice(result.error || 'Unable to add member.');
                    return;
                  }
                  setTeamMemberName('');
                  setTeamMemberEmail('');
                  await refreshData();
                  showNotice('Member added to team.');
                }}
                className="btn-skew bg-g-blue border border-g-blue text-white text-xs font-mono uppercase tracking-widest px-4 py-2 hover:bg-g-blue/80 transition-all"
              >
                <span>Add Member To Team</span>
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Student</th>
                  <th className="text-left hidden md:table-cell">Details</th>
                  <th className="text-left hidden lg:table-cell">Points</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map(reg => (
                  <tr key={reg.id}>
                    <td>
                      <div>
                        <div className="text-sm text-white">{reg.name} {reg.isLeader ? <span className="text-[10px] text-g-yellow font-mono">(Leader)</span> : ''}</div>
                        <div className="text-[10px] text-white/30 font-mono">{reg.email}{reg.teamName ? ` · ${reg.teamName}` : ''}</div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell">
                      <span className="text-xs text-white/40 font-mono">{reg.iarNo || '-'} / {reg.department || '-'} / {reg.year || '-'}</span>
                    </td>
                    <td className="hidden lg:table-cell"><span className="text-g-blue font-mono">{reg.user.points}</span></td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={async () => {
                            const name = window.prompt('Name', reg.name) || reg.name;
                            const email = window.prompt('Email', reg.email) || reg.email;
                            const iarNo = window.prompt('IAR No', reg.iarNo) || reg.iarNo;
                            const department = window.prompt('Department', reg.department) || reg.department;
                            const year = window.prompt('Year', reg.year) || reg.year;
                            const result = await updateRegistrationDetails(reg.id, { name, email, iarNo, department, year });
                            if (!result.ok) {
                              showNotice(result.error || 'Unable to update details.');
                              return;
                            }
                            await refreshData();
                            showNotice('Registration details updated.');
                          }}
                          className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-blue hover:border-g-blue/30 transition-colors"
                        ><Pencil size={11} /></button>
                        <button onClick={async () => { await adjustUserPoints(reg.user.id, -50); await refreshData(); }} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-red hover:border-g-red/30 transition-colors"><Minus size={11} /></button>
                        <button onClick={async () => { await adjustUserPoints(reg.user.id, 50); await refreshData(); }} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-green hover:border-g-green/30 transition-colors"><PlusCircle size={11} /></button>
                        <button
                          onClick={async () => {
                            const result = selectedEvent.teamRegistration ? await removeMemberFromTeam(reg.id) : { ok: true };
                            if (!selectedEvent.teamRegistration) await removeRegistration(reg.id);
                            if (!result.ok) {
                              showNotice(result.error || 'Unable to remove.');
                              return;
                            }
                            await refreshData();
                          }}
                          className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-yellow hover:border-g-yellow/30 transition-colors"
                        ><X size={11} /></button>
                        <button onClick={async () => { await banUserPermanently(reg.user.id); await refreshData(); }} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-red hover:border-g-red/30 transition-colors"><Ban size={11} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
        </GlassCard>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card rounded-2xl p-8 w-full max-w-xl max-h-[88vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-white text-lg">Create New Event</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-white/40 hover:text-white"><X size={16} /></button>
              </div>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Event Title</label>
                  <input className="form-input" value={eventTitle} onChange={e => setEventTitle(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Date</label>
                    <input type="date" className="form-input" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Category</label>
                    <select className="form-input" value={eventCategory} onChange={e => setEventCategory(e.target.value as Event['category'])}>
                      <option value="hackathon" className="bg-dark-card">hackathon</option>
                      <option value="workshop" className="bg-dark-card">workshop</option>
                      <option value="talk" className="bg-dark-card">talk</option>
                      <option value="bootcamp" className="bg-dark-card">bootcamp</option>
                      <option value="community" className="bg-dark-card">community</option>
                      <option value="webinar" className="bg-dark-card">webinar</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Status</label>
                    <select className="form-input" value={eventStatus} onChange={e => setEventStatus(e.target.value as Event['status'])}>
                      <option value="upcoming" className="bg-dark-card">upcoming</option>
                      <option value="registration-open" className="bg-dark-card">registration-open</option>
                      <option value="live" className="bg-dark-card">live</option>
                      <option value="completed" className="bg-dark-card">completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Capacity</label>
                    <input type="number" className="form-input" value={eventCapacity} onChange={e => setEventCapacity(Number(e.target.value) || 1)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Location</label>
                  <input className="form-input" value={eventLocation} onChange={e => setEventLocation(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Join Link (Optional)</label>
                    <input
                      className="form-input"
                      value={eventJoinLink}
                      onChange={e => setEventJoinLink(e.target.value)}
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Registration Form URL (Optional)</label>
                    <input
                      className="form-input"
                      value={eventRegistrationFormUrl}
                      onChange={e => setEventRegistrationFormUrl(e.target.value)}
                      placeholder="https://forms.gle/..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Banner Image URL (Optional)</label>
                  <input
                    className="form-input"
                    value={eventBanner}
                    onChange={e => setEventBanner(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Description</label>
                  <textarea className="form-input resize-none" rows={3} value={eventDescription} onChange={e => setEventDescription(e.target.value)} required />
                </div>

                <div className="border border-white/10 rounded-lg p-3 space-y-3">
                  <label className="flex items-center gap-2 text-xs font-mono text-white/70">
                    <input type="checkbox" checked={teamEnabled} onChange={e => setTeamEnabled(e.target.checked)} />
                    Enable team formation for this event
                  </label>
                  {teamEnabled && (
                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" className="form-input" value={teamMin} onChange={e => setTeamMin(Number(e.target.value) || 2)} placeholder="Min team size" />
                      <input type="number" className="form-input" value={teamMax} onChange={e => setTeamMax(Number(e.target.value) || 4)} placeholder="Max team size" />
                    </div>
                  )}
                </div>

                <div className="border border-white/10 rounded-lg p-3 space-y-3">
                  <p className="text-xs font-mono text-white/60 uppercase tracking-widest">Event specific extra fields (e.g. GitHub repo link)</p>
                  <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                    <input className="form-input" value={fieldLabel} onChange={e => setFieldLabel(e.target.value)} placeholder="Field label" />
                    <label className="flex items-center gap-1 text-xs text-white/60">
                      <input type="checkbox" checked={fieldRequired} onChange={e => setFieldRequired(e.target.checked)} /> req
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = fieldLabel.trim();
                        if (!trimmed) return;
                        setRegistrationFields(prev => [...prev, { id: `f-${Date.now()}`, label: trimmed, required: fieldRequired }]);
                        setFieldLabel('');
                        setFieldRequired(false);
                      }}
                      className="btn-skew bg-transparent border border-white/20 text-white text-xs px-3"
                    >
                      <span>Add</span>
                    </button>
                  </div>
                  {registrationFields.map(field => (
                    <div key={field.id} className="flex items-center justify-between text-xs text-white/50 border border-white/10 rounded px-2 py-1">
                      <span>{field.label} {field.required ? '(required)' : ''}</span>
                      <button
                        type="button"
                        onClick={() => setRegistrationFields(prev => prev.filter(f => f.id !== field.id))}
                        className="text-g-red"
                      >
                        remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-skew flex-1 bg-g-blue border border-g-blue text-white text-xs font-mono uppercase tracking-widest py-3 hover:bg-g-blue/80 transition-all text-center">
                    <span>Create Event</span>
                  </button>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn-skew flex-1 bg-transparent border border-white/15 text-white/60 text-xs font-mono uppercase tracking-widest py-3 hover:border-white/30 transition-all text-center">
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
