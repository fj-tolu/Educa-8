import { User, UserRole, Subject, VideoLesson, QAThread } from '../types';

export const CURRENT_INSTRUCTOR: User = {
  id: 'u1',
  name: 'Jason Ranti',
  role: UserRole.SCHOOL_INSTRUCTOR,
  avatarUrl: 'https://image.pollinations.ai/prompt/portrait%20of%20a%20friendly%20male%20teacher%20in%20classroom?width=100&height=100&nologo=true'
};

export const CURRENT_TEACHER: User = {
  id: 'u2',
  name: 'Dr. Sarah Connor',
  role: UserRole.CONTRACTOR_TEACHER,
  specialty: 'Mathematics & Physics',
  avatarUrl: 'https://image.pollinations.ai/prompt/professional%20female%20professor%20portrait?width=100&height=100&nologo=true'
};

export const CURRENT_ADMIN: User = {
  id: 'u_admin',
  name: 'System Administrator',
  role: UserRole.ADMIN,
  avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
}

export const SUBJECTS: Subject[] = [
  { id: 's1', title: 'Algebra I', icon: 'Calculator', color: 'bg-blue-100 text-blue-600', teacherId: 'u2' },
  { id: 's2', title: 'Biology', icon: 'Dna', color: 'bg-green-100 text-green-600', teacherId: 'u3' },
  { id: 's3', title: 'World History', icon: 'Globe', color: 'bg-orange-100 text-orange-600', teacherId: 'u4' },
  { id: 's4', title: 'Literature', icon: 'BookOpen', color: 'bg-purple-100 text-purple-600', teacherId: 'u5' },
];

// Using a standard open source video for demo (Big Buck Bunny Trailer)
const DEMO_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const LESSONS: VideoLesson[] = [
  {
    id: 'l1',
    subjectId: 's1',
    title: 'Introduction to Linear Equations',
    description: 'Understanding variables and basic linear structures. In this lesson we explore the fundamental theorem.',
    thumbnailUrl: 'https://image.pollinations.ai/prompt/mathematics%20linear%20equations%20blackboard?width=800&height=450&nologo=true',
    duration: '15:30',
    views: 120,
    uploadedAt: '2023-10-24',
    videoUrl: DEMO_VIDEO_URL
  },
  {
    id: 'l2',
    subjectId: 's1',
    title: 'Slope-Intercept Form',
    description: 'Mastering y = mx + b with real world examples regarding architecture and bridge building.',
    thumbnailUrl: 'https://image.pollinations.ai/prompt/architectural%20bridge%20blueprints%20math?width=800&height=450&nologo=true',
    duration: '22:15',
    views: 85,
    uploadedAt: '2023-10-26',
    videoUrl: DEMO_VIDEO_URL
  },
  {
    id: 'l3',
    subjectId: 's2',
    title: 'Cellular Respiration',
    description: 'How cells generate energy from glucose. A deep dive into the mitochondria.',
    thumbnailUrl: 'https://image.pollinations.ai/prompt/biology%20mitochondria%20cell%20structure%203d?width=800&height=450&nologo=true',
    duration: '18:45',
    views: 200,
    uploadedAt: '2023-10-20',
    videoUrl: DEMO_VIDEO_URL
  },
  {
    id: 'l4',
    subjectId: 's2',
    title: 'Photosynthesis Fundamentals',
    description: 'The process by which green plants and some other organisms use sunlight to synthesize foods.',
    thumbnailUrl: 'https://image.pollinations.ai/prompt/photosynthesis%20plant%20sunlight%20diagram?width=800&height=450&nologo=true',
    duration: '20:10',
    views: 150,
    uploadedAt: '2023-10-21',
    videoUrl: DEMO_VIDEO_URL
  },
  {
    id: 'l5',
    subjectId: 's2',
    title: 'Genetics and Heredity',
    description: 'Introduction to DNA, genes, and how traits are passed down through generations.',
    thumbnailUrl: 'https://image.pollinations.ai/prompt/dna%20helix%20genetics%20science?width=800&height=450&nologo=true',
    duration: '25:00',
    views: 180,
    uploadedAt: '2023-10-22',
    videoUrl: DEMO_VIDEO_URL
  }
];

export const MOCK_QA_THREADS: QAThread[] = [
  {
    id: 'qa1',
    lessonId: 'l1',
    instructorId: 'u1',
    questionText: 'The students are confused about why "b" represents the y-intercept. Can you explain the etymology or a quick memory trick?',
    timestamp: '2 hours ago',
    status: 'ANSWERED',
    answerText: 'Great question! Think of "b" as the "beginning" value when x is 0. I will upload a short explaining this shortly.',
    answeredAt: '1 hour ago'
  },
  {
    id: 'qa2',
    lessonId: 'l2',
    instructorId: 'u1',
    questionText: 'Is there a specific graph paper scale we should use for the exercises at minute 14?',
    timestamp: '10 mins ago',
    status: 'PENDING'
  }
];