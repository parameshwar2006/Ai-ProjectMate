import React, { useState, useEffect } from 'react';
import { ProjectCard } from '../components/discovery/ProjectCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { api } from '../services/api';
import {
  Search,
  FolderKanban,
  Plus,
  Sparkles,
  Layers,
  X,
  CheckCircle2,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'IoT',
  'AI/ML',
  'Cybersecurity',
  'Robotics',
  'FinTech',
  'Web Development',
  'Sustainability',
  'Healthcare',
  'Smart Campus',
];

export const DiscoverProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Create Project Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDomain, setNewDomain] = useState('IoT');
  const [newDifficulty, setNewDifficulty] = useState('intermediate');
  const [newSkills, setNewSkills] = useState('ESP32, React, C++');
  const [isCreating, setIsCreating] = useState(false);
  const [joinSuccessId, setJoinSuccessId] = useState<number | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await api.projects.getProjects({
        search: search || undefined,
        domain: selectedCategory !== 'All' ? selectedCategory : undefined,
        difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
      });
      setProjects(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, selectedCategory, selectedDifficulty]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    setIsCreating(true);
    try {
      const parsedSkills = newSkills.split(',').map(s => s.trim()).filter(Boolean);
      await api.projects.createProject({
        title: newTitle,
        description: newDesc,
        domain: newDomain,
        difficulty: newDifficulty,
        teamSizeTarget: 4,
        deadline: '2026-12-15',
        skills: parsedSkills,
      });
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRequest = (projectId: number) => {
    setJoinSuccessId(projectId);
    setTimeout(() => setJoinSuccessId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderKanban className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Discover Collaborative Projects</h1>
          </div>
          <p className="text-xs text-slate-400">
            Browse campus projects recruiting teammates across AI/ML, IoT, Robotics, Cybersecurity, and Web3.
          </p>
        </div>

        <Button
          variant="glow"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Project
        </Button>
      </div>

      {joinSuccessId && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Join request submitted to project lead! You will receive a notification upon review.</span>
        </div>
      )}

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-500 text-white shadow-glow-blue'
                : 'bg-dark-850 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Difficulty Filter Bar */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, tech stack..."
            className="w-full bg-dark-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
          >
            <option value="All">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />
          Loading project workspaces...
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(proj => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onJoinRequest={handleJoinRequest}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass-card rounded-2xl border border-slate-800 space-y-3">
          <FolderKanban className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No projects found in this category</h3>
          <p className="text-xs text-slate-400">
            Be the first to propose a project idea or reset your active filters.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSelectedCategory('All'); setSearch(''); }}>
            Reset Filters
          </Button>
        </div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Project Workspace">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Project Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. EdgePulse: Industrial IoT Telemetry"
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Description & Goals</label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="What are you building, what problem does it solve, and what is your vision?"
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Domain</label>
              <select
                value={newDomain}
                onChange={e => setNewDomain(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
              >
                <option value="IoT">IoT</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Web Development">Web Development</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Robotics">Robotics</option>
                <option value="Healthcare">Healthcare</option>
                <option value="FinTech">FinTech</option>
                <option value="Smart Campus">Smart Campus</option>
                <option value="Sustainability">Sustainability</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Difficulty</label>
              <select
                value={newDifficulty}
                onChange={e => setNewDifficulty(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Required Skills (Comma separated)</label>
            <input
              type="text"
              value={newSkills}
              onChange={e => setNewSkills(e.target.value)}
              placeholder="e.g. ESP32, React, C++, Node.js"
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" size="sm" isLoading={isCreating}>
              Synthesize with AI Roadmap
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
