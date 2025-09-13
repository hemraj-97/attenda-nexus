export interface Teacher {
  id: string;
  name: string;
  email: string;
}

export interface Class {
  id: string;
  classname: string;
  teacherId: string;
}

export interface Student {
  id: string;
  name: string;
  reg_no: string;
  rollNumber: string;
  classname: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  guardianName: string;
  guardianContact: string;
}

export interface Attendance {
  id: string;
  student_name: string;
  class_name: string;
  date: string; // YYYY-MM-DD format
  status: 'PRESENT' | 'ABSENT';
  reg_no: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  teacher: Teacher | null;
}

export interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  todayAttendanceProgress: number;
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type: 'class_created' | 'student_added' | 'attendance_marked';
  message: string;
  timestamp: string;
  className?: string;
}

export interface AttendanceRecord {
  student: Student;
  status: 'PRESENT' | 'ABSENT';
}