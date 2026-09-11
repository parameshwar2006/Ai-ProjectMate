import { Router } from 'express';
import { matchingService } from '../services/matching.service.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.js';

const router = Router();

// Find recommended teammates for a specific project
router.get('/project/:projectId', (req, res) => {
  try {
    const matches = matchingService.findMatchesForProject(Number(req.params.projectId));
    res.json(matches);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Find recommended projects for the logged-in student
router.get('/recommended-projects', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const projects = matchingService.findRecommendedProjects(req.user!.id);
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Calculate compatibility on-the-fly
router.post('/compatibility', (req, res) => {
  try {
    const { project, student } = req.body;
    const result = matchingService.calculateCompatibility(project, student);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
