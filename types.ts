export enum UserRole {
  CONTRACTOR_TEACHER = 'CONTRACTOR_TEACHER', // Remote Expert
  SCHOOL_INSTRUCTOR = 'SCHOOL_INSTRUCTOR',   // Local Facilitator
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  specialty?: string; // For teachers
}

export interface Subject {
  id: string;
  title: string;
  icon: string;
  color: string;
  teacherId: string;
}

export interface VideoLesson {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string; // e.g., "14:20"
  views: number;
  uploadedAt: string;
  videoUrl?: string; // Mock url
}

export interface QAThread {
  id: string;
  lessonId: string;
  instructorId: string;
  questionText: string;
  timestamp: string;
  status: 'PENDING' | 'ANSWERED';
  answerText?: string;
  answerVideoUrl?: string;
  answeredAt?: string;
}

export interface DashboardStats {
  totalLessons: number;
  activeStudents: number;
  pendingQuestions: number;
  hoursWatched: number;
}