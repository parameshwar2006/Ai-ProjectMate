import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import {
  Share2,
  Lock,
  Mail,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const TEST_ACCOUNTS = [
  { name: 'Yashwanth Kumar', role: 'Full Stack & IoT Lead', email: 'yashwanth@college.edu', id: 1 },
  { name: 'Rahul Sharma', role: 'Embedded & ESP32 Specialist', email: 'rahul.sharma@college.edu', id: 2 },
  { name: 'Priya Patel', role: 'Frontend & UI/UX Architect', email: 'priya.patel@college.edu', id: 3 },
  { name: 'Arjun Mehta', role: 'Lead ML Researcher', email: 'arjun.mehta@college.edu', id: 4 },
  { name: 'Platform Admin', role: 'System Administrator', email: 'admin@aiprojectmate.dev', id: 99 },
];

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot Password Modal
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Google OAuth Mock Loading
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      // Redirect to dashboard or previous destination
      const destination = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid college email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofill = (acc: typeof TEST_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword('password123');
    setError(null);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      // Simulate Google OAuth popup handshake & sign in as active student
      await new Promise(res => setTimeout(res, 600));
      await demoLogin(1); // Sign in as Yashwanth
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSubmitted(true);
    setTimeout(() => {
      setIsForgotOpen(false);
      setForgotSubmitted(false);
    }, 2500);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 animate-in fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-glow-blue transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-dark-900 rounded-[15px] flex items-center justify-center">
                <Share2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <span className="text-2xl font-black text-white tracking-tight">AI ProjectMate</span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight pt-2">Welcome Back</h2>
          <p className="text-xs text-slate-400">
            Sign in to access your project workspaces, team Kanban, and AI copilot.
          </p>
        </div>

        {/* Quick Fill / Test Personas Card */}
        <div className="p-4 rounded-2xl bg-dark-900 border border-slate-700/80 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Quick Fill Demo Accounts
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Password: password123</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {TEST_ACCOUNTS.map(acc => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleAutofill(acc)}
                className={`p-2 rounded-xl text-left transition-all border ${
                  email === acc.email
                    ? 'bg-blue-500/20 border-blue-500/50 text-white'
                    : 'bg-dark-850 hover:bg-dark-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <div className="font-semibold text-xs truncate">{acc.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{acc.role}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Login Card */}
        <Card className="p-6 md:p-8 border border-slate-700/90 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-dark-850 hover:bg-dark-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99]"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-transparent animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with College Google Account</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-dark-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-mono">
              or email
            </span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">College Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded bg-dark-900 border-slate-700 text-brand-blue focus:ring-0"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="glow"
              size="md"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Account
            </Button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-cyan-400 hover:underline font-semibold">
              Create student profile
            </Link>
          </div>
        </Card>
      </div>

      {/* Forgot Password Modal */}
      <Modal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} title="Reset Account Password">
        {forgotSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">Reset Link Sent</h4>
            <p className="text-xs text-slate-400">
              Check <strong>{forgotEmail || 'your email'}</strong> for password reset instructions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-slate-400">
              Enter your registered college email and we will dispatch an instant password reset link.
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">College Email</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="name@college.edu"
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                required
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsForgotOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="glow" size="sm">
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
