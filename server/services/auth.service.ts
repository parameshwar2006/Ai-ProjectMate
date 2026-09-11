import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ai-project-mate-super-secret-key-2026';

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  isOnboarded: boolean;
  fullName: string;
  avatarUrl: string;
  college?: string;
  branch?: string;
}

export const authService = {
  signToken(user: { id: number; email: string; role: string }): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  },

  verifyToken(token: string): { id: number; email: string; role: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };
    } catch {
      return null;
    }
  },

  getAuthUser(userId: number): AuthUser | null {
    const row = db.queryOne<any>(
      `SELECT u.id, u.email, u.role, u.is_onboarded, p.full_name, p.avatar_url, p.college, p.branch
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = ? AND u.is_active = 1`,
      [userId]
    );

    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      role: row.role,
      isOnboarded: Boolean(row.is_onboarded),
      fullName: row.full_name || 'Anonymous User',
      avatarUrl: row.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      college: row.college,
      branch: row.branch,
    };
  },

  register(email: string, password: string, fullName: string): { token: string; user: AuthUser } {
    const existing = db.queryOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) {
      throw new Error('Email is already registered. Please log in.');
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const res = db.execute(
      'INSERT INTO users (email, password_hash, role, is_active, is_onboarded) VALUES (?, ?, ?, 1, 0)',
      [email.toLowerCase(), passwordHash, 'student']
    );
    const userId = Number(res.lastInsertRowid);

    // Initial empty profile
    db.execute(
      'INSERT INTO profiles (user_id, full_name, avatar_url, weekly_hours, preferred_team_size) VALUES (?, ?, ?, ?, ?)',
      [userId, fullName, `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`, 15, 4]
    );

    // Initial welcome notification
    db.execute(
      'INSERT INTO notifications (user_id, type, title, message, link) VALUES (?, ?, ?, ?, ?)',
      [userId, 'system', 'Welcome to AI ProjectMate! 🚀', 'Complete your skill onboarding to unlock AI team recommendations.', '/onboarding']
    );

    const user = this.getAuthUser(userId)!;
    const token = this.signToken({ id: userId, email: email.toLowerCase(), role: 'student' });
    return { token, user };
  },

  login(email: string, password: string): { token: string; user: AuthUser } {
    const userRow = db.queryOne<any>('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!userRow) {
      throw new Error('Invalid email or password.');
    }

    if (!userRow.is_active) {
      throw new Error('This account has been suspended by platform administration.');
    }

    const isValid = bcrypt.compareSync(password, userRow.password_hash);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    const user = this.getAuthUser(userRow.id)!;
    const token = this.signToken({ id: userRow.id, email: userRow.email, role: userRow.role });
    return { token, user };
  },

  demoLogin(userId: number): { token: string; user: AuthUser } {
    const userRow = db.queryOne<any>('SELECT * FROM users WHERE id = ?', [userId]);
    if (!userRow) {
      throw new Error('Demo persona not found.');
    }

    const user = this.getAuthUser(userRow.id)!;
    const token = this.signToken({ id: userRow.id, email: userRow.email, role: userRow.role });
    return { token, user };
  },
};
