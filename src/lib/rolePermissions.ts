import { AdminRole } from '@/types';

export type DashboardModule =
  | 'overview'
  | 'events'
  | 'users'
  | 'queries'
  | 'leaderboard'
  | 'media'
  | 'announcements'
  | 'analytics'
  | 'settings';

const ALL_MODULES: DashboardModule[] = [
  'overview', 'events', 'users', 'queries', 'leaderboard', 'media', 'announcements', 'analytics', 'settings',
];

const ROLE_PERMISSIONS: Record<AdminRole, DashboardModule[]> = {
  leader: ALL_MODULES, // Leaders have full access to everything
  tech: ALL_MODULES, // Tech team: all modules (events, users, analytics, etc.)
  marketing: ['overview', 'announcements', 'media', 'events', 'analytics', 'queries'], // Marketing: media, analytics, events, announcements, queries
  documentation: ['overview', 'media', 'announcements', 'queries'], // Documentation: media, announcements, queries
  operations: ['overview', 'events', 'users', 'leaderboard', 'analytics', 'queries'], // Operations: events, users, leaderboard, queries
  outreach: ['overview', 'announcements', 'analytics', 'events', 'queries'], // Outreach: announcements, analytics, events, queries
};

const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  leader: 'Full access to all administrative modules',
  tech: 'Full access to all technical and administrative modules',
  marketing: 'Access to media, announcements, events, analytics, and queries',
  documentation: 'Access to media, announcements, and queries',
  operations: 'Access to events, users, leaderboard, analytics, and queries',
  outreach: 'Access to announcements, analytics, events, and queries',
};

export function getModulesForRole(role: AdminRole): DashboardModule[] {
  return ROLE_PERMISSIONS[role] ?? ['overview'];
}

export function canAccess(role: AdminRole, module: DashboardModule): boolean {
  return ROLE_PERMISSIONS[role]?.includes(module) ?? false;
}

export function getRoleDescription(role: AdminRole): string {
  return ROLE_DESCRIPTIONS[role] ?? 'Limited access';
}

export const AVAILABLE_ROLES: AdminRole[] = [
  'leader',
  'tech',
  'marketing',
  'documentation',
  'operations',
  'outreach',
];
