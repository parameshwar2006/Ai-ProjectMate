import { Router } from 'express';
import { adminService } from '../services/admin.service.js';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth.middleware.js';

const router = Router();

// Platform Analytics & Metrics
router.get('/stats', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const stats = adminService.getPlatformStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Moderation Reports
router.get('/reports', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const reports = adminService.getReports();
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Resolve Report
router.post('/reports/:id/resolve', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const { action } = req.body;
    const result = adminService.resolveReport(Number(req.params.id), action);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Toggle User Suspension / Active Status
router.post('/users/:id/toggle-status', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const result = adminService.toggleUserStatus(Number(req.params.id));
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
