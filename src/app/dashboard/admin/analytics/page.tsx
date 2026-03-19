'use client';
import { GlassCard } from '@/components/ui/GlassCard';
import { BarChart, Construction, LineChart } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-white">Platform Analytics</h1>
        <p className="text-white/40 text-sm font-mono mt-1">Review user engagement and event statistics</p>
      </div>

      <GlassCard animate={false} className="min-h-[50vh] flex flex-col items-center justify-center border-dashed border-white/20">
        <Construction size={48} className="text-white/20 mb-4" />
        <h2 className="font-heading text-xl text-white mb-2">Analytics Dashboard Under Construction</h2>
        <p className="text-white/40 text-sm max-w-md text-center">
          The analytics system is currently being built. Soon, this page will display comprehensive charts and metrics about community growth, track event registrations, and measure engagement across all groups.
        </p>
        <div className="flex gap-4 mt-6">
          <div className="w-12 h-12 rounded-lg bg-g-blue/10 flex items-center justify-center border border-g-blue/20">
            <LineChart className="text-g-blue/50" />
          </div>
          <div className="w-12 h-12 rounded-lg bg-g-red/10 flex items-center justify-center border border-g-red/20">
            <BarChart className="text-g-red/50" />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
