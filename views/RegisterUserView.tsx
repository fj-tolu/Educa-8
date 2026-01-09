
import React, { useState } from 'react';
import { UserPlus, CheckCircle, School, GraduationCap, Shield } from 'lucide-react';

const RegisterUserView: React.FC = () => {
  const [userType, setUserType] = useState<'SCHOOL' | 'TEACHER' | 'ADMIN'>('SCHOOL');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    // Reset after 2 seconds
    setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', subject: '' });
    }, 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Register New User</h1>
           <p className="text-gray-500 dark:text-gray-400">Onboard schools or contractor teachers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
            onClick={() => setUserType('SCHOOL')}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${userType === 'SCHOOL' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-dark-surface hover:border-blue-300'}`}
        >
            <div className={`p-3 rounded-full ${userType === 'SCHOOL' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                <School size={24} />
            </div>
            <span className={`font-bold ${userType === 'SCHOOL' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}>School Instructor</span>
        </button>

        <button 
            onClick={() => setUserType('TEACHER')}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${userType === 'TEACHER' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-400' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-dark-surface hover:border-purple-300'}`}
        >
            <div className={`p-3 rounded-full ${userType === 'TEACHER' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                <GraduationCap size={24} />
            </div>
            <span className={`font-bold ${userType === 'TEACHER' ? 'text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400'}`}>Contractor Teacher</span>
        </button>

        <button 
            onClick={() => setUserType('ADMIN')}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${userType === 'ADMIN' ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-400' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-dark-surface hover:border-orange-300'}`}
        >
            <div className={`p-3 rounded-full ${userType === 'ADMIN' ? 'bg-orange-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                <Shield size={24} />
            </div>
            <span className={`font-bold ${userType === 'ADMIN' ? 'text-orange-700 dark:text-orange-300' : 'text-gray-600 dark:text-gray-400'}`}>Administrator</span>
        </button>
      </div>

      <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl border border-gray-100 dark:border-dark-border shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Entity Name</label>
                    <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder={userType === 'SCHOOL' ? 'e.g. Springfield High' : 'e.g. Dr. John Doe'}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Login Email</label>
                    <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="email@domain.com"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                </div>
            </div>

            {userType === 'TEACHER' && (
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Specialty Subject</label>
                    <select 
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                    >
                        <option value="">Select a Subject</option>
                        <option value="math">Mathematics</option>
                        <option value="science">Science/Biology</option>
                        <option value="history">History</option>
                    </select>
                </div>
            )}

            <div className="pt-4">
                <button 
                    type="submit"
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${isSuccess ? 'bg-green-500' : 'bg-gray-900 dark:bg-blue-600 hover:scale-[1.01]'}`}
                >
                    {isSuccess ? (
                        <><CheckCircle size={20} /> Registered Successfully</>
                    ) : (
                        <><UserPlus size={20} /> Create Account</>
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserView;