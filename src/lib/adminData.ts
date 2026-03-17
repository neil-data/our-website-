import { mockEvents } from '@/data/events';
import { mockLeaderboard } from '@/data/leaderboard';
import { Event } from '@/types';

const USERS_KEY = 'gdgoc-users';
const EVENTS_KEY = 'gdgoc-managed-events';
const REGISTRATIONS_KEY = 'gdgoc-event-registrations';
const CONTACT_QUERIES_KEY = 'gdgoc-contact-queries';

const canUseStorage = () => typeof window !== 'undefined';

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  iarNo: string;
  department: string;
  year: string;
  phone: string;
  bio: string;
  github: string;
  linkedin: string;
  points: number;
  banned: boolean;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  email: string;
  iarNo: string;
  department: string;
  year: string;
  teamId?: string;
  teamName?: string;
  isLeader?: boolean;
  customFieldValues?: Record<string, string>;
  registeredAt: string;
}

export interface EventRegistrationWithUser extends EventRegistration {
  user: StudentUser;
}

export interface EventTeam {
  teamId: string;
  teamName: string;
  members: EventRegistrationWithUser[];
}

export interface ContactQuery {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  repliedAt?: string;
  adminReply?: string;
  repliedBy?: string;
  status: 'open' | 'replied';
}

interface SessionPayload {
  name?: string;
  email?: string;
  iarNo?: string;
  department?: string;
  year?: string;
  phone?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
}

interface TeamMemberInput {
  name?: string;
  email: string;
  iarNo?: string;
  department?: string;
  year?: string;
}

interface RegisterOptions {
  teamName?: string;
  members?: TeamMemberInput[];
  customFieldValues?: Record<string, string>;
}

const makeUserId = (email: string) => `u-${email.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const seedUsers = (): StudentUser[] =>
  mockLeaderboard.map(entry => {
    const localPart = entry.name.toLowerCase().replace(/\s+/g, '.');
    const email = `${localPart}@iar.ac.in`;
    return {
      id: makeUserId(email),
      name: entry.name,
      email,
      iarNo: '',
      department: '',
      year: '',
      phone: '',
      bio: '',
      github: '',
      linkedin: '',
      points: entry.points,
      banned: false,
      createdAt: new Date().toISOString(),
    };
  });

const normalizeEvent = (event: Event): Event => ({
  ...event,
  teamRegistration: Boolean(event.teamRegistration),
  teamMinSize: event.teamMinSize || 2,
  teamMaxSize: event.teamMaxSize || 4,
  registrationFields: event.registrationFields || [],
});

export function loadUsers(): StudentUser[] {
  if (!canUseStorage()) return seedUsers();
  const users = safeParse<StudentUser[]>(window.localStorage.getItem(USERS_KEY), []);
  if (users.length > 0) return users;
  const seeded = seedUsers();
  window.localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
  return seeded;
}

export function saveUsers(users: StudentUser[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loadManagedEvents(): Event[] {
  if (!canUseStorage()) return mockEvents.map(normalizeEvent);
  const events = safeParse<Event[]>(window.localStorage.getItem(EVENTS_KEY), []);
  if (events.length > 0) return events.map(normalizeEvent);
  const seeded = mockEvents.map(normalizeEvent);
  window.localStorage.setItem(EVENTS_KEY, JSON.stringify(seeded));
  return seeded;
}

export function saveManagedEvents(events: Event[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(EVENTS_KEY, JSON.stringify(events.map(normalizeEvent)));
}

export function loadRegistrations(): EventRegistration[] {
  if (!canUseStorage()) return [];
  return safeParse<EventRegistration[]>(window.localStorage.getItem(REGISTRATIONS_KEY), []);
}

export function saveRegistrations(registrations: EventRegistration[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
}

export function loadContactQueries(): ContactQuery[] {
  if (!canUseStorage()) return [];
  return safeParse<ContactQuery[]>(window.localStorage.getItem(CONTACT_QUERIES_KEY), []);
}

export function saveContactQueries(queries: ContactQuery[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(CONTACT_QUERIES_KEY, JSON.stringify(queries));
}

export function submitContactQuery(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): { ok: boolean; error?: string } {
  const name = payload.name.trim();
  const email = payload.email.trim().toLowerCase();
  const subject = payload.subject.trim();
  const message = payload.message.trim();

  if (!name || !email || !subject || !message) {
    return { ok: false, error: 'Please fill all required fields.' };
  }

  if (!email.endsWith('@iar.ac.in')) {
    return { ok: false, error: 'Please use your @iar.ac.in email.' };
  }

  const queries = loadContactQueries();
  const next: ContactQuery = {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    email,
    subject,
    message,
    submittedAt: new Date().toISOString(),
    status: 'open',
  };

  saveContactQueries([next, ...queries]);

  upsertUserFromSession({ name, email });
  return { ok: true };
}

export function replyToContactQuery(queryId: string, reply: string, adminName: string = 'Admin'): { ok: boolean; error?: string } {
  const cleanReply = reply.trim();
  if (!cleanReply) return { ok: false, error: 'Reply message cannot be empty.' };

  const queries = loadContactQueries();
  const target = queries.find(query => query.id === queryId);
  if (!target) return { ok: false, error: 'Query not found.' };

  const next = queries.map(query =>
    query.id === queryId
      ? {
          ...query,
          adminReply: cleanReply,
          repliedBy: adminName,
          repliedAt: new Date().toISOString(),
          status: 'replied' as const,
        }
      : query
  );

  saveContactQueries(next);
  return { ok: true };
}

export function getQueriesForStudent(email: string): ContactQuery[] {
  const target = email.trim().toLowerCase();
  return loadContactQueries().filter(query => query.email.toLowerCase() === target);
}

export function getEventsWithRegistrationCounts(): Event[] {
  const events = loadManagedEvents();
  const registrations = loadRegistrations();
  return events.map(event => ({
    ...event,
    registered: registrations.filter(r => r.eventId === event.id).length,
  }));
}

export function upsertUserFromSession(session: SessionPayload): { user: StudentUser | null; error?: string } {
  const cleanEmail = (session.email || '').trim().toLowerCase();
  if (!cleanEmail) return { user: null, error: 'Email is required.' };
  if (!cleanEmail.endsWith('@iar.ac.in')) return { user: null, error: 'Only @iar.ac.in emails are allowed.' };

  const users = loadUsers();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing?.banned) {
    return { user: null, error: 'This account has been permanently banned by admin.' };
  }

  const nextUser: StudentUser = {
    id: existing?.id || makeUserId(cleanEmail),
    name: (session.name || existing?.name || cleanEmail.split('@')[0]).trim(),
    email: cleanEmail,
    iarNo: (session.iarNo ?? existing?.iarNo ?? '').trim(),
    department: (session.department ?? existing?.department ?? '').trim(),
    year: (session.year ?? existing?.year ?? '').trim(),
    phone: (session.phone ?? existing?.phone ?? '').trim(),
    bio: (session.bio ?? existing?.bio ?? '').trim(),
    github: (session.github ?? existing?.github ?? '').trim(),
    linkedin: (session.linkedin ?? existing?.linkedin ?? '').trim(),
    points: existing?.points ?? 0,
    banned: false,
    createdAt: existing?.createdAt || new Date().toISOString(),
  };

  const nextUsers = existing
    ? users.map(u => (u.id === existing.id ? nextUser : u))
    : [nextUser, ...users];
  saveUsers(nextUsers);

  return { user: nextUser };
}

const eventById = (eventId: string) => getEventsWithRegistrationCounts().find(e => e.id === eventId);

const registrationExists = (eventId: string, email: string) => {
  const target = email.trim().toLowerCase();
  return loadRegistrations().some(r => r.eventId === eventId && r.email.toLowerCase() === target);
};

export function registerForEventWithDetails(eventId: string, leaderSession: SessionPayload, options?: RegisterOptions): { ok: boolean; error?: string } {
  const event = eventById(eventId);
  if (!event) return { ok: false, error: 'Event not found.' };
  if (event.status === 'completed') return { ok: false, error: 'Event registration is closed.' };

  const extraMembers = options?.members || [];
  const candidates: Array<{ session: SessionPayload; leader: boolean }> = [{ session: leaderSession, leader: true }];
  for (const member of extraMembers) {
    candidates.push({
      session: {
        name: member.name,
        email: member.email,
        iarNo: member.iarNo || leaderSession.iarNo,
        department: member.department || leaderSession.department,
        year: member.year || leaderSession.year,
      },
      leader: false,
    });
  }

  const emails = candidates.map(c => (c.session.email || '').trim().toLowerCase());
  if (emails.some(email => !email.endsWith('@iar.ac.in'))) {
    return { ok: false, error: 'All team member emails must be @iar.ac.in.' };
  }
  if (new Set(emails).size !== emails.length) {
    return { ok: false, error: 'Duplicate emails are not allowed in one registration.' };
  }
  if (emails.some(email => registrationExists(eventId, email))) {
    return { ok: false, error: 'One or more members are already registered in this event.' };
  }

  const users = loadUsers();
  const banned = users.find(u => emails.includes(u.email.toLowerCase()) && u.banned);
  if (banned) return { ok: false, error: `${banned.email} is banned by admin.` };

  if (event.teamRegistration) {
    const min = event.teamMinSize || 2;
    const max = event.teamMaxSize || 4;
    const size = candidates.length;
    if (!options?.teamName?.trim()) return { ok: false, error: 'Team name is required for this event.' };
    if (size < min || size > max) {
      return { ok: false, error: `Team size must be between ${min} and ${max}.` };
    }
  } else if (candidates.length > 1) {
    return { ok: false, error: 'This event does not allow team registration.' };
  }

  const customFields = event.registrationFields || [];
  const customValues = options?.customFieldValues || {};
  const missingField = customFields.find(field => field.required && !(customValues[field.id] || '').trim());
  if (missingField) {
    return { ok: false, error: `${missingField.label} is required.` };
  }

  const currentRegistrations = loadRegistrations();
  if (currentRegistrations.filter(r => r.eventId === eventId).length + candidates.length > event.capacity) {
    return { ok: false, error: 'Not enough spots left for all team members.' };
  }

  const teamId = event.teamRegistration ? `team-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` : undefined;
  const teamName = options?.teamName?.trim();

  const nextRegistrations: EventRegistration[] = [];
  for (const candidate of candidates) {
    const synced = upsertUserFromSession(candidate.session);
    if (!synced.user) return { ok: false, error: synced.error || 'Unable to save member profile.' };
    nextRegistrations.push({
      id: `reg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      eventId,
      userId: synced.user.id,
      name: synced.user.name,
      email: synced.user.email,
      iarNo: synced.user.iarNo,
      department: synced.user.department,
      year: synced.user.year,
      teamId,
      teamName,
      isLeader: candidate.leader,
      customFieldValues: customValues,
      registeredAt: new Date().toISOString(),
    });
  }

  saveRegistrations([...nextRegistrations, ...currentRegistrations]);
  nextRegistrations.forEach(reg => adjustUserPoints(reg.userId, 25));
  return { ok: true };
}

export function registerUserForEvent(eventId: string, session: SessionPayload): { ok: boolean; error?: string } {
  return registerForEventWithDetails(eventId, session);
}

export function getRegistrationsForEvent(eventId: string): EventRegistrationWithUser[] {
  const users = loadUsers();
  const registrations = loadRegistrations().filter(r => r.eventId === eventId);
  return registrations
    .map(reg => {
      const user = users.find(u => u.id === reg.userId);
      return user ? { ...reg, user } : null;
    })
    .filter((item): item is EventRegistrationWithUser => Boolean(item));
}

export function getTeamsForEvent(eventId: string): EventTeam[] {
  const registrations = getRegistrationsForEvent(eventId);
  const grouped = new Map<string, EventRegistrationWithUser[]>();

  for (const reg of registrations) {
    const key = reg.teamId || `solo-${reg.id}`;
    const list = grouped.get(key) || [];
    list.push(reg);
    grouped.set(key, list);
  }

  return Array.from(grouped.entries()).map(([teamId, members]) => ({
    teamId,
    teamName: members[0]?.teamName || members[0]?.name || 'Team',
    members: members.sort((a, b) => Number(Boolean(b.isLeader)) - Number(Boolean(a.isLeader))),
  }));
}

export function updateRegistrationDetails(registrationId: string, patch: Partial<EventRegistration>): { ok: boolean; error?: string } {
  const registrations = loadRegistrations();
  const target = registrations.find(r => r.id === registrationId);
  if (!target) return { ok: false, error: 'Registration not found.' };

  const nextEmail = (patch.email ?? target.email).trim().toLowerCase();
  if (!nextEmail.endsWith('@iar.ac.in')) return { ok: false, error: 'Email must be @iar.ac.in.' };

  const duplicate = registrations.find(r => r.id !== target.id && r.eventId === target.eventId && r.email.toLowerCase() === nextEmail);
  if (duplicate) return { ok: false, error: 'Another member already uses this email in this event.' };

  const synced = upsertUserFromSession({
    name: patch.name ?? target.name,
    email: nextEmail,
    iarNo: patch.iarNo ?? target.iarNo,
    department: patch.department ?? target.department,
    year: patch.year ?? target.year,
  });
  if (!synced.user) return { ok: false, error: synced.error || 'Unable to update user.' };
  const syncedUser = synced.user;

  const next = registrations.map(reg =>
    reg.id === registrationId
      ? {
          ...reg,
          ...patch,
          userId: syncedUser.id,
          email: syncedUser.email,
          name: patch.name ?? syncedUser.name,
          iarNo: patch.iarNo ?? syncedUser.iarNo,
          department: patch.department ?? syncedUser.department,
          year: patch.year ?? syncedUser.year,
        }
      : reg
  );
  saveRegistrations(next);
  return { ok: true };
}

export function addMemberToTeam(eventId: string, teamId: string, member: TeamMemberInput): { ok: boolean; error?: string } {
  const event = eventById(eventId);
  if (!event) return { ok: false, error: 'Event not found.' };
  const teamRegs = loadRegistrations().filter(r => r.eventId === eventId && r.teamId === teamId);
  if (teamRegs.length === 0) return { ok: false, error: 'Team not found.' };

  const maxSize = event.teamMaxSize || 4;
  if (teamRegs.length >= maxSize) return { ok: false, error: `Team already reached max size (${maxSize}).` };

  return registerForEventWithDetails(
    eventId,
    {
      name: member.name,
      email: member.email,
      iarNo: member.iarNo,
      department: member.department,
      year: member.year,
    },
    {
      teamName: teamRegs[0].teamName,
      members: [],
      customFieldValues: teamRegs[0].customFieldValues,
    }
  );
}

export function removeMemberFromTeam(registrationId: string): { ok: boolean; error?: string } {
  const registrations = loadRegistrations();
  const target = registrations.find(r => r.id === registrationId);
  if (!target) return { ok: false, error: 'Registration not found.' };
  if (!target.teamId) {
    removeRegistration(registrationId);
    return { ok: true };
  }
  const teamMembers = registrations.filter(r => r.eventId === target.eventId && r.teamId === target.teamId);
  if (target.isLeader && teamMembers.length > 1) {
    return { ok: false, error: 'Leader cannot be removed while team still has members.' };
  }
  removeRegistration(registrationId);
  return { ok: true };
}

export function removeRegistration(registrationId: string): void {
  const registrations = loadRegistrations();
  const existing = registrations.find(r => r.id === registrationId);
  const next = registrations.filter(r => r.id !== registrationId);
  saveRegistrations(next);
  if (existing) adjustUserPoints(existing.userId, -25);
}

export function addUserToEvent(eventId: string, userId: string): { ok: boolean; error?: string } {
  const users = loadUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return { ok: false, error: 'User not found.' };
  return registerForEventWithDetails(eventId, user);
}

export function adjustUserPoints(userId: string, delta: number): void {
  const users = loadUsers();
  const next = users.map(user =>
    user.id === userId
      ? { ...user, points: Math.max(0, user.points + delta) }
      : user
  );
  saveUsers(next);
}

export function banUserPermanently(userId: string): void {
  const users = loadUsers();
  const next = users.map(user =>
    user.id === userId
      ? { ...user, banned: true }
      : user
  );
  saveUsers(next);

  const registrations = loadRegistrations();
  saveRegistrations(registrations.filter(r => r.userId !== userId));
}

export function unbanUser(userId: string): void {
  const users = loadUsers();
  saveUsers(users.map(user => (user.id === userId ? { ...user, banned: false } : user)));
}

export function removeUser(userId: string): void {
  const users = loadUsers();
  saveUsers(users.filter(user => user.id !== userId));
  const registrations = loadRegistrations();
  saveRegistrations(registrations.filter(r => r.userId !== userId));
}

export function createManagedEvent(payload: Partial<Event>): Event {
  const events = loadManagedEvents();
  const next: Event = normalizeEvent({
    id: `e${Date.now()}`,
    title: payload.title || 'New Event',
    date: payload.date || new Date().toISOString().split('T')[0],
    endDate: payload.endDate,
    time: payload.time || '10:00 AM IST',
    location: payload.location || 'TBD',
    category: payload.category || 'community',
    status: payload.status || 'upcoming',
    description: payload.description || '',
    shortDesc: payload.shortDesc || payload.description || '',
    banner: payload.banner || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
    speakers: payload.speakers || [],
    schedule: payload.schedule || [],
    faq: payload.faq || [],
    capacity: payload.capacity || 100,
    registered: 0,
    teamRegistration: payload.teamRegistration || false,
    teamMinSize: payload.teamMinSize || 2,
    teamMaxSize: payload.teamMaxSize || 4,
    registrationFields: payload.registrationFields || [],
    tags: payload.tags || ['community'],
  });
  saveManagedEvents([next, ...events]);
  return next;
}

export function deleteManagedEvent(eventId: string): void {
  const events = loadManagedEvents();
  saveManagedEvents(events.filter(event => event.id !== eventId));
  const registrations = loadRegistrations();
  saveRegistrations(registrations.filter(reg => reg.eventId !== eventId));
}