import React, { useState } from 'react';
import { Task, ProjectMember } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Plus, Clock, User, CheckCircle2, ChevronRight, ChevronLeft, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

interface KanbanBoardProps {
  projectId: number;
  tasks: Task[];
  members: ProjectMember[];
  onTasksUpdated: () => void;
}

const COLUMNS: { id: Task['status']; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog', color: 'border-slate-700' },
  { id: 'todo', title: 'To Do', color: 'border-blue-500/40' },
  { id: 'in_progress', title: 'In Progress', color: 'border-amber-500/40' },
  { id: 'review', title: 'Review', color: 'border-purple-500/40' },
  { id: 'completed', title: 'Completed', color: 'border-emerald-500/40' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  projectId,
  tasks,
  members,
  onTasksUpdated,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssignee, setNewAssignee] = useState<string>('');
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');
  const [newStatus, setNewStatus] = useState<Task['status']>('todo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await api.tasks.createTask(projectId, {
        title: newTitle,
        description: newDesc,
        assigneeId: newAssignee ? Number(newAssignee) : null,
        priority: newPriority,
        status: newStatus,
        deadline: '2026-11-15',
        labels: ['feature'],
      });
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      onTasksUpdated();
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveStatus = async (task: Task, direction: 'prev' | 'next') => {
    const colOrder: Task['status'][] = ['backlog', 'todo', 'in_progress', 'review', 'completed'];
    const currentIndex = colOrder.indexOf(task.status);
    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex >= 0 && targetIndex < colOrder.length) {
      const nextStatus = colOrder[targetIndex];
      try {
        await api.tasks.updateTask(task.id, { status: nextStatus });
        onTasksUpdated();
      } catch (err) {
        console.error('Failed to move task:', err);
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.tasks.deleteTask(taskId);
        onTasksUpdated();
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const getPriorityBadge = (prio: Task['priority']) => {
    switch (prio) {
      case 'urgent': return <Badge variant="rose" size="sm">Urgent</Badge>;
      case 'high': return <Badge variant="amber" size="sm">High</Badge>;
      case 'medium': return <Badge variant="blue" size="sm">Medium</Badge>;
      default: return <Badge variant="slate" size="sm">Low</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Board Header Actions */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400">
          Showing <span className="font-semibold text-white">{tasks.length}</span> sprint tasks across 5 workflow stages.
        </div>
        <Button
          variant="glow"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Task
        </Button>
      </div>

      {/* 5-Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 overflow-x-auto pb-4">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`bg-dark-900/90 rounded-2xl p-3 border ${col.color} flex flex-col min-h-[520px]`}
            >
              {/* Column Title & Counter */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200">{col.title}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-dark-850 hover:bg-dark-800/90 border border-slate-800 hover:border-slate-700 transition-all shadow-sm group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {task.title}
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-0.5 transition-opacity"
                        title="Delete task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
                      <div>{getPriorityBadge(task.priority)}</div>

                      <div className="flex items-center gap-1.5 text-slate-400">
                        {task.assignee_name ? (
                          <img
                            src={task.assignee_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                            alt={task.assignee_name}
                            className="w-5 h-5 rounded-full object-cover border border-slate-700"
                            title={task.assignee_name}
                          />
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Unassigned</span>
                        )}
                      </div>
                    </div>

                    {/* Column Shift Micro-controls */}
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/40">
                      <button
                        onClick={() => handleMoveStatus(task, 'prev')}
                        disabled={col.id === 'backlog'}
                        className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                        title="Move to previous stage"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveStatus(task, 'next')}
                        disabled={col.id === 'completed'}
                        className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                        title="Move to next stage"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="py-12 text-center text-slate-600 text-xs italic">
                    No tasks in {col.title}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Task Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Implement TLS handshake on ESP32 firmware"
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Technical specifications, requirements, or test criteria..."
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Assignee</label>
              <select
                value={newAssignee}
                onChange={e => setNewAssignee(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
              >
                <option value="">Unassigned</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.full_name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Priority</label>
              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as any)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Initial Column</label>
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value as any)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
            >
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" size="sm" isLoading={isSubmitting}>
              Add to Board
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
