import { mockClasses, generateId } from '../mocks/data';
import { Class } from '../types';

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate occasional errors
const maybeThrowError = (errorRate = 0.1) => {
  if (Math.random() < errorRate) {
    throw new Error('Network error - please try again');
  }
};

// In-memory storage for demo
let classes = [...mockClasses];

export const classService = {
  async getClasses(teacherId: string): Promise<Class[]> {
    await delay(600);
    maybeThrowError(0.03);
    return classes.filter(c => c.teacherId === teacherId);
  },

  async getClassByName(className: string): Promise<Class | null> {
    await delay(400);
    maybeThrowError(0.03);
    return classes.find(c => c.classname === className) || null;
  },

  async createClass(className: string, teacherId: string): Promise<Class> {
    await delay(800);
    maybeThrowError(0.05);
    
    // Check if class already exists
    if (classes.some(c => c.classname === className)) {
      throw new Error('Class with this name already exists');
    }

    const newClass: Class = {
      id: generateId('class'),
      classname: className,
      teacherId
    };

    classes.push(newClass);
    return newClass;
  },

  async updateClass(classId: string, updates: Partial<Class>): Promise<Class> {
    await delay(600);
    maybeThrowError(0.05);
    
    const classIndex = classes.findIndex(c => c.id === classId);
    if (classIndex === -1) {
      throw new Error('Class not found');
    }

    classes[classIndex] = { ...classes[classIndex], ...updates };
    return classes[classIndex];
  },

  async deleteClass(classId: string): Promise<void> {
    await delay(500);
    maybeThrowError(0.05);
    
    const classIndex = classes.findIndex(c => c.id === classId);
    if (classIndex === -1) {
      throw new Error('Class not found');
    }

    classes.splice(classIndex, 1);
  }
};