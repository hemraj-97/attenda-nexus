import { mockTeacher } from '../mocks/data';
import { Teacher } from '../types';

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate occasional errors
const maybeThrowError = (errorRate = 0.1) => {
  if (Math.random() < errorRate) {
    throw new Error('Network error - please try again');
  }
};

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async signIn(data: SignInData): Promise<Teacher> {
    await delay(800); // Simulate network delay
    maybeThrowError(0.05); // 5% chance of error
    
    // Simple mock validation
    if (data.email && data.password) {
      return mockTeacher;
    }
    throw new Error('Invalid credentials');
  },

  async signUp(data: SignUpData): Promise<Teacher> {
    await delay(1000); // Simulate network delay
    maybeThrowError(0.05); // 5% chance of error
    
    // Return mock teacher with provided name and email
    return {
      ...mockTeacher,
      name: data.name,
      email: data.email
    };
  },

  async getCurrentTeacher(): Promise<Teacher> {
    await delay(300);
    maybeThrowError(0.02); // 2% chance of error
    return mockTeacher;
  },

  async updateProfile(updates: Partial<Teacher>): Promise<Teacher> {
    await delay(600);
    maybeThrowError(0.05);
    return { ...mockTeacher, ...updates };
  }
};