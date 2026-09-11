import { Router } from 'express';
import { authService } from '../services/auth.service.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.js';

const router = Router();

// Register
router.post('/register', (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and full name are required.' });
    }
    const result = authService.register(email, password, fullName);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const result = authService.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Login failed' });
  }
});

// Demo Login (Instant switch to any seeded persona for reviewing)
router.post('/demo-login', (req, res) => {
  try {
    const { userId } = req.body;
    const result = authService.demoLogin(Number(userId) || 1);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Demo login failed' });
  }
});

// Current Authenticated User Session
router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

export default router;
