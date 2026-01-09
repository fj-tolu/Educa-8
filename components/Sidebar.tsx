import React from 'react';
import { LayoutDashboard, BookOpen, MessageSquare, Settings, LogOut, Video, Users, ShieldAlert, Moon, Sun, X, UserPlus } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  activeView: string;
  onNavigate: (view: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentRole, 
  activeView, 
  onNavigate, 
  isDarkMode, 
  toggleDarkMode,
  isOpen,
  onClose,
  onLogout
}) => {
  const isTeacher = currentRole === UserRole.CONTRACTOR_TEACHER;
  const isAdmin = currentRole === UserRole.ADMIN;

  let menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'curriculum', label: isTeacher ? 'My Curriculum' : 'All Courses', icon: BookOpen },
    { id: 'videos', label: isTeacher ? 'Studio Uploads' : 'Lesson Library', icon: Video },
    { id: 'qa', label: 'The Bridge (Q&A)', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (isAdmin) {
    menuItems = [
      { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'admin-register', label: 'Register User', icon: UserPlus }, // New
      { id: 'admin-users', label: 'User Management', icon: Users },
      { id: 'admin-content', label: 'Content Moderation', icon: ShieldAlert },
      { id: 'settings', label: 'System Settings', icon: Settings },
    ];
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark-surface border-r border-gray-100 dark:border-dark-border transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
              E
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">Educa-8</span>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-500 dark:text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-4">
            {isAdmin ? 'Administration' : 'Overview'}
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-50 dark:border-dark-border space-y-3">
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
              <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className={`w-8 h-4 bg-gray-300 dark:bg-blue-600 rounded-full relative transition-colors`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isDarkMode ? 'left-4.5' : 'left-0.5'}`} style={{ left: isDarkMode ? '18px' : '2px' }}></div>
            </div>
          </button>

          {!isAdmin && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-200">
                  <span className="font-bold text-xs">PRO</span>
                </div>
                <span className="text-sm font-bold text-blue-900 dark:text-blue-100">Premium Plan</span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">Your school has 14 days left.</p>
            </div>
          )}
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;