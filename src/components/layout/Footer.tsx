import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, Heart } from 'lucide-react';
import { Github, Twitter, Linkedin } from '../common/Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-dark-950 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-dark-900 rounded-[7px] flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-tight">AI ProjectMate</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              The AI-powered collaboration and teammate matching platform empowering university engineers and builders to ship production-grade software and hardware projects.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/discover/students" className="hover:text-cyan-400 transition-colors">Find Teammates</Link></li>
              <li><Link to="/discover/projects" className="hover:text-cyan-400 transition-colors">Browse Projects</Link></li>
              <li><Link to="/#project-generator" className="hover:text-cyan-400 transition-colors">AI Project Generator</Link></li>
              <li><Link to="/#skill-gap" className="hover:text-cyan-400 transition-colors">Skill Gap Analyzer</Link></li>
            </ul>
          </div>

          {/* Col 3: Workspaces */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Workspaces</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/projects/1" className="hover:text-cyan-400 transition-colors">IoT Energy Monitor</Link></li>
              <li><Link to="/projects/2" className="hover:text-cyan-400 transition-colors">MediScan AI Diagnostics</Link></li>
              <li><Link to="/projects/3" className="hover:text-cyan-400 transition-colors">CyberGuard Zero-Trust</Link></li>
              <li><Link to="/projects/6" className="hover:text-cyan-400 transition-colors">CodeSphere Web IDE</Link></li>
            </ul>
          </div>

          {/* Col 4: Technology & Colleges */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Ecosystem</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Supporting engineering cohorts at IIT Bombay, BITS Pilani, RVCE Bangalore, IIIT Hyderabad, and 50+ technical universities.
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Node 26 SQLite</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">React 19</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Tailwind</span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} AI ProjectMate Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500 mx-0.5" /> for university builders & hackathon teams.
          </div>
        </div>
      </div>
    </footer>
  );
};
