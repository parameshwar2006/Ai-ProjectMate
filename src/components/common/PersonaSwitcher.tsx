import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, ChevronDown, Sparkles, Shield } from 'lucide-react';

const DEMO_PERSONAS = [
  {
    id: 1,
    name: 'Yashwanth Kumar',
    role: 'Full Stack & IoT Lead',
    college: 'IIT Bombay',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    tag: 'Owner / Lead',
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    role: 'Embedded & ESP32 Lead',
    college: 'BITS Pilani',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    tag: 'Teammate',
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Frontend & UI/UX Architect',
    college: 'RVCE Bangalore',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    tag: 'Invited / UI Lead',
  },
  {
    id: 4,
    name: 'Arjun Mehta',
    role: 'Lead ML Researcher',
    college: 'NIT Trichy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    tag: 'AI Lead',
  },
  {
    id: 5,
    name: 'Sneha Reddy',
    role: 'Security & Systems',
    college: 'IIIT Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    tag: 'Security Lead',
  },
  {
    id: 99,
    name: 'Platform Administrator',
    role: 'Admin Supervisor',
    college: 'AI ProjectMate Central',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    tag: 'Admin',
  },
];

export const PersonaSwitcher: React.FC = () => {
  const { user, demoLogin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = async (personaId: number) => {
    if (user?.id === personaId) {
      setIsOpen(false);
      return;
    }
    setIsSwitching(true);
    try {
      await demoLogin(personaId);
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to switch persona:', err);
    } finally {
      setIsSwitching(false);
    }
  };

  const currentPersona = DEMO_PERSONAS.find(p => p.id === user?.id) || DEMO_PERSONAS[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm"
        title="Switch active student or admin persona"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-400">Persona:</span>
        <span className="font-semibold text-slate-100 max-w-[110px] truncate">{currentPersona.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-dark-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          <div className="px-3 py-2 border-b border-slate-800 mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Switch Demo Persona
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              1-Click
            </span>
          </div>

          <div className="space-y-1">
            {DEMO_PERSONAS.map(p => {
              const isSelected = user?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-blue-500/15 border border-blue-500/30 text-white'
                      : 'hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold truncate text-slate-200">{p.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          p.id === 99
                            ? 'bg-purple-500/20 text-purple-300'
                            : isSelected
                            ? 'bg-blue-500/30 text-blue-200'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {p.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{p.role}</p>
                  </div>
                  {isSelected && <UserCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
