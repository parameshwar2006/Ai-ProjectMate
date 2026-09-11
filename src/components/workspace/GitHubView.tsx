import React from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { GitBranch, Star, GitCommit, Sparkles, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Github } from '../common/Icons';

interface GitHubViewProps {
  project: any;
}

export const GitHubView: React.FC<GitHubViewProps> = ({ project }) => {
  const repoName = project.repo_url?.split('/').pop() || 'project-core';
  const ownerName = project.owner_name?.toLowerCase().replace(/\s+/g, '-') || 'team';

  const mockCommits = [
    { id: 'a89f3c1', message: 'feat: add FreeRTOS multi-core task prioritization for telemetry sampling', author: project.owner_name, time: '2 hours ago' },
    { id: 'f72b11e', message: 'fix: handle zero-drift ADC calibration on analog sensor pin 34', author: 'Rahul Sharma', time: 'Yesterday' },
    { id: 'c41d990', message: 'chore: configure Mosquitto TLS certificates and port 8883 handshakes', author: project.owner_name, time: '3 days ago' },
    { id: 'b23a788', message: 'ui: implement real-time SVG power gauge and voltage charts', author: 'Priya Patel', time: '5 days ago' },
  ];

  const languages = [
    { name: 'C++', pct: 45, color: 'bg-blue-500' },
    { name: 'TypeScript', pct: 35, color: 'bg-cyan-400' },
    { name: 'Python', pct: 15, color: 'bg-amber-400' },
    { name: 'CMake', pct: 5, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* GitHub Integration Banner */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-dark-900 border border-slate-700 flex items-center justify-center text-white">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-white">{ownerName}/{repoName}</h3>
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                <CheckCircle2 className="w-3 h-3" /> Synced
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Connected repository tracking automated test runs, commit cadences, and codebase metrics.
            </p>
          </div>
        </div>

        <a
          href={project.repo_url || 'https://github.com'}
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="outline" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
            Open on GitHub
          </Button>
        </a>
      </div>

      {/* AI GitHub Skill Analysis */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/30">
        <div className="flex items-center gap-2 mb-2 font-semibold text-sm text-cyan-300">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          AI GitHub Repository & Team Codebase Analysis
        </div>
        <p className="text-xs text-slate-200 leading-relaxed mb-3">
          "Strong experience with C++ and FreeRTOS embedded kernels, high velocity in TypeScript/React UI tooling, moderate telemetry API throughput. Excellent commit hygiene with clear conventional commit formatting and sub-24h PR turnaround."
        </p>
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
          <span className="px-2 py-1 rounded bg-dark-900/80 border border-slate-700">Code Health: 96/100</span>
          <span className="px-2 py-1 rounded bg-dark-900/80 border border-slate-700">Test Coverage: 84%</span>
          <span className="px-2 py-1 rounded bg-dark-900/80 border border-slate-700">CI/CD: GitHub Actions Passing</span>
        </div>
      </div>

      {/* Languages & Repository Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Languages Bar */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Language Composition
          </h4>

          {/* Bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-dark-900">
            {languages.map((l, i) => (
              <div
                key={i}
                className={`h-full ${l.color}`}
                style={{ width: `${l.pct}%` }}
                title={`${l.name}: ${l.pct}%`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {languages.map((l, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-slate-300 p-2 rounded-lg bg-dark-850">
                <span className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                  {l.name}
                </span>
                <span className="font-mono text-slate-400">{l.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Commits */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Recent Commit Activity
            </h4>
            <span className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
              <GitBranch className="w-3 h-3" /> main
            </span>
          </div>

          <div className="space-y-2">
            {mockCommits.map((c, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-dark-850 border border-slate-800/80 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1 font-mono">
                  <span>{c.id}</span>
                  <span>{c.time}</span>
                </div>
                <p className="text-slate-200 line-clamp-1 font-mono text-[11px]">{c.message}</p>
                <div className="text-[10px] text-slate-500 mt-1">By {c.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
