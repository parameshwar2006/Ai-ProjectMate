import db from '../db/database.js';

export interface CoveredSkill {
  name: string;
  category: string;
  memberId: number;
  memberName: string;
  memberAvatar: string;
  proficiency: string;
  yearsExperience: number;
}

export interface MissingSkill {
  name: string;
  category: string;
  criticality: 'critical' | 'moderate' | 'optional';
  learningResources: {
    title: string;
    url: string;
    type: 'docs' | 'course' | 'tutorial';
  }[];
}

export interface SkillGapAnalysisResult {
  projectId?: number;
  projectTitle?: string;
  totalRequired: number;
  coveredCount: number;
  missingCount: number;
  healthScore: number;
  coveredSkills: CoveredSkill[];
  missingSkills: MissingSkill[];
  aiRecommendation: string;
  actionableSuggestions: string[];
}

const RESOURCE_CATALOG: Record<string, { title: string; url: string; type: 'docs' | 'course' | 'tutorial' }[]> = {
  'Machine Learning': [
    { title: 'Fast.ai: Practical Deep Learning for Coders', url: 'https://course.fast.ai/', type: 'course' },
    { title: 'Scikit-Learn Official User Guide & API', url: 'https://scikit-learn.org/stable/', type: 'docs' },
  ],
  'PyTorch': [
    { title: 'PyTorch Deep Learning Zero to Mastery', url: 'https://pytorch.org/tutorials/', type: 'tutorial' },
    { title: 'Stanford CS231n: Deep Learning for Computer Vision', url: 'http://cs231n.stanford.edu/', type: 'course' },
  ],
  'Docker': [
    { title: 'Docker Official Getting Started Guide', url: 'https://docs.docker.com/get-started/', type: 'docs' },
    { title: 'Play with Docker Interactive Sandbox', url: 'https://labs.play-with-docker.com/', type: 'tutorial' },
  ],
  'Kubernetes': [
    { title: 'Kubernetes The Hard Way (Kelsey Hightower)', url: 'https://github.com/kelseyhightower/kubernetes-the-hard-way', type: 'tutorial' },
    { title: 'Official K8s Interactive Basics', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', type: 'docs' },
  ],
  'ROS2': [
    { title: 'ROS 2 Humble Documentation & Tutorials', url: 'https://docs.ros.org/en/humble/Tutorials.html', type: 'docs' },
    { title: 'Articulated Robotics: Building a Mobile Robot with ROS2', url: 'https://articulatedrobotics.xyz/', type: 'tutorial' },
  ],
  'ESP32': [
    { title: 'Espressif ESP-IDF Programming Guide', url: 'https://docs.espressif.com/projects/esp-idf/', type: 'docs' },
    { title: 'Random Nerd Tutorials: ESP32 with FreeRTOS', url: 'https://randomnerdtutorials.com/projects-esp32/', type: 'tutorial' },
  ],
  'React': [
    { title: 'React Official Documentation (react.dev)', url: 'https://react.dev/learn', type: 'docs' },
    { title: 'The Modern React 19 Bootcamp', url: 'https://fullstackopen.com/en/', type: 'course' },
  ],
  'PostgreSQL': [
    { title: 'PostgreSQL Official Documentation', url: 'https://www.postgresql.org/docs/', type: 'docs' },
    { title: 'Use The Index, Luke: SQL Indexing Guide', url: 'https://use-the-index-luke.com/', type: 'tutorial' },
  ],
  'Solidity': [
    { title: 'CryptoZombies: Interactive Solidity Tutorial', url: 'https://cryptozombies.io/', type: 'tutorial' },
    { title: 'Solidity by Example (0.8.20+)', url: 'https://solidity-by-example.org/', type: 'docs' },
  ],
  'Cybersecurity': [
    { title: 'OWASP Top 10 Web Application Security', url: 'https://owasp.org/www-project-top-ten/', type: 'docs' },
    { title: 'PortSwigger Web Security Academy', url: 'https://portswigger.net/web-security', type: 'course' },
  ],
};

export const skillGapService = {
  analyzeProject(projectId: number): SkillGapAnalysisResult {
    const project = db.queryOne<any>('SELECT * FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      throw new Error('Project not found');
    }

    // Required skills
    const requiredSkills = db.query<any>(
      `SELECT s.id, s.name, s.category, ps.is_required
       FROM project_skills ps
       JOIN skills s ON ps.skill_id = s.id
       WHERE ps.project_id = ?`,
      [projectId]
    );

    // Current members
    const members = db.query<any>(
      `SELECT u.id, p.full_name, p.avatar_url, pm.role
       FROM project_members pm
       JOIN users u ON pm.user_id = u.id
       JOIN profiles p ON u.id = p.user_id
       WHERE pm.project_id = ?`,
      [projectId]
    );

    return this.analyzeSkillSet(
      requiredSkills.map((s: any) => ({ name: s.name, category: s.category })),
      members,
      project.title,
      project.domain
    );
  },

  analyzeSkillSet(
    requiredSkills: { name: string; category?: string }[],
    members: any[],
    projectTitle = 'Project',
    domain = 'Software'
  ): SkillGapAnalysisResult {
    // Gather all skills of all team members
    const memberSkillsMap = new Map<number, any[]>();
    for (const m of members) {
      const skills = db.query<any>(
        `SELECT s.name, s.category, us.proficiency, us.years_experience
         FROM user_skills us
         JOIN skills s ON us.skill_id = s.id
         WHERE us.user_id = ?`,
        [m.id || m.user_id]
      );
      memberSkillsMap.set(m.id || m.user_id, skills);
    }

    const coveredSkills: CoveredSkill[] = [];
    const missingSkills: MissingSkill[] = [];

    for (const req of requiredSkills) {
      let isCovered = false;
      let bestCoverage: any = null;

      for (const m of members) {
        const mSkills = memberSkillsMap.get(m.id || m.user_id) || [];
        const matched = mSkills.find(
          (s: any) => s.name.toLowerCase() === req.name.toLowerCase()
        );
        if (matched) {
          if (!bestCoverage || (matched.years_experience || 0) > (bestCoverage.years_experience || 0)) {
            bestCoverage = {
              member: m,
              skill: matched,
            };
          }
          isCovered = true;
        }
      }

      if (isCovered && bestCoverage) {
        coveredSkills.push({
          name: req.name,
          category: req.category || bestCoverage.skill.category || 'general',
          memberId: bestCoverage.member.id || bestCoverage.member.user_id,
          memberName: bestCoverage.member.full_name || bestCoverage.member.name || 'Teammate',
          memberAvatar: bestCoverage.member.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          proficiency: bestCoverage.skill.proficiency || 'intermediate',
          yearsExperience: bestCoverage.skill.years_experience || 1.0,
        });
      } else {
        const catalogResources = RESOURCE_CATALOG[req.name] || [
          { title: `${req.name} Official Documentation`, url: `https://duckduckgo.com/?q=${encodeURIComponent(req.name + ' official documentation')}`, type: 'docs' },
          { title: `Learn ${req.name} Step-by-Step`, url: `https://duckduckgo.com/?q=${encodeURIComponent('learn ' + req.name + ' tutorial')}`, type: 'tutorial' },
        ];

        missingSkills.push({
          name: req.name,
          category: req.category || 'tech',
          criticality: missingSkills.length === 0 ? 'critical' : 'moderate',
          learningResources: catalogResources,
        });
      }
    }

    const totalRequired = Math.max(requiredSkills.length, 1);
    const healthScore = Math.round((coveredSkills.length / totalRequired) * 100);

    // AI Recommendation Synthesis
    let aiRecommendation = '';
    const actionableSuggestions: string[] = [];

    if (missingSkills.length === 0) {
      aiRecommendation = `All ${totalRequired} core skills required for ${projectTitle} are fully covered by your current roster. The team has balanced coverage across ${coveredSkills.map(c => c.name).slice(0, 3).join(', ')}.`;
      actionableSuggestions.push('Establish code review workflows and sprint milestones.');
      actionableSuggestions.push('Ensure test coverage before advancing to Phase 4 integration.');
    } else {
      const coveredNames = coveredSkills.map(c => c.name).slice(0, 3).join(', ');
      const missingNames = missingSkills.map(m => m.name).join(', ');

      aiRecommendation = `Your team is strong in ${coveredNames || 'general engineering'} but currently lacks ${missingNames} expertise. Bringing on a teammate with ${missingSkills[0]?.name} will eliminate the biggest delivery bottleneck.`;

      actionableSuggestions.push(`Invite a candidate specializing in ${missingSkills[0]?.name} from the Discover Students directory.`);
      if (missingSkills.length > 1) {
        actionableSuggestions.push(`Utilize curated documentation to cross-train an existing member on ${missingSkills[1]?.name}.`);
      }
      actionableSuggestions.push('Reorganize sprint priorities to begin with fully covered foundational modules first.');
    }

    return {
      totalRequired,
      coveredCount: coveredSkills.length,
      missingCount: missingSkills.length,
      healthScore,
      coveredSkills,
      missingSkills,
      aiRecommendation,
      actionableSuggestions,
    };
  },
};
