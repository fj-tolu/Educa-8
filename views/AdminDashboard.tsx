import React, { useState } from 'react';
import { Users, School, DollarSign, Activity, Shield, TrendingUp, BarChart3, PieChart } from 'lucide-react';

interface AdminDashboardProps {
    onNavigate: (view: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
    // Mock Data State to simulate interactivity
    const [weeklyData] = useState([40, 65, 45, 80, 55, 90, 70]);
    const [revenueData] = useState([
        { label: 'School Subs', value: 65, color: 'blue-600' },
        { label: 'Enterprise', value: 25, color: 'purple-500' },
        { label: 'Add-ons', value: 10, color: 'green-500' }
    ]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">System Administration</h1>
            <p className="text-gray-500 dark:text-gray-400">Overview of Educa-8 Platform Performance</p>
        </div>
        <button className="hidden md:flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30">
            <DownloadIcon size={16} /> Export Reports
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
            { icon: School, count: '42', label: 'Active Schools', color: 'blue', growth: '+12%', link: 'admin-users' },
            { icon: Users, count: '1,204', label: 'Students Learning', color: 'purple', growth: '+5%', link: 'admin-users' },
            { icon: DollarSign, count: '$24k', label: 'Monthly Revenue', color: 'green', growth: '+8%', link: 'admin-dashboard' },
            { icon: Activity, count: '99.9%', label: 'System Uptime', color: 'orange', growth: 'Good', link: 'admin-dashboard' }
        ].map((kpi, i) => (
            <div 
                key={i} 
                onClick={() => onNavigate(kpi.link)}
                className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm hover:scale-[1.02] hover:shadow-lg transition-all cursor-pointer"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 bg-${kpi.color}-50 dark:bg-${kpi.color}-900/20 text-${kpi.color}-600 rounded-xl`}>
                        <kpi.icon size={24} />
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">{kpi.growth}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.count}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{kpi.label}</p>
            </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">Platform Activity</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Weekly student engagement & lessons viewed</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-bold rounded-lg text-gray-500 dark:text-gray-400">Weekly</span>
                </div>
            </div>
            
            {/* Dynamic CSS Bar Chart */}
            <div className="flex items-end justify-between h-48 gap-4">
                {weeklyData.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-lg relative overflow-hidden h-full flex items-end">
                             <div 
                                className="w-full bg-blue-600 hover:bg-blue-500 transition-all duration-500 rounded-t-lg relative group-hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]" 
                                style={{ height: `${h}%` }}
                             ></div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium group-hover:text-blue-500 transition-colors">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                        </span>
                        {/* Tooltip on hover */}
                        <div className="absolute opacity-0 group-hover:opacity-100 -mt-8 bg-black text-white text-[10px] px-2 py-1 rounded transition-opacity pointer-events-none">
                            {h}k Views
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm p-8 flex flex-col justify-center">
             <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-6">Revenue Breakdown</h3>
             <div className="relative aspect-square flex items-center justify-center mb-6 max-h-48">
                 {/* CSS Pie Chart donut style */}
                 <div className="w-40 h-40 rounded-full border-[16px] border-blue-600 border-r-green-500 border-b-purple-500 rotate-45 transform transition-transform hover:scale-105 shadow-xl shadow-blue-500/10"></div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-3xl font-bold text-gray-800 dark:text-white">$24k</span>
                     <span className="text-xs text-gray-500 uppercase tracking-wide">Total</span>
                 </div>
             </div>
             <div className="space-y-4">
                 {revenueData.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-${item.color}`}></div>
                            <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                        </div>
                        <span className="font-bold text-gray-800 dark:text-white">{item.value}%</span>
                    </div>
                 ))}
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* User Management Summary */}
         <div className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-dark-border flex justify-between items-center">
                <h3 className="font-bold text-gray-800 dark:text-white">Recent User Activity</h3>
                <button 
                    onClick={() => onNavigate('admin-users')}
                    className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                    Manage All
                </button>
            </div>
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase text-left">
                    <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {[1, 2, 3].map((i) => (
                        <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer" onClick={() => onNavigate('admin-users')}>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 dark:text-white">Sarah Connor</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">sarah@educa8.com</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Contractor Teacher</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded-full">Active</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>

         {/* Content Moderation / Alerts Summary */}
         <div className="space-y-6">
            <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Shield size={18} className="text-orange-500"/> Content Moderation
                </h3>
                <div className="space-y-4">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded-xl cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors" onClick={() => onNavigate('admin-content')}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded">Reported</span>
                            <span className="text-xs text-gray-400">2h ago</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white mb-1">Video: Biology 101 - Reproduction</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Reason: Inappropriate language...</p>
                    </div>
                </div>
                <button onClick={() => onNavigate('admin-content')} className="w-full mt-4 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white">View All Alerts</button>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl shadow-lg text-white">
                <h3 className="font-bold mb-2">System Health</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Server Load</span>
                            <span>34%</span>
                        </div>
                        <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-1/3 hover:w-full transition-all duration-1000"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Storage</span>
                            <span>82%</span>
                        </div>
                        <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 w-[82%]"></div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// Helper for icon
const DownloadIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

export default AdminDashboard;