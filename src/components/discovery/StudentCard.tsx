import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Sparkles, Clock, Star, ChevronDown, ChevronUp, UserPlus, ExternalLink } from 'lucide-react';

interface StudentCardProps {
  student: any;
  matchScore?: number;
  matchBreakdown?: {
    skillMatch: number;
    availabilityMatch: number;
    domainInterest: number;
    experienceMatch: number;
  };
  explanation?: string;
  whyThisMatch?: string[];
  onInvite?: (candidate: { id: number; name: string; avatar: string }) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  matchScore = 92,
  matchBreakdown,
  explanation,
  whyThisMatch,
  onInvite,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Derive score color
  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    if (score >= 80) return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between group">
      <div>
        {/* Card Header: Avatar, Name, College, Match Score */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={student.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={student.full_name}
              className="w-13 h-13 rounded-2xl object-cover border border-slate-700/80 shadow-md group-hover:border-blue-500/50 transition-colors"
            />
            <div className="min-w-0">
              <Link
                to={`/students/${student.id}`}
                className="text-base font-semibold text-white hover:text-cyan-400 transition-colors truncate block"
              >
                {student.full_name}
              </Link>
              <p className="text-xs text-slate-400 truncate">
                {student.college || 'Engineering Institute'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {student.branch || 'Computer Science'} · {student.graduation_year || 2026}
              </p>
            </div>
          </div>

          {/* Match Score Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border shadow-sm ${getScoreBadge(
              matchScore
            )}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{matchScore}% Match</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {student.bio || 'Passionate student builder looking to collaborate on impactful engineering projects.'}
        </p>

        {/* Skills Chips */}
        <div className="mb-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Top Skills & Proficiency
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(student.skills || []).slice(0, 4).map((sk: any) => (
              <Badge key={sk.name || sk.id} variant="blue" size="sm">
                <span>{sk.name}</span>
                {sk.proficiency && (
                  <span className="text-[9px] opacity-75 capitalize">({sk.proficiency.slice(0, 3)})</span>
                )}
              </Badge>
            ))}
            {(student.skills || []).length > 4 && (
              <Badge variant="slate" size="sm">
                +{(student.skills || []).length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Meta Stats: Availability, GitHub Stars, Projects */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-dark-900/80 border border-slate-800/80 text-[11px] text-slate-300 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span className="truncate">{student.weekly_hours || 15}h/wk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">{student.github_stars || 18} stars</span>
          </div>
          <div className="text-right text-slate-400 truncate">
            {student.projectCount || student.projects?.length || 2} projects
          </div>
        </div>

        {/* AI Match Explanation / Why this match */}
        {explanation && (
          <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
            <div className="flex items-center justify-between font-semibold text-blue-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                AI Match Rationale
              </span>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                {showDetails ? 'Less' : 'Why this match?'}
                {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <p className="text-slate-300 leading-normal">{explanation}</p>

            {/* Expandable sub-scores & details */}
            {showDetails && (
              <div className="mt-3 pt-3 border-t border-blue-500/20 space-y-2 animate-in fade-in">
                {matchBreakdown && (
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Skill Match:</span>
                      <span className="font-semibold text-white">{matchBreakdown.skillMatch}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Availability:</span>
                      <span className="font-semibold text-white">{matchBreakdown.availabilityMatch}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Domain Interest:</span>
                      <span className="font-semibold text-white">{matchBreakdown.domainInterest}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Experience:</span>
                      <span className="font-semibold text-white">{matchBreakdown.experienceMatch}%</span>
                    </div>
                  </div>
                )}
                {whyThisMatch && whyThisMatch.length > 0 && (
                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5 pt-1">
                    {whyThisMatch.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
        <Link to={`/students/${student.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full text-xs">
            View Profile
          </Button>
        </Link>
        <Button
          variant="glow"
          size="sm"
          className="flex-1 text-xs"
          leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          onClick={() =>
            onInvite?.({
              id: student.id,
              name: student.full_name,
              avatar: student.avatar_url,
            })
          }
        >
          Invite
        </Button>
      </div>
    </div>
  );
};
