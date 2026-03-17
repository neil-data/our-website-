import { mockMedia } from '@/data/media';
import { mockTeam } from '@/data/team';
import { MediaItem, TeamMember } from '@/types';

const MEDIA_KEY = 'gdgoc-media-items';
const TEAM_KEY = 'gdgoc-team-members';

const canUseStorage = () => typeof window !== 'undefined';

export function loadMediaItems(): MediaItem[] {
  if (!canUseStorage()) return mockMedia;
  const raw = window.localStorage.getItem(MEDIA_KEY);
  if (!raw) return mockMedia;
  try {
    const parsed = JSON.parse(raw) as MediaItem[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockMedia;
  } catch {
    return mockMedia;
  }
}

export function saveMediaItems(items: MediaItem[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(MEDIA_KEY, JSON.stringify(items));
}

export function resetMediaItems(): MediaItem[] {
  if (canUseStorage()) {
    window.localStorage.removeItem(MEDIA_KEY);
  }
  return mockMedia;
}

export function loadTeamMembers(): TeamMember[] {
  if (!canUseStorage()) return mockTeam;
  const raw = window.localStorage.getItem(TEAM_KEY);
  if (!raw) return mockTeam;
  try {
    const parsed = JSON.parse(raw) as TeamMember[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockTeam;
  } catch {
    return mockTeam;
  }
}

export function saveTeamMembers(items: TeamMember[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(TEAM_KEY, JSON.stringify(items));
}

export function resetTeamMembers(): TeamMember[] {
  if (canUseStorage()) {
    window.localStorage.removeItem(TEAM_KEY);
  }
  return mockTeam;
}