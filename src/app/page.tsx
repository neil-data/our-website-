import { loadManagedEvents, loadUsers, loadMedia } from '@/lib/adminData';
import HeroSection from '@/components/home/HeroSection';
import CommunityImpactSection from '@/components/home/CommunityImpactSection';
import UpcomingEventsSection from '@/components/home/UpcomingEventsSection';
import LeaderboardPreviewSection from '@/components/home/LeaderboardPreviewSection';
import MediaPreviewSection from '@/components/home/MediaPreviewSection';
import TeamPreviewSection from '@/components/home/TeamPreviewSection';

export const revalidate = 60; // Revalidate every minute 

export default async function HomePage() {
  const [events, users, media] = await Promise.all([
    loadManagedEvents(),
    loadUsers(),
    loadMedia()
  ]);

  const membersCount = users.length > 0 ? users.length : 100;
  const eventsCount = events.length > 0 ? events.length : 2;
  const workshopsCount = events.filter(e => e.category === 'workshop' || e.category === 'bootcamp').length || 1;
  const prizeMoney = 10; // Keep static or derive if possible

  return (
    <>
      <HeroSection />
      <CommunityImpactSection 
        membersCount={membersCount}
        eventsCount={eventsCount}
        workshopsCount={workshopsCount}
        prizeMoney={prizeMoney}
      />
      <UpcomingEventsSection events={events} />
      <LeaderboardPreviewSection users={users} />
      <MediaPreviewSection media={media} />
      <TeamPreviewSection />
    </>
  );
}
