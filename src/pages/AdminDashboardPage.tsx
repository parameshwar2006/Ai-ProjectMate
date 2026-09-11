import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { api } from '../services/api';
import {
  ShieldAlert,
  Users,
  FolderKanban,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  UserX,
  Flag,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const PIE_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsData, reportsData] = await Promise.all([
        api.admin.getStats().catch(() => null),
        api.admin.getReports().catch(() => []),
      ]);
      setStats(statsData);
      setReports(reportsData || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleResolveReport = async (reportId: number, action: string) => {
    try {
      await api.admin.resolveReport(reportId, action);
      setActionSuccess(`Report #${reportId} resolved with action: ${action.replace('_', ' ')}`);
      fetchAdminData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Platform Administration & Analytics</h1>
          </div>
          <p className="text-xs text-slate-400">
            System health, cohort growth trends, skill demand distribution, and student safety moderation.
          </p>
        </div>

        <span className="text-xs px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
          Admin Authorization Active
        </span>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs text-purple-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Top 4 Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Students</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {stats?.totalUsers || '2,450'}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +18.4% month-over-month
          </p>
        </Card>

        <Card className="p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Workspaces</span>
            <FolderKanban className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {stats?.totalProjects || '430'}
          </div>
          <p className="text-[11px] text-slate-400">
            Across 10 academic domains
          </p>
        </Card>

        <Card className="p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Team Compatibility</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {stats?.avgMatchScore || 94}%
          </div>
          <p className="text-[11px] text-purple-400 font-medium">
            Deterministic synergy score
          </p>
        </Card>

        <Card className="p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Project Delivery Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {stats?.completionRate || 58}%
          </div>
          <p className="text-[11px] text-slate-400">
            Average sprint progress
          </p>
        </Card>
      </div>

      {/* Analytics Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User & Project Growth Chart */}
        <Card className="p-6 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Monthly Cohort Growth (Students & Projects)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.userGrowth || []}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#userGrad)" name="Students" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Most In-Demand Skills Bar Chart */}
        <Card className="p-6 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            Most Demanded Skills Across Projects
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.popularSkills || []}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-25} textAnchor="end" height={45} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Bar dataKey="demandCount" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Project Demand" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Moderation Queue */}
      <Card className="p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Community Safety & Moderation Queue
            </h3>
            <p className="text-xs text-slate-400">Review flagged user accounts and reported project workspaces.</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 font-mono">
            {reports.length} Reports Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-dark-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Reporter</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-400">#{r.id}</td>
                  <td className="p-3">
                    <Badge variant={r.target_type === 'user' ? 'purple' : 'cyan'} size="sm">
                      {r.target_type}
                    </Badge>
                  </td>
                  <td className="p-3 text-white font-medium">{r.reporter_name}</td>
                  <td className="p-3 text-slate-300">{r.reason}</td>
                  <td className="p-3">
                    <span className="capitalize px-2 py-0.5 rounded text-[10px] font-mono bg-dark-900 border border-slate-700">
                      {r.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {r.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleResolveReport(r.id, r.target_type === 'user' ? 'ban_user' : 'flag_project')}
                          className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40 text-[11px] font-medium"
                        >
                          {r.target_type === 'user' ? 'Suspend' : 'Flag'}
                        </button>
                        <button
                          onClick={() => handleResolveReport(r.id, 'dismiss')}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-[11px]"
                        >
                          Dismiss
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
