// ─── Event Types ─────────────────────────────────────────────────────────────
export interface Speaker {
  name: string;
  title: string;
  company: string;
  avatar: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  speaker?: string;
  type: 'talk' | 'workshop' | 'break' | 'panel';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface EventRegistrationField {
  id: string;
  label: string;
  required: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  category: 'hackathon' | 'workshop' | 'talk' | 'bootcamp' | 'community' | 'webinar';
  status: 'upcoming' | 'live' | 'completed' | 'registration-open';
  description: string;
  shortDesc: string;
  banner: string;
  speakers: Speaker[];
  schedule: ScheduleItem[];
  faq: FAQItem[];
  capacity: number;
  registered: number;
  teamRegistration?: boolean;
  teamMinSize?: number;
  teamMaxSize?: number;
  registrationFields?: EventRegistrationField[];
  tags: string[];
}

// ─── User / Team Types ────────────────────────────────────────────────────────
export type AdminRole = 'leader' | 'tech' | 'marketing' | 'documentation' | 'operations' | 'outreach';

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  team: AdminRole | 'student';
  avatar: string;
  bio: string;
  socials: SocialLinks;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: AdminRole | 'student';
  avatar: string;
  points: number;
  rank: number;
  eventsAttended: number;
  eventsRegistered: string[];
  joinedDate: string;
  achievements: Achievement[];
}

// ─── Leaderboard Types ────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  points: number;
  badge: 'gold' | 'silver' | 'bronze' | 'rising-star' | 'contributor';
  eventsAttended: number;
  contributions: number;
  team: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  color: string;
}

// ─── Media Types ──────────────────────────────────────────────────────────────
export type MediaType = 'photo' | 'video';
export type MediaCategory = 'hackathon' | 'workshop' | 'community' | 'highlights' | 'team';

export interface MediaItem {
  id: string;
  type: MediaType;
  category: MediaCategory;
  title: string;
  src: string;
  thumbnail: string;
  link?: string;
  event?: string;
  date: string;
}

// ─── Announcement Types ───────────────────────────────────────────────────────
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'event' | 'urgent' | 'achievement';
  author: string;
  createdAt: string;
  pinned: boolean;
}

// ─── Community Types ──────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  contributors: number;
  stars: number;
  githubUrl?: string;
  status: 'active' | 'completed' | 'looking-for-contributors';
}

export interface StudyGroup {
  id: string;
  name: string;
  topic: string;
  members: number;
  schedule: string;
  lead: string;
}

// ─── Analytics Types ──────────────────────────────────────────────────────────
export interface AnalyticsData {
  month: string;
  members: number;
  events: number;
  registrations: number;
}
