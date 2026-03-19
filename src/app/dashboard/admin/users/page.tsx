'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { AdminRole, TeamMember } from '@/types';
import { loadTeamMembers, saveTeamMember, deleteTeamMember } from '@/lib/adminData';
import {
  adjustUserPoints,
  banUserPermanently,
  loadUsers,
  removeUser,
  StudentUser,
  unbanUser,
  upsertUserFromSession,
} from '../../../../lib/adminData';
import { Plus, Search, Trash2, RotateCcw, Pencil, Ban, Minus, PlusCircle, ShieldCheck } from 'lucide-react';

const TEAM_OPTIONS: AdminRole[] = ['leader', 'tech', 'marketing', 'documentation', 'operations', 'outreach'];

const emptyTeamForm = {
  name: '',
  role: '',
  team: 'tech' as AdminRole,
  bio: '',
  linkedin: '',
  github: '',
  twitter: '',
  instagram: '',
};

const emptyUserForm = {
  name: '',
  email: '',
  iarNo: '',
  department: '',
  year: '',
  phone: '',
};

export default function AdminUsersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [users, setUsers] = useState<StudentUser[]>([]);
  const [search, setSearch] = useState('');
  const [teamForm, setTeamForm] = useState(emptyTeamForm);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const refreshUsers = async () => {
    setUsers(await loadUsers());
  };

  const showNotice = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 2200);
  };

  const fetchTeam = async () => {
    setMembers(await loadTeamMembers());
  };

  useEffect(() => {
    let mounted = true;
    const initialize = async () => {
      if (!mounted) return;
      await fetchTeam();
      await refreshUsers();
    };

    void initialize();

    return () => {
      mounted = false;
    };
  }, []);

  // removed updateMembers

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.department.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase()) ||
    m.team.toLowerCase().includes(search.toLowerCase())
  );

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name.trim() || !teamForm.role.trim() || !teamForm.bio.trim()) return;

    const payload: TeamMember = {
      id: editingId || `t${Date.now()}`,
      name: teamForm.name.trim(),
      role: teamForm.role.trim(),
      team: teamForm.team,
      avatar: `https://api.dicebear.com/7.x/micah/png?seed=${encodeURIComponent(teamForm.name.trim())}`,
      bio: teamForm.bio.trim(),
      socials: {
        linkedin: teamForm.linkedin.trim() || undefined,
        github: teamForm.github.trim() || undefined,
        twitter: teamForm.twitter.trim() || undefined,
        instagram: teamForm.instagram.trim() || undefined,
      },
    };

    await saveTeamMember(payload);
    await fetchTeam();

    setTeamForm(emptyTeamForm);
    setEditingId(null);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setTeamForm({
      name: member.name,
      role: member.role,
      team: member.team as AdminRole,
      bio: member.bio,
      linkedin: member.socials.linkedin || '',
      github: member.socials.github || '',
      twitter: member.socials.twitter || '',
      instagram: member.socials.instagram || '',
    });
  };

  const handleRemoveMember = async (id: string) => {
    await deleteTeamMember(id);
    await fetchTeam();
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await upsertUserFromSession(userForm);
    if (!result.user) {
      showNotice(result.error || 'Unable to add user.');
      return;
    }
    setUserForm(emptyUserForm);
    await refreshUsers();
    showNotice('User added successfully.');
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-white">Users & Team Management</h1>
        <p className="text-white/40 text-sm font-mono mt-1">Admin can access all user details, points, bans, and team data</p>
      </div>

      {notice && <p className="text-xs font-mono text-g-yellow mb-4">{notice}</p>}

      <GlassCard animate={false} className="mb-6" glowColor="green">
        <h2 className="section-number mb-4">Add Student User</h2>
        <form onSubmit={handleAddUser} className="grid md:grid-cols-3 gap-4">
          <input className="form-input" placeholder="Name" value={userForm.name} onChange={e => setUserForm(prev => ({ ...prev, name: e.target.value }))} required />
          <input className="form-input" placeholder="Email (@iar.ac.in)" value={userForm.email} onChange={e => setUserForm(prev => ({ ...prev, email: e.target.value }))} required />
          <input className="form-input" placeholder="IAR No" value={userForm.iarNo} onChange={e => setUserForm(prev => ({ ...prev, iarNo: e.target.value }))} />
          <input className="form-input" placeholder="Department" value={userForm.department} onChange={e => setUserForm(prev => ({ ...prev, department: e.target.value }))} />
          <input className="form-input" placeholder="Year" value={userForm.year} onChange={e => setUserForm(prev => ({ ...prev, year: e.target.value }))} />
          <div className="flex gap-2">
            <input className="form-input" placeholder="Phone" value={userForm.phone} onChange={e => setUserForm(prev => ({ ...prev, phone: e.target.value }))} />
            <button type="submit" className="btn-skew bg-g-green border border-g-green text-white text-xs font-mono uppercase tracking-widest px-5 py-2.5 hover:bg-g-green/80 transition-all flex items-center gap-2">
              <span className="flex items-center gap-2"><Plus size={12} /> Add</span>
            </button>
          </div>
        </form>
      </GlassCard>

      <GlassCard animate={false} className="mb-8">
        <div className="relative mb-4 max-w-[320px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search users or team..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input pl-9 py-2 text-xs"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="text-left">User</th>
                <th className="text-left hidden md:table-cell">Details</th>
                <th className="text-left hidden lg:table-cell">Social</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                  <td>
                    <div>
                      <div className="text-sm text-white font-medium flex items-center gap-2">
                        {user.name}
                        {user.banned && <span className="text-[10px] text-g-red font-mono uppercase">Banned</span>}
                      </div>
                      <div className="text-[10px] text-white/30 font-mono">{user.email}</div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <div className="text-xs text-white/40 font-mono">IAR: {user.iarNo || '-'} | Dept: {user.department || '-'} | Year: {user.year || '-'}</div>
                    <div className="text-xs text-white/25 font-mono">Phone: {user.phone || '-'} | Points: {user.points}</div>
                  </td>
                  <td className="hidden lg:table-cell">
                    <div className="text-xs text-white/35">GitHub: {user.github || '-'}</div>
                    <div className="text-xs text-white/35">LinkedIn: {user.linkedin || '-'}</div>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={async () => { await adjustUserPoints(user.id, -50); await refreshUsers(); }} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-red hover:border-g-red/30 transition-colors"><Minus size={11} /></button>
                      <button onClick={async () => { await adjustUserPoints(user.id, 50); await refreshUsers(); }} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-green hover:border-g-green/30 transition-colors"><PlusCircle size={11} /></button>
                      {user.banned ? (
                        <button onClick={async () => { await unbanUser(user.id); await refreshUsers(); showNotice('User unbanned.'); }} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-blue hover:border-g-blue/30 transition-colors"><ShieldCheck size={11} /></button>
                      ) : (
                        <button onClick={async () => { await banUserPermanently(user.id); await refreshUsers(); showNotice('User banned.'); }} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-red hover:border-g-red/30 transition-colors"><Ban size={11} /></button>
                      )}
                      <button onClick={async () => { await removeUser(user.id); await refreshUsers(); showNotice('User removed.'); }} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-red hover:border-g-red/30 transition-colors"><Trash2 size={11} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-white">Team Management</h2>
      </div>

      <GlassCard animate={false} className="mb-6" glowColor="blue">
        <h2 className="section-number mb-4">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h2>
        <form onSubmit={handleTeamSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <input className="form-input" value={teamForm.name} onChange={e => setTeamForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Name" />
            <input className="form-input" value={teamForm.role} onChange={e => setTeamForm(prev => ({ ...prev, role: e.target.value }))} placeholder="Role" />
            <select className="form-input" value={teamForm.team} onChange={e => setTeamForm(prev => ({ ...prev, team: e.target.value as AdminRole }))}>
              {TEAM_OPTIONS.map(opt => (
                <option key={opt} value={opt} className="bg-dark-card">{opt}</option>
              ))}
            </select>
          </div>
          <textarea className="form-input resize-none" rows={3} value={teamForm.bio} onChange={e => setTeamForm(prev => ({ ...prev, bio: e.target.value }))} placeholder="Bio" />
          <div className="grid md:grid-cols-4 gap-4">
            <input className="form-input" placeholder="LinkedIn URL" value={teamForm.linkedin} onChange={e => setTeamForm(prev => ({ ...prev, linkedin: e.target.value }))} />
            <input className="form-input" placeholder="GitHub URL" value={teamForm.github} onChange={e => setTeamForm(prev => ({ ...prev, github: e.target.value }))} />
            <input className="form-input" placeholder="Twitter URL" value={teamForm.twitter} onChange={e => setTeamForm(prev => ({ ...prev, twitter: e.target.value }))} />
            <input className="form-input" placeholder="Instagram URL" value={teamForm.instagram} onChange={e => setTeamForm(prev => ({ ...prev, instagram: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-skew bg-g-blue border border-g-blue text-white text-xs font-mono uppercase tracking-widest px-5 py-2.5 hover:bg-g-blue/80 transition-all flex items-center gap-2">
              <span className="flex items-center gap-2"><Plus size={12} /> {editingId ? 'Save Changes' : 'Add Member'}</span>
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTeamForm(emptyTeamForm);
                }}
                className="btn-skew bg-transparent border border-white/20 text-white/70 text-xs font-mono uppercase tracking-widest px-5 py-2.5 hover:border-white/40 transition-all"
              >
                <span>Cancel Edit</span>
              </button>
            )}
          </div>
        </form>
      </GlassCard>

      <GlassCard animate={false}>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="text-left">Member</th>
                <th className="text-left hidden md:table-cell">Team</th>
                <th className="text-left hidden lg:table-cell">Bio</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, i) => (
                <motion.tr key={member.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                        <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="text-sm text-white font-medium">{member.name}</div>
                        <div className="text-[10px] text-white/30 font-mono">{member.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className="text-white/40 text-xs font-mono uppercase">{member.team}</span>
                  </td>
                  <td className="hidden lg:table-cell">
                    <span className="text-white/40 text-xs line-clamp-1">{member.bio}</span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(member)} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-blue hover:border-g-blue/30 transition-colors"><Pencil size={12} /></button>
                      <button onClick={() => void handleRemoveMember(member.id)} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-g-red hover:border-g-red/30 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
