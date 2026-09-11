import { Router } from 'express';
import { taskService } from '../services/task.service.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Get Tasks for Project
router.get('/project/:projectId', (req, res) => {
  try {
    const tasks = taskService.getTasksForProject(Number(req.params.projectId));
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create Task
router.post('/project/:projectId', requireAuth, (req, res) => {
  try {
    const task = taskService.createTask(Number(req.params.projectId), req.body);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Update Task (status move, priority change, assignment, etc.)
router.put('/:taskId', requireAuth, (req, res) => {
  try {
    const task = taskService.updateTask(Number(req.params.taskId), req.body);
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Task
router.delete('/:taskId', requireAuth, (req, res) => {
  try {
    const result = taskService.deleteTask(Number(req.params.taskId));
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Toggle Roadmap Task Checkbox
router.post('/roadmap-toggle/:roadmapTaskId', requireAuth, (req, res) => {
  try {
    const result = taskService.toggleRoadmapTask(Number(req.params.roadmapTaskId));
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
