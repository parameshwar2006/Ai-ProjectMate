import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { api } from '../../services/api';
import { Send, CheckCircle2 } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: { id: number; name: string; avatar: string } | null;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, candidate }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');
  const [roleOffered, setRoleOffered] = useState('Contributor');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setError(null);
      api.projects.getProjects().then(data => {
        setProjects(data || []);
        if (data && data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      });
      if (candidate) {
        setMessage(`Hey ${candidate.name}, we'd love to have you join our team! Your background aligns nicely with our technical milestones.`);
      }
    }
  }, [isOpen, candidate]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate || !selectedProjectId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await api.notifications.sendInvitation({
        recipientId: candidate.id,
        projectId: Number(selectedProjectId),
        roleOffered,
        message,
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!candidate) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Invite ${candidate.name} to Project`}>
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30 animate-bounce">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-white">Invitation Dispatched!</h4>
          <p className="text-xs text-slate-400">
            {candidate.name} has received your invitation notification with project details.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSend} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Candidate Preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/80 border border-slate-700/80">
            <img src={candidate.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-600" />
            <div>
              <div className="text-sm font-semibold text-white">{candidate.name}</div>
              <div className="text-xs text-cyan-400">Target Teammate</div>
            </div>
          </div>

          {/* Select Project */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Select Workspace Project</label>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(Number(e.target.value))}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
              required
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.domain})
                </option>
              ))}
            </select>
          </div>

          {/* Role Offered */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Proposed Role</label>
            <input
              type="text"
              value={roleOffered}
              onChange={e => setRoleOffered(e.target.value)}
              placeholder="e.g. Firmware Lead, Frontend Architect, ML Specialist"
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
              required
            />
          </div>

          {/* Invitation Note */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Personalized Message</label>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="glow"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Send Invitation
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
