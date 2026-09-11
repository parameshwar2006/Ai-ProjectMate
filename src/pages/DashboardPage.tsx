import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { InviteModal } from '../components/discovery/InviteModal';
import { api } from '../services/api';
import {
  Sparkles,
  FolderKanban,
  Users,
  Bell,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Plus,
  ExternalLink,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { notifications, invitations, respondToInvitation } = useNotifications();
  const navigate = useNavigate();

  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [recommendedTeammates, setRecommendedTeammates] = useState<any[]>([]);
  const [recommendedProjects, setRecommendedProjects] = useState<any[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Invite modal target
  const [inviteTarget, setInviteTarget] = useState<{ id: number; name: string; avatar: string } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [allProjects, recProjects, recStudents] = await Promise.all([
          api.projects.getProjects().catch(() => []),
          api.matching.getRecommendedProjects().catch(() => []),
          api.matching.getTeammateMatches(1).catch(() => []), // Matches for user's primary project
        ]);

        // Filter projects where current user is owner or member
        const userProjects = (allProjects || []).filter(
          (p: any) =>
            p.owner_id === user?.id ||
            p.members?.some((m: any) => m.id === user?.id || m.user_id === user?.id)
        );

        setActiveProjects(userProjects.length > 0 ? userProjects : (allProjects || []).slice(0, 2));
        setRecommendedProjects((recProjects || []).slice(0, 4));
        setRecommendedTeammates((recStudents || []).slice(0, 3));

        // Gather tasks from active projects
        if (allProjects && allProjects.length > 0) {
          const firstProjTasks = await api.tasks.getTasks(allProjects[0].id).catch(() => []);
          setUpcomingTasks((firstProjTasks || []).filter((t: any) => t.status !== 'completed').slice(0, 4));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Engineer';

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* 1. Header with Personalized Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Good morning, {firstName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here is what is happening with your projects and team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/discover/projects">
            <Button variant="outline" size="sm">
              Discover Projects
            </Button>
          </Link>
          <Link to="/discover/students">
            <Button variant="glow" size="sm" leftIcon={<Users className="w-3.5 h-3.5" />}>
              Find Teammates
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Top Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Your Match Score */}
        <Card className="p-5 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Your Match Score</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono flex items-baseline gap-1">
            94<span className="text-lg text-cyan-400">%</span>
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Top 5% compatibility in {user?.branch || 'Engineering'}
          </p>
        </Card>

        {/* Card 2: Recommended Projects */}
        <Card className="p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Recommended Projects</span>
            <FolderKanban className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {recommendedProjects.length || 8}
          </div>
          <p className="text-[11px] text-slate-400">
            Matching your skills & domain
          </p>
        </Card>

        {/* Card 3: Pending Invitations */}
        <Card className="p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Invitations</span>
            <Bell className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {invitations.filter(i => i.status === 'pending').length}
          </div>
          <Link to="/notifications" className="text-[11px] text-cyan-400 hover:underline block">
            Review invites →
          </Link>
        </Card>

        {/* Card 4: Active Projects */}
        <Card className="p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Workspaces</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {activeProjects.length}
          </div>
          <p className="text-[11px] text-slate-400">
            Currently in active sprints
          </p>
        </Card>
      </div>

      {/* 3. Pending Invitations Callout (If Any) */}
      {invitations.filter(i => i.status === 'pending').length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-300">
            <span className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400 animate-bounce" />
              Team Invitation Pending Your Decision
            </span>
            <Link to="/notifications" className="text-cyan-400 hover:underline">
              View All
            </Link>
          </div>
          {invitations
            .filter(i => i.status === 'pending')
            .slice(0, 1)
            .map(inv => (
              <div
                key={inv.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-dark-900/90 border border-slate-700/80"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={inv.sender_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-slate-600"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {inv.sender_name} invited you to join <span className="text-cyan-400 font-bold">"{inv.project_title}"</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Offered Role: <span className="text-slate-200">{inv.role_offered}</span> · "{inv.message}"
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => respondToInvitation(inv.id, 'decline')}
                    className="text-xs"
                  >
                    Decline
                  </Button>
                  <Button
                    variant="glow"
                    size="sm"
                    onClick={() => respondToInvitation(inv.id, 'accept')}
                    className="text-xs"
                  >
                    Accept & Join
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 4. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Current Projects & AI Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Projects Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-cyan-400" />
                Active Workspaces
              </h3>
              <Link to="/discover/projects" className="text-xs text-cyan-400 hover:underline">
                Explore all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeProjects.map(proj => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="cyan" size="sm">{proj.domain}</Badge>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Target: {proj.deadline ? new Date(proj.deadline).toLocaleDateString() : 'Sprint 4'}
                      </span>
                    </div>

                    <Link
                      to={`/projects/${proj.id}`}
                      className="text-sm font-bold text-white hover:text-cyan-400 transition-colors line-clamp-1 mb-1 block"
                    >
                      {proj.title}
                    </Link>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Milestone Progress</span>
                        <span className="font-semibold text-slate-200">{proj.progress_pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                          style={{ width: `${proj.progress_pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      {(proj.members || []).slice(0, 3).map((m: any, idx: number) => (
                        <img
                          key={idx}
                          src={m.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover border-2 border-dark-900"
                        />
                      ))}
                    </div>

                    <Link to={`/projects/${proj.id}`}>
                      <Button variant="secondary" size="sm" className="text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Open Workspace
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommended Teammates Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                AI Recommended Teammates
              </h3>
              <Link to="/discover/students" className="text-xs text-cyan-400 hover:underline">
                View all candidates →
              </Link>
            </div>

            <div className="space-y-3">
              {recommendedTeammates.map(candidate => (
                <div
                  key={candidate.studentId}
                  className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={candidate.avatarUrl}
                      alt={candidate.studentName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/students/${candidate.studentId}`}
                          className="text-sm font-bold text-white hover:text-cyan-400 transition-colors truncate"
                        >
                          {candidate.studentName}
                        </Link>
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                          {candidate.overallScore}% Match
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {candidate.college} · {candidate.branch}
                      </div>
                      <div className="text-[11px] text-cyan-300 mt-1 truncate">
                        {candidate.explanation}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/students/${candidate.studentId}`}>
                      <Button variant="secondary" size="sm" className="text-xs">
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="glow"
                      size="sm"
                      className="text-xs"
                      onClick={() =>
                        setInviteTarget({
                          id: candidate.studentId,
                          name: candidate.studentName,
                          avatar: candidate.avatarUrl,
                        })
                      }
                    >
                      Invite
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Upcoming Tasks, Skill Growth, Activity Feed */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Upcoming Sprint Tasks
              </h3>
              <Link to="/projects/1/tasks" className="text-[11px] text-cyan-400 hover:underline">
                Kanban →
              </Link>
            </div>

            <div className="space-y-2.5">
              {upcomingTasks.map(t => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-dark-900 border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-slate-200 line-clamp-1">{t.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono capitalize">
                      {t.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Due: {t.deadline || 'This sprint'}</span>
                    <span className="capitalize text-slate-400">{t.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}

              {upcomingTasks.length === 0 && (
                <div className="text-xs text-slate-500 text-center py-4 italic">
                  All sprint tasks completed!
                </div>
              )}
            </div>
          </div>

          {/* Skill Growth Tracker */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Skill Growth Tracker
              </h3>
              <Link to="/profile" className="text-[11px] text-purple-400 hover:underline">
                Edit →
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>ESP32 & Embedded C++</span>
                  <span className="text-cyan-400 font-mono">Expert (3.5y)</span>
                </div>
                <div className="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full w-[95%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>React & Next.js Telemetry</span>
                  <span className="text-blue-400 font-mono">Advanced (2.5y)</span>
                </div>
                <div className="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[80%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Machine Learning & TinyML</span>
                  <span className="text-purple-400 font-mono">Growing (1.5y)</span>
                </div>
                <div className="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[60%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Notifications Feed */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" />
                Recent Notifications
              </h3>
              <Link to="/notifications" className="text-[11px] text-blue-400 hover:underline">
                View all →
              </Link>
            </div>

            <div className="space-y-2">
              {notifications.slice(0, 3).map(n => (
                <div key={n.id} className="p-2.5 rounded-xl bg-dark-900 border border-slate-800 text-xs">
                  <div className="font-semibold text-slate-200">{n.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{n.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal Dialog */}
      <InviteModal
        isOpen={Boolean(inviteTarget)}
        onClose={() => setInviteTarget(null)}
        candidate={inviteTarget}
      />
    </div>
  );
};
