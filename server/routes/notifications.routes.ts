import { Router } from 'express';
import { notificationService } from '../services/notification.service.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.js';

const router = Router();

// Get Notifications
router.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const notifications = notificationService.getUserNotifications(req.user!.id);
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get Unread Count
router.get('/unread-count', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const count = notificationService.getUnreadCount(req.user!.id);
    res.json({ unreadCount: count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Mark Single Notification as Read
router.put('/:id/read', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const result = notificationService.markAsRead(Number(req.params.id), req.user!.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Mark All as Read
router.put('/read-all', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const result = notificationService.markAllAsRead(req.user!.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get Invitations Received by User
router.get('/invitations', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const invites = notificationService.getUserInvitations(req.user!.id);
    res.json(invites);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Send Team Invitation to Student
router.post('/invitations', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { recipientId, projectId, roleOffered, message } = req.body;
    if (!recipientId || !projectId) {
      return res.status(400).json({ error: 'recipientId and projectId are required.' });
    }
    const result = notificationService.sendInvitation(
      req.user!.id,
      Number(recipientId),
      Number(projectId),
      roleOffered || 'Contributor',
      message || 'Would love to collaborate with you on this project!'
    );
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Accept or Decline Invitation
router.post('/invitations/:id/respond', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { action } = req.body; // 'accept' or 'decline'
    if (action !== 'accept' && action !== 'decline') {
      return res.status(400).json({ error: 'Action must be "accept" or "decline"' });
    }
    const result = notificationService.respondToInvitation(Number(req.params.id), req.user!.id, action);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
