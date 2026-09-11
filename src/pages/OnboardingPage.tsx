import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  Cpu,
  Brain,
  Clock,
  Layers,
  Heart,
} from 'lucide-react';
import { Github } from '../components/common/Icons';

const DOMAIN_OPTIONS = [
  'AI/ML',
  'IoT',
  'Web Development',
  'Cybersecurity',
  'Robotics',
  'Healthcare',
  'FinTech',
  'Smart Campus',
  'Sustainability',
];

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

export const OnboardingPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [allSkills, setAllSkills] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');

  // Form states
  const [basicInfo, setBasicInfo] = useState({
    fullName: user?.fullName || '',
    college: 'IIT Bombay',
    branch: 'Computer Science & Engineering',
    gradYear: 2026,
    bio: 'Passionate software and hardware builder seeking ambitious teammates for college capstones and hackathons.',
  });

  const [selectedSkills, setSelectedSkills] = useState<{ id: number; name: string; proficiency: string; years: number }[]>([
    { id: 1, name: 'TypeScript', proficiency: 'advanced', years: 2.5 },
    { id: 8, name: 'React', proficiency: 'expert', years: 3 },
    { id: 10, name: 'Node.js', proficiency: 'advanced', years: 2 },
  ]);

  const [selectedDomains, setSelectedDomains] = useState<string[]>(['AI/ML', 'IoT', 'Web Development']);

  const [experience, setExperience] = useState({
    level: 'intermediate',
    yearsCoding: 3,
    pastProjectsCount: 4,
  });

  const [availability, setAvailability] = useState({
    weeklyHours: 18,
    scheduleMatrix: {
      mon: ['evening'],
      tue: ['afternoon', 'evening'],
      wed: ['evening'],
      thu: ['evening'],
      sat: ['morning', 'afternoon'],
      sun: ['afternoon'],
    } as Record<string, string[]>,
  });

  const [github, setGithub] = useState({
    username: user?.email.split('@')[0] || 'dev-builder',
  });

  const [preferences, setPreferences] = useState({
    preferredRole: 'Full Stack Lead',
    preferredTeamSize: 4,
    remotePreference: 'hybrid',
  });

  useEffect(() => {
    api.users.getSkills().then(skills => setAllSkills(skills || []));
  }, []);

  const toggleSkill = (sk: any) => {
    if (selectedSkills.some(s => s.name === sk.name)) {
      setSelectedSkills(prev => prev.filter(s => s.name !== sk.name));
    } else {
      setSelectedSkills(prev => [
        ...prev,
        { id: sk.id, name: sk.name, proficiency: 'intermediate', years: 1.5 },
      ]);
    }
  };

  const updateSkillProficiency = (skillName: string, proficiency: string) => {
    setSelectedSkills(prev =>
      prev.map(s => (s.name === skillName ? { ...s, proficiency } : s))
    );
  };

  const toggleDomain = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    );
  };

  const toggleScheduleSlot = (day: string, time: string) => {
    setAvailability(prev => {
      const currentSlots = prev.scheduleMatrix[day] || [];
      const updated = currentSlots.includes(time)
        ? currentSlots.filter(t => t !== time)
        : [...currentSlots, time];
      return {
        ...prev,
        scheduleMatrix: {
          ...prev.scheduleMatrix,
          [day]: updated,
        },
      };
    });
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.users.completeOnboarding({
        basicInfo,
        skills: selectedSkills,
        interests: { domains: selectedDomains },
        experience,
        availability,
        github,
        projectPreferences: preferences,
      });

      setGeneratedSummary(res.ai_summary || 'AI Profile Summary successfully generated.');
      setStep(8); // Celebration step

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      await refreshUser();
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      {/* Progress Bar & Steps Indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Profile Onboarding</span>
          <span className="font-mono text-cyan-400 font-semibold">
            {step <= 7 ? `Step ${step} of 7` : 'Complete!'}
          </span>
        </div>
        <div className="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 transition-all duration-300 rounded-full"
            style={{ width: `${Math.min(100, (step / 7) * 100)}%` }}
          />
        </div>
      </div>

      <Card className="p-6 md:p-8 border border-slate-700/80 shadow-2xl">
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                Step 1: Basic Information
              </h2>
              <p className="text-xs text-slate-400">Tell us where you study and what drives your engineering curiosity.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={basicInfo.fullName}
                  onChange={e => setBasicInfo({ ...basicInfo, fullName: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">College / University</label>
                <input
                  type="text"
                  value={basicInfo.college}
                  onChange={e => setBasicInfo({ ...basicInfo, college: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Branch / Major</label>
                <input
                  type="text"
                  value={basicInfo.branch}
                  onChange={e => setBasicInfo({ ...basicInfo, branch: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Graduation Year</label>
                <input
                  type="number"
                  value={basicInfo.gradYear}
                  onChange={e => setBasicInfo({ ...basicInfo, gradYear: Number(e.target.value) })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Developer Bio</label>
                <textarea
                  rows={3}
                  value={basicInfo.bio}
                  onChange={e => setBasicInfo({ ...basicInfo, bio: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Skills & Proficiency */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                Step 2: Technical Skills & Proficiency
              </h2>
              <p className="text-xs text-slate-400">Select skills you command and set your confidence level.</p>
            </div>

            {/* Selected Skills with Proficiency Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Your Chosen Skills</label>
              <div className="space-y-2">
                {selectedSkills.map(sk => (
                  <div
                    key={sk.name}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-dark-900 border border-slate-800 text-xs"
                  >
                    <span className="font-semibold text-white">{sk.name}</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={sk.proficiency}
                        onChange={e => updateSkillProficiency(sk.name, e.target.value)}
                        className="bg-dark-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-cyan-300 capitalize focus:outline-none"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                      <button
                        onClick={() => toggleSkill(sk)}
                        className="text-slate-500 hover:text-red-400 text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Selector Catalog */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Click to Add More Skills</label>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
                {allSkills.map(sk => {
                  const isSelected = selectedSkills.some(s => s.name === sk.name);
                  return (
                    <button
                      key={sk.id}
                      type="button"
                      onClick={() => toggleSkill(sk)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-500 text-white shadow-glow-blue'
                          : 'bg-dark-900 hover:bg-dark-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {sk.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Domain Interests */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                Step 3: Preferred Project Domains
              </h2>
              <p className="text-xs text-slate-400">Which engineering areas are you excited to build projects in?</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DOMAIN_OPTIONS.map(d => {
                const isSelected = selectedDomains.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDomain(d)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-500/40 text-purple-200 shadow-glow-purple font-semibold'
                        : 'bg-dark-900 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs">{d}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Experience Level */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Step 4: Experience & Background
              </h2>
              <p className="text-xs text-slate-400">Helps our matching engine place you with balanced peer cohorts.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Self-Assessed Level</label>
                <select
                  value={experience.level}
                  onChange={e => setExperience({ ...experience, level: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue capitalize"
                >
                  <option value="beginner">Beginner (1st/2nd year, coursework)</option>
                  <option value="intermediate">Intermediate (Built side projects/hackathons)</option>
                  <option value="advanced">Advanced (Production internships/OSS contributor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Years of Hands-on Coding</label>
                <input
                  type="number"
                  value={experience.yearsCoding}
                  onChange={e => setExperience({ ...experience, yearsCoding: Number(e.target.value) })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Past Completed Projects Count</label>
                <input
                  type="number"
                  value={experience.pastProjectsCount}
                  onChange={e => setExperience({ ...experience, pastProjectsCount: Number(e.target.value) })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Weekly Availability & Schedule Matrix */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Step 5: Availability Schedule
              </h2>
              <p className="text-xs text-slate-400">Click slots where you can actively attend standups and code.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Committed Hours per Week: <span className="font-bold text-cyan-400">{availability.weeklyHours} hrs</span>
              </label>
              <input
                type="range"
                min={5}
                max={35}
                step={1}
                value={availability.weeklyHours}
                onChange={e => setAvailability({ ...availability, weeklyHours: Number(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Schedule Matrix */}
            <div className="overflow-x-auto pt-2">
              <div className="min-w-[420px] text-xs">
                <div className="grid grid-cols-8 gap-1 mb-2 font-mono text-slate-400 text-center">
                  <div>Slot</div>
                  {DAYS.map(d => <div key={d.id}>{d.label}</div>)}
                </div>

                {TIMES.map(time => (
                  <div key={time} className="grid grid-cols-8 gap-1 mb-1.5 items-center">
                    <div className="text-[11px] text-slate-400 capitalize">{time}</div>
                    {DAYS.map(d => {
                      const isBooked = (availability.scheduleMatrix[d.id] || []).includes(time);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => toggleScheduleSlot(d.id, time)}
                          className={`h-8 rounded-lg border text-[10px] font-mono transition-all ${
                            isBooked
                              ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold'
                              : 'bg-dark-900 border-slate-800 text-slate-500 hover:border-slate-700'
                          }`}
                        >
                          {isBooked ? '✓' : ''}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: GitHub Connection */}
        {step === 6 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Github className="w-5 h-5 text-cyan-400" />
                Step 6: GitHub Profile Sync
              </h2>
              <p className="text-xs text-slate-400">Connect your handle so our AI can analyze commit cadence and repo stats.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">GitHub Username</label>
              <div className="relative">
                <Github className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={github.username}
                  onChange={e => setGithub({ username: e.target.value })}
                  placeholder="e.g. torvalds"
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-400 space-y-2">
              <span className="font-semibold text-slate-200 block">Automatic Repository Sync</span>
              <p className="leading-relaxed">
                We will pull public repositories, language percentages, star counts, and recent contributions to power your developer profile card.
              </p>
            </div>
          </div>
        )}

        {/* STEP 7: Project Preferences */}
        {step === 7 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-cyan-400" />
                Step 7: Collaboration Preferences
              </h2>
              <p className="text-xs text-slate-400">Help teammates know how you best collaborate.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Role</label>
                <input
                  type="text"
                  value={preferences.preferredRole}
                  onChange={e => setPreferences({ ...preferences, preferredRole: e.target.value })}
                  placeholder="e.g. Full Stack Lead, ML Engineer"
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Team Size</label>
                <select
                  value={preferences.preferredTeamSize}
                  onChange={e => setPreferences({ ...preferences, preferredTeamSize: Number(e.target.value) })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                >
                  <option value={2}>2 Members (Pair Programming)</option>
                  <option value={3}>3 Members (Agile Trio)</option>
                  <option value={4}>4 Members (Standard Capstone Squad)</option>
                  <option value={5}>5 Members (Large Multi-disciplinary)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Remote vs In-Person</label>
                <select
                  value={preferences.remotePreference}
                  onChange={e => setPreferences({ ...preferences, remotePreference: e.target.value as any })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                >
                  <option value="remote">Fully Remote (Discord/Slack)</option>
                  <option value="hybrid">Hybrid (Lab sessions + remote sprint)</option>
                  <option value="in-person">In-Person Only (Campus makerspace)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: SUCCESS CELEBRATION */}
        {step === 8 && (
          <div className="py-6 text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-dark-950 flex items-center justify-center mx-auto shadow-glow-cyan">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Your AI Profile is Ready! 🚀</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                AI ProjectMate has synthesized your verified skills, schedule availability, and preferred project domains.
              </p>
            </div>

            {/* Generated AI Profile Summary */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 via-cyan-900/20 to-purple-900/30 border border-cyan-500/30 text-left text-xs max-w-lg mx-auto space-y-2">
              <div className="flex items-center gap-2 font-semibold text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                AI Profile Summary
              </div>
              <p className="text-slate-200 leading-relaxed italic">
                "{generatedSummary}"
              </p>
            </div>

            <div className="pt-4">
              <Button
                variant="glow"
                size="lg"
                onClick={() => navigate('/dashboard')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Go to My Dashboard
              </Button>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        {step <= 7 && (
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep(step - 1)}
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Previous
              </Button>
            ) : (
              <div />
            )}

            {step < 7 ? (
              <Button
                type="button"
                variant="glow"
                size="sm"
                onClick={() => setStep(step + 1)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="button"
                variant="glow"
                size="sm"
                isLoading={isSubmitting}
                onClick={handleFinalSubmit}
                rightIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Complete AI Profile
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
