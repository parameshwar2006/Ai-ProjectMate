import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { KanbanBoard } from '../components/workspace/KanbanBoard';
import { RoadmapView } from '../components/workspace/RoadmapView';
import { TeamRoster } from '../components/workspace/TeamRoster';
import { ProjectCopilot } from '../components/workspace/ProjectCopilot';
import { GitHubView } from '../components/workspace/GitHubView';
import { InviteModal } from '../components/discovery/InviteModal';
import { api } from '../services/api';
import {
  FolderKanban,
  Users,
  CheckSquare,
  Map,
  Bot,
  Settings,
  Clock,
  Sparkles,
  ExternalLink,
  ArrowLeft,
  FileCode,
  HardDrive,
} from 'lucide-react';
import { Github } from '../components/common/Icons';

export const ProjectWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'tasks' | 'roadmap' | 'github' | 'ai' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const fetchProject = async () => {
    if (!id) return;
    try {
      const data = await api.projects.getProjectById(Number(id));
      setProject(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
        <div className="w-5 h-5 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />
        Loading project workspace...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-4">
        <FolderKanban className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Project Workspace Not Found</h2>
        <Link to="/discover/projects">
          <Button variant="outline" size="sm">
            Back to Projects Directory
          </Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FolderKanban },
    { id: 'team', label: `Team (${(project.members || []).length})`, icon: Users },
    { id: 'tasks', label: `Tasks (${(project.tasks || []).length})`, icon: CheckSquare },
    { id: 'roadmap', label: 'AI Roadmap', icon: Map },
    { id: 'ai', label: 'Project Copilot', icon: Bot, isHighlight: true },
    { id: 'github', label: 'GitHub', icon: Github },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back to Projects */}
      <Link
        to="/discover/projects"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Projects Directory
      </Link>

      {/* Workspace Header Card */}
      <div className="p-6 rounded-3xl glass-card border border-slate-700/80 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="cyan" size="sm">{project.domain}</Badge>
              <Badge variant="amber" size="sm" className="capitalize">{project.difficulty}</Badge>
              <span className="text-xs text-slate-400 font-mono">
                Target: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Sprint 4'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
              {project.title}
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('ai')}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
            >
              Ask Copilot
            </Button>
            <Button
              variant="glow"
              size="sm"
              onClick={() => setIsInviteOpen(true)}
              leftIcon={<Users className="w-3.5 h-3.5" />}
            >
              Invite Teammate
            </Button>
          </div>
        </div>

        {/* Progress Metric Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-400">
            <span>Overall Sprint Progress: <strong className="text-white">{project.progress_pct}%</strong></span>
            <div className="w-48 h-2 bg-dark-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${project.progress_pct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>Team: <strong className="text-white">{(project.members || []).length} / {project.team_size_target}</strong></span>
            <span>Lead: <strong className="text-cyan-300">{project.owner_name}</strong></span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              } ${tab.isHighlight ? 'text-cyan-300 hover:text-cyan-200' : ''}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Areas */}
      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tech Stack & Hardware Card */}
            <Card className="p-6 border border-slate-800 space-y-4 md:col-span-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                Required Architecture & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {(project.skills || []).map((sk: any) => (
                  <Badge key={sk.id} variant="blue" size="md">
                    {sk.name}
                  </Badge>
                ))}
              </div>

              {project.hardware_reqs && (
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Hardware & Sensors
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {project.hardware_reqs}
                  </p>
                </div>
              )}
            </Card>

            {/* Quick Metrics */}
            <Card className="p-6 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Sprint Summary
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-dark-850">
                  <span className="text-slate-400">Total Tasks:</span>
                  <span className="font-semibold text-white">{(project.tasks || []).length}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-dark-850">
                  <span className="text-slate-400">Completed:</span>
                  <span className="font-semibold text-emerald-400">
                    {(project.tasks || []).filter((t: any) => t.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-dark-850">
                  <span className="text-slate-400">Pending Blockers:</span>
                  <span className="font-semibold text-amber-400">
                    {(project.tasks || []).filter((t: any) => t.priority === 'urgent' && t.status !== 'completed').length}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Kanban Preview */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-white mb-4">Sprint Kanban Preview</h3>
            <KanbanBoard
              projectId={project.id}
              tasks={project.tasks || []}
              members={project.members || []}
              onTasksUpdated={fetchProject}
            />
          </div>
        </div>
      )}

      {/* 2. TEAM TAB */}
      {activeTab === 'team' && (
        <div className="animate-in fade-in">
          <TeamRoster
            projectId={project.id}
            project={project}
            members={project.members || []}
            tasks={project.tasks || []}
            onRosterUpdated={fetchProject}
            onOpenInviteModal={() => setIsInviteOpen(true)}
          />
        </div>
      )}

      {/* 3. TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="animate-in fade-in">
          <KanbanBoard
            projectId={project.id}
            tasks={project.tasks || []}
            members={project.members || []}
            onTasksUpdated={fetchProject}
          />
        </div>
      )}

      {/* 4. ROADMAP TAB */}
      {activeTab === 'roadmap' && (
        <div className="animate-in fade-in">
          <RoadmapView
            projectId={project.id}
            project={project}
            roadmaps={project.roadmaps || []}
            onRoadmapsUpdated={fetchProject}
          />
        </div>
      )}

      {/* 5. PROJECT COPILOT TAB */}
      {activeTab === 'ai' && (
        <div className="animate-in fade-in">
          <ProjectCopilot projectId={project.id} project={project} />
        </div>
      )}

      {/* 6. GITHUB TAB */}
      {activeTab === 'github' && (
        <div className="animate-in fade-in">
          <GitHubView project={project} />
        </div>
      )}

      {/* 7. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <Card className="p-6 border border-slate-800 space-y-6 max-w-2xl animate-in fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Project Settings</h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1.5">Project Title</label>
              <input
                type="text"
                defaultValue={project.title}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1.5">Repository URL</label>
              <input
                type="text"
                defaultValue={project.repo_url}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-slate-500">Danger zone: irreversible actions</span>
              <Button variant="danger" size="sm">
                Archive Workspace
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Invite Modal */}
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        candidate={null}
      />
    </div>
  );
};
