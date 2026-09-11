import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { PersonaSwitcher } from '../components/common/PersonaSwitcher';
import { Settings, Shield, Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          Account & Platform Settings
        </h1>
        <p className="text-xs text-slate-400">Manage your active persona, session preferences, and notification channels.</p>
      </div>

      {/* Persona Switcher Section */}
      <Card className="p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Demo Persona</h3>
            <p className="text-xs text-slate-400">Switch instantaneously between student personas or platform admin for evaluation.</p>
          </div>
          <PersonaSwitcher />
        </div>
      </Card>

      {/* Account Info */}
      <Card className="p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          Active Account Information
        </h3>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between p-2.5 rounded-xl bg-dark-900 border border-slate-800">
            <span className="text-slate-400">Full Name:</span>
            <span className="font-semibold text-white">{user?.fullName}</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-dark-900 border border-slate-800">
            <span className="text-slate-400">Email Address:</span>
            <span className="font-semibold text-white">{user?.email}</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-dark-900 border border-slate-800">
            <span className="text-slate-400">Platform Role:</span>
            <span className="font-semibold text-cyan-300 capitalize">{user?.role}</span>
          </div>
        </div>
      </Card>

      {/* Sign Out Action */}
      <Card className="p-6 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-red-400">Session Management</h3>
          <p className="text-xs text-slate-400">Sign out of the current demo persona session.</p>
        </div>
        <Button
          variant="danger"
          size="sm"
          leftIcon={<LogOut className="w-4 h-4" />}
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Sign Out
        </Button>
      </Card>
    </div>
  );
};
