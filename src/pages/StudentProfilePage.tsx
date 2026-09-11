import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { InviteModal } from '../components/discovery/InviteModal';
import { api } from '../services/api';
import {
  User,
  GraduationCap,
  Sparkles,
  Clock,
  Heart,
  FolderKanban,
  Star,
  ExternalLink,
  UserPlus,
  ArrowLeft,
} from 'lucide-react';
import { Github, Linkedin } from '../components/common/Icons';

const DAYS = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
  { id: 'sat', label: 'Sat' },
  { id: 'sun', label: 'Sun' },
];

const TIMES = ['morning', 'afternoon', 'evening'];

export const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      api.users.getStudentById(Number(id))
        .then(res => setStudent(res))
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
        <div className="w-5 h-5 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />
        Loading student developer profile...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-4">
        <User className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Student Profile Not Found</h2>
        <Link to="/discover/students">
          <Button variant="outline" size="sm">
            Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  const schedule = student.scheduleMatrix || {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/discover/students"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Discover Students
      </Link>

      {/* 1. Profile Header Card */}
      <div className="p-6 md:p-8 rounded-3xl glass-card border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              src={student.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={student.full_name}
              className="w-24 h-24 rounded-3xl object-cover border-2 border-slate-700 shadow-xl"
            />
            <div className="space-y-1.5">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{student.full_name}</h1>
              <div className="text-xs text-cyan-300 font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                {student.college || 'Engineering Institute'} · {student.branch || 'Computer Science'}
              </div>
              <div className="text-xs text-slate-400">
                Class of {student.graduation_year || 2026} · Seeking {student.preferred_role || 'Software Engineer'}
              </div>
              {/* Links */}
              <div className="flex items-center gap-4 pt-2 text-xs">
                {student.github_username && (
                  <a
                    href={`https://github.com/${student.github_username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 text-slate-400" />
                    github.com/{student.github_username}
                  </a>
                )}
                {student.linkedin_url && (
                  <a
                    href={student.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="flex-shrink-0">
            <Button
              variant="glow"
              size="md"
              leftIcon={<UserPlus className="w-4 h-4" />}
              onClick={() => setIsInviteOpen(true)}
            >
              Invite to Project
            </Button>
          </div>
        </div>

        {/* Short Bio */}
        {student.bio && (
          <p className="mt-6 pt-5 border-t border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            {student.bio}
          </p>
        )}
      </div>

      {/* 2. AI Profile Summary Synthesis */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/30 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-xs text-cyan-300">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          AI Profile Summary & Strengths Evaluation
        </div>
        <p className="text-xs text-slate-200 leading-relaxed italic">
          "{student.ai_summary || 'Dedicated engineering student with strong technical fundamentals, active GitHub projects, and collaborative mindset.'}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left 2 Cols: Skills & Projects */}
        <div className="md:col-span-2 space-y-8">
          {/* Skills Section */}
          <Card className="p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Technical Proficiencies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(student.skills || []).map((sk: any) => (
                <div
                  key={sk.id}
                  className="p-3 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{sk.name}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{sk.category?.replace('_', ' ')}</div>
                  </div>
                  <Badge variant="blue" size="sm" className="capitalize font-mono">
                    {sk.proficiency} ({sk.years_experience || 1}y)
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Past Projects Section */}
          <Card className="p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Workspaces & Projects ({student.projects?.length || 0})
              </h3>
            </div>

            <div className="space-y-3">
              {(student.projects || []).map((p: any) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-dark-850 border border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Link to={`/projects/${p.id}`} className="font-bold text-white hover:text-cyan-400">
                      {p.title}
                    </Link>
                    <Badge variant="cyan" size="sm">{p.domain}</Badge>
                  </div>
                  {p.description && (
                    <p className="text-slate-400 leading-relaxed line-clamp-2">{p.description}</p>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Role: <strong className="text-slate-300">{p.role || 'Contributor'}</strong></span>
                    <Link to={`/projects/${p.id}`} className="text-cyan-400 hover:underline flex items-center gap-1">
                      Open Project <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Weekly Availability & Collaboration Preferences */}
        <div className="space-y-6">
          {/* Weekly Schedule Matrix */}
          <Card className="p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Availability ({student.weekly_hours || 15}h/wk)
              </h3>
            </div>

            <div className="overflow-x-auto text-[11px]">
              <div className="grid grid-cols-8 gap-1 mb-2 font-mono text-slate-400 text-center">
                <div></div>
                {DAYS.map(d => <div key={d.id}>{d.label}</div>)}
              </div>

              {TIMES.map(time => (
                <div key={time} className="grid grid-cols-8 gap-1 mb-1 items-center">
                  <div className="text-[10px] text-slate-400 capitalize">{time.slice(0, 3)}</div>
                  {DAYS.map(d => {
                    const isAvailable = (schedule[d.id] || []).includes(time);
                    return (
                      <div
                        key={d.id}
                        className={`h-6 rounded flex items-center justify-center font-mono text-[9px] border ${
                          isAvailable
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-dark-900 border-slate-800 text-transparent'
                        }`}
                      >
                        {isAvailable ? '✓' : ''}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>

          {/* Collaboration Preferences */}
          <Card className="p-5 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-purple-400" />
              Collaboration Preferences
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-dark-850">
                <span className="text-slate-400">Team Size:</span>
                <span className="font-semibold text-white">{student.preferred_team_size || 4} Members</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-dark-850">
                <span className="text-slate-400">Work Style:</span>
                <span className="font-semibold text-white capitalize">{student.remote_preference || 'Hybrid'}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-dark-850">
                <span className="text-slate-400">Preferred Role:</span>
                <span className="font-semibold text-cyan-300">{student.preferred_role || 'Engineer'}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Target Domains
              </span>
              <div className="flex flex-wrap gap-1">
                {(student.domains || []).map((d: string) => (
                  <Badge key={d} variant="purple" size="sm">{d}</Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Invite Modal */}
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        candidate={{
          id: student.id,
          name: student.full_name,
          avatar: student.avatar_url,
        }}
      />
    </div>
  );
};
