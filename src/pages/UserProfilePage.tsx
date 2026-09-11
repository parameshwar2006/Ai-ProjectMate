import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';
import { User, Save, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [bio, setBio] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [hours, setHours] = useState(18);
  const [role, setRole] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user?.id) {
      api.users.getStudentById(user.id).then(res => {
        if (res) {
          setProfile(res);
          setBio(res.bio || '');
          setCollege(res.college || '');
          setBranch(res.branch || '');
          setHours(res.weekly_hours || 18);
          setRole(res.preferred_role || '');
        }
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await api.users.updateProfile({
        bio,
        college,
        branch,
        weekly_hours: Number(hours),
        preferred_role: role,
      });
      setSaveSuccess(true);
      await refreshUser();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            My Developer Profile
          </h1>
          <p className="text-xs text-slate-400">Manage your skills, campus credentials, and availability</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile updated successfully! AI matching algorithms have refreshed your compatibility.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">College</label>
              <input
                type="text"
                value={college}
                onChange={e => setCollege(e.target.value)}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Branch</label>
              <input
                type="text"
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Role</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Weekly Availability (Hours)</label>
              <input
                type="number"
                value={hours}
                onChange={e => setHours(Number(e.target.value))}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Current Skills Display */}
        {profile?.skills && (
          <Card className="p-6 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Verified Skills ({profile.skills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((sk: any) => (
                <Badge key={sk.id} variant="blue" size="md">
                  <span>{sk.name}</span>
                  <span className="text-[10px] opacity-75 capitalize">({sk.proficiency})</span>
                </Badge>
              ))}
            </div>
          </Card>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="glow"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
