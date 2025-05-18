export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
}

export interface CourseGrade {
  id: string;
  userId: string;
  courseName: string;
  firstGrade: number;
  secondGrade: number;
  thirdGrade?: number;
  requiredGrade?: number;
  semester: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}