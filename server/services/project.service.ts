import db from '../db/database.js';
import { aiService } from './ai.service.js';

export interface ProjectFilter {
  search?: string;
  domain?: string;
  difficulty?: string;
  status?: string;
  skill?: string;
}

export const projectService = {
  getProjects(filter: ProjectFilter = {}) {
    let sql = `
      SELECT
        p.id, p.owner_id, p.title, p.description, p.domain, p.difficulty,
        p.status, p.team_size_target, p.progress_pct, p.deadline, p.repo_url,
        p.hardware_reqs, p.created_at,
        u.email as owner_email,
        prof.full_name as owner_name,
        prof.avatar_url as owner_avatar,
        prof.college as owner_college
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      JOIN profiles prof ON u.id = prof.user_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filter.search) {
      sql += ` AND (p.title LIKE ? OR p.description LIKE ? OR p.domain LIKE ?)`;
      const s = `%${filter.search}%`;
      params.push(s, s, s);
    }

    if (filter.domain && filter.domain !== 'All') {
      sql += ` AND p.domain = ?`;
      params.push(filter.domain);
    }

    if (filter.difficulty && filter.difficulty !== 'All') {
      sql += ` AND p.difficulty = ?`;
      params.push(filter.difficulty.toLowerCase());
    }

    if (filter.status && filter.status !== 'All') {
      sql += ` AND p.status = ?`;
      params.push(filter.status.toLowerCase());
    }

    sql += ` ORDER BY p.created_at DESC`;

    const projects = db.query<any>(sql, params);

    return projects.map(p => {
      const skills = db.query<any>(
        `SELECT s.id, s.name, s.category, s.icon, ps.is_required
         FROM project_skills ps
         JOIN skills s ON ps.skill_id = s.id
         WHERE ps.project_id = ?`,
        [p.id]
      );

      const members = db.query<any>(
        `SELECT u.id, u.email, prof.full_name, prof.avatar_url, pm.role, pm.joined_at
         FROM project_members pm
         JOIN users u ON pm.user_id = u.id
         JOIN profiles prof ON u.id = prof.user_id
         WHERE pm.project_id = ?`,
        [p.id]
      );

      return {
        ...p,
        skills,
        members,
        currentMembersCount: members.length,
      };
    });
  },

  getProjectById(id: number) {
    const project = db.queryOne<any>(
      `SELECT
        p.id, p.owner_id, p.title, p.description, p.domain, p.difficulty,
        p.status, p.team_size_target, p.progress_pct, p.deadline, p.repo_url,
        p.hardware_reqs, p.created_at,
        u.email as owner_email,
        prof.full_name as owner_name,
        prof.avatar_url as owner_avatar,
        prof.college as owner_college
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      JOIN profiles prof ON u.id = prof.user_id
      WHERE p.id = ?`,
      [id]
    );

    if (!project) return null;

    const skills = db.query<any>(
      `SELECT s.id, s.name, s.category, s.icon, ps.is_required
       FROM project_skills ps
       JOIN skills s ON ps.skill_id = s.id
       WHERE ps.project_id = ?`,
      [id]
    );

    const members = db.query<any>(
      `SELECT u.id, u.email, prof.full_name, prof.avatar_url, prof.college, prof.weekly_hours, pm.role, pm.joined_at
       FROM project_members pm
       JOIN users u ON pm.user_id = u.id
       JOIN profiles prof ON u.id = prof.user_id
       WHERE pm.project_id = ?`,
      [id]
    );

    const tasks = db.query<any>(
      `SELECT t.*, u.email as assignee_email, prof.full_name as assignee_name, prof.avatar_url as assignee_avatar
       FROM tasks t
       LEFT JOIN users u ON t.assignee_id = u.id
       LEFT JOIN profiles prof ON u.id = prof.user_id
       WHERE t.project_id = ?
       ORDER BY t.created_at DESC`,
      [id]
    );

    const roadmaps = db.query<any>(
      `SELECT * FROM roadmaps WHERE project_id = ? ORDER BY phase_number ASC`,
      [id]
    );

    const roadmapPhases = roadmaps.map(r => {
      const roadmapTasks = db.query<any>(
        `SELECT * FROM roadmap_tasks WHERE roadmap_id = ? ORDER BY id ASC`,
        [r.id]
      );
      return {
        ...r,
        tasks: roadmapTasks,
      };
    });

    return {
      ...project,
      skills,
      members,
      tasks,
      roadmaps: roadmapPhases,
      currentMembersCount: members.length,
    };
  },

  createProject(ownerId: number, data: any) {
    const {
      title,
      description,
      domain,
      difficulty = 'intermediate',
      teamSizeTarget = 4,
      deadline = '2026-12-01',
      repoUrl,
      hardwareReqs,
      skills = [],
    } = data;

    const res = db.execute(
      `INSERT INTO projects (
        owner_id, title, description, domain, difficulty, status,
        team_size_target, progress_pct, deadline, repo_url, hardware_reqs
      ) VALUES (?, ?, ?, ?, ?, 'recruiting', ?, 0, ?, ?, ?)`,
      [
        ownerId,
        title,
        description,
        domain || 'Web Development',
        difficulty,
        teamSizeTarget,
        deadline,
        repoUrl || '',
        hardwareReqs || '',
      ]
    );

    const projectId = Number(res.lastInsertRowid);

    // Add owner as Lead member
    db.execute(
      'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
      [projectId, ownerId, 'Project Lead']
    );

    // Link required skills
    for (const skName of skills) {
      let skillId: number | null = null;
      if (typeof skName === 'number') {
        skillId = skName;
      } else {
        const found = db.queryOne<any>('SELECT id FROM skills WHERE name = ? COLLATE NOCASE', [skName]);
        if (found) skillId = found.id;
      }

      if (skillId) {
        db.execute(
          'INSERT OR IGNORE INTO project_skills (project_id, skill_id, is_required) VALUES (?, ?, 1)',
          [projectId, skillId]
        );
      }
    }

    // Auto-generate 6-phase roadmap
    const roadmapPhases = aiService.generateRoadmap({ title, domain });
    for (const rp of roadmapPhases) {
      const rRes = db.execute(
        `INSERT INTO roadmaps (project_id, phase_number, phase_name, description, target_deadline)
         VALUES (?, ?, ?, ?, ?)`,
        [projectId, rp.phaseNumber, rp.phaseName, rp.description, rp.targetDeadline]
      );
      const roadmapId = Number(rRes.lastInsertRowid);

      for (const t of rp.tasks) {
        db.execute(
          `INSERT INTO roadmap_tasks (roadmap_id, title, is_completed, suggested_deadline)
           VALUES (?, ?, ?, ?)`,
          [roadmapId, t.title, t.isCompleted ? 1 : 0, t.suggestedDeadline]
        );
      }
    }

    // Create default starter tasks in Backlog & Todo
    db.execute(
      `INSERT INTO tasks (project_id, title, description, assignee_id, status, priority, deadline, labels)
       VALUES (?, ?, ?, ?, 'todo', 'high', ?, ?)`,
      [projectId, 'Set up repository and project documentation', 'Initialize GitHub repo and add README with architectural vision.', ownerId, deadline, JSON.stringify(['setup', 'docs'])]
    );

    db.execute(
      `INSERT INTO tasks (project_id, title, description, assignee_id, status, priority, deadline, labels)
       VALUES (?, ?, ?, NULL, 'backlog', 'medium', ?, ?)`,
      [projectId, 'Recruit complementary team members', 'Use AI Team Matcher to fill open skill requirements.', deadline, JSON.stringify(['recruiting'])]
    );

    return this.getProjectById(projectId);
  },

  updateProject(projectId: number, updates: any) {
    const allowed = ['title', 'description', 'domain', 'difficulty', 'status', 'team_size_target', 'progress_pct', 'deadline', 'repo_url', 'hardware_reqs'];
    const fields: string[] = [];
    const values: any[] = [];

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    }

    if (fields.length > 0) {
      values.push(projectId);
      db.execute(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    return this.getProjectById(projectId);
  },

  updateMemberRole(projectId: number, userId: number, newRole: string) {
    db.execute(
      'UPDATE project_members SET role = ? WHERE project_id = ? AND user_id = ?',
      [newRole, projectId, userId]
    );
    return this.getProjectById(projectId);
  },

  removeMember(projectId: number, userId: number) {
    db.execute(
      'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
      [projectId, userId]
    );
    // Unassign tasks assigned to this user in this project
    db.execute(
      'UPDATE tasks SET assignee_id = NULL WHERE project_id = ? AND assignee_id = ?',
      [projectId, userId]
    );
    return this.getProjectById(projectId);
  },

  deleteProject(projectId: number) {
    db.execute('DELETE FROM projects WHERE id = ?', [projectId]);
    return { success: true };
  },
};
