import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { NotificationItem, InvitationItem } from '../types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationItem[];
  invitations: InvitationItem[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  respondToInvitation: (id: number, action: 'accept' | 'decline') => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setInvitations([]);
      setUnreadCount(0);
      return;
    }

    try {
      const [notifs, invs, unread] = await Promise.all([
        api.notifications.getNotifications().catch(() => []),
        api.notifications.getInvitations().catch(() => []),
        api.notifications.getUnreadCount().catch(() => ({ unreadCount: 0 })),
      ]);
      setNotifications(notifs);
      setInvitations(invs);
      setUnreadCount(unread.unreadCount || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, [user]);

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const markAsRead = async (id: number) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: 1 } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const respondToInvitation = async (id: number, action: 'accept' | 'decline') => {
    try {
      await api.notifications.respondToInvitation(id, action);
      await refreshNotifications();
    } catch (err) {
      console.error('Failed to respond to invitation:', err);
      throw err;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        invitations,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        respondToInvitation,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
}
