import db from '../db/database.js';

export interface MatchResult {
  studentId: number;
  studentName: string;
  avatarUrl: string;
  college: string;
  branch: string;
  overallScore: number;
  breakdown: {
    skillMatch: number;
    availabilityMatch: number;
    domainInterest: number;
    experienceMatch: number;
  };
  keyMatchedSkills: string[];
  missingSkillsCovered: string[];
  explanation: string;
  whyThisMatch: string[];
  weeklyHours: number;
  preferredRole: string;
}

export interface ProjectMatchResult {
  projectId: number;
  projectTitle: string;
  domain: string;
  difficulty: string;
  progressPct: number;
  overallScore: number;
  breakdown: {
    skillMatch: number;
    availabilityMatch: number;
    domainInterest: number;
    experienceMatch: number;
  };
  explanation: string;
  requiredSkills: string[];
}

const PROFICIENCY_WEIGHTS: Record<string, number> = {
  beginner: 0.45,
  intermediate: 0.75,
  advanced: 0.92,
  expert: 1.0,
};

export const matchingService = {
  /**
   * Calculate compatibility between a project and a student
   */
  calculateCompatibility(project: any, student: any): MatchResult {
    // 1. Skill Match & Complementary Skills
    const projectSkills: any[] = project.skills || [];
    const studentSkills: any[] = student.skills || [];

    const projectSkillNames = projectSkills.map((s: any) => (s.name || s).toLowerCase());
    const studentSkillMap = new Map<string, any>();
    for (const sk of studentSkills) {
      studentSkillMap.set((sk.name || sk).toLowerCase(), sk);
    }

    let matchedSkillCount = 0;
    let weightedSkillScore = 0;
    const keyMatchedSkills: string[] = [];

    for (const projSk of projectSkillNames) {
      if (studentSkillMap.has(projSk)) {
        matchedSkillCount++;
        const stSkill = studentSkillMap.get(projSk);
        const weight = PROFICIENCY_WEIGHTS[stSkill.proficiency?.toLowerCase()] || 0.7;
        weightedSkillScore += weight;
        keyMatchedSkills.push(stSkill.name || projSk);
      }
    }

    const totalReqSkills = Math.max(projectSkillNames.length, 1);
    const rawSkillRatio = weightedSkillScore / totalReqSkills;
    // Scale skill match into a smooth 60-98 range for good matches
    const skillMatchScore = Math.min(
      99,
      Math.max(40, Math.round((rawSkillRatio * 75) + (matchedSkillCount > 0 ? 24 : 0)))
    );

    // 2. Availability Match
    const studentHours = student.weekly_hours || 15;
    // Projects generally need 15-20 hours/week
    const targetHours = 18;
    const hourRatio = Math.min(1.0, studentHours / targetHours);
    const availabilityMatchScore = Math.min(98, Math.max(50, Math.round(hourRatio * 96)));

    // 3. Domain Interest Match
    let studentDomains: string[] = [];
    try {
      studentDomains = Array.isArray(student.domains)
        ? student.domains
        : JSON.parse(student.domains || '[]');
    } catch {
      studentDomains = [];
    }

    const projDomain = (project.domain || '').toLowerCase();
    const hasDomainMatch = studentDomains.some((d: string) =>
      projDomain.includes(d.toLowerCase()) || d.toLowerCase().includes(projDomain)
    );
    const domainInterestScore = hasDomainMatch ? 95 : 68;

    // 4. Experience Parity Match
    const maxStudentExp = Math.max(...studentSkills.map((s: any) => s.years_experience || 0), 1.0);
    const difficulty = (project.difficulty || 'intermediate').toLowerCase();
    let experienceMatchScore = 80;

    if (difficulty === 'beginner') {
      experienceMatchScore = 92;
    } else if (difficulty === 'intermediate') {
      experienceMatchScore = maxStudentExp >= 2 ? 94 : 78;
    } else if (difficulty === 'advanced') {
      experienceMatchScore = maxStudentExp >= 3 ? 96 : maxStudentExp >= 2 ? 82 : 65;
    }

    // Complementary skills that help the team
    const teamMembers: any[] = project.members || [];
    const teamSkillSet = new Set<string>();
    for (const m of teamMembers) {
      const mSkills = db.query<any>(
        'SELECT s.name FROM user_skills us JOIN skills s ON us.skill_id = s.id WHERE us.user_id = ?',
        [m.user_id || m.userId]
      );
      for (const sk of mSkills) {
        teamSkillSet.add(sk.name.toLowerCase());
      }
    }

    const missingSkillsCovered: string[] = [];
    for (const projSk of projectSkillNames) {
      if (!teamSkillSet.has(projSk) && studentSkillMap.has(projSk)) {
        missingSkillsCovered.push(studentSkillMap.get(projSk).name);
      }
    }

    // Overall Weighted Score
    // 40% skills, 25% domain, 20% availability, 15% experience + bonus for missing skills covered
    let totalScore = Math.round(
      (skillMatchScore * 0.40) +
      (domainInterestScore * 0.25) +
      (availabilityMatchScore * 0.20) +
      (experienceMatchScore * 0.15)
    );

    if (missingSkillsCovered.length > 0) {
      totalScore = Math.min(99, totalScore + 4);
    }

    // Natural Language Explanation Generation
    let explanation = '';
    const whyThisMatch: string[] = [];

    if (keyMatchedSkills.length > 0) {
      whyThisMatch.push(`Has verified proficiency in ${keyMatchedSkills.slice(0, 3).join(', ')}.`);
    }

    if (missingSkillsCovered.length > 0) {
      whyThisMatch.push(`Directly covers critical missing team skills: ${missingSkillsCovered.join(', ')}.`);
    }

    if (hasDomainMatch) {
      whyThisMatch.push(`Strong domain interest in ${project.domain}.`);
    }

    whyThisMatch.push(`Commits ${studentHours}h/week aligning with project delivery goals.`);

    if (keyMatchedSkills.length >= 2) {
      explanation = `Strong match because your project requires ${project.domain} capabilities and ${student.full_name} brings proven experience in ${keyMatchedSkills.slice(0, 2).join(' and ')}.`;
    } else if (missingSkillsCovered.length > 0) {
      explanation = `Ideal match to fill the team skill gap in ${missingSkillsCovered.join(', ')}.`;
    } else {
      explanation = `Compatible teammate based on domain alignment in ${project.domain} and complementary software background.`;
    }

    return {
      studentId: student.id,
      studentName: student.full_name,
      avatarUrl: student.avatar_url,
      college: student.college,
      branch: student.branch,
      overallScore: totalScore,
      breakdown: {
        skillMatch: skillMatchScore,
        availabilityMatch: availabilityMatchScore,
        domainInterest: domainInterestScore,
        experienceMatch: experienceMatchScore,
      },
      keyMatchedSkills,
      missingSkillsCovered,
      explanation,
      whyThisMatch,
      weeklyHours: studentHours,
      preferredRole: student.preferred_role || 'Contributor',
    };
  },

  /**
   * Find recommended teammates for a specific project
   */
  findMatchesForProject(projectId: number, limit = 10): MatchResult[] {
    const project = db.queryOne<any>('SELECT * FROM projects WHERE id = ?', [projectId]);
    if (!project) return [];

    const projectSkills = db.query<any>(
      `SELECT s.id, s.name, ps.is_required
       FROM project_skills ps
       JOIN skills s ON ps.skill_id = s.id
       WHERE ps.project_id = ?`,
      [projectId]
    );

    const members = db.query<any>(
      'SELECT user_id, role FROM project_members WHERE project_id = ?',
      [projectId]
    );

    const memberIds = new Set(members.map((m: any) => m.user_id));
    memberIds.add(project.owner_id);

    // Get all eligible candidates
    const allStudents = db.query<any>(
      `SELECT u.id, u.email, p.full_name, p.avatar_url, p.college, p.branch,
              p.weekly_hours, p.preferred_role, p.domains, p.bio
       FROM users u
       JOIN profiles p ON u.id = p.user_id
       WHERE u.role = 'student' AND u.is_active = 1`
    );

    const projectObj = { ...project, skills: projectSkills, members };
    const matches: MatchResult[] = [];

    for (const student of allStudents) {
      if (memberIds.has(student.id)) continue; // Don't recommend existing team members

      const studentSkills = db.query<any>(
        `SELECT s.id, s.name, us.proficiency, us.years_experience
         FROM user_skills us
         JOIN skills s ON us.skill_id = s.id
         WHERE us.user_id = ?`,
        [student.id]
      );

      const match = this.calculateCompatibility(projectObj, { ...student, skills: studentSkills });
      matches.push(match);
    }

    matches.sort((a, b) => b.overallScore - a.overallScore);
    return matches.slice(0, limit);
  },

  /**
   * Find recommended projects for a specific student
   */
  findRecommendedProjects(userId: number, limit = 8): ProjectMatchResult[] {
    const student = db.queryOne<any>(
      `SELECT u.id, u.email, p.full_name, p.avatar_url, p.weekly_hours, p.domains
       FROM users u
       JOIN profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [userId]
    );
    if (!student) return [];

    const studentSkills = db.query<any>(
      `SELECT s.id, s.name, us.proficiency, us.years_experience
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = ?`,
      [userId]
    );
    const studentObj = { ...student, skills: studentSkills };

    // Get active projects where student is NOT yet a member
    const projects = db.query<any>(
      `SELECT p.*
       FROM projects p
       WHERE p.status != 'completed'
       AND p.id NOT IN (SELECT project_id FROM project_members WHERE user_id = ?)`,
      [userId]
    );

    const results: ProjectMatchResult[] = [];

    for (const proj of projects) {
      const projSkills = db.query<any>(
        `SELECT s.name
         FROM project_skills ps
         JOIN skills s ON ps.skill_id = s.id
         WHERE ps.project_id = ?`,
        [proj.id]
      );

      const match = this.calculateCompatibility(
        { ...proj, skills: projSkills, members: [] },
        studentObj
      );

      results.push({
        projectId: proj.id,
        projectTitle: proj.title,
        domain: proj.domain,
        difficulty: proj.difficulty,
        progressPct: proj.progress_pct,
        overallScore: match.overallScore,
        breakdown: match.breakdown,
        explanation: match.explanation,
        requiredSkills: projSkills.map((s: any) => s.name),
      });
    }

    results.sort((a, b) => b.overallScore - a.overallScore);
    return results.slice(0, limit);
  },
};
