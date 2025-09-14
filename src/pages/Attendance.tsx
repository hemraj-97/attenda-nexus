import React, { useState, useEffect } from 'react';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { ClipboardCheck, Calendar, Users, CheckCircle, XCircle } from 'lucide-react';
import { mockClasses, mockStudents, mockAttendance } from '../mocks/data';
import { useToast } from '../hooks/use-toast';
import { Class, Student, AttendanceRecord } from '../types';

export default function Attendance() {
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsAndAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = () => {
    setClasses(mockClasses);
  };

  const fetchStudentsAndAttendance = () => {
    if (!selectedClass) return;
    
    try {
      setLoading(true);
      const studentsData = mockStudents.filter(s => s.classname === selectedClass);
      setStudents(studentsData);
      
      const existingAttendance = mockAttendance.filter(a => a.class_name === selectedClass && a.date === selectedDate);
      
      const records: AttendanceRecord[] = studentsData.map(student => {
        const existing = existingAttendance.find(a => a.reg_no === student.reg_no);
        return {
          student,
          status: existing?.status || 'ABSENT'
        };
      });
      
      setAttendanceRecords(records);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (studentId: string) => {
    setAttendanceRecords(prev => prev.map(record => 
      record.student.id === studentId 
        ? { ...record, status: record.status === 'PRESENT' ? 'ABSENT' : 'PRESENT' }
        : record
    ));
  };

  const saveAttendance = async () => {
    if (!selectedClass || attendanceRecords.length === 0) return;
    try {
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        toast({ title: 'Success', description: 'Attendance saved successfully' });
      }, 400);
    } catch (error) {
      setSaving(false);
      toast({ title: 'Error', description: 'Failed to save attendance', variant: 'destructive' });
    }
  };

  const presentCount = attendanceRecords.filter(r => r.status === 'PRESENT').length;
  const totalCount = attendanceRecords.length;
  const attendanceRate = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

  return (
    <AppShell>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Attendance Management
          </h1>
          <p className="text-foreground-muted">
            Mark and manage student attendance
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-glass-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Present</p>
                  <p className="text-2xl font-bold text-success">{presentCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-glass-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Absent</p>
                  <p className="text-2xl font-bold text-destructive">{totalCount - presentCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-glass-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Total</p>
                  <p className="text-2xl font-bold text-foreground">{totalCount}</p>
                </div>
                <Users className="h-8 w-8 text-neon-cyan" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-glass-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Rate</p>
                  <p className="text-2xl font-bold text-foreground">{attendanceRate.toFixed(1)}%</p>
                </div>
                <ClipboardCheck className="h-8 w-8 text-neon-purple" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>Select class and date to mark attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="class">Select Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="glass focus:border-primary/50">
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-glass-border">
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.classname}>
                        {cls.classname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">Select Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="glass focus:border-primary/50"
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={saveAttendance}
                  disabled={!selectedClass || attendanceRecords.length === 0 || saving}
                  variant="neon"
                  className="w-full"
                >
                  {saving ? 'Saving...' : 'Save Attendance'}
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-foreground-muted mt-2">Loading students...</p>
              </div>
            ) : attendanceRecords.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-foreground-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {selectedClass ? 'No students found' : 'Select a class to begin'}
                </h3>
                <p className="text-foreground-muted">
                  {selectedClass ? 'This class has no enrolled students' : 'Choose a class from the dropdown above'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {attendanceRecords.map((record) => (
                  <div
                    key={record.student.id}
                    className="flex items-center justify-between p-4 glass rounded-lg border border-glass-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-foreground">
                          {record.student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{record.student.name}</p>
                        <p className="text-sm text-foreground-muted">
                          Roll: {record.student.rollNumber} • Reg: {record.student.reg_no}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={record.status === 'PRESENT' ? 'default' : 'destructive'}
                        className="min-w-[80px] justify-center"
                      >
                        {record.status}
                      </Badge>
                      <Button
                        variant={record.status === 'PRESENT' ? 'destructive' : 'default'}
                        size="sm"
                        onClick={() => toggleAttendance(record.student.id)}
                      >
                        {record.status === 'PRESENT' ? 'Mark Absent' : 'Mark Present'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}