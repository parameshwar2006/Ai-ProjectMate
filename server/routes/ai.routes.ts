import { Router } from 'express';
import { aiService } from '../services/ai.service.js';
import { skillGapService } from '../services/skillgap.service.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.js';

const router = Router();

// AI Project Generator
router.post('/generate-project', (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const result = aiService.generateProjectIdea(prompt);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// AI Roadmap Generator
router.post('/generate-roadmap', (req, res) => {
  try {
    const { project } = req.body;
    const result = aiService.generateRoadmap(project || { domain: 'Software', title: 'New Project' });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Project Copilot Assistant
router.post('/copilot', (req, res) => {
  try {
    const { projectId, message } = req.body;
    if (!projectId || !message) {
      return res.status(400).json({ error: 'projectId and message are required' });
    }
    const result = aiService.askProjectCopilot(Number(projectId), message);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Skill Gap Analysis for Project
router.get('/skill-gap/:projectId', (req, res) => {
  try {
    const result = skillGapService.analyzeProject(Number(req.params.projectId));
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Custom Skill Gap Analysis
router.post('/skill-gap/custom', (req, res) => {
  try {
    const { requiredSkills, members, projectTitle, domain } = req.body;
    const result = skillGapService.analyzeSkillSet(
      requiredSkills || [],
      members || [],
      projectTitle || 'Project',
      domain || 'Software'
    );
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
