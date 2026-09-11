import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Users, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ProjectCardProps {
  project: any;
  onJoinRequest?: (projectId: number) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onJoinRequest }) => {
  const getDomainVariant = (domain: string) => {
    switch (domain?.toLowerCase()) {
      case 'ai/ml': return 'purple';
      case 'iot': return 'cyan';
      case 'cybersecurity': return 'rose';
      case 'robotics': return 'amber';
      case 'fintech': return 'emerald';
      default: return 'blue';
    }
  };

  const getDifficultyVariant = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case 'beginner': return 'emerald';
      case 'advanced': return 'rose';
      default: return 'amber';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between group">
      <div>
        {/* Domain & Difficulty Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={getDomainVariant(project.domain)} size="sm">
            {project.domain}
          </Badge>
          <Badge variant={getDifficultyVariant(project.difficulty)} size="sm" className="capitalize">
            {project.difficulty}
          </Badge>
        </div>

        {/* Project Title */}
        <Link
          to={`/projects/${project.id}`}
          className="text-base font-semibold text-white hover:text-cyan-400 transition-colors line-clamp-1 mb-2 block"
        >
          {project.title}
        </Link>

        {/* Short Description */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Required Skills Badges */}
        <div className="mb-4">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Required Technologies
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(project.skills || []).slice(0, 4).map((sk: any) => (
              <Badge key={sk.name || sk.id || sk} variant="slate" size="sm">
                {sk.name || sk}
              </Badge>
            ))}
            {(project.skills || []).length > 4 && (
              <Badge variant="slate" size="sm">
                +{(project.skills || []).length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Development Progress</span>
            <span className="font-semibold text-slate-200">{project.progress_pct || 0}%</span>
          </div>
          <div className="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${project.progress_pct || 0}%` }}
            />
          </div>
        </div>

        {/* Team Members & Owner */}
        <div className="flex items-center justify-between py-2 border-t border-slate-800/80 mb-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              {(project.members || []).slice(0, 3).map((m: any, idx: number) => (
                <img
                  key={m.id || idx}
                  src={m.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={m.full_name}
                  className="w-6 h-6 rounded-full object-cover border-2 border-dark-900"
                  title={m.full_name}
                />
              ))}
            </div>
            <span className="text-[11px]">
              {(project.members || []).length} / {project.team_size_target || 4} Members
            </span>
          </div>

          <div className="text-[11px] text-slate-500 truncate max-w-[120px]">
            Lead: {project.owner_name || 'Founder'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <Link to={`/projects/${project.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Workspace
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => onJoinRequest?.(project.id)}
        >
          Join
        </Button>
      </div>
    </div>
  );
};
