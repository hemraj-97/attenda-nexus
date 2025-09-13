import { mockStudents, generateId, generateRegNo } from '../mocks/data';
import { Student } from '../types';

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate occasional errors
const maybeThrowError = (errorRate = 0.1) => {
  if (Math.random() < errorRate) {
    throw new Error('Network error - please try again');
  }
};

// In-memory storage for demo
let students = [...mockStudents];

export interface CreateStudentData {
  name: string;
  rollNumber: string;
  classname: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  guardianName: string;
  guardianContact: string;
}

export const studentService = {
  async getStudentsByClass(className: string): Promise<Student[]> {
    await delay(600);
    maybeThrowError(0.03);
    return students.filter(s => s.classname === className);
  },

  async getStudentByRegNo(regNo: string): Promise<Student | null> {
    await delay(400);
    maybeThrowError(0.03);
    return students.find(s => s.reg_no === regNo) || null;
  },

  async getAllStudents(): Promise<Student[]> {
    await delay(700);
    maybeThrowError(0.03);
    return students;
  },

  async createStudent(data: CreateStudentData): Promise<Student> {
    await delay(800);
    maybeThrowError(0.05);
    
    // Check if roll number already exists in class
    if (students.some(s => s.rollNumber === data.rollNumber && s.classname === data.classname)) {
      throw new Error('Roll number already exists in this class');
    }

    const newStudent: Student = {
      id: generateId('student'),
      reg_no: generateRegNo(data.classname),
      ...data
    };

    students.push(newStudent);
    return newStudent;
  },

  async updateStudent(studentId: string, updates: Partial<Student>): Promise<Student> {
    await delay(600);
    maybeThrowError(0.05);
    
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }

    students[studentIndex] = { ...students[studentIndex], ...updates };
    return students[studentIndex];
  },

  async deleteStudent(studentId: string): Promise<void> {
    await delay(500);
    maybeThrowError(0.05);
    
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }

    students.splice(studentIndex, 1);
  }
};