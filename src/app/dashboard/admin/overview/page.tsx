'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminOverviewPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/admin/events');
  }, [router]);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-g-blue border-r-g-red border-b-g-yellow border-l-g-green animate-spin mx-auto mb-4" />
        <p className="text-white/40 text-sm font-mono">Redirecting to Events Dashboard...</p>
      </div>
    </div>
  );
}
