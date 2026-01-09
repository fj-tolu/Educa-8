import React, { useState, useRef, useEffect } from 'react';
import { Play, Clock, MessageCircle, Send, Search, Bell, X, ChevronLeft, Filter, BookOpen, Video, HelpCircle, ChevronDown, ChevronUp, Users, CheckCircle } from 'lucide-react';
import { Subject, VideoLesson, QAThread, User } from '../types';
import { LESSONS, SUBJECTS, MOCK_QA_THREADS } from '../services/mockData';

interface InstructorDashboardProps {
  user: User;
  currentView: string; // 'dashboard' | 'curriculum' | 'videos' | 'qa'
  onNavigate: (view: string) => void;
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ user, currentView, onNavigate }) => {
  const [selectedLesson, setSelectedLesson] = useState<VideoLesson | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [question, setQuestion] = useState('');
  const [localThreads, setLocalThreads] = useState<QAThread[]>(MOCK_QA_THREADS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const [expandedCard, setExpandedCard] = useState<string | null>('tips');

  // Reset selection when view changes
  useEffect(() => {
    if (currentView === 'dashboard') {
        setSelectedLesson(null);
        setSelectedSubject(null);
    }
  }, [currentView]);

  // Filter lessons based on search query
  const filteredLessons = LESSONS.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLesson = (lesson: VideoLesson) => {
    setSelectedLesson(lesson);
    setIsPlaying(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitQuestion = () => {
    if (!question.trim() || !selectedLesson) return;
    const newThread: QAThread = {
      id: `qa-${Date.now()}`,
      lessonId: selectedLesson.id,
      instructorId: user.id,
      questionText: question,
      timestamp: 'Just now',
      status: 'PENDING'
    };
    setLocalThreads([newThread, ...localThreads]);
    setQuestion('');
  };

  // 1. Detailed Lesson View (Video Player) - Overrides everything if selected
  if (selectedLesson) {
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
             <button 
                onClick={() => setSelectedLesson(null)}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-4 transition-colors"
             >
                <ChevronLeft size={20} /> Back to List
             </button>
             
            <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-dark-border animate-fade-in">
              {/* Video Player Container */}
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-6 group shadow-2xl shadow-blue-500/10">
                {!isPlaying ? (
                  <>
                    <img src={selectedLesson.thumbnailUrl} alt="Lesson" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <button 
                        onClick={() => {
                           setIsPlaying(true);
                           setTimeout(() => videoRef.current?.play(), 100);
                        }}
                        className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform group glow-hover"
                      >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Play size={32} className="text-blue-600 ml-1" />
                        </div>
                      </button>
                    </div>
                  </>
                ) : (
                  <video 
                    ref={videoRef}
                    src={selectedLesson.videoUrl} 
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                  />
                )}
              </div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedLesson.title}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl">
                    {selectedLesson.description}
                  </p>
                </div>
              </div>

              {/* The Bridge: Q&A Module */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/50">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle size={20} className="text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-blue-900 dark:text-blue-100">The Bridge: Ask the Remote Expert</h3>
                </div>
                
                <div className="bg-white dark:bg-dark-bg rounded-xl p-4 border border-blue-100 dark:border-gray-700 shadow-sm mb-4 max-h-60 overflow-y-auto">
                  {localThreads.filter(t => t.lessonId === selectedLesson.id).length === 0 ? (
                     <p className="text-sm text-gray-400 text-center py-4">No questions asked for this lesson yet.</p>
                  ) : (
                    localThreads.filter(t => t.lessonId === selectedLesson.id).map(thread => (
                      <div key={thread.id} className="mb-4 last:mb-0 border-b border-gray-50 dark:border-gray-800 last:border-0 pb-4 last:pb-0">
                        <div className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-bold flex-shrink-0">I</div>
                          <p className="text-sm text-gray-800 dark:text-gray-200">{thread.questionText}</p>
                        </div>
                        {thread.status === 'ANSWERED' && (
                          <div className="flex gap-2 mt-2 ml-4 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center text-xs font-bold flex-shrink-0">T</div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{thread.answerText}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="relative">
                  <input 
                    type="text" 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type a student question here..." 
                    className="w-full pl-4 pr-12 py-3 bg-white dark:bg-dark-bg border border-blue-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white"
                  />
                  <button 
                    onClick={submitQuestion}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
        </div>
    );
  }

  // 2. Subject/Curriculum Details View
  if (selectedSubject) {
    const subjectLessons = LESSONS.filter(l => l.subjectId === selectedSubject.id);
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
        <button onClick={() => setSelectedSubject(null)} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-4 transition-colors">
          <ChevronLeft size={20} /> Back to Subjects
        </button>
        <div className={`p-8 rounded-3xl ${selectedSubject.color} bg-opacity-10 dark:bg-opacity-20 flex items-center gap-6`}>
           <div className={`w-20 h-20 rounded-2xl ${selectedSubject.color} flex items-center justify-center text-4xl shadow-xl`}>
             {selectedSubject.title[0]}
           </div>
           <div>
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{selectedSubject.title}</h1>
             <p className="text-gray-600 dark:text-gray-300 mt-2">{subjectLessons.length} Lessons • 140 Students Enrolled</p>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {subjectLessons.map((lesson) => (
             <div 
               key={lesson.id} 
               onClick={() => handleSelectLesson(lesson)}
               className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-gray-100 dark:border-dark-border cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
             >
               <div className="h-40 bg-gray-200 relative overflow-hidden">
                 <img src={lesson.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-blue-600 shadow-lg scale-0 group-hover:scale-100 transition-transform">
                      <Play size={20} className="ml-1" />
                    </div>
                 </div>
               </div>
               <div className="p-5">
                 <h3 className="font-bold text-gray-800 dark:text-white mb-1 line-clamp-1">{lesson.title}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{lesson.description}</p>
                 <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                   <Clock size={14} /> {lesson.duration}
                 </div>
               </div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  // 3. Main Views based on Navigation
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {currentView === 'dashboard' ? 'Classroom Dashboard' : 
               currentView === 'curriculum' ? 'All Subjects' : 
               currentView === 'videos' ? 'Video Library' : 'The Bridge Q&A'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, {user.name}. Ready to facilitate?</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {currentView !== 'curriculum' && (
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lessons..." 
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow"
                />
              </div>
          )}
          <button className="relative p-2 bg-white dark:bg-dark-surface rounded-full border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-dark-surface"></span>
          </button>
        </div>
      </div>

      {/* VIEW: CURRICULUM */}
      {(currentView === 'curriculum') && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {SUBJECTS.map((subject) => (
                <div 
                  key={subject.id} 
                  onClick={() => setSelectedSubject(subject)}
                  className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-dark-border hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all cursor-pointer group hover:-translate-y-1 duration-300"
                >
                  <div className={`w-14 h-14 rounded-xl ${subject.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="font-bold text-xl">{subject.title[0]}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{subject.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">12 Lessons • 3 New this week</p>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-300 dark:bg-gray-500 w-1/2"></div>
                  </div>
                </div>
            ))}
         </div>
      )}

      {/* VIEW: VIDEOS OR SEARCH RESULTS */}
      {(currentView === 'videos' || searchQuery) && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredLessons.map(lesson => (
                 <div 
                  key={lesson.id} 
                  onClick={() => handleSelectLesson(lesson)}
                  className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-gray-100 dark:border-dark-border cursor-pointer hover:border-blue-200 dark:hover:border-blue-800 transition-all hover:scale-[1.01] hover:shadow-lg"
                >
                  <div className="h-44 bg-gray-200 overflow-hidden relative">
                    <img src={lesson.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-all">
                       <Play size={32} className="text-white opacity-80" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">{lesson.duration}</div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1 uppercase tracking-wide">
                        {SUBJECTS.find(s => s.id === lesson.subjectId)?.title}
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-white line-clamp-1 text-lg mb-2">{lesson.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{lesson.description}</p>
                  </div>
                </div>
              ))}
              {filteredLessons.length === 0 && (
                  <div className="col-span-full text-center py-20 text-gray-400">
                      <Video size={48} className="mx-auto mb-4 opacity-20" />
                      <p>No video lessons found matching your search.</p>
                  </div>
              )}
         </div>
      )}

      {/* VIEW: QA */}
      {currentView === 'qa' && (
          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-gray-100 dark:border-dark-border">
                  <div className="flex gap-4">
                      <button className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-bold text-sm">All Questions</button>
                      <button className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-bold text-sm">Pending</button>
                      <button className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-bold text-sm">Answered</button>
                  </div>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-dark-border">
                  {localThreads.map(thread => (
                       <div key={thread.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer" onClick={() => {
                           // Navigate to lesson to see/add context
                           const l = LESSONS.find(x => x.id === thread.lessonId);
                           if (l) handleSelectLesson(l);
                       }}>
                           <div className="flex justify-between mb-2">
                               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                   {LESSONS.find(l => l.id === thread.lessonId)?.title}
                               </div>
                               <span className="text-xs text-gray-400">{thread.timestamp}</span>
                           </div>
                           <h4 className="font-bold text-gray-800 dark:text-white mb-2">{thread.questionText}</h4>
                           {thread.status === 'ANSWERED' ? (
                               <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                   {thread.answerText}
                               </div>
                           ) : (
                               <div className="flex items-center gap-2 text-sm text-orange-500 dark:text-orange-400 italic">
                                   <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                   Waiting for teacher response...
                               </div>
                           )}
                       </div>
                  ))}
              </div>
          </div>
      )}

      {/* VIEW: DASHBOARD (DEFAULT) */}
      {currentView === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-2 space-y-8">
                   {/* DEMO VIDEO SECTION */}
                   <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-1 shadow-lg shadow-blue-500/20">
                      <div className="bg-white dark:bg-dark-surface rounded-[22px] overflow-hidden">
                        {!isDemoPlaying ? (
                            <div className="relative h-64 w-full bg-gray-900 group cursor-pointer" onClick={() => setIsDemoPlaying(true)}>
                                <img 
                                    src="https://image.pollinations.ai/prompt/classroom%20learning%20dashboard%20tutorial?width=800&height=300&nologo=true" 
                                    className="w-full h-full object-cover opacity-60" 
                                    alt="Tutorial Preview"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Play size={32} className="ml-1 fill-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Platform Tutorial</h3>
                                    <p className="text-sm opacity-90">Watch how to facilitate a class in 2 minutes</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative h-64 bg-black">
                                <video 
                                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
                                    controls 
                                    autoPlay 
                                    className="w-full h-full object-contain" 
                                />
                                <button onClick={() => setIsDemoPlaying(false)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-white/20">
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                    <HelpCircle size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white">New to Educa-8?</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Learn the basics of facilitation.</p>
                                </div>
                            </div>
                            <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">View Guide</button>
                        </div>
                      </div>
                   </div>

                  {/* Subject Grid Preview */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SUBJECTS.slice(0, 4).map((subject) => (
                        <div 
                        key={subject.id} 
                        onClick={() => setSelectedSubject(subject)}
                        className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-dark-border hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all cursor-pointer group hover:-translate-y-1 duration-300"
                        >
                        <div className={`w-12 h-12 rounded-xl ${subject.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <span className="font-bold text-lg">{subject.title[0]}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{subject.title}</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">12 Lessons • 3 New</p>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-gray-300 dark:bg-gray-500 w-1/2"></div>
                        </div>
                        </div>
                    ))}
                    </div>

                    {/* Recent Lessons */}
                    <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Recent Lessons</h3>
                        <button onClick={() => onNavigate('videos')} className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {LESSONS.slice(0, 3).map((lesson) => (
                        <div 
                            key={lesson.id} 
                            onClick={() => handleSelectLesson(lesson)}
                            className="flex items-center gap-4 bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-100 dark:border-dark-border cursor-pointer hover:border-blue-200 dark:hover:border-blue-800 transition-all hover:scale-[1.01]"
                        >
                            <div className="w-32 h-20 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 relative">
                            <img src={lesson.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                                <Play size={20} className="text-white" />
                            </div>
                            </div>
                            <div className="flex-1">
                            <h4 className="font-bold text-gray-800 dark:text-white line-clamp-1">{lesson.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{lesson.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock size={12} /> {lesson.duration}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-medium">
                                {SUBJECTS.find(s => s.id === lesson.subjectId)?.title}
                                </span>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-blue-600 dark:bg-blue-700 text-white p-6 rounded-3xl shadow-lg shadow-blue-200 dark:shadow-blue-900/40 hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => onNavigate('curriculum')}>
                    <h3 className="font-bold text-lg mb-1">Today's Schedule</h3>
                    <p className="text-blue-200 text-sm mb-6">3 Classes remaining</p>
                    
                    <div className="space-y-4">
                    <div className="bg-white/10 p-3 rounded-xl flex items-center gap-3 backdrop-blur-sm border border-white/10">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">09:00</div>
                        <div>
                        <p className="font-medium text-sm">Algebra I</p>
                        <p className="text-xs text-blue-200">Room 101 • 45 mins</p>
                        </div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl flex items-center gap-3 backdrop-blur-sm border border-white/20 shadow-lg">
                        <div className="w-10 h-10 rounded-lg bg-white text-blue-600 flex items-center justify-center font-bold text-sm">10:00</div>
                        <div>
                        <p className="font-medium text-sm">Biology</p>
                        <p className="text-xs text-blue-200">Lab A • 60 mins</p>
                        </div>
                        <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]"></div>
                    </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden">
                    <div 
                        className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setExpandedCard(expandedCard === 'attendance' ? null : 'attendance')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                                <Users size={20} />
                            </div>
                            <h3 className="font-bold text-gray-800 dark:text-white">Class Attendance</h3>
                        </div>
                        {expandedCard === 'attendance' ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
                    </div>
                    {expandedCard === 'attendance' && (
                        <div className="px-6 pb-6 bg-gray-50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-dark-border animate-fade-in">
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Total Students</span>
                                    <span className="font-bold text-gray-800 dark:text-white">28/30</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 w-[93%]"></div>
                                </div>
                                <p className="text-xs text-gray-400">2 students absent today (Medical)</p>
                                <button className="w-full py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700">Mark Attendance</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden">
                    <div 
                        className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setExpandedCard(expandedCard === 'tips' ? null : 'tips')}
                    >
                        <div className="flex items-center gap-3">
                             <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                                <CheckCircle size={20} />
                            </div>
                            <h3 className="font-bold text-gray-800 dark:text-white">Instructor Tips</h3>
                        </div>
                        {expandedCard === 'tips' ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
                    </div>
                    {(expandedCard === 'tips' || !expandedCard) && ( // Default open or toggle? Let's make it toggleable but default closed if we follow state logic exactly. Or just show content. I'll stick to toggle logic.
                        <div className={`px-6 pb-6 transition-all ${expandedCard === 'tips' ? 'block animate-fade-in' : 'hidden'}`}>
                            <ul className="space-y-4 pt-2 border-t border-gray-100 dark:border-dark-border">
                                <li className="flex gap-3 items-start text-sm text-gray-600 dark:text-gray-400 pt-4">
                                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                                    Pause video at 14:20 for group discussion.
                                </li>
                                <li className="flex gap-3 items-start text-sm text-gray-600 dark:text-gray-400">
                                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                                    Collect homework before the History segment.
                                </li>
                                <li className="flex gap-3 items-start text-sm text-gray-600 dark:text-gray-400">
                                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                                    Ensure projector audio is synced.
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default InstructorDashboard;