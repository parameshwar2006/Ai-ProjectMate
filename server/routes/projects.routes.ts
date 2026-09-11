import { Router } from 'express';
import { projectService } from '../services/project.service.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../middleware/auth.middleware.js';

const router = Router();

// Discover Projects
router.get('/', (req, res) => {
  try {
    const { search, domain, difficulty, status, skill } = req.query;
    const projects = projectService.getProjects({
      search: search as string,
      domain: domain as string,
      difficulty: difficulty as string,
      status: status as string,
      skill: skill as string,
    });
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get Project Workspace Details
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const project = projectService.getProjectById(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create New Project (with auto AI roadmap synthesis)
router.post('/', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { title, description, domain, difficulty, teamSizeTarget, deadline, repoUrl, hardwareReqs, skills } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Project title and description are required.' });
    }
    const created = projectService.createProject(req.user!.id, {
      title,
      description,
      domain,
      difficulty,
      teamSizeTarget,
      deadline,
      repoUrl,
      hardwareReqs,
      skills,
    });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Update Project
router.put('/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const updated = projectService.updateProject(Number(req.params.id), req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Update Member Role
router.put('/:id/members/:userId/role', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { role } = req.body;
    const updated = projectService.updateMemberRole(Number(req.params.id), Number(req.params.userId), role);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Remove Member
router.delete('/:id/members/:userId', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const updated = projectService.removeMember(Number(req.params.id), Number(req.params.userId));
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Project
router.delete('/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const result = projectService.deleteProject(Number(req.params.id));
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
