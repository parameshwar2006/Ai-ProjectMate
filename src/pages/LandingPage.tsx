import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { api } from '../services/api';
import {
  Sparkles,
  ArrowRight,
  Users,
  Cpu,
  Brain,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FolderKanban,
  Zap,
  Shield,
  ChevronDown,
  ChevronUp,
  Share2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // AI Project Generator State
  const [projectPrompt, setProjectPrompt] = useState('I want to build an IoT project using ESP32 and machine learning.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<any>(null);

  // Skill Gap Showcase State
  const [selectedPreset, setSelectedPreset] = useState<'iot' | 'ai' | 'fullstack'>('iot');

  // Match Showcase Expandable
  const [showMatchDetails, setShowMatchDetails] = useState(false);

  const handleGenerateProject = async () => {
    if (!projectPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await api.ai.generateProject(projectPrompt);
      setGeneratedProject(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const skillGapPresets = {
    iot: {
      title: 'IoT Smart Campus Energy Monitor',
      required: ['ESP32', 'C++', 'React', 'Node.js', 'Machine Learning', 'Cloud Deployment'],
      covered: [
        { name: 'ESP32', member: 'Rahul Sharma', level: 'Expert' },
        { name: 'C++', member: 'Rahul Sharma', level: 'Advanced' },
        { name: 'React', member: 'Yashwanth Kumar', level: 'Advanced' },
        { name: 'Node.js', member: 'Yashwanth Kumar', level: 'Intermediate' },
      ],
      missing: ['Machine Learning', 'Cloud Deployment'],
      aiRecommendation: 'Your team is exceptionally strong in firmware (ESP32/C++) and frontend visualization, but currently lacks on-device machine learning and cloud containerization expertise.',
    },
    ai: {
      title: 'MediScan AI Clinical Diagnostics',
      required: ['Python', 'PyTorch', 'Computer Vision', 'FastAPI', 'React', 'Docker'],
      covered: [
        { name: 'Python', member: 'Arjun Mehta', level: 'Expert' },
        { name: 'PyTorch', member: 'Arjun Mehta', level: 'Advanced' },
        { name: 'Computer Vision', member: 'Arjun Mehta', level: 'Expert' },
        { name: 'React', member: 'Priya Patel', level: 'Expert' },
      ],
      missing: ['FastAPI', 'Docker'],
      aiRecommendation: 'Your team has world-class deep learning and UI design talent, but requires backend API orchestration and Docker container packaging.',
    },
    fullstack: {
      title: 'CodeSphere Collaborative IDE',
      required: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
      covered: [
        { name: 'TypeScript', member: 'Kavya Nair', level: 'Advanced' },
        { name: 'Node.js', member: 'Kavya Nair', level: 'Expert' },
        { name: 'PostgreSQL', member: 'Kavya Nair', level: 'Advanced' },
        { name: 'React', member: 'Priya Patel', level: 'Expert' },
      ],
      missing: ['Redis', 'Docker'],
      aiRecommendation: 'Core full stack pipeline is verified, but in-memory caching (Redis) and sandbox virtualization (Docker) remain open skill gaps.',
    },
  };

  return (
    <div className="space-y-28">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Ambient Glow Backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-purple-600/15 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs font-semibold text-blue-300 shadow-sm animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Next-Generation College Teammate & Project Matcher</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">v2.0</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Build the right team.{' '}
            <span className="gradient-text">Build better projects.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI ProjectMate uses AI to match students with compatible teammates, discover project ideas, identify skill gaps, and turn ideas into actionable project plans.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/discover/students">
              <Button variant="glow" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Find My Team
              </Button>
            </Link>
            <Link to="/discover/projects">
              <Button variant="secondary" size="lg">
                Explore Projects
              </Button>
            </Link>
          </div>

          {/* Hero Visual Preview: Animated Dashboard with Connected Nodes */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="p-1 rounded-3xl bg-gradient-to-b from-slate-700/60 via-slate-800/40 to-transparent shadow-2xl">
              <div className="rounded-[22px] bg-dark-900/95 border border-slate-800 p-6 md:p-8 backdrop-blur-xl space-y-6">
                {/* Visual Top Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-slate-400 font-mono ml-2">ai-projectmate.workspace // live-matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>AI Engine Live</span>
                  </div>
                </div>

                {/* Connected Student Cards Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left relative">
                  {/* Student 1 */}
                  <div className="p-4 rounded-xl bg-dark-850 border border-slate-700/70 shadow-lg relative group hover:border-blue-500/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                          alt="Yashwanth"
                          className="w-10 h-10 rounded-xl object-cover border border-blue-400/40"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">Yashwanth Kumar</div>
                          <div className="text-[10px] text-slate-400">IIT Bombay · EE & IoT</div>
                        </div>
                      </div>
                      <Badge variant="blue" size="sm">Lead</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-300">ESP32</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300">React</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/15 text-purple-300">C++</span>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
                      <span>Availability: 20h/wk</span>
                      <span className="text-cyan-400 font-semibold">Match Lead</span>
                    </div>
                  </div>

                  {/* Connected Indicator Center */}
                  <div className="hidden md:flex flex-col items-center justify-center relative">
                    <div className="w-full h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 animate-pulse absolute top-1/2 -translate-y-1/2" />
                    <div className="w-10 h-10 rounded-full bg-dark-900 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center font-mono text-xs font-bold shadow-glow-cyan z-10">
                      94%
                    </div>
                    <span className="text-[10px] text-cyan-300 font-medium mt-2 z-10 bg-dark-900 px-2 rounded">
                      AI Compatibility
                    </span>
                  </div>

                  {/* Student 2 */}
                  <div className="p-4 rounded-xl bg-dark-850 border border-slate-700/70 shadow-lg relative group hover:border-cyan-500/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                          alt="Rahul"
                          className="w-10 h-10 rounded-xl object-cover border border-cyan-400/40"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">Rahul Sharma</div>
                          <div className="text-[10px] text-slate-400">BITS Pilani · Instrumentation</div>
                        </div>
                      </div>
                      <Badge variant="cyan" size="sm">94% Match</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300">ESP32</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/15 text-purple-300">FreeRTOS</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-300">IoT</span>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
                      <span>Availability: 18h/wk</span>
                      <span className="text-emerald-400 font-semibold">Hardware Match</span>
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Banner Preview */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/25 flex items-center justify-between text-xs text-left">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span className="text-slate-200">
                      <strong>AI Match Explanation:</strong> "Strong match because your project requires embedded telemetry and Rahul has 3.5 years of hands-on ESP32 firmware experience."
                    </span>
                  </div>
                  <Link to="/discover/students" className="text-cyan-400 font-semibold hover:underline flex-shrink-0 ml-3">
                    View Matches →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / STATISTICS SECTION */}
      <section className="border-y border-slate-800/80 bg-dark-900/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-extrabold gradient-text-blue font-mono">10K+</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Verified Students</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-extrabold gradient-text-blue font-mono">2.5K+</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Active Projects</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-extrabold gradient-text-purple font-mono">94%</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Average Team Match</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-extrabold gradient-text-blue font-mono">50+</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Tech Skills Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (4 STEPS) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Workflow</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            How AI ProjectMate Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            From initial concept to active sprint management in four streamlined steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Create Your Profile',
              desc: 'Add verified skills, interests, past projects, GitHub stats, availability hours, and preferred roles.',
              icon: Users,
            },
            {
              step: '02',
              title: 'Tell Us Your Goal',
              desc: 'Enter what you want to build or generate structured, production-ready project plans with AI.',
              icon: Brain,
            },
            {
              step: '03',
              title: 'AI Builds Your Team',
              desc: 'Our multi-factor matching engine evaluates skill synergy, schedule overlap, and domain interest.',
              icon: Sparkles,
            },
            {
              step: '04',
              title: 'Build Together',
              desc: 'Manage tasks on Kanban boards, track 6-phase roadmaps, and collaborate with Project Copilot.',
              icon: FolderKanban,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-card border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-slate-600 group-hover:text-cyan-400 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-dark-850 border border-slate-700/80 flex items-center justify-center text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURE SHOWCASE 1: AI TEAM MATCHING */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Intelligent Matching</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Deterministic Multi-Factor Team Compatibility
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We do not rely on random keyword searches. Our algorithm computes weighted compatibility based on required project skills, complementary skill synergy, schedule hours, domain interest, and experience parity.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-slate-300"><strong>Skill Match (40%):</strong> Weighted by proficiency (Beginner to Expert).</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-slate-300"><strong>Complementary Synergy:</strong> Direct bonus for filling missing team gaps.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-slate-300"><strong>Availability & Domain:</strong> Ensures weekly commitment and shared passion.</span>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/discover/students">
                <Button variant="glow" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Recommended Teammates
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Recommendation Card */}
          <div className="p-6 rounded-2xl glass-card border border-slate-700/80 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                  alt="Rahul"
                  className="w-13 h-13 rounded-2xl object-cover border border-slate-600"
                />
                <div>
                  <h4 className="text-base font-bold text-white">Rahul Sharma</h4>
                  <p className="text-xs text-slate-400">BITS Pilani · Electronics & Instrumentation</p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                94% Match
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <Badge variant="blue" size="sm">ESP32 · Expert</Badge>
              <Badge variant="cyan" size="sm">C++ · Advanced</Badge>
              <Badge variant="purple" size="sm">IoT · Expert</Badge>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between font-semibold text-blue-300">
                <span>AI Match Explanation</span>
                <button
                  onClick={() => setShowMatchDetails(!showMatchDetails)}
                  className="text-cyan-400 text-[11px] hover:underline flex items-center gap-1"
                >
                  {showMatchDetails ? 'Hide breakdown' : 'Why this match?'}
                  {showMatchDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-slate-300 leading-normal">
                "Strong match because your project requires embedded development and Rahul has 3.5 years of verified ESP32 & C++ firmware experience."
              </p>

              {showMatchDetails && (
                <div className="pt-2 mt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Skill Match:</span>
                    <span className="font-semibold text-white">96%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Availability:</span>
                    <span className="font-semibold text-white">91%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Domain Interest:</span>
                    <span className="font-semibold text-white">95%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Experience:</span>
                    <span className="font-semibold text-white">92%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Commits 18h/week · Remote/In-person</span>
              <Button variant="glow" size="sm">
                Invite to Project
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURE SHOWCASE 2: INTERACTIVE AI PROJECT GENERATOR */}
      <section id="project-generator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">AI Architecture Engine</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            AI Project Generator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Describe what you want to build in natural language. AI ProjectMate generates a complete architecture, tech stack, team roles, and development roadmap.
          </p>
        </div>

        {/* Interactive Generator Box */}
        <div className="p-6 md:p-8 rounded-3xl glass-card border border-slate-700/80 shadow-2xl max-w-4xl mx-auto space-y-6">
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-200">
              What kind of project do you want to build?
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={projectPrompt}
                onChange={e => setProjectPrompt(e.target.value)}
                placeholder="e.g. I want to build an IoT project using ESP32 and machine learning."
                className="flex-1 bg-dark-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
              />
              <Button
                variant="glow"
                size="md"
                isLoading={isGenerating}
                onClick={handleGenerateProject}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Generate Architecture
              </Button>
            </div>

            {/* Prompt presets */}
            <div className="flex flex-wrap gap-2 text-[11px] pt-1">
              <span className="text-slate-500">Try examples:</span>
              <button
                onClick={() => setProjectPrompt('I want to build an IoT project using ESP32 and machine learning.')}
                className="text-cyan-400 hover:underline"
              >
                IoT Vibration Monitor
              </button>
              <span className="text-slate-600">·</span>
              <button
                onClick={() => setProjectPrompt('Diabetic retinopathy screening tool using computer vision.')}
                className="text-cyan-400 hover:underline"
              >
                Medical AI Vision
              </button>
              <span className="text-slate-600">·</span>
              <button
                onClick={() => setProjectPrompt('Zero-trust packet inspector in Rust with eBPF.')}
                className="text-cyan-400 hover:underline"
              >
                eBPF Security Sensor
              </button>
            </div>
          </div>

          {/* Generated Result Card Preview */}
          {generatedProject ? (
            <div className="p-6 rounded-2xl bg-dark-900 border border-slate-700 space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <Badge variant="cyan" size="sm">{generatedProject.domain}</Badge>
                  <h3 className="text-lg font-bold text-white mt-1">{generatedProject.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="amber" size="sm">{generatedProject.difficulty}</Badge>
                  <span className="text-xs text-slate-400">{generatedProject.durationWeeks} Weeks</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-300">Problem Statement</h4>
                  <p className="text-slate-400 leading-relaxed">{generatedProject.problemStatement}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-300">Proposed Solution</h4>
                  <p className="text-slate-400 leading-relaxed">{generatedProject.proposedSolution}</p>
                </div>
              </div>

              {/* Hardware & Software Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Required Hardware
                  </span>
                  <span className="text-slate-200">{generatedProject.requiredHardware || 'Standard Cloud / PC'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Software Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedProject.softwareStack?.map((s: string) => (
                      <Badge key={s} variant="blue" size="sm">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Roles */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Recommended Team Roles (4 Members)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {generatedProject.teamRoles?.map((r: any, i: number) => (
                    <div key={i} className="p-2.5 rounded-xl bg-dark-850 border border-slate-800">
                      <div className="font-semibold text-cyan-300">{r.role}</div>
                      <div className="text-[11px] text-slate-400 leading-tight mt-0.5">{r.responsibilities}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex justify-end">
                <Button
                  variant="glow"
                  size="md"
                  onClick={() => {
                    navigate('/dashboard');
                  }}
                >
                  Create Project Workspace
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 rounded-2xl bg-dark-900/50 border border-dashed border-slate-800">
              Click <strong>"Generate Architecture"</strong> to synthesize full specifications, team roles, and 6-phase roadmap.
            </div>
          )}
        </div>
      </section>

      {/* 6. FEATURE SHOWCASE 3: SKILL GAP ANALYSIS */}
      <section id="skill-gap" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Skill Intelligence</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            AI Skill Gap Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Eliminate project failure before writing a single line of code. Our analyzer detects critical missing skills in your roster and curates targeted learning materials.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex justify-center gap-2">
          {(['iot', 'ai', 'fullstack'] as const).map(key => (
            <button
              key={key}
              onClick={() => setSelectedPreset(key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedPreset === key
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'bg-dark-850 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {key === 'iot' ? 'IoT Campus Monitor' : key === 'ai' ? 'Medical AI Vision' : 'Collaborative IDE'}
            </button>
          ))}
        </div>

        {/* Analysis Card Display */}
        {(() => {
          const current = skillGapPresets[selectedPreset];
          return (
            <div className="p-6 md:p-8 rounded-3xl glass-card border border-slate-700/80 max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">{current.title}</h3>
                  <p className="text-xs text-slate-400">Comparing required technical stack against team roster</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Skill Health</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {Math.round((current.covered.length / current.required.length) * 100)}% Covered
                  </span>
                </div>
              </div>

              {/* Covered vs Missing Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Covered */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Covered Skills ({current.covered.length})
                  </div>
                  <div className="space-y-2">
                    {current.covered.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-xs"
                      >
                        <span className="font-medium text-slate-200">{c.name} ✓</span>
                        <div className="text-[11px] text-slate-400">
                          {c.member} ({c.level})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Missing Skills ({current.missing.length})
                  </div>
                  <div className="space-y-2">
                    {current.missing.map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs"
                      >
                        <span className="font-medium text-red-200">{m}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-semibold">
                          Gap Required
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Recommendation Callout */}
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/25 text-xs text-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-purple-300">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  AI Recommendation
                </div>
                <p className="leading-relaxed">{current.aiRecommendation}</p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Suggested Action: Recruit candidate from Discover Students</span>
                  <Link to={`/discover/students?skill=${encodeURIComponent(current.missing[0])}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Find {current.missing[0]} Specialist →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 7. BOTTOM CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-blue-900/40 via-dark-900 to-purple-900/40 border border-slate-700/80 p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white mx-auto shadow-glow-blue">
            <Share2 className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
            Ready to build your next breakthrough project?
          </h2>

          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join over 10,000 students collaborating across 50+ university cohorts. Find your dream team in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button variant="glow" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Create Your Free Profile
              </Button>
            </Link>
            <Link to="/discover/students">
              <Button variant="secondary" size="lg">
                Browse Student Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
