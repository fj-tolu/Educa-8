import React, { useState } from 'react';
import { MoreHorizontal, Search, Filter, UserX, UserCheck, Edit } from 'lucide-react';

const UserManagementView: React.FC = () => {
    const [filter, setFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([
        { id: 1, name: 'Sarah Connor', email: 'sarah@educa8.com', role: 'Contractor Teacher', status: 'Active' },
        { id: 2, name: 'Springfield High', email: 'admin@springfield.edu', role: 'School Instructor', status: 'Active' },
        { id: 3, name: 'John Rambo', email: 'john@educa8.com', role: 'Contractor Teacher', status: 'Suspended' },
        { id: 4, name: 'Westside Academy', email: 'contact@westside.edu', role: 'School Instructor', status: 'Active' },
        { id: 5, name: 'Dr. Emmett Brown', email: 'doc@educa8.com', role: 'Contractor Teacher', status: 'Active' },
        { id: 6, name: 'Hill Valley High', email: 'admin@hvhigh.edu', role: 'School Instructor', status: 'Inactive' },
    ]);

    const toggleStatus = (id: number) => {
        setUsers(users.map(u => u.id === id ? {...u, status: u.status === 'Active' ? 'Suspended' : 'Active'} : u));
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              user.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = filter === 'ALL' || 
                              (filter === 'TEACHERS' && user.role === 'Contractor Teacher') || 
                              (filter === 'SCHOOLS' && user.role === 'School Instructor');
        
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage schools, teachers, and system access.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-6 border-b border-gray-100 dark:border-dark-border flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow" 
                        />
                    </div>
                    <div className="flex gap-2">
                        {['ALL', 'TEACHERS', 'SCHOOLS'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase text-left">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user.role === 'School Instructor' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'}`}>
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 dark:text-white">{user.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${user.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => toggleStatus(user.id)}
                                                className={`p-2 transition-colors ${user.status === 'Active' ? 'text-gray-400 hover:text-red-600' : 'text-green-600 hover:text-green-700'}`} 
                                                title={user.status === 'Active' ? "Suspend" : "Activate"}
                                            >
                                                {user.status === 'Active' ? <UserX size={16} /> : <UserCheck size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                                        No users found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagementView;