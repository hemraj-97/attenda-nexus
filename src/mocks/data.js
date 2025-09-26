// Mock Teacher Data
export const mockTeacher = {
  id: 'teacher-1',
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@school.edu'
};

// Mock Classes Data
export const mockClasses = [
  { id: 'class-1', classname: 'Computer Science 101', teacherId: 'teacher-1' },
  { id: 'class-2', classname: 'Advanced Mathematics', teacherId: 'teacher-1' },
  { id: 'class-3', classname: 'Physics Laboratory', teacherId: 'teacher-1' },
  { id: 'class-4', classname: 'Data Structures', teacherId: 'teacher-1' },
];

// Mock Students Data
export const mockStudents = [
  {
    id: 'student-1',
    name: 'Alex Johnson',
    reg_no: 'CS2024001',
    rollNumber: '1',
    classname: 'Computer Science 101',
    dateOfBirth: '2004-03-15',
    gender: 'Male',
    guardianName: 'Michael Johnson',
    guardianContact: '555-0101'
  },
  {
    id: 'student-2',
    name: 'Emma Watson',
    reg_no: 'CS2024002',
    rollNumber: '2',
    classname: 'Computer Science 101',
    dateOfBirth: '2004-07-22',
    gender: 'Female',
    guardianName: 'James Watson',
    guardianContact: '555-0102'
  },
  {
    id: 'student-3',
    name: 'Raj Patel',
    reg_no: 'CS2024003',
    rollNumber: '3',
    classname: 'Computer Science 101',
    dateOfBirth: '2003-11-08',
    gender: 'Male',
    guardianName: 'Priya Patel',
    guardianContact: '555-0103'
  },
  {
    id: 'student-4',
    name: 'Maya Chen',
    reg_no: 'MATH2024001',
    rollNumber: '1',
    classname: 'Advanced Mathematics',
    dateOfBirth: '2004-01-30',
    gender: 'Female',
    guardianName: 'Li Chen',
    guardianContact: '555-0104'
  },
  {
    id: 'student-5',
    name: 'Jordan Smith',
    reg_no: 'MATH2024002',
    rollNumber: '2',
    classname: 'Advanced Mathematics',
    dateOfBirth: '2003-09-12',
    gender: 'Other',
    guardianName: 'Taylor Smith',
    guardianContact: '555-0105'
  },
  {
    id: 'student-6',
    name: 'Sofia Rodriguez',
    reg_no: 'PHY2024001',
    rollNumber: '1',
    classname: 'Physics Laboratory',
    dateOfBirth: '2004-05-18',
    gender: 'Female',
    guardianName: 'Carlos Rodriguez',
    guardianContact: '555-0106'
  }
];

// Mock Attendance Data
export const mockAttendance = [
  {
    id: 'att-1',
    student_name: 'Alex Johnson',
    class_name: 'Computer Science 101',
    date: '2024-01-15',
    status: 'PRESENT',
    reg_no: 'CS2024001'
  },
  {
    id: 'att-2',
    student_name: 'Emma Watson',
    class_name: 'Computer Science 101',
    date: '2024-01-15',
    status: 'PRESENT',
    reg_no: 'CS2024002'
  },
  {
    id: 'att-3',
    student_name: 'Raj Patel',
    class_name: 'Computer Science 101',
    date: '2024-01-15',
    status: 'ABSENT',
    reg_no: 'CS2024003'
  },
  {
    id: 'att-4',
    student_name: 'Maya Chen',
    class_name: 'Advanced Mathematics',
    date: '2024-01-15',
    status: 'PRESENT',
    reg_no: 'MATH2024001'
  },
  {
    id: 'att-5',
    student_name: 'Jordan Smith',
    class_name: 'Advanced Mathematics',
    date: '2024-01-15',
    status: 'PRESENT',
    reg_no: 'MATH2024002'
  }
];

// Mock Recent Activity
export const mockRecentActivity = [
  {
    id: 'activity-1',
    type: 'attendance_marked',
    message: 'Attendance marked for Computer Science 101',
    timestamp: '2024-01-15T10:30:00Z',
    className: 'Computer Science 101'
  },
  {
    id: 'activity-2',
    type: 'student_added',
    message: 'New student Sofia Rodriguez added to Physics Laboratory',
    timestamp: '2024-01-14T15:20:00Z',
    className: 'Physics Laboratory'
  },
  {
    id: 'activity-3',
    type: 'class_created',
    message: 'Created new class: Data Structures',
    timestamp: '2024-01-13T09:15:00Z',
    className: 'Data Structures'
  }
];

// Helper functions for generating unique IDs
export const generateId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateRegNo = (className) => {
  const classCode = className.replace(/\s+/g, '').substr(0, 4).toUpperCase();
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 999) + 1;
  return `${classCode}${year}${randomNum.toString().padStart(3, '0')}`;
};