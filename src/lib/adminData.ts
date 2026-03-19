import { Event } from '@/types';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebaseClient';

const USERS_COLLECTION = 'users';
const EVENTS_COLLECTION = 'events';
const REGISTRATIONS_COLLECTION = 'registrations';
const CONTACT_QUERIES_COLLECTION = 'queries';
const ANNOUNCEMENTS_COLLECTION = 'announcements';
const MEDIA_COLLECTION = 'media';
const TEAM_COLLECTION = 'team';

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
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const cleanObj = <T extends Record<string, any>>(obj: T): T => {
  const result = {} as any;
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = cleanObj(value);
    } else {
      result[key] = value;
    }
  }
  return result;
};

const seedUsers = (): StudentUser[] => [];

const normalizeEvent = (event: Event): Event => ({
  ...event,
  teamRegistration: Boolean(event.teamRegistration),
  teamMinSize: event.teamMinSize || 2,
  teamMaxSize: event.teamMaxSize || 4,
  registrationFields: event.registrationFields || [],
});

async function getCollectionDocs<T extends { id: string }>(name: string): Promise<T[]> {
  const db = getFirebaseDb();
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map(snap => ({ id: snap.id, ...(snap.data() as Omit<T, 'id'>) } as T));
}

async function getUsersInternal(): Promise<StudentUser[]> {
  try {
    const users = await getCollectionDocs<StudentUser>(USERS_COLLECTION);
    if (users.length > 0) return users;
    return [];
  } catch {
    return seedUsers();
  }
}

async function getRegistrationsInternal(): Promise<EventRegistration[]> {
  try {
    return await getCollectionDocs<EventRegistration>(REGISTRATIONS_COLLECTION);
  } catch {
    return [];
  }
}

export async function loadUsers(): Promise<StudentUser[]> {
  return getUsersInternal();
}

export async function saveUsers(users: StudentUser[]): Promise<void> {
  const db = getFirebaseDb();
  const batch = writeBatch(db);
  users.forEach(user => {
    batch.set(doc(db, USERS_COLLECTION, user.id), cleanObj(user));
  });
  await batch.commit();
}

export async function loadManagedEvents(): Promise<Event[]> {
  try {
    const events = await getCollectionDocs<Event>(EVENTS_COLLECTION);
    return events.map(normalizeEvent);
  } catch {
    return [];
  }
}

export async function saveManagedEvents(events: Event[]): Promise<void> {
  const db = getFirebaseDb();
  const batch = writeBatch(db);
  events.forEach(event => {
    batch.set(doc(db, EVENTS_COLLECTION, event.id), cleanObj(normalizeEvent(event)));
  });
  await batch.commit();
}

export async function loadRegistrations(): Promise<EventRegistration[]> {
  return getRegistrationsInternal();
}

export async function saveRegistrations(registrations: EventRegistration[]): Promise<void> {
  const db = getFirebaseDb();
  const batch = writeBatch(db);
  registrations.forEach(registration => {
    batch.set(doc(db, REGISTRATIONS_COLLECTION, registration.id), cleanObj(registration));
  });
  await batch.commit();
}

export async function loadContactQueries(): Promise<ContactQuery[]> {
  try {
    return await getCollectionDocs<ContactQuery>(CONTACT_QUERIES_COLLECTION);
  } catch {
    return [];
  }
}

export async function saveContactQueries(queries: ContactQuery[]): Promise<void> {
  const db = getFirebaseDb();
  const batch = writeBatch(db);
  queries.forEach(queryItem => {
    batch.set(doc(db, CONTACT_QUERIES_COLLECTION, queryItem.id), cleanObj(queryItem));
  });
  await batch.commit();
}

export async function submitContactQuery(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
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

  const next: ContactQuery = {
    id: makeId('q'),
    name,
    email,
    subject,
    message,
    submittedAt: new Date().toISOString(),
    status: 'open',
  };

  try {
    const db = getFirebaseDb();
    await setDoc(doc(db, CONTACT_QUERIES_COLLECTION, next.id), cleanObj(next));
    await upsertUserFromSession({ name, email });
    return { ok: true };
  } catch {
    return { ok: false, error: 'Unable to submit query right now.' };
  }
}

export async function replyToContactQuery(queryId: string, reply: string, adminName: string = 'Admin'): Promise<{ ok: boolean; error?: string }> {
  const cleanReply = reply.trim();
  if (!cleanReply) return { ok: false, error: 'Reply message cannot be empty.' };

  try {
    const db = getFirebaseDb();
    const targetRef = doc(db, CONTACT_QUERIES_COLLECTION, queryId);
    const targetSnap = await getDoc(targetRef);
    if (!targetSnap.exists()) return { ok: false, error: 'Query not found.' };

    await updateDoc(targetRef, cleanObj({
      adminReply: cleanReply,
      repliedBy: adminName,
      repliedAt: new Date().toISOString(),
      status: 'replied',
    }));

    return { ok: true };
  } catch {
    return { ok: false, error: 'Unable to save reply right now.' };
  }
}

export async function getQueriesForStudent(email: string): Promise<ContactQuery[]> {
  const target = email.trim().toLowerCase();
  const all = await loadContactQueries();
  return all.filter(queryItem => queryItem.email.toLowerCase() === target);
}

export async function getEventsWithRegistrationCounts(): Promise<Event[]> {
  const [events, registrations] = await Promise.all([loadManagedEvents(), loadRegistrations()]);
  return events.map(event => ({
    ...event,
    registered: registrations.filter(r => r.eventId === event.id).length,
  }));
}

export async function upsertUserFromSession(session: SessionPayload): Promise<{ user: StudentUser | null; error?: string }> {
  const cleanEmail = (session.email || '').trim().toLowerCase();
  if (!cleanEmail) return { user: null, error: 'Email is required.' };
  if (!cleanEmail.endsWith('@iar.ac.in')) return { user: null, error: 'Only @iar.ac.in emails are allowed.' };

  const users = await loadUsers();
  const existing = users.find(user => user.email.toLowerCase() === cleanEmail);
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

  try {
    const db = getFirebaseDb();
    await setDoc(doc(db, USERS_COLLECTION, nextUser.id), cleanObj(nextUser), { merge: true });
    return { user: nextUser };
  } catch {
    return { user: null, error: 'Unable to save user profile.' };
  }
}

const registrationExists = (registrations: EventRegistration[], eventId: string, email: string) => {
  const target = email.trim().toLowerCase();
  return registrations.some(registration => registration.eventId === eventId && registration.email.toLowerCase() === target);
};

export async function registerForEventWithDetails(eventId: string, leaderSession: SessionPayload, options?: RegisterOptions): Promise<{ ok: boolean; error?: string }> {
  const events = await getEventsWithRegistrationCounts();
  const event = events.find(item => item.id === eventId);
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

  const emails = candidates.map(candidate => (candidate.session.email || '').trim().toLowerCase());
  if (emails.some(email => !email.endsWith('@iar.ac.in'))) {
    return { ok: false, error: 'All team member emails must be @iar.ac.in.' };
  }

  if (new Set(emails).size !== emails.length) {
    return { ok: false, error: 'Duplicate emails are not allowed in one registration.' };
  }

  const users = await loadUsers();
  const banned = users.find(user => emails.includes(user.email.toLowerCase()) && user.banned);
  if (banned) return { ok: false, error: `${banned.email} is banned by admin.` };

  const allRegistrations = await loadRegistrations();
  if (emails.some(email => registrationExists(allRegistrations, eventId, email))) {
    return { ok: false, error: 'One or more members are already registered in this event.' };
  }

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

  const existingEventRegistrations = allRegistrations.filter(registration => registration.eventId === eventId).length;
  if (existingEventRegistrations + candidates.length > event.capacity) {
    return { ok: false, error: 'Not enough spots left for all team members.' };
  }

  const teamId = event.teamRegistration ? makeId('team') : undefined;
  const teamName = options?.teamName?.trim();

  try {
    const db = getFirebaseDb();
    const batch = writeBatch(db);
    const userPointDeltas = new Map<string, number>();

    for (const candidate of candidates) {
      const synced = await upsertUserFromSession(candidate.session);
      if (!synced.user) return { ok: false, error: synced.error || 'Unable to save member profile.' };

      const registration: EventRegistration = {
        id: makeId('reg'),
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
      };

      batch.set(doc(db, REGISTRATIONS_COLLECTION, registration.id), cleanObj(registration));
      userPointDeltas.set(synced.user.id, (userPointDeltas.get(synced.user.id) || 0) + 25);
    }

    await batch.commit();

    for (const [userId, delta] of userPointDeltas.entries()) {
      await adjustUserPoints(userId, delta);
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'Unable to register right now.' };
  }
}

export async function registerUserForEvent(eventId: string, session: SessionPayload): Promise<{ ok: boolean; error?: string }> {
  return registerForEventWithDetails(eventId, session);
}

export async function getRegistrationsForEvent(eventId: string): Promise<EventRegistrationWithUser[]> {
  const db = getFirebaseDb();
  const eventRegistrationsSnapshot = await getDocs(query(collection(db, REGISTRATIONS_COLLECTION), where('eventId', '==', eventId)));
  const registrations = eventRegistrationsSnapshot.docs.map(item => ({ id: item.id, ...(item.data() as Omit<EventRegistration, 'id'>) }));

  const users = await loadUsers();

  return registrations
    .map(registration => {
      const user = users.find(item => item.id === registration.userId);
      return user ? { ...registration, user } : null;
    })
    .filter((item): item is EventRegistrationWithUser => Boolean(item));
}

export async function getTeamsForEvent(eventId: string): Promise<EventTeam[]> {
  const registrations = await getRegistrationsForEvent(eventId);
  const grouped = new Map<string, EventRegistrationWithUser[]>();

  for (const registration of registrations) {
    const key = registration.teamId || `solo-${registration.id}`;
    const list = grouped.get(key) || [];
    list.push(registration);
    grouped.set(key, list);
  }

  return Array.from(grouped.entries()).map(([teamId, members]) => ({
    teamId,
    teamName: members[0]?.teamName || members[0]?.name || 'Team',
    members: members.sort((a, b) => Number(Boolean(b.isLeader)) - Number(Boolean(a.isLeader))),
  }));
}

export async function updateRegistrationDetails(registrationId: string, patch: Partial<EventRegistration>): Promise<{ ok: boolean; error?: string }> {
  const db = getFirebaseDb();
  const regRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
  const target = await getDoc(regRef);
  if (!target.exists()) return { ok: false, error: 'Registration not found.' };

  const existing = { id: target.id, ...(target.data() as Omit<EventRegistration, 'id'>) };

  const nextEmail = (patch.email ?? existing.email).trim().toLowerCase();
  if (!nextEmail.endsWith('@iar.ac.in')) return { ok: false, error: 'Email must be @iar.ac.in.' };

  const allEventRegistrations = await getRegistrationsForEvent(existing.eventId);
  const duplicate = allEventRegistrations.find(registration => registration.id !== existing.id && registration.email.toLowerCase() === nextEmail);
  if (duplicate) return { ok: false, error: 'Another member already uses this email in this event.' };

  const synced = await upsertUserFromSession({
    name: patch.name ?? existing.name,
    email: nextEmail,
    iarNo: patch.iarNo ?? existing.iarNo,
    department: patch.department ?? existing.department,
    year: patch.year ?? existing.year,
  });
  if (!synced.user) return { ok: false, error: synced.error || 'Unable to update user.' };

  await updateDoc(regRef, cleanObj({
    ...patch,
    userId: synced.user.id,
    email: synced.user.email,
    name: patch.name ?? synced.user.name,
    iarNo: patch.iarNo ?? synced.user.iarNo,
    department: patch.department ?? synced.user.department,
    year: patch.year ?? synced.user.year,
  }));

  return { ok: true };
}

export async function addMemberToTeam(eventId: string, teamId: string, member: TeamMemberInput): Promise<{ ok: boolean; error?: string }> {
  const events = await getEventsWithRegistrationCounts();
  const event = events.find(item => item.id === eventId);
  if (!event) return { ok: false, error: 'Event not found.' };

  const registrations = await loadRegistrations();
  const teamRegistrations = registrations.filter(registration => registration.eventId === eventId && registration.teamId === teamId);
  if (teamRegistrations.length === 0) return { ok: false, error: 'Team not found.' };

  const maxSize = event.teamMaxSize || 4;
  if (teamRegistrations.length >= maxSize) return { ok: false, error: `Team already reached max size (${maxSize}).` };

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
      teamName: teamRegistrations[0].teamName,
      members: [],
      customFieldValues: teamRegistrations[0].customFieldValues,
    }
  );
}

export async function removeMemberFromTeam(registrationId: string): Promise<{ ok: boolean; error?: string }> {
  const db = getFirebaseDb();
  const registrationRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
  const targetSnap = await getDoc(registrationRef);
  if (!targetSnap.exists()) return { ok: false, error: 'Registration not found.' };

  const target = { id: targetSnap.id, ...(targetSnap.data() as Omit<EventRegistration, 'id'>) };

  if (!target.teamId) {
    await removeRegistration(registrationId);
    return { ok: true };
  }

  const registrations = await loadRegistrations();
  const teamMembers = registrations.filter(registration => registration.eventId === target.eventId && registration.teamId === target.teamId);
  if (target.isLeader && teamMembers.length > 1) {
    return { ok: false, error: 'Leader cannot be removed while team still has members.' };
  }

  await removeRegistration(registrationId);
  return { ok: true };
}

export async function removeRegistration(registrationId: string): Promise<void> {
  const db = getFirebaseDb();
  const regRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
  const existing = await getDoc(regRef);
  if (!existing.exists()) return;

  const reg = { id: existing.id, ...(existing.data() as Omit<EventRegistration, 'id'>) };
  await deleteDoc(regRef);
  await adjustUserPoints(reg.userId, -25);
}

export async function addUserToEvent(eventId: string, userId: string): Promise<{ ok: boolean; error?: string }> {
  const users = await loadUsers();
  const user = users.find(item => item.id === userId);
  if (!user) return { ok: false, error: 'User not found.' };
  return registerForEventWithDetails(eventId, user);
}

export async function adjustUserPoints(userId: string, delta: number): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, USERS_COLLECTION, userId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;

  const user = snapshot.data() as StudentUser;
  await updateDoc(ref, {
    points: Math.max(0, (user.points || 0) + delta),
  });
}

export async function banUserPermanently(userId: string): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    banned: true,
  });

  const registrations = await loadRegistrations();
  const related = registrations.filter(registration => registration.userId === userId);
  await Promise.all(related.map(registration => removeRegistration(registration.id)));
}

export async function unbanUser(userId: string): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    banned: false,
  });
}

export async function removeUser(userId: string): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, USERS_COLLECTION, userId));

  const registrations = await loadRegistrations();
  const related = registrations.filter(registration => registration.userId === userId);
  await Promise.all(related.map(registration => deleteDoc(doc(db, REGISTRATIONS_COLLECTION, registration.id))));
}

export async function createManagedEvent(payload: Partial<Event>): Promise<Event> {
  const next: Event = normalizeEvent({
    id: `e${Date.now()}`,
    title: payload.title || 'New Event',
    date: payload.date || new Date().toISOString().split('T')[0],
    endDate: payload.endDate,
    time: payload.time || '10:00 AM IST',
    location: payload.location || 'TBD',
    joinLink: payload.joinLink,
    registrationFormUrl: payload.registrationFormUrl,
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

  const db = getFirebaseDb();
  await setDoc(doc(db, EVENTS_COLLECTION, next.id), cleanObj(next));
  return next;
}

export async function deleteManagedEvent(eventId: string): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, EVENTS_COLLECTION, eventId));

  const registrations = await loadRegistrations();
  const related = registrations.filter(registration => registration.eventId === eventId);
  await Promise.all(related.map(registration => deleteDoc(doc(db, REGISTRATIONS_COLLECTION, registration.id))));
}

import { Announcement, MediaItem, TeamMember } from '@/types';

export async function loadAnnouncements(): Promise<Announcement[]> {
  try {
    const items = await getCollectionDocs<Announcement>(ANNOUNCEMENTS_COLLECTION);
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export async function createAnnouncement(payload: Partial<Announcement>): Promise<Announcement> {
  const next: Announcement = {
    id: `a${Date.now()}`,
    title: payload.title || 'Announcement',
    content: payload.content || '',
    type: payload.type || 'general',
    author: payload.author || 'Admin',
    createdAt: payload.createdAt || new Date().toISOString(),
    pinned: Boolean(payload.pinned),
  };
  const db = getFirebaseDb();
  await setDoc(doc(db, ANNOUNCEMENTS_COLLECTION, next.id), cleanObj(next));
  return next;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, ANNOUNCEMENTS_COLLECTION, id));
}

export async function loadMedia(): Promise<MediaItem[]> {
  try {
    const items = await getCollectionDocs<MediaItem>(MEDIA_COLLECTION);
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export async function createMedia(payload: Partial<MediaItem>): Promise<MediaItem> {
  const next: MediaItem = {
    id: `m${Date.now()}`,
    type: payload.type || 'photo',
    category: payload.category || 'community',
    title: payload.title || 'Media',
    src: payload.src || '',
    thumbnail: payload.thumbnail || payload.src || '',
    link: payload.link,
    event: payload.event,
    date: payload.date || new Date().toISOString().split('T')[0],
  };
  const db = getFirebaseDb();
  await setDoc(doc(db, MEDIA_COLLECTION, next.id), cleanObj(next));
  return next;
}

export async function deleteMedia(id: string): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, MEDIA_COLLECTION, id));
}

export async function loadTeamMembers(): Promise<TeamMember[]> {
  try {
    return await getCollectionDocs<TeamMember>(TEAM_COLLECTION);
  } catch {
    return [];
  }
}

export async function saveTeamMember(payload: TeamMember): Promise<TeamMember> {
  const db = getFirebaseDb();
  await setDoc(doc(db, TEAM_COLLECTION, payload.id), cleanObj(payload));
  return payload;
}

export async function deleteTeamMember(id: string): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, TEAM_COLLECTION, id));
}
