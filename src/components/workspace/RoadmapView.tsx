import React, { useState } from 'react';
import { RoadmapPhase } from '../../types';
import { Button } from '../common/Button';
import { Sparkles, CheckCircle2, Circle, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

interface RoadmapViewProps {
  projectId: number;
  project: any;
  roadmaps: RoadmapPhase[];
  onRoadmapsUpdated: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  projectId,
  project,
  roadmaps,
  onRoadmapsUpdated,
}) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleToggleTask = async (taskId: number) => {
    setTogglingId(taskId);
    try {
      await api.tasks.toggleRoadmapTask(taskId);
      onRoadmapsUpdated();
    } catch (err) {
      console.error('Failed to toggle roadmap task:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await api.ai.generateRoadmap(project);
      onRoadmapsUpdated();
    } catch (err) {
      console.error('Failed to regenerate roadmap:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Compute total and completed milestones
  const allTasks = roadmaps.flatMap(r => r.tasks || []);
  const completedTasks = allTasks.filter(t => t.is_completed === 1);
  const percent = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Roadmap Header & AI Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-semibold text-white">AI-Synthesized Development Roadmap</h3>
          </div>
          <p className="text-xs text-slate-400">
            Structured 6-phase engineering trajectory customized for {project.title}.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-semibold text-white">{percent}% Completed</div>
            <div className="text-[11px] text-slate-400">{completedTasks.length} of {allTasks.length} milestones checked</div>
          </div>
          <Button
            variant="glow"
            size="sm"
            isLoading={isRegenerating}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={handleRegenerate}
          >
            Regenerate Roadmap with AI
          </Button>
        </div>
      </div>

      {/* 6 Phases Timeline */}
      <div className="space-y-4">
        {roadmaps.map((phase, idx) => {
          const phaseTasks = phase.tasks || [];
          const isPhaseDone = phaseTasks.length > 0 && phaseTasks.every(t => t.is_completed === 1);

          return (
            <div
              key={phase.id || idx}
              className={`p-5 rounded-2xl glass-card border transition-all ${
                isPhaseDone
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center border ${
                      isPhaseDone
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-dark-800 text-cyan-400 border-slate-700'
                    }`}
                  >
                    P{phase.phase_number || idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      {phase.phase_name}
                      {isPhaseDone && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-normal">
                          Phase Complete ✓
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400">{phase.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Target: {phase.target_deadline || 'Sprint Cycle'}</span>
                </div>
              </div>

              {/* Tasks within Phase */}
              <div className="pl-11 space-y-2 pt-2 border-t border-slate-800/60">
                {phaseTasks.map(task => {
                  const isChecked = task.is_completed === 1;
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="text-slate-400 group-hover:text-cyan-400 transition-colors"
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                        <span
                          className={`text-xs ${
                            isChecked
                              ? 'text-slate-500 line-through'
                              : 'text-slate-200 group-hover:text-white'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      {task.suggested_deadline && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          {task.suggested_deadline}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
