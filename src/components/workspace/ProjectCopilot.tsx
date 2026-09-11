import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../common/Button';
import { api } from '../../services/api';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Cpu,
  Layers,
  CheckSquare,
  HelpCircle,
  Database,
  Calendar,
  AlertTriangle,
  Code2,
} from 'lucide-react';

interface ProjectCopilotProps {
  projectId: number;
  project: any;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: 'Divide into 4 tasks', prompt: 'Divide this project into tasks for 4 members.', icon: Layers },
  { label: 'Why behind schedule?', prompt: 'Why is our project behind schedule and what are the bottlenecks?', icon: AlertTriangle },
  { label: 'Suggest DB architecture', prompt: 'Suggest a better database architecture for our tech stack.', icon: Database },
  { label: 'Find missing skills', prompt: 'Find missing skills in our team.', icon: HelpCircle },
  { label: 'Generate API docs', prompt: 'Generate API documentation draft for our project endpoints.', icon: Code2 },
  { label: 'Testing checklist', prompt: 'Create a production testing checklist for our deployment.', icon: CheckSquare },
];

export const ProjectCopilot: React.FC<ProjectCopilotProps> = ({ projectId, project }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `Hello! I am your **Project Copilot** for **${project.title}**.\n\nI have loaded your live project state into memory: **${(project.members || []).length} team members**, **${project.progress_pct}% sprint progress**, and your core tech stack (${(project.skills || []).map((s: any) => s.name).join(', ')}).\n\nSelect any quick analysis prompt below or ask me anything specific about architecture, task distribution, or technical blockers.`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const res = await api.ai.askCopilot(projectId, textToSend);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.response || 'I have analyzed your project context.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Error analyzing project context: ${err.message || 'Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] rounded-2xl glass-card border border-slate-800 overflow-hidden">
      {/* Copilot Header with Context Memory Tags */}
      <div className="p-4 border-b border-slate-800 bg-dark-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-glow-cyan">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Project Copilot</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Context Active
              </span>
            </div>
            <p className="text-xs text-slate-400">Contextual engineering assistant aware of project state and team roster</p>
          </div>
        </div>

        {/* Live Context Memory Indicators */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="px-2 py-1 rounded bg-dark-800 border border-slate-700">
            {project.domain}
          </span>
          <span className="px-2 py-1 rounded bg-dark-800 border border-slate-700">
            {(project.members || []).length} Members
          </span>
          <span className="px-2 py-1 rounded bg-dark-800 border border-slate-700">
            {project.progress_pct}% Done
          </span>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-3 border-b border-slate-800/80 bg-dark-950/40 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] text-slate-500 flex-shrink-0 font-medium pl-1">Quick prompts:</span>
        {QUICK_PROMPTS.map((qp, idx) => {
          const Icon = qp.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-850 hover:bg-blue-500/15 border border-slate-700 hover:border-blue-500/30 text-xs text-slate-300 hover:text-cyan-300 transition-all flex-shrink-0"
            >
              <Icon className="w-3 h-3 text-cyan-400" />
              <span>{qp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isAssistant
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                    : 'bg-dark-800 border border-slate-700 text-slate-300'
                }`}
              >
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap ${
                  isAssistant
                    ? 'bg-dark-900 border border-slate-800 text-slate-200'
                    : 'bg-brand-blue text-white shadow-md'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[10px] mt-2 pt-1 border-t ${
                    isAssistant ? 'border-slate-800 text-slate-500' : 'border-blue-400/30 text-blue-200'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-dark-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              Project Copilot is analyzing repository context and calculating plan...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 border-t border-slate-800 bg-dark-900/80">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Copilot about architecture, task division, schedule bottlenecks, or testing checklists..."
            className="flex-1 bg-dark-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
          />
          <Button
            type="submit"
            variant="glow"
            size="sm"
            disabled={!input.trim() || isLoading}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};
