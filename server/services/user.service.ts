import db from '../db/database.js';
import { aiService } from './ai.service.js';

export interface StudentFilter {
  search?: string;
  skills?: string[];
  domain?: string;
  experience?: string;
  availability?: number;
  college?: string;
  sortBy?: 'compatibility' | 'experience' | 'availability' | 'name';
}

export const userService = {
  getAllSkills() {
    return db.query('SELECT * FROM skills ORDER BY category, name');
  },

  getStudents(filter: StudentFilter = {}) {
    let sql = `
      SELECT
        u.id, u.email, u.role, u.is_active,
        p.full_name, p.avatar_url, p.college, p.branch, p.graduation_year,
        p.bio, p.github_username, p.linkedin_url, p.weekly_hours, p.preferred_team_size,
        p.preferred_role, p.remote_preference, p.domains, p.schedule_matrix, p.ai_summary,
        COALESCE(gh.total_stars, 0) as github_stars,
        COALESCE(gh.total_repos, 0) as github_repos
      FROM users u
      JOIN profiles p ON u.id = p.user_id
      LEFT JOIN github_profiles gh ON u.id = gh.user_id
      WHERE u.role = 'student' AND u.is_active = 1
    `;
    const params: any[] = [];

    if (filter.search) {
      sql += ` AND (p.full_name LIKE ? OR p.college LIKE ? OR p.branch LIKE ? OR p.bio LIKE ?)`;
      const s = `%${filter.search}%`;
      params.push(s, s, s, s);
    }

    if (filter.college) {
      sql += ` AND p.college LIKE ?`;
      params.push(`%${filter.college}%`);
    }

    if (filter.availability) {
      sql += ` AND p.weekly_hours >= ?`;
      params.push(filter.availability);
    }

    const rows = db.query<any>(sql, params);

    // Fetch skills and projects for each student
    const result = rows.map(student => {
      const skills = db.query<any>(
        `SELECT s.id, s.name, s.category, s.icon, us.proficiency, us.years_experience
         FROM user_skills us
         JOIN skills s ON us.skill_id = s.id
         WHERE us.user_id = ?`,
        [student.id]
      );

      const projects = db.query<any>(
        `SELECT p.id, p.title, p.domain, pm.role
         FROM project_members pm
         JOIN projects p ON pm.project_id = p.id
         WHERE pm.user_id = ?`,
        [student.id]
      );

      let parsedDomains: string[] = [];
      try {
        parsedDomains = JSON.parse(student.domains || '[]');
      } catch {
        parsedDomains = [];
      }

      let parsedSchedule: any = {};
      try {
        parsedSchedule = JSON.parse(student.schedule_matrix || '{}');
      } catch {
        parsedSchedule = {};
      }

      return {
        ...student,
        domains: parsedDomains,
        scheduleMatrix: parsedSchedule,
        skills,
        projects,
        projectCount: projects.length,
      };
    });

    // Apply in-memory skill filtering if specified
    let filtered = result;
    if (filter.skills && filter.skills.length > 0) {
      filtered = filtered.filter(st => {
        const studentSkillNames = st.skills.map((s: any) => s.name.toLowerCase());
        return filter.skills!.some(reqSk => studentSkillNames.includes(reqSk.toLowerCase()));
      });
    }

    if (filter.domain) {
      filtered = filtered.filter(st =>
        st.domains.some((d: string) => d.toLowerCase().includes(filter.domain!.toLowerCase()))
      );
    }

    if (filter.experience) {
      filtered = filtered.filter(st => {
        const maxExp = Math.max(...st.skills.map((s: any) => s.years_experience || 0), 0);
        if (filter.experience === 'beginner') return maxExp < 2;
        if (filter.experience === 'intermediate') return maxExp >= 2 && maxExp < 3;
        if (filter.experience === 'advanced') return maxExp >= 3;
        return true;
      });
    }

    // Sorting
    if (filter.sortBy === 'experience') {
      filtered.sort((a, b) => {
        const expA = Math.max(...a.skills.map((s: any) => s.years_experience || 0), 0);
        const expB = Math.max(...b.skills.map((s: any) => s.years_experience || 0), 0);
        return expB - expA;
      });
    } else if (filter.sortBy === 'availability') {
      filtered.sort((a, b) => b.weekly_hours - a.weekly_hours);
    } else if (filter.sortBy === 'name') {
      filtered.sort((a, b) => a.full_name.localeCompare(b.full_name));
    }

    return filtered;
  },

  getStudentById(id: number) {
    const student = db.queryOne<any>(
      `SELECT
        u.id, u.email, u.role, u.is_active, u.is_onboarded, u.created_at,
        p.full_name, p.avatar_url, p.college, p.branch, p.graduation_year,
        p.bio, p.github_username, p.linkedin_url, p.weekly_hours, p.preferred_team_size,
        p.preferred_role, p.remote_preference, p.domains, p.schedule_matrix, p.ai_summary
      FROM users u
      JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ? AND u.is_active = 1`,
      [id]
    );

    if (!student) return null;

    const skills = db.query<any>(
      `SELECT s.id, s.name, s.category, s.icon, us.proficiency, us.years_experience
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = ?
       ORDER BY us.years_experience DESC`,
      [id]
    );

    const projects = db.query<any>(
      `SELECT p.id, p.title, p.description, p.domain, p.status, p.progress_pct, p.repo_url, pm.role
       FROM project_members pm
       JOIN projects p ON pm.project_id = p.id
       WHERE pm.user_id = ?`,
      [id]
    );

    const github = db.queryOne<any>(
      `SELECT * FROM github_profiles WHERE user_id = ?`,
      [id]
    );

    const repositories = db.query<any>(
      `SELECT * FROM repositories WHERE user_id = ? ORDER BY stars_count DESC`,
      [id]
    );

    let parsedDomains: string[] = [];
    try {
      parsedDomains = JSON.parse(student.domains || '[]');
    } catch {
      parsedDomains = [];
    }

    let parsedSchedule: any = {};
    try {
      parsedSchedule = JSON.parse(student.schedule_matrix || '{}');
    } catch {
      parsedSchedule = {};
    }

    let topLanguages: any[] = [];
    try {
      topLanguages = github?.top_languages ? JSON.parse(github.top_languages) : [];
    } catch {
      topLanguages = [];
    }

    return {
      ...student,
      domains: parsedDomains,
      scheduleMatrix: parsedSchedule,
      skills,
      projects,
      githubProfile: github
        ? {
            ...github,
            topLanguages,
            repositories,
          }
        : null,
    };
  },

  updateProfile(userId: number, updates: any) {
    const allowedFields = [
      'full_name', 'avatar_url', 'college', 'branch', 'graduation_year',
      'bio', 'github_username', 'linkedin_url', 'weekly_hours',
      'preferred_team_size', 'preferred_role', 'remote_preference',
      'domains', 'schedule_matrix', 'ai_summary',
    ];

    const fieldsToUpdate: string[] = [];
    const values: any[] = [];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        fieldsToUpdate.push(`${field} = ?`);
        if (typeof updates[field] === 'object') {
          values.push(JSON.stringify(updates[field]));
        } else {
          values.push(updates[field]);
        }
      }
    }

    if (fieldsToUpdate.length > 0) {
      values.push(userId);
      db.execute(
        `UPDATE profiles SET ${fieldsToUpdate.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
        values
      );
    }

    // If skills are provided, replace user_skills
    if (Array.isArray(updates.skills)) {
      db.execute('DELETE FROM user_skills WHERE user_id = ?', [userId]);
      for (const sk of updates.skills) {
        let skillId = sk.id;
        if (!skillId && sk.name) {
          const found = db.queryOne<any>('SELECT id FROM skills WHERE name = ? COLLATE NOCASE', [sk.name]);
          if (found) skillId = found.id;
        }
        if (skillId) {
          db.execute(
            'INSERT OR REPLACE INTO user_skills (user_id, skill_id, proficiency, years_experience) VALUES (?, ?, ?, ?)',
            [userId, skillId, sk.proficiency || 'intermediate', sk.years_experience || 1.5]
          );
        }
      }
    }

    return this.getStudentById(userId);
  },

  completeOnboarding(userId: number, data: any) {
    const {
      basicInfo,
      skills,
      interests,
      experience,
      availability,
      github,
      projectPreferences,
    } = data;

    // Generate smart AI summary
    const skillNames = (skills || []).map((s: any) => s.name || s);
    const domainList = interests?.domains || ['Web Development', 'AI/ML'];
    const aiSummary = aiService.generateProfileSummary({
      name: basicInfo?.fullName || 'Student',
      college: basicInfo?.college || 'University',
      branch: basicInfo?.branch || 'Engineering',
      skills: skillNames,
      domains: domainList,
      prefRole: projectPreferences?.preferredRole || 'Software Engineer',
    });

    // Update Profile
    db.execute(
      `UPDATE profiles SET
        full_name = ?, college = ?, branch = ?, graduation_year = ?, bio = ?,
        github_username = ?, weekly_hours = ?, preferred_team_size = ?,
        preferred_role = ?, remote_preference = ?, domains = ?, schedule_matrix = ?,
        ai_summary = ?, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [
        basicInfo?.fullName || 'Student',
        basicInfo?.college || '',
        basicInfo?.branch || '',
        Number(basicInfo?.gradYear) || 2026,
        basicInfo?.bio || '',
        github?.username || '',
        Number(availability?.weeklyHours) || 15,
        Number(projectPreferences?.preferredTeamSize) || 4,
        projectPreferences?.preferredRole || 'Contributor',
        projectPreferences?.remotePreference || 'hybrid',
        JSON.stringify(domainList),
        JSON.stringify(availability?.scheduleMatrix || {}),
        aiSummary,
        userId,
      ]
    );

    // Update User Skills
    db.execute('DELETE FROM user_skills WHERE user_id = ?', [userId]);
    if (Array.isArray(skills)) {
      for (const sk of skills) {
        let skillId = sk.id;
        if (!skillId && sk.name) {
          const found = db.queryOne<any>('SELECT id FROM skills WHERE name = ? COLLATE NOCASE', [sk.name]);
          if (found) skillId = found.id;
        }
        if (skillId) {
          db.execute(
            'INSERT INTO user_skills (user_id, skill_id, proficiency, years_experience) VALUES (?, ?, ?, ?)',
            [userId, skillId, sk.proficiency || 'intermediate', Number(sk.years) || 1.5]
          );
        }
      }
    }

    // Set GitHub Mock Stats
    if (github?.username) {
      db.execute(
        `INSERT OR REPLACE INTO github_profiles (
          user_id, username, total_stars, total_repos, contributions_year, top_languages, ai_github_analysis
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          github.username,
          14,
          8,
          184,
          JSON.stringify([
            { language: skillNames[0] || 'JavaScript', percentage: 65 },
            { language: skillNames[1] || 'Python', percentage: 35 },
          ]),
          `Active open-source student profile focused on ${domainList[0] || 'software development'}. Clean repository structure with growing contributions.`,
        ]
      );
    }

    // Mark as onboarded
    db.execute('UPDATE users SET is_onboarded = 1 WHERE id = ?', [userId]);

    return this.getStudentById(userId);
  },
};
