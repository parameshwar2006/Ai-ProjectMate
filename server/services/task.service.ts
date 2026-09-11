import db from '../db/database.js';

export const taskService = {
  getTasksForProject(projectId: number) {
    return db.query<any>(
      `SELECT t.*, u.email as assignee_email, prof.full_name as assignee_name, prof.avatar_url as assignee_avatar
       FROM tasks t
       LEFT JOIN users u ON t.assignee_id = u.id
       LEFT JOIN profiles prof ON u.id = prof.user_id
       WHERE t.project_id = ?
       ORDER BY t.created_at DESC`,
      [projectId]
    );
  },

  createTask(projectId: number, data: any) {
    const {
      title,
      description = '',
      assigneeId = null,
      status = 'todo',
      priority = 'medium',
      deadline = null,
      labels = [],
    } = data;

    const res = db.execute(
      `INSERT INTO tasks (project_id, title, description, assignee_id, status, priority, deadline, labels)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        title,
        description,
        assigneeId ? Number(assigneeId) : null,
        status,
        priority,
        deadline,
        JSON.stringify(labels),
      ]
    );

    this.recalculateProjectProgress(projectId);

    const taskId = Number(res.lastInsertRowid);
    return db.queryOne<any>(
      `SELECT t.*, u.email as assignee_email, prof.full_name as assignee_name, prof.avatar_url as assignee_avatar
       FROM tasks t
       LEFT JOIN users u ON t.assignee_id = u.id
       LEFT JOIN profiles prof ON u.id = prof.user_id
       WHERE t.id = ?`,
      [taskId]
    );
  },

  updateTask(taskId: number, updates: any) {
    const task = db.queryOne<any>('SELECT project_id FROM tasks WHERE id = ?', [taskId]);
    if (!task) throw new Error('Task not found');

    const allowed = ['title', 'description', 'assignee_id', 'status', 'priority', 'deadline', 'labels'];
    const fields: string[] = [];
    const values: any[] = [];

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'labels' && Array.isArray(updates[key])) {
          values.push(JSON.stringify(updates[key]));
        } else if (key === 'assignee_id') {
          values.push(updates[key] ? Number(updates[key]) : null);
        } else {
          values.push(updates[key]);
        }
      }
    }

    if (fields.length > 0) {
      values.push(taskId);
      db.execute(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    this.recalculateProjectProgress(task.project_id);

    return db.queryOne<any>(
      `SELECT t.*, u.email as assignee_email, prof.full_name as assignee_name, prof.avatar_url as assignee_avatar
       FROM tasks t
       LEFT JOIN users u ON t.assignee_id = u.id
       LEFT JOIN profiles prof ON u.id = prof.user_id
       WHERE t.id = ?`,
      [taskId]
    );
  },

  deleteTask(taskId: number) {
    const task = db.queryOne<any>('SELECT project_id FROM tasks WHERE id = ?', [taskId]);
    if (task) {
      db.execute('DELETE FROM tasks WHERE id = ?', [taskId]);
      this.recalculateProjectProgress(task.project_id);
    }
    return { success: true };
  },

  toggleRoadmapTask(roadmapTaskId: number) {
    const item = db.queryOne<any>(
      `SELECT rt.*, r.project_id FROM roadmap_tasks rt JOIN roadmaps r ON rt.roadmap_id = r.id WHERE rt.id = ?`,
      [roadmapTaskId]
    );
    if (!item) throw new Error('Roadmap task not found');

    const newCompleted = item.is_completed ? 0 : 1;
    db.execute('UPDATE roadmap_tasks SET is_completed = ? WHERE id = ?', [newCompleted, roadmapTaskId]);

    this.recalculateProjectProgress(item.project_id);

    return { id: roadmapTaskId, isCompleted: Boolean(newCompleted) };
  },

  recalculateProjectProgress(projectId: number) {
    const allTasks = db.query<any>('SELECT status FROM tasks WHERE project_id = ?', [projectId]);
    const roadmapTasks = db.query<any>(
      `SELECT rt.is_completed FROM roadmap_tasks rt JOIN roadmaps r ON rt.roadmap_id = r.id WHERE r.project_id = ?`,
      [projectId]
    );

    let totalItems = allTasks.length + roadmapTasks.length;
    if (totalItems === 0) return;

    let completedItems = allTasks.filter(t => t.status === 'completed').length +
      roadmapTasks.filter(rt => rt.is_completed === 1).length;

    const progressPct = Math.min(100, Math.round((completedItems / totalItems) * 100));
    db.execute('UPDATE projects SET progress_pct = ? WHERE id = ?', [progressPct, projectId]);
  },
};
