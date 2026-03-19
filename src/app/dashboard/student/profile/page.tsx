'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Star, Award, Calendar, Code2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { upsertUserFromSession } from '@/lib/adminData';

interface StudentSession {
  name: string;
  email: string;
  iarNo?: string;
  department?: string;
  year?: string;
  bio?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  avatar?: string;
}

export default function StudentProfilePage() {
  const [session, setSession] = useState<StudentSession | null>(null);
  const [saved, setSaved] = useState(false);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formIarNo, setFormIarNo] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formGithub, setFormGithub] = useState('');
  const [formLinkedin, setFormLinkedin] = useState('');
  const [formAvatar, setFormAvatar] = useState('');

  const AVATAR_OPTIONS = [
    'https://api.dicebear.com/7.x/avataaars/png?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Nala',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Zoe',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Leo',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Milo',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Jasper',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Luna',
  ];

  useEffect(() => {
    const raw = localStorage.getItem('gdgoc-student-session');
    if (raw) {
      const s: StudentSession = JSON.parse(raw);
      setSession(s);
      setFormName(s.name || '');
      setFormEmail(s.email || '');
      setFormIarNo(s.iarNo || '');
      setFormDepartment(s.department || '');
      setFormYear(s.year || '');
      setFormBio(s.bio || '');
      setFormPhone(s.phone || '');
      setFormGithub(s.github || '');
      setFormLinkedin(s.linkedin || '');
      setFormAvatar(s.avatar || '');
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentSession = {
      name: formName,
      email: formEmail,
      iarNo: formIarNo,
      department: formDepartment,
      year: formYear,
      bio: formBio,
      phone: formPhone,
      github: formGithub,
      linkedin: formLinkedin,
      avatar: formAvatar,
    };
    localStorage.setItem('gdgoc-student-session', JSON.stringify(updated));
    await upsertUserFromSession(updated);
    setSession(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const name = session?.name || 'Student';
  const email = session?.email || '';
  const avatar = formAvatar || `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(name.replace(/\s+/g, ''))}`;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-white">My Profile</h1>
        <p className="text-white/40 text-sm font-mono mt-1">Manage your profile and view achievements</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard animate={false} className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-g-blue/30">
              <Image src={avatar} alt={name} fill className="object-cover" />
            </div>
            <div className="font-semibold text-white text-lg mb-0.5">{name}</div>
            <div className="text-white/35 text-xs font-mono mb-3">{email}</div>
            <Badge variant="blue" className="mb-4">Member</Badge>
            <div className="separator-line my-4" />
            <div className="grid grid-cols-2 gap-4 text-center mb-4">
              <div>
                <div className="flex items-center justify-center gap-1 text-g-blue font-bold text-xl">
                  <Star size={14} />0
                </div>
                <div className="text-white/25 text-[10px] font-mono uppercase">Points</div>
              </div>
              <div>
                <div className="text-g-green font-bold text-xl">—</div>
                <div className="text-white/25 text-[10px] font-mono uppercase">Rank</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-white font-bold text-xl">
                  <Calendar size={14} />0
                </div>
                <div className="text-white/25 text-[10px] font-mono uppercase">Events</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-white font-bold text-xl">
                  <Code2 size={14} />0
                </div>
                <div className="text-white/25 text-[10px] font-mono uppercase">Contributions</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Edit form + Achievements */}
        <div className="lg:col-span-3 space-y-6">
          <GlassCard animate={false}>
            <h2 className="section-number mb-5">Edit Profile</h2>
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Full Name</label>
                  <input value={formName} onChange={e => setFormName(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Email</label>
                  <input value={formEmail} onChange={e => setFormEmail(e.target.value)} className="form-input" type="email" />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">IAR No</label>
                  <input value={formIarNo} onChange={e => setFormIarNo(e.target.value)} className="form-input" placeholder="IAR number" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Department</label>
                  <input value={formDepartment} onChange={e => setFormDepartment(e.target.value)} className="form-input" placeholder="e.g., CSE" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Year</label>
                  <select value={formYear} onChange={e => setFormYear(e.target.value)} className="form-input">
                    <option value="" className="bg-dark-card">Select</option>
                    <option value="1st" className="bg-dark-card">1st Year</option>
                    <option value="2nd" className="bg-dark-card">2nd Year</option>
                    <option value="3rd" className="bg-dark-card">3rd Year</option>
                    <option value="4th" className="bg-dark-card">4th Year</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Phone</label>
                <input value={formPhone} onChange={e => setFormPhone(e.target.value)} className="form-input" placeholder="+91 ..." />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Bio</label>
                <textarea value={formBio} onChange={e => setFormBio(e.target.value)} className="form-input resize-none" rows={3} placeholder="Tell us about yourself..." />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-4">Choose Avatar</label>
                <div className="flex flex-wrap gap-3">
                  {AVATAR_OPTIONS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormAvatar(url)}
                      className={cn(
                        "relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-110",
                        formAvatar === url ? "border-g-blue scale-110" : "border-white/10"
                      )}
                    >
                      <Image src={url} alt={`Avatar ${i}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">GitHub</label>
                  <input value={formGithub} onChange={e => setFormGithub(e.target.value)} className="form-input" placeholder="github.com/..." />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">LinkedIn</label>
                  <input value={formLinkedin} onChange={e => setFormLinkedin(e.target.value)} className="form-input" placeholder="linkedin.com/in/..." />
                </div>
              </div>
              <button type="submit" className="btn-skew bg-g-blue border border-g-blue text-white text-xs font-mono uppercase tracking-widest px-6 py-2.5 hover:bg-g-blue/80 transition-all">
                <span>{saved ? 'Saved ✓' : 'Save Changes'}</span>
              </button>
            </form>
          </GlassCard>

          {/* Achievements */}
          <GlassCard animate={false}>
            <h2 className="section-number mb-5 flex items-center gap-2"><Award size={13} /> Achievements</h2>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Award size={28} className="text-white/10 mb-3" />
              <p className="text-white/30 text-sm font-mono">No achievements yet. Attend events to earn badges!</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
