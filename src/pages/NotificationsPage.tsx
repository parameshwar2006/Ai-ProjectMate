import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import {
  Bell,
  CheckCheck,
  Sparkles,
  Calendar,
  UserPlus,
  CheckCircle2,
  XCircle,
  Inbox,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    invitations,
    unreadCount,
    markAsRead,
    markAllAsRead,
    respondToInvitation,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<'all' | 'invitations' | 'tasks' | 'recommendations'>('all');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleInvitationAction = async (invitationId: number, action: 'accept' | 'decline') => {
    try {
      await respondToInvitation(invitationId, action);
      setActionFeedback(action === 'accept' ? 'Invitation accepted! Welcome to the team.' : 'Invitation declined.');
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'invitations') return n.type === 'invitation';
    if (activeFilter === 'tasks') return n.type === 'task' || n.type === 'deadline';
    if (activeFilter === 'recommendations') return n.type === 'recommendation';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            Notifications & Invitations
          </h1>
          <p className="text-xs text-slate-400">
            Stay synchronized with sprint assignments, AI match alerts, and team invitation requests.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {actionFeedback && (
        <div className="p-3.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        {(['all', 'invitations', 'tasks', 'recommendations'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl font-medium capitalize transition-all ${
              activeFilter === tab
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Invitations Section (If activeFilter === 'all' or 'invitations') */}
      {(activeFilter === 'all' || activeFilter === 'invitations') && invitations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
            Project Invitations ({invitations.length})
          </h3>

          <div className="space-y-3">
            {invitations.map(inv => (
              <Card
                key={inv.id}
                className="p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={inv.sender_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt=""
                    className="w-11 h-11 rounded-full object-cover border border-slate-700 flex-shrink-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{inv.sender_name}</span>
                      <Badge variant="cyan" size="sm">{inv.project_domain}</Badge>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Invited you to join <strong>"{inv.project_title}"</strong> as <span className="text-cyan-300">{inv.role_offered}</span>.
                    </p>
                    {inv.message && (
                      <p className="text-[11px] text-slate-400 italic mt-1 bg-dark-900/60 p-2 rounded-lg border border-slate-800">
                        "{inv.message}"
                      </p>
                    )}
                  </div>
                </div>

                {inv.status === 'pending' ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInvitationAction(inv.id, 'decline')}
                      className="text-xs"
                    >
                      Decline
                    </Button>
                    <Button
                      variant="glow"
                      size="sm"
                      onClick={() => handleInvitationAction(inv.id, 'accept')}
                      className="text-xs"
                    >
                      Accept & Join
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant={inv.status === 'accepted' ? 'emerald' : 'rose'}
                    size="sm"
                    className="capitalize"
                  >
                    {inv.status}
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Recent Activity & Updates ({filteredNotifications.length})
        </h3>

        {filteredNotifications.length > 0 ? (
          <div className="space-y-2.5">
            {filteredNotifications.map(n => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-4 rounded-2xl glass-card border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  n.is_read ? 'border-slate-800/80 bg-dark-950/40 opacity-80' : 'border-blue-500/30 bg-blue-500/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-dark-900 border border-slate-700 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                    {n.type === 'recommendation' ? (
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    ) : n.type === 'deadline' ? (
                      <Calendar className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Bell className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      {n.title}
                      {!n.is_read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      )}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {n.link && (
                  <Link to={n.link} className="flex-shrink-0 text-cyan-400 hover:underline text-xs flex items-center gap-1">
                    View <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center glass-card rounded-2xl border border-slate-800 space-y-2">
            <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-semibold text-white">No notifications here</h4>
            <p className="text-xs text-slate-400">You're all caught up with your sprint updates!</p>
          </div>
        )}
      </div>
    </div>
  );
};
