import React from 'react';
import { UserRole } from '../types';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onChange: (role: UserRole) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onChange }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white p-2 rounded-full shadow-2xl border border-gray-200 flex items-center gap-1">
      <button 
        onClick={() => onChange(UserRole.SCHOOL_INSTRUCTOR)}
        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${currentRole === UserRole.SCHOOL_INSTRUCTOR ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
      >
        In-School View
      </button>
      <button 
        onClick={() => onChange(UserRole.CONTRACTOR_TEACHER)}
        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${currentRole === UserRole.CONTRACTOR_TEACHER ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
      >
        Teacher View
      </button>
      <button 
        onClick={() => onChange(UserRole.ADMIN)}
        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${currentRole === UserRole.ADMIN ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
      >
        Admin View
      </button>
    </div>
  );
};

export default RoleSwitcher;