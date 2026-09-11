const API_BASE = '/api';

function getAuthToken(): string | null {
  return localStorage.getItem('pm_token');
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    register: (body: { email: string; password: string; fullName: string }) =>
      request<{ token: string; user: any }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      request<{ token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    demoLogin: (userId: number) =>
      request<{ token: string; user: any }>('/auth/demo-login', { method: 'POST', body: JSON.stringify({ userId }) }),
    me: () => request<{ user: any }>('/auth/me'),
  },

  // Users & Students
  users: {
    getSkills: () => request<any[]>('/skills'),
    getStudents: (params?: Record<string, any>) => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            searchParams.append(k, String(v));
          }
        });
      }
      return request<any[]>(`/students?${searchParams.toString()}`);
    },
    getStudentById: (id: number) => request<any>(`/students/${id}`),
    updateProfile: (updates: any) => request<any>('/profile', { method: 'PUT', body: JSON.stringify(updates) }),
    completeOnboarding: (data: any) => request<any>('/onboarding', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Projects
  projects: {
    getProjects: (params?: Record<string, any>) => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            searchParams.append(k, String(v));
          }
        });
      }
      return request<any[]>(`/projects?${searchParams.toString()}`);
    },
    getProjectById: (id: number) => request<any>(`/projects/${id}`),
    createProject: (data: any) => request<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    updateProject: (id: number, data: any) => request<any>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateMemberRole: (projectId: number, userId: number, role: string) =>
      request<any>(`/projects/${projectId}/members/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
    removeMember: (projectId: number, userId: number) =>
      request<any>(`/projects/${projectId}/members/${userId}`, { method: 'DELETE' }),
    deleteProject: (id: number) => request<any>(`/projects/${id}`, { method: 'DELETE' }),
  },

  // Matching
  matching: {
    getTeammateMatches: (projectId: number) => request<any[]>(`/matching/project/${projectId}`),
    getRecommendedProjects: () => request<any[]>('/matching/recommended-projects'),
    calculateCompatibility: (project: any, student: any) =>
      request<any>('/matching/compatibility', { method: 'POST', body: JSON.stringify({ project, student }) }),
  },

  // AI
  ai: {
    generateProject: (prompt: string) =>
      request<any>('/ai/generate-project', { method: 'POST', body: JSON.stringify({ prompt }) }),
    generateRoadmap: (project: any) =>
      request<any>('/ai/generate-roadmap', { method: 'POST', body: JSON.stringify({ project }) }),
    askCopilot: (projectId: number, message: string) =>
      request<{ response: string; promptAction?: string }>('/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({ projectId, message }),
      }),
    getSkillGap: (projectId: number) => request<any>(`/ai/skill-gap/${projectId}`),
    getCustomSkillGap: (data: any) =>
      request<any>('/ai/skill-gap/custom', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Tasks
  tasks: {
    getTasks: (projectId: number) => request<any[]>(`/tasks/project/${projectId}`),
    createTask: (projectId: number, data: any) =>
      request<any>(`/tasks/project/${projectId}`, { method: 'POST', body: JSON.stringify(data) }),
    updateTask: (taskId: number, data: any) =>
      request<any>(`/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTask: (taskId: number) => request<any>(`/tasks/${taskId}`, { method: 'DELETE' }),
    toggleRoadmapTask: (roadmapTaskId: number) =>
      request<any>(`/tasks/roadmap-toggle/${roadmapTaskId}`, { method: 'POST' }),
  },

  // Notifications & Invitations
  notifications: {
    getNotifications: () => request<any[]>('/notifications'),
    getUnreadCount: () => request<{ unreadCount: number }>('/notifications/unread-count'),
    markAsRead: (id: number) => request<any>(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllAsRead: () => request<any>('/notifications/read-all', { method: 'PUT' }),
    getInvitations: () => request<any[]>('/notifications/invitations'),
    sendInvitation: (data: { recipientId: number; projectId: number; roleOffered: string; message: string }) =>
      request<any>('/notifications/invitations', { method: 'POST', body: JSON.stringify(data) }),
    respondToInvitation: (invitationId: number, action: 'accept' | 'decline') =>
      request<any>(`/notifications/invitations/${invitationId}/respond`, { method: 'POST', body: JSON.stringify({ action }) }),
  },

  // Admin
  admin: {
    getStats: () => request<any>('/admin/stats'),
    getReports: () => request<any[]>('/admin/reports'),
    resolveReport: (id: number, action: string) =>
      request<any>(`/admin/reports/${id}/resolve`, { method: 'POST', body: JSON.stringify({ action }) }),
    toggleUserStatus: (id: number) =>
      request<any>(`/admin/users/${id}/toggle-status`, { method: 'POST' }),
  },
};
