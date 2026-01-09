import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      onLogin(email);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-dark-border animate-fade-in">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-blue-500/40">
            E
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Sign in to access the Educa-8 platform</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@educa8.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">Remember me</span>
            </label>
            <a href="#" className="text-blue-600 font-medium hover:underline">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-400">
            Demo Logins:<br/>
            Admin: admin@educa8.com<br/>
            Teacher: teacher@educa8.com<br/>
            School: school@educa8.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;