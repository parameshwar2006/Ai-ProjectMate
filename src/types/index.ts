export interface Skill {
  id: number;
  name: string;
  category: 'languages' | 'frameworks' | 'ai_ml' | 'embedded_iot' | 'cloud_devops' | 'databases' | 'design';
  icon?: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_experience?: number;
}

export interface UserProfile {
  id: number;
  email: string;
  role: 'student' | 'admin';
  is_active: number;
  is_onboarded: number;
  full_name: string;
  avatar_url: string;
  college?: string;
  branch?: string;
  graduation_year?: number;
  bio?: string;
  github_username?: string;
  linkedin_url?: string;
  weekly_hours: number;
  preferred_team_size: number;
  preferred_role?: string;
  remote_preference: 'remote' | 'hybrid' | 'in-person';
  domains: string[];
  scheduleMatrix?: Record<string, string[]>;
  ai_summary?: string;
  skills: Skill[];
  projects?: any[];
  projectCount?: number;
  github_stars?: number;
  github_repos?: number;
  githubProfile?: {
    username: string;
    total_stars: number;
    total_repos: number;
    contributions_year: number;
    topLanguages: { language: string; percentage: number }[];
    ai_github_analysis: string;
    repositories: {
      id: number;
      repo_name: string;
      description: string;
      language: string;
      stars_count: number;
      repo_url: string;
    }[];
  };
}

export interface ProjectMember {
  id: number;
  email: string;
  full_name: string;
  avatar_url: string;
  college?: string;
  weekly_hours?: number;
  role: string;
  joined_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  assignee_id?: number | null;
  assignee_name?: string;
  assignee_avatar?: string;
  assignee_email?: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
  labels?: string | string[];
  created_at?: string;
}

export interface RoadmapTask {
  id: number;
  roadmap_id: number;
  title: string;
  is_completed: number;
  suggested_deadline?: string;
}

export interface RoadmapPhase {
  id: number;
  project_id: number;
  phase_number: number;
  phase_name: string;
  description?: string;
  target_deadline?: string;
  tasks: RoadmapTask[];
}

export interface Project {
  id: number;
  owner_id: number;
  owner_name?: string;
  owner_avatar?: string;
  owner_college?: string;
  title: string;
  description: string;
  domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'recruiting' | 'in_progress' | 'completed';
  team_size_target: number;
  progress_pct: number;
  deadline?: string;
  repo_url?: string;
  hardware_reqs?: string;
  created_at: string;
  skills: Skill[];
  members: ProjectMember[];
  currentMembersCount?: number;
  tasks?: Task[];
  roadmaps?: RoadmapPhase[];
}

export interface NotificationItem {
  id: number;
  user_id: number;
  type: 'invitation' | 'task' | 'deadline' | 'recommendation' | 'system';
  title: string;
  message: string;
  link?: string;
  is_read: number;
  created_at: string;
}

export interface InvitationItem {
  id: number;
  project_id: number;
  sender_id: number;
  recipient_id: number;
  role_offered: string;
  status: 'pending' | 'accepted' | 'declined';
  message: string;
  created_at: string;
  project_title: string;
  project_domain: string;
  sender_name: string;
  sender_avatar: string;
}

export interface MatchCandidate {
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
