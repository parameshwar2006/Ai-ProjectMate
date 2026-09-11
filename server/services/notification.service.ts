import db from '../db/database.js';

export const notificationService = {
  getUserNotifications(userId: number) {
    return db.query<any>(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );
  },

  getUnreadCount(userId: number): number {
    const res = db.queryOne<any>(
      'SELECT COUNT(*) as cnt FROM notifications WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    return res?.cnt || 0;
  },

  markAsRead(notificationId: number, userId: number) {
    db.execute('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [notificationId, userId]);
    return { success: true };
  },

  markAllAsRead(userId: number) {
    db.execute('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
    return { success: true };
  },

  getUserInvitations(userId: number) {
    return db.query<any>(
      `SELECT
        inv.*,
        p.title as project_title, p.domain as project_domain,
        sender_prof.full_name as sender_name, sender_prof.avatar_url as sender_avatar
       FROM invitations inv
       JOIN projects p ON inv.project_id = p.id
       JOIN profiles sender_prof ON inv.sender_id = sender_prof.user_id
       WHERE inv.recipient_id = ?
       ORDER BY inv.created_at DESC`,
      [userId]
    );
  },

  sendInvitation(senderId: number, recipientId: number, projectId: number, roleOffered: string, message: string) {
    const project = db.queryOne<any>('SELECT title FROM projects WHERE id = ?', [projectId]);
    const sender = db.queryOne<any>('SELECT full_name FROM profiles WHERE user_id = ?', [senderId]);

    // Check if already a member
    const existingMember = db.queryOne<any>(
      'SELECT user_id FROM project_members WHERE project_id = ? AND user_id = ?',
      [projectId, recipientId]
    );
    if (existingMember) {
      throw new Error('This user is already a member of this project.');
    }

    // Check if pending invite already exists
    const existingInvite = db.queryOne<any>(
      'SELECT id FROM invitations WHERE project_id = ? AND recipient_id = ? AND status = "pending"',
      [projectId, recipientId]
    );
    if (existingInvite) {
      throw new Error('An invitation has already been sent to this user.');
    }

    const res = db.execute(
      `INSERT INTO invitations (project_id, sender_id, recipient_id, role_offered, status, message)
       VALUES (?, ?, ?, ?, 'pending', ?)`,
      [projectId, senderId, recipientId, roleOffered, message]
    );

    // Send notification to recipient
    db.execute(
      `INSERT INTO notifications (user_id, type, title, message, link)
       VALUES (?, 'invitation', ?, ?, ?)`,
      [
        recipientId,
        `Team Invitation: ${project?.title || 'Project'}`,
        `${sender?.full_name || 'A teammate'} invited you to join "${project?.title}" as ${roleOffered}.`,
        `/projects/${projectId}`,
      ]
    );

    return { id: Number(res.lastInsertRowid), success: true };
  },

  respondToInvitation(invitationId: number, recipientId: number, action: 'accept' | 'decline') {
    const inv = db.queryOne<any>(
      `SELECT inv.*, p.title as project_title, prof.full_name as recipient_name
       FROM invitations inv
       JOIN projects p ON inv.project_id = p.id
       JOIN profiles prof ON inv.recipient_id = prof.user_id
       WHERE inv.id = ? AND inv.recipient_id = ?`,
      [invitationId, recipientId]
    );

    if (!inv) throw new Error('Invitation not found or unauthorized');

    if (action === 'accept') {
      db.execute('UPDATE invitations SET status = "accepted" WHERE id = ?', [invitationId]);

      // Add to project members
      db.execute(
        'INSERT OR IGNORE INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
        [inv.project_id, recipientId, inv.role_offered || 'Contributor']
      );

      // Notify sender
      db.execute(
        `INSERT INTO notifications (user_id, type, title, message, link)
         VALUES (?, 'invitation', ?, ?, ?)`,
        [
          inv.sender_id,
          'Invitation Accepted! 🎉',
          `${inv.recipient_name} accepted your invitation to join ${inv.project_title} as ${inv.role_offered}.`,
          `/projects/${inv.project_id}/team`,
        ]
      );
    } else {
      db.execute('UPDATE invitations SET status = "declined" WHERE id = ?', [invitationId]);

      // Notify sender
      db.execute(
        `INSERT INTO notifications (user_id, type, title, message, link)
         VALUES (?, 'invitation', ?, ?, ?)`,
        [
          inv.sender_id,
          'Invitation Declined',
          `${inv.recipient_name} declined the invitation to join ${inv.project_title}.`,
          `/projects/${inv.project_id}`,
        ]
      );
    }

    return { success: true, status: action === 'accept' ? 'accepted' : 'declined' };
  },
};
