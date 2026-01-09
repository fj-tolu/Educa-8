import React, { useState, useEffect } from 'react';
import { UploadCloud, MessageSquare, CheckCircle, Video, TrendingUp, MoreVertical, Sparkles, X, FileVideo, Search, Send, Play, Clock, Eye, Trash2, Edit2, ChevronLeft, ChevronDown, ChevronUp, BarChart } from 'lucide-react';
import { User, QAThread, VideoLesson } from '../types';
import { MOCK_QA_THREADS, LESSONS, SUBJECTS } from '../services/mockData';
import VideoEditor from '../components/VideoEditor';

interface TeacherDashboardProps {
  user: User;
  currentView: string;
  onNavigate: (view: string) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, currentView, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'inbox' | 'curriculum' | 'stats'>('stats');
  
  // Sync prop with internal state based on Sidebar IDs
  useEffect(() => {
    if (currentView === 'videos') setActiveTab('upload');
    else if (currentView === 'qa') setActiveTab('inbox');
    else if (currentView === 'curriculum') setActiveTab('curriculum');
    else setActiveTab('stats');
  }, [currentView]);

  const [threads, setThreads] = useState<QAThread[]>(MOCK_QA_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [viewingLesson, setViewingLesson] = useState<VideoLesson | null>(null);
  const [uploadStep, setUploadStep] = useState(1);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);

  // Chat Logic
  const selectedThread = threads.find(t => t.id === selectedThreadId);

  const handleReply = () => {
    if (!replyText || !selectedThreadId) return;
    const updatedThreads = threads.map(t => {
      if (t.id === selectedThreadId) {
        return { ...t, status: 'ANSWERED' as const, answerText: replyText, answeredAt: 'Just now' };
      }
      return t;
    });
    setThreads(updatedThreads);
    setReplyText('');
  };

  // Upload Logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setUploadFile(e.target.files[0]);
  };

  const startEditing = () => {
      if (uploadFile) {
          setShowUploadModal(false);
          setShowEditor(true);
      }
  };

  const handleEditorSave = () => {
      setShowEditor(false);
      setShowUploadModal(true);
      setUploadStep(2); 
      let progress = 0;
      const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
              clearInterval(interval);
              setTimeout(() => setUploadStep(3), 500);
          }
      }, 300);
  };

  const closeUploadFlow = () => {
      setShowUploadModal(false);
      setUploadStep(1);
      setUploadFile(null);
      setUploadProgress(0);
  };

  const pendingCount = threads.filter(t => t.status === 'PENDING').length;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 relative animate-fade-in h-full flex flex-col">
      {/* Header (Hidden in Inbox Mode for space) */}
      {activeTab !== 'inbox' && (
        <div className="flex justify-between items-center">
            <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {activeTab === 'upload' ? 'Content Studio' : 
                activeTab === 'curriculum' ? 'My Curriculum' : 'Teacher Dashboard'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{user.specialty} • Contractor Portal</p>
            </div>
            <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 glow-hover"
            >
            <UploadCloud size={18} />
            Upload New Lesson
            </button>
        </div>
      )}

      {/* Stats Row (Only on Dashboard) */}
      {activeTab === 'stats' && (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                { label: 'Total Lessons', val: LESSONS.length, icon: Video, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', navTarget: 'videos' },
                { label: 'Students Reached', val: '1,204', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', navTarget: 'dashboard' },
                { label: 'Pending Questions', val: pendingCount, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', alert: pendingCount > 0, navTarget: 'qa' }
                ].map((stat, i) => (
                <div 
                    key={i} 
                    onClick={() => onNavigate(stat.navTarget)}
                    className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-dark-border flex items-center justify-between hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1 transform duration-200"
                >
                    <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                    <h3 className={`text-3xl font-bold ${stat.alert ? 'text-orange-500' : 'text-gray-800 dark:text-white'}`}>{stat.val}</h3>
                    </div>
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon size={24} />
                    </div>
                </div>
                ))}
            </div>

            {/* Recent Activity / Performance Section to fill space */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <BarChart size={20} className="text-blue-500" /> Content Performance
                        </h3>
                        <select className="bg-gray-50 dark:bg-gray-800 border-none text-xs rounded-lg px-2 py-1 text-gray-500 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="space-y-4">
                        {LESSONS.slice(0, 3).map((lesson, idx) => (
                            <div key={lesson.id} className="flex items-center gap-4 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-xl transition-colors" onClick={() => setViewingLesson(lesson)}>
                                <span className="text-gray-400 font-bold text-lg w-4">{idx + 1}</span>
                                <img src={lesson.thumbnailUrl} className="w-16 h-10 rounded object-cover bg-gray-200" alt="thumb"/>
                                <div className="flex-1">
                                    <p className="font-bold text-sm text-gray-800 dark:text-white line-clamp-1">{lesson.title}</p>
                                    <p className="text-xs text-gray-400">{lesson.views} views</p>
                                </div>
                                <div className="text-green-500 text-xs font-bold">+12%</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <MessageSquare size={20} className="text-orange-500" /> Recent Inquiries
                        </h3>
                        <button onClick={() => setActiveTab('inbox')} className="text-xs text-blue-600 font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        {threads.slice(0, 3).map(thread => (
                            <div key={thread.id} onClick={() => { setActiveTab('inbox'); setSelectedThreadId(thread.id); }} className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30">
                                <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1 mb-1">"{thread.questionText}"</p>
                                <div className="flex justify-between items-center text-xs text-gray-400">
                                    <span>{LESSONS.find(l => l.id === thread.lessonId)?.title.substring(0, 20)}...</span>
                                    <span className={thread.status === 'PENDING' ? 'text-orange-500' : 'text-green-500'}>{thread.status}</span>
                                </div>
                            </div>
                        ))}
                        {threads.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No questions yet.</p>}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* VIEW: THE BRIDGE (CHAT APP) */}
      {activeTab === 'inbox' && (
         <div className="flex-1 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden flex animate-fade-in h-[calc(100vh-140px)]">
            {/* Left Sidebar: Thread List */}
            <div className={`w-full md:w-80 border-r border-gray-100 dark:border-dark-border flex flex-col ${selectedThreadId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-100 dark:border-dark-border">
                    <h2 className="font-bold text-gray-800 dark:text-white mb-2">The Bridge</h2>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search questions..." className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm focus:outline-none dark:text-white" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {threads.map(thread => (
                        <div 
                            key={thread.id}
                            onClick={() => setSelectedThreadId(thread.id)}
                            className={`p-4 border-b border-gray-50 dark:border-dark-border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${selectedThreadId === thread.id ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-600' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-sm text-gray-800 dark:text-white line-clamp-1">
                                    {LESSONS.find(l => l.id === thread.lessonId)?.title || 'Unknown Lesson'}
                                </span>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap">{thread.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">"{thread.questionText}"</p>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${thread.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                {thread.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side: Chat Window */}
            <div className={`flex-1 flex flex-col ${!selectedThreadId ? 'hidden md:flex' : 'flex'}`}>
                {selectedThread ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 border-b border-gray-100 dark:border-dark-border px-6 flex items-center justify-between bg-white dark:bg-dark-surface z-10">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedThreadId(null)} className="md:hidden text-gray-500">
                                    <ChevronLeft size={24} />
                                </button>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white">Student Question</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Regarding: {LESSONS.find(l => l.id === selectedThread.lessonId)?.title}</p>
                                </div>
                            </div>
                            {selectedThread.status === 'PENDING' && (
                                <span className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full cursor-pointer hover:scale-105 transition-transform">
                                    <Sparkles size={12} /> Generate AI Hint
                                </span>
                            )}
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 bg-gray-50 dark:bg-black/20 p-6 overflow-y-auto space-y-6">
                            {/* Question Bubble */}
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center font-bold text-xs text-gray-600 dark:text-gray-300">S</div>
                                <div className="max-w-[80%]">
                                    <div className="bg-white dark:bg-dark-surface p-4 rounded-2xl rounded-tl-none shadow-sm text-gray-800 dark:text-white border border-gray-100 dark:border-dark-border">
                                        <p className="text-sm">{selectedThread.questionText}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 mt-1 block ml-2">{selectedThread.timestamp}</span>
                                </div>
                            </div>

                             {/* Pending State Indicator */}
                            {selectedThread.status === 'PENDING' && (
                                <div className="flex flex-col items-center justify-center py-8 opacity-60">
                                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-500 mb-2 animate-pulse">
                                        <Clock size={24} />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Waiting for your expert answer...</p>
                                </div>
                            )}

                            {/* Answer Bubble */}
                            {selectedThread.status === 'ANSWERED' && (
                                <div className="flex gap-4 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center font-bold text-xs text-white">Me</div>
                                    <div className="max-w-[80%]">
                                        <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none shadow-lg shadow-blue-500/20 text-white">
                                            <p className="text-sm">{selectedThread.answerText}</p>
                                             {/* Show attached video placeholder if exists (mock logic) */}
                                            {selectedThread.answerVideoUrl && (
                                                <div className="mt-2 bg-black/20 rounded-lg p-2 flex items-center gap-2">
                                                    <Video size={16} />
                                                    <span className="text-xs">Video Response Attached</span>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 mt-1 block text-right mr-2">{selectedThread.answeredAt}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        {selectedThread.status === 'PENDING' && (
                            <div className="p-6 border-t border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface shadow-[0_-5px_20px_rgba(0,0,0,0.02)] z-20">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                    <Edit2 size={12} /> Draft Your Response
                                </h4>
                                <div className="space-y-3">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type your explanation here..."
                                        className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none min-h-[100px] text-sm"
                                    />
                                    <div className="flex justify-between items-center">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
                                            <Video size={16} />
                                            <span>Attach Video Response</span>
                                        </button>
                                        <button 
                                            onClick={handleReply}
                                            disabled={!replyText}
                                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span>Send Answer</span>
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare size={48} className="mb-4 opacity-20" />
                        <p>Select a question to view the conversation</p>
                    </div>
                )}
            </div>
         </div>
      )}

      {/* VIEW: STUDIO UPLOADS (VIDEO LIBRARY) */}
      {activeTab === 'upload' && (
         <div className="animate-fade-in space-y-6">
             {LESSONS.length === 0 ? (
                 <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-100 dark:border-dark-border text-center py-20">
                    <UploadCloud size={64} className="mx-auto text-blue-100 dark:text-blue-900 mb-6" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Video Library Management</h3>
                    <p className="text-gray-500 mb-6">No lessons uploaded yet.</p>
                    <button onClick={() => setShowUploadModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                        Upload First Lesson
                    </button>
                </div>
             ) : (
                 <>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                        <div className="w-full md:w-auto">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Your Lesson Library</h2>
                            <p className="text-gray-500 text-sm">Manage your recorded content and metadata.</p>
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="text" placeholder="Filter videos..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg text-sm focus:outline-none dark:text-white" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {LESSONS.map(lesson => (
                            <div 
                                key={lesson.id} 
                                onClick={() => setViewingLesson(lesson)}
                                className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                            >
                                {/* Thumbnail */}
                                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                                    <img src={lesson.thumbnailUrl} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <div 
                                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 hover:scale-110 transition-transform shadow-lg" title="Preview"
                                        >
                                            <Play size={18} className="ml-1" />
                                        </div>
                                        <div 
                                            onClick={(e) => { e.stopPropagation(); /* Logic for edit metadata */ }}
                                            className="w-10 h-10 bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black hover:scale-110 transition-transform shadow-lg" title="Edit Metadata"
                                        >
                                            <Edit2 size={16} />
                                        </div>
                                    </div>
                                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        {lesson.duration}
                                    </span>
                                </div>
                                
                                {/* Info */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                                            {SUBJECTS.find(s => s.id === lesson.subjectId)?.title}
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <Eye size={12} />
                                            <span className="text-xs">{lesson.views}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-800 dark:text-white text-sm line-clamp-1 mb-1">{lesson.title}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{lesson.description}</p>
                                    
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-50 dark:border-dark-border">
                                        <span className="text-[10px] text-gray-400">Uploaded {lesson.uploadedAt}</span>
                                        <button className="text-red-400 hover:text-red-600 transition-colors" onClick={(e) => e.stopPropagation()}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </>
             )}
         </div>
      )}

      {/* VIEW: CURRICULUM */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6 animate-fade-in">
           <div className={`bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-100 dark:border-dark-border`}>
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-gray-800 dark:text-white">My Curriculum Plan</h3>
               <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-bold hover:bg-blue-700">Add Unit</button>
             </div>
             <div className="space-y-4">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border overflow-hidden transition-all duration-300">
                    <div 
                        onClick={() => setExpandedUnit(expandedUnit === i ? null : i)}
                        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors select-none"
                    >
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                        {i}
                        </div>
                        <div className="flex-1">
                        <h4 className="font-bold text-gray-800 dark:text-white text-sm md:text-base">Unit {i}: Fundamentals of Subject</h4>
                        <p className="text-xs text-gray-400">3 Video Lessons • 2 Quizzes • 45 mins total</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-gray-400 hover:text-blue-600"><Edit2 size={16} /></button>
                                <button className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                            </div>
                            {expandedUnit === i ? <ChevronUp className="text-gray-400" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
                        </div>
                    </div>
                    {/* Expanded Content */}
                    {expandedUnit === i && (
                        <div className="p-4 pt-0 bg-gray-50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-dark-border animate-fade-in">
                            <div className="space-y-2 mt-3">
                                {LESSONS.slice(0,3).map((lesson, idx) => (
                                    <div key={idx} onClick={() => setViewingLesson(lesson)} className="flex items-center gap-3 p-3 bg-white dark:bg-dark-surface rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                            <Play size={12} className="text-gray-500 dark:text-gray-400 fill-current" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">{lesson.title}</p>
                                            <p className="text-xs text-gray-500">{lesson.duration} • Video Lesson</p>
                                        </div>
                                        <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-0.5 rounded">Ready</span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-3 p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 justify-center">
                                    <span className="text-xs font-bold">+ Add Content to Unit</span>
                                </div>
                            </div>
                        </div>
                    )}
                 </div>
               ))}
             </div>
           </div>
        </div>
      )}

      {/* MODALS */}
      {showEditor && <VideoEditor file={uploadFile} onSave={handleEditorSave} onCancel={() => setShowEditor(false)} />}
      
      {/* Upload Modal */}
      {showUploadModal && !showEditor && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in border border-gray-100 dark:border-dark-border">
            <div className="p-6 border-b border-gray-100 dark:border-dark-border flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {uploadStep === 1 ? 'New Lesson Details' : uploadStep === 2 ? 'Publishing...' : 'Success'}
              </h3>
              <button onClick={closeUploadFlow} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
                {uploadStep === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Lesson Title</label>
                            <input type="text" className="w-full p-3 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg rounded-lg dark:text-white" placeholder="e.g. Intro to Calculus" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Video File</label>
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors relative">
                                <input type="file" accept="video/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                {uploadFile ? (
                                    <div className="flex flex-col items-center text-blue-600 dark:text-blue-400">
                                        <FileVideo size={32} className="mb-2" />
                                        <span className="font-medium text-sm">{uploadFile.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <UploadCloud size={32} className="mb-2" />
                                        <span className="font-medium text-sm">Drag or click to upload video</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="pt-4 flex gap-3">
                             <button onClick={closeUploadFlow} className="flex-1 py-3 text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl">Cancel</button>
                             <button disabled={!uploadFile} onClick={startEditing} className="flex-1 py-3 bg-gray-900 dark:bg-blue-600 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-black dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <Sparkles size={16} /> Next: Edit Video
                             </button>
                        </div>
                    </div>
                )}
                {uploadStep === 2 && (
                    <div className="text-center py-8">
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%`}}></div>
                        </div>
                        <p className="text-xs text-gray-400">{uploadProgress}% Complete</p>
                    </div>
                )}
                {uploadStep === 3 && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={32} />
                        </div>
                        <h4 className="font-bold text-gray-800 dark:text-white mb-6">Lesson Published!</h4>
                        <button onClick={closeUploadFlow} className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">Back to Dashboard</button>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {viewingLesson && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
             <div className="w-full max-w-5xl bg-black rounded-3xl overflow-hidden relative shadow-2xl">
                 <button 
                    onClick={() => setViewingLesson(null)} 
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                 >
                     <X size={20} />
                 </button>
                 <div className="aspect-video">
                     <video src={viewingLesson.videoUrl} controls autoPlay className="w-full h-full" />
                 </div>
                 <div className="p-6 bg-gray-900">
                     <h2 className="text-2xl font-bold text-white mb-2">{viewingLesson.title}</h2>
                     <p className="text-gray-400">{viewingLesson.description}</p>
                 </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;