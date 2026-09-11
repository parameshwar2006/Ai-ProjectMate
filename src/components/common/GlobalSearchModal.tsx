import React, { useState, useEffect, useRef } from 'react';
import { Search, User, FolderKanban, Cpu, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setStudents([]);
      setProjects([]);
      setSkills([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const [stdRes, prjRes, skRes] = await Promise.all([
          api.users.getStudents({ search: query }).catch(() => []),
          api.projects.getProjects({ search: query }).catch(() => []),
          api.users.getSkills().catch(() => []),
        ]);

        setStudents((stdRes || []).slice(0, 4));
        setProjects((prjRes || []).slice(0, 4));
        setSkills(
          (skRes || [])
            .filter((s: any) => s.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 4)
        );
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-dark-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search students, projects, skills, and technologies... (e.g. ESP32, Vision, Yashwanth)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-dark-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {isLoading && (
            <div className="py-8 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />
              Searching platform directory...
            </div>
          )}

          {!isLoading && !query && (
            <div className="py-12 text-center text-slate-400 text-sm">
              <p>Type keywords to discover student teammates, collaborative projects, and skills.</p>
              <div className="flex justify-center gap-2 mt-4 text-xs">
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">ESP32</span>
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">PyTorch</span>
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">React</span>
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Robotics</span>
              </div>
            </div>
          )}

          {!isLoading && query && students.length === 0 && projects.length === 0 && skills.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-400">
              No matching records found for "{query}".
            </div>
          )}

          {/* Students */}
          {students.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                Students ({students.length})
              </div>
              <div className="mt-1 space-y-1">
                {students.map(st => (
                  <button
                    key={st.id}
                    onClick={() => handleSelect(`/students/${st.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={st.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-200 group-hover:text-blue-400 truncate">
                          {st.full_name}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {st.college} · {st.branch}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
                Projects ({projects.length})
              </div>
              <div className="mt-1 space-y-1">
                {projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(`/projects/${p.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-200 group-hover:text-cyan-400 truncate">
                        {p.title}
                      </div>
                      <div className="text-xs text-slate-400 truncate flex items-center gap-2">
                        <span className="text-cyan-300 font-mono text-[11px]">{p.domain}</span>
                        <span>·</span>
                        <span>{p.difficulty}</span>
                        <span>·</span>
                        <span>{p.progress_pct}% progress</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                Skills & Technologies ({skills.length})
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5 p-1">
                {skills.map(sk => (
                  <button
                    key={sk.id}
                    onClick={() => handleSelect(`/discover/students?skill=${encodeURIComponent(sk.name)}`)}
                    className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-purple-500/20 border border-slate-700/80 hover:border-purple-500/40 text-xs text-slate-200 hover:text-purple-300 transition-all flex items-center gap-2"
                  >
                    <span>{sk.name}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{sk.category.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
