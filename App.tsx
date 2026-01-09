import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import InstructorDashboard from './views/InstructorDashboard';
import TeacherDashboard from './views/TeacherDashboard';
import AdminDashboard from './views/AdminDashboard';
import UserManagementView from './views/UserManagementView';
import ContentModerationView from './views/ContentModerationView';
import LoginView from './views/LoginView';
import SettingsView from './views/SettingsView';
import RegisterUserView from './views/RegisterUserView';
import { UserRole, User } from './types';
import { CURRENT_INSTRUCTOR, CURRENT_TEACHER, CURRENT_ADMIN } from './services/mockData';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.SCHOOL_INSTRUCTOR);
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Defaulting to true for Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    if (email.includes('admin')) {
        setActiveRole(UserRole.ADMIN);
        setActiveView('admin-dashboard');
    } else if (email.includes('teacher')) {
        setActiveRole(UserRole.CONTRACTOR_TEACHER);
        setActiveView('dashboard');
    } else {
        setActiveRole(UserRole.SCHOOL_INSTRUCTOR);
        setActiveView('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveView('dashboard');
    setActiveRole(UserRole.SCHOOL_INSTRUCTOR);
  };

  const getCurrentUser = (): User => {
    switch (activeRole) {
      case UserRole.SCHOOL_INSTRUCTOR: return CURRENT_INSTRUCTOR;
      case UserRole.CONTRACTOR_TEACHER: return CURRENT_TEACHER;
      case UserRole.ADMIN: return CURRENT_ADMIN;
      default: return CURRENT_INSTRUCTOR;
    }
  }

  const currentUser = getCurrentUser();

  const renderContent = () => {
    // Common Views
    if (activeView === 'settings') return <SettingsView user={currentUser} />;
    
    // Admin Views
    if (activeRole === UserRole.ADMIN) {
        switch (activeView) {
            case 'admin-dashboard': return <AdminDashboard onNavigate={setActiveView} />;
            case 'admin-register': return <RegisterUserView />;
            case 'admin-users': return <UserManagementView />;
            case 'admin-content': return <ContentModerationView />;
            default: return <AdminDashboard onNavigate={setActiveView} />;
        }
    } 
    // Instructor Views
    else if (activeRole === UserRole.SCHOOL_INSTRUCTOR) {
      // The InstructorDashboard handles sub-views internally for smoother transitions
      return <InstructorDashboard user={currentUser} currentView={activeView} onNavigate={setActiveView} />;
    } 
    // Teacher Views
    else {
      return <TeacherDashboard user={currentUser} currentView={activeView} onNavigate={setActiveView} />;
    }
  };

  if (!isLoggedIn) {
      return (
        <div className={isDarkMode ? 'dark' : ''}>
            <LoginView onLogin={handleLogin} />
        </div>
      );
  }

  return (
    <div className={`flex h-screen bg-[#F3F4F6] dark:bg-dark-bg overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar 
        currentRole={activeRole} 
        activeView={activeView} 
        onNavigate={setActiveView} 
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-white dark:bg-dark-surface p-4 border-b border-gray-200 dark:border-dark-border flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
            <span className="font-bold text-gray-800 dark:text-white">Educa-8</span>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-600 dark:text-gray-300">
            <Menu size={24} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;