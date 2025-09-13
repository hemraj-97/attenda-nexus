import { mockAttendance, generateId } from '../mocks/data';
import { Attendance, AttendanceRecord } from '../types';

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate occasional errors
const maybeThrowError = (errorRate = 0.1) => {
  if (Math.random() < errorRate) {
    throw new Error('Network error - please try again');
  }
};

// In-memory storage for demo
let attendance = [...mockAttendance];

export interface MarkAttendanceData {
  className: string;
  date: string;
  records: AttendanceRecord[];
}

export const attendanceService = {
  async getAttendanceByClassAndDate(className: string, date: string): Promise<Attendance[]> {
    await delay(500);
    maybeThrowError(0.03);
    return attendance.filter(a => a.class_name === className && a.date === date);
  },

  async getStudentAttendanceHistory(regNo: string): Promise<Attendance[]> {
    await delay(600);
    maybeThrowError(0.03);
    return attendance.filter(a => a.reg_no === regNo).sort((a, b) => b.date.localeCompare(a.date));
  },

  async markAttendance(data: MarkAttendanceData): Promise<Attendance[]> {
    await delay(1000);
    maybeThrowError(0.05);

    const newAttendanceRecords: Attendance[] = [];

    // Remove existing attendance for this class and date
    attendance = attendance.filter(a => !(a.class_name === data.className && a.date === data.date));

    // Add new attendance records
    for (const record of data.records) {
      const attendanceRecord: Attendance = {
        id: generateId('attendance'),
        student_name: record.student.name,
        class_name: data.className,
        date: data.date,
        status: record.status,
        reg_no: record.student.reg_no
      };
      
      attendance.push(attendanceRecord);
      newAttendanceRecords.push(attendanceRecord);
    }

    return newAttendanceRecords;
  },

  async updateAttendance(attendanceId: string, status: 'PRESENT' | 'ABSENT'): Promise<Attendance> {
    await delay(400);
    maybeThrowError(0.05);

    const attendanceIndex = attendance.findIndex(a => a.id === attendanceId);
    if (attendanceIndex === -1) {
      throw new Error('Attendance record not found');
    }

    attendance[attendanceIndex].status = status;
    return attendance[attendanceIndex];
  },

  async getAttendanceStats(className: string, startDate?: string, endDate?: string): Promise<{
    totalDays: number;
    presentDays: number;
    absentDays: number;
    attendanceRate: number;
  }> {
    await delay(800);
    maybeThrowError(0.03);

    let classAttendance = attendance.filter(a => a.class_name === className);
    
    if (startDate) {
      classAttendance = classAttendance.filter(a => a.date >= startDate);
    }
    if (endDate) {
      classAttendance = classAttendance.filter(a => a.date <= endDate);
    }

    const totalDays = classAttendance.length;
    const presentDays = classAttendance.filter(a => a.status === 'PRESENT').length;
    const absentDays = totalDays - presentDays;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    return {
      totalDays,
      presentDays,
      absentDays,
      attendanceRate: Math.round(attendanceRate * 100) / 100
    };
  }
};