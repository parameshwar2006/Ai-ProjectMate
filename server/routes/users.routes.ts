import { Router } from 'express';
import { userService } from '../services/user.service.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.js';

const router = Router();

// Get list of all skills categorized
router.get('/skills', (req, res) => {
  try {
    const skills = userService.getAllSkills();
    res.json(skills);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Discover Students (with search and multi-filtering)
router.get('/students', (req, res) => {
  try {
    const { search, skills, domain, experience, availability, college, sortBy } = req.query;

    const parsedSkills = skills ? (typeof skills === 'string' ? skills.split(',') : (skills as string[])) : undefined;

    const students = userService.getStudents({
      search: search as string,
      skills: parsedSkills,
      domain: domain as string,
      experience: experience as string,
      availability: availability ? Number(availability) : undefined,
      college: college as string,
      sortBy: sortBy as any,
    });

    res.json(students);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get Student Profile by ID
router.get('/students/:id', (req, res) => {
  try {
    const student = userService.getStudentById(Number(req.params.id));
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Profile
router.put('/profile', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const updated = userService.updateProfile(req.user!.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Complete 7-Step Onboarding
router.post('/onboarding', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const updated = userService.completeOnboarding(req.user!.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
