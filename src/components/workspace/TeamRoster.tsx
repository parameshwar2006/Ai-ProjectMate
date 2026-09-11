import React, { useState } from 'react';
import { ProjectMember, Task } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { UserPlus, Shield, Clock, Edit2, Check, UserMinus } from 'lucide-react';
import { api } from '../../services/api';

interface TeamRosterProps {
  projectId: number;
  project: any;
  members: ProjectMember[];
  tasks: Task[];
  onRosterUpdated: () => void;
  onOpenInviteModal: () => void;
}

export const TeamRoster: React.FC<TeamRosterProps> = ({
  projectId,
  project,
  members,
  tasks,
  onRosterUpdated,
  onOpenInviteModal,
}) => {
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [roleInput, setRoleInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const startEditRole = (member: ProjectMember) => {
    setEditingUserId(member.id);
    setRoleInput(member.role || 'Contributor');
  };

  const saveRole = async (userId: number) => {
    setIsSaving(true);
    try {
      await api.projects.updateMemberRole(projectId, userId, roleInput);
      setEditingUserId(null);
      onRosterUpdated();
    } catch (err) {
      console.error('Failed to update role:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (window.confirm('Remove this member from the project workspace?')) {
      try {
        await api.projects.removeMember(projectId, userId);
        onRosterUpdated();
      } catch (err) {
        console.error('Failed to remove member:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Roster Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-white">Project Engineering Roster</h3>
          <p className="text-xs text-slate-400">
            {members.length} of {project.team_size_target || 4} active members collaborating on {project.title}.
          </p>
        </div>

        <Button
          variant="glow"
          size="sm"
          leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          onClick={onOpenInviteModal}
        >
          Invite Teammate
        </Button>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map(member => {
          const assignedTasks = tasks.filter(t => t.assignee_id === member.id);
          const isOwner = project.owner_id === member.id;
          const isEditing = editingUserId === member.id;

          return (
            <div
              key={member.id}
              className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={member.full_name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{member.full_name}</span>
                        {isOwner && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">{member.college || 'Engineering College'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{member.weekly_hours || 15}h/wk</span>
                  </div>
                </div>

                {/* Role Assignment */}
                <div className="mb-4 p-3 rounded-xl bg-dark-900/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Project Role
                    </span>
                    {!isEditing && (
                      <button
                        onClick={() => startEditRole(member)}
                        className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit Role
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={roleInput}
                        onChange={e => setRoleInput(e.target.value)}
                        className="flex-1 bg-dark-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-brand-blue"
                      />
                      <button
                        onClick={() => saveRole(member.id)}
                        disabled={isSaving}
                        className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs font-semibold text-slate-200">
                      {member.role || 'Contributor'}
                    </div>
                  )}
                </div>

                {/* Assigned Tasks Summary */}
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Current Assigned Tasks ({assignedTasks.length})
                  </div>
                  {assignedTasks.length > 0 ? (
                    <div className="space-y-1.5">
                      {assignedTasks.slice(0, 3).map(task => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-dark-850 border border-slate-800/80"
                        >
                          <span className="text-slate-300 truncate">{task.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded capitalize bg-dark-900 text-slate-400">
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                      {assignedTasks.length > 3 && (
                        <div className="text-[11px] text-slate-500 text-center">
                          +{assignedTasks.length - 3} more assigned
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic p-2 rounded-lg bg-dark-850/50 text-center">
                      No tasks assigned yet
                    </div>
                  )}
                </div>
              </div>

              {!isOwner && (
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex justify-end">
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 hover:underline"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    Remove from Team
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
