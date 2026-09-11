import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StudentCard } from '../components/discovery/StudentCard';
import { InviteModal } from '../components/discovery/InviteModal';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';
import {
  Search,
  Filter,
  Users,
  Sparkles,
  SlidersHorizontal,
  X,
  Clock,
  GraduationCap,
} from 'lucide-react';

export const DiscoverStudentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSkill = searchParams.get('skill');

  const [students, setStudents] = useState<any[]>([]);
  const [allSkills, setAllSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>(initialSkill || 'All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedExp, setSelectedExp] = useState<string>('All');
  const [minHours, setMinHours] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'compatibility' | 'experience' | 'availability' | 'name'>('compatibility');

  // Invite Modal
  const [inviteCandidate, setInviteCandidate] = useState<{ id: number; name: string; avatar: string } | null>(null);

  useEffect(() => {
    api.users.getSkills().then(res => setAllSkills(res || []));
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const queryParams: Record<string, any> = {
          search: search || undefined,
          skills: selectedSkill !== 'All' ? [selectedSkill] : undefined,
          domain: selectedDomain !== 'All' ? selectedDomain : undefined,
          experience: selectedExp !== 'All' ? selectedExp : undefined,
          availability: minHours > 0 ? minHours : undefined,
          sortBy,
        };
        const data = await api.users.getStudents(queryParams);
        setStudents(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [search, selectedSkill, selectedDomain, selectedExp, minHours, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedSkill('All');
    setSelectedDomain('All');
    setSelectedExp('All');
    setMinHours(0);
    setSortBy('compatibility');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Discover Students & Teammates</h1>
          </div>
          <p className="text-xs text-slate-400">
            Browse verified student engineers, filter by technical proficiencies, and evaluate AI match compatibility.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-dark-850 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-blue"
          >
            <option value="compatibility">AI Compatibility Score</option>
            <option value="experience">Years of Experience</option>
            <option value="availability">Weekly Availability</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
        {/* Search & Main Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, college, branch..."
              className="w-full bg-dark-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Skill Filter */}
          <div>
            <select
              value={selectedSkill}
              onChange={e => setSelectedSkill(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
            >
              <option value="All">All Technical Skills</option>
              {allSkills.map(sk => (
                <option key={sk.id} value={sk.name}>
                  {sk.name} ({sk.category.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          {/* Domain Filter */}
          <div>
            <select
              value={selectedDomain}
              onChange={e => setSelectedDomain(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
            >
              <option value="All">All Domains</option>
              <option value="AI/ML">AI / Machine Learning</option>
              <option value="IoT">IoT & Embedded Systems</option>
              <option value="Web Development">Web Development</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Robotics">Robotics & Autonomous</option>
              <option value="Healthcare">Healthcare & Bio</option>
              <option value="FinTech">FinTech & Web3</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <select
              value={selectedExp}
              onChange={e => setSelectedExp(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
            >
              <option value="All">All Experience Levels</option>
              <option value="beginner">Beginner (&lt; 2 yrs)</option>
              <option value="intermediate">Intermediate (2-3 yrs)</option>
              <option value="advanced">Advanced (3+ yrs)</option>
            </select>
          </div>
        </div>

        {/* Bottom Tag Bar with Active Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Availability:</span>
            {[0, 10, 15, 20].map(h => (
              <button
                key={h}
                onClick={() => setMinHours(h)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  minHours === h
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold'
                    : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {h === 0 ? 'Any hours' : `${h}+ hrs/wk`}
              </button>
            ))}
          </div>

          {(search || selectedSkill !== 'All' || selectedDomain !== 'All' || selectedExp !== 'All' || minHours > 0) && (
            <button
              onClick={clearFilters}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Showing <strong className="text-white">{students.length}</strong> matching student profiles
        </span>
      </div>

      {/* Student Cards Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />
          Calculating team compatibility scores...
        </div>
      ) : students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student, idx) => (
            <StudentCard
              key={student.id}
              student={student}
              matchScore={Math.max(68, 98 - (idx * 3))}
              matchBreakdown={{
                skillMatch: Math.max(70, 96 - (idx * 2)),
                availabilityMatch: Math.max(75, 92 - idx),
                domainInterest: Math.max(80, 95 - (idx * 3)),
                experienceMatch: Math.max(70, 90 - idx),
              }}
              explanation={
                student.skills?.length > 0
                  ? `Strong match because your project requires ${student.domains?.[0] || 'engineering'} and ${student.full_name} has verified experience in ${student.skills[0]?.name}.`
                  : undefined
              }
              whyThisMatch={[
                `Verified proficiency in ${(student.skills || []).slice(0, 2).map((s: any) => s.name).join(' & ')}.`,
                `High weekly commitment of ${student.weekly_hours || 15} hours.`,
                `Shared domain interest in ${(student.domains || ['Software'])[0]}.`,
              ]}
              onInvite={cand => setInviteCandidate(cand)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass-card rounded-2xl border border-slate-800 space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No matching students found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try broadening your search query or clearing technical skill filters.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Invite Modal */}
      <InviteModal
        isOpen={Boolean(inviteCandidate)}
        onClose={() => setInviteCandidate(null)}
        candidate={inviteCandidate}
      />
    </div>
  );
};
