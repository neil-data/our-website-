"use client";

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlobalSettings, loadSettings, saveSettings } from '@/lib/adminData';

const MAINTENANCE_KEY = 'gdgoc-maintenance-mode';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    await saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateMaintenanceMode = (enabled: boolean) => {
    if (!settings) return;
    const next = { ...settings, maintenanceMode: enabled };
    setSettings(next);
    window.localStorage.setItem(MAINTENANCE_KEY, enabled ? 'on' : 'off');
    window.dispatchEvent(new Event('maintenance-mode-changed'));
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm font-mono mt-1">Platform and chapter configuration</p>
      </div>

      <div className="space-y-6">
        {/* General */}
        <GlassCard animate={false}>
          <h2 className="section-number mb-5">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Chapter Name</label>
              <input 
                value={settings?.chapterName || ''} 
                onChange={e => setSettings(s => s ? {...s, chapterName: e.target.value} : null)}
                className="form-input" 
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Chapter Email</label>
              <input 
                value={settings?.chapterEmail || ''} 
                onChange={e => setSettings(s => s ? {...s, chapterEmail: e.target.value} : null)}
                className="form-input" 
                type="email" 
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Institution</label>
              <input 
                value={settings?.institution || ''} 
                onChange={e => setSettings(s => s ? {...s, institution: e.target.value} : null)}
                className="form-input" 
              />
            </div>
          </div>
        </GlassCard>

        {/* Leaderboard */}
        <GlassCard animate={false}>
          <h2 className="section-number mb-5">Leaderboard Configuration</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Pts per Event Attended</label>
                <input 
                  type="number" 
                  value={settings?.pointsConfig.eventAttended || 0} 
                  onChange={e => setSettings(s => s ? {...s, pointsConfig: {...s.pointsConfig, eventAttended: parseInt(e.target.value)}} : null)}
                  className="form-input" 
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Pts for Speaking</label>
                <input 
                  type="number" 
                  value={settings?.pointsConfig.speaking || 0} 
                  onChange={e => setSettings(s => s ? {...s, pointsConfig: {...s.pointsConfig, speaking: parseInt(e.target.value)}} : null)}
                  className="form-input" 
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Pts for Organizing</label>
                <input 
                  type="number" 
                  value={settings?.pointsConfig.organizing || 0} 
                  onChange={e => setSettings(s => s ? {...s, pointsConfig: {...s.pointsConfig, organizing: parseInt(e.target.value)}} : null)}
                  className="form-input" 
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Pts for Hackathon Win</label>
                <input 
                  type="number" 
                  value={settings?.pointsConfig.hackathonWin || 0} 
                  onChange={e => setSettings(s => s ? {...s, pointsConfig: {...s.pointsConfig, hackathonWin: parseInt(e.target.value)}} : null)}
                  className="form-input" 
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Social */}
        <GlassCard animate={false}>
          <h2 className="section-number mb-5">Social Links</h2>
          <div className="space-y-3">
            {['github', 'linkedin', 'instagram', 'twitter', 'youtube'].map(platform => (
              <div key={platform}>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-1">{platform}</label>
                <input 
                  className="form-input" 
                  value={(settings?.socials as any)?.[platform] || ''}
                  onChange={e => setSettings(s => s ? {...s, socials: {...s.socials, [platform]: e.target.value}} : null)}
                  placeholder={`https://${platform.toLowerCase()}.com/gdgoc-iar`} 
                />
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Maintenance */}
        <GlassCard animate={false}>
          <h2 className="section-number mb-5">Maintenance Mode</h2>
          <p className="text-white/45 text-sm mb-5">
            Turn this on to temporarily show a maintenance page to public and student routes.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => updateMaintenanceMode(true)}
              className={`btn-skew text-xs font-mono uppercase tracking-widest px-6 py-2.5 transition-all ${
                settings?.maintenanceMode
                  ? 'bg-g-red border border-g-red text-white'
                  : 'bg-transparent border border-white/15 text-white/60 hover:border-white/30'
              }`}
            >
              <span>ON</span>
            </button>
            <button
              type="button"
              onClick={() => updateMaintenanceMode(false)}
              className={`btn-skew text-xs font-mono uppercase tracking-widest px-6 py-2.5 transition-all ${
                !settings?.maintenanceMode
                  ? 'bg-g-green border border-g-green text-white'
                  : 'bg-transparent border border-white/15 text-white/60 hover:border-white/30'
              }`}
            >
              <span>OFF</span>
            </button>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest mt-4 text-white/35">
            Current Status: {settings?.maintenanceMode ? 'ON' : 'OFF'}
          </p>
        </GlassCard>

        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            className="btn-skew bg-g-blue border border-g-blue text-white text-xs font-mono uppercase tracking-widest px-6 py-2.5 hover:bg-g-blue/80 transition-all"
          >
            <span>{saved ? 'Saved ✓' : 'Save All Settings'}</span>
          </button>
          <button 
            onClick={() => loadSettings().then(setSettings)}
            className="btn-skew bg-transparent border border-white/15 text-white/60 text-xs font-mono uppercase tracking-widest px-6 py-2.5 hover:border-white/30 transition-all"
          >
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
}
