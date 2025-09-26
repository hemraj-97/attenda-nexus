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

export default function Attendance() {
  const { toast } = useToast();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
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
      
      const records = studentsData.map(student => {
        const existing = existingAttendance.find(a => a.reg_no === student.reg_no);
        return {
          student,
          status: existing ? existing.status : 'ABSENT'
        };
      });
      
      setAttendanceRecords(records);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.student.id === studentId 
          ? { ...record, status }
          : record
      )
    );
  };

  const handleSaveAttendance = async () => {
    if (attendanceRecords.length === 0) return;
    
    try {
      setSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: `Attendance saved for ${attendanceRecords.length} students`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save attendance',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const attendanceStats = {
    present: attendanceRecords.filter(r => r.status === 'PRESENT').length,
    absent: attendanceRecords.filter(r => r.status === 'ABSENT').length,
    total: attendanceRecords.length
  };

  return (
    <AppShell>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Attendance
          </h1>
          <p className="text-foreground-muted">
            Mark and manage student attendance
          </p>
        </div>

        {/* Controls */}
        <Card className="glass-card border-glass-border mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ClipboardCheck className="h-5 w-5 text-neon-cyan" />
              <span>Attendance Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="class">Select Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class" className="glass focus:border-primary/50">
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

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
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
                onClick={handleSaveAttendance}
                disabled={!selectedClass || attendanceRecords.length === 0 || saving}
                className="w-full"
                variant="neon"
              >
                {saving ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {selectedClass && attendanceRecords.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card border-glass-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground-muted">Total Students</p>
                    <p className="text-2xl font-bold text-foreground">{attendanceStats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-neon-cyan" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-glass-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground-muted">Present</p>
                    <p className="text-2xl font-bold text-success">{attendanceStats.present}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-glass-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground-muted">Absent</p>
                    <p className="text-2xl font-bold text-destructive">{attendanceStats.absent}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-glass-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground-muted">Attendance Rate</p>
                    <p className="text-2xl font-bold text-foreground">
                      {attendanceStats.total > 0 
                        ? Math.round((attendanceStats.present / attendanceStats.total) * 100)
                        : 0}%
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Students List */}
        {selectedClass && (
          <Card className="glass-card border-glass-border">
            <CardHeader>
              <CardTitle>Students - {selectedClass}</CardTitle>
              <CardDescription>
                Mark attendance for {new Date(selectedDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-foreground-muted">Loading students...</p>
                </div>
              ) : attendanceRecords.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-foreground-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Students Found</h3>
                  <p className="text-foreground-muted">
                    No students are enrolled in this class.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {attendanceRecords.map((record) => (
                    <div
                      key={record.student.id}
                      className="flex items-center justify-between p-4 glass rounded-lg border border-glass-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-foreground">
                            {record.student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{record.student.name}</h3>
                          <p className="text-sm text-foreground-muted">
                            Roll: {record.student.rollNumber} | Reg: {record.student.reg_no}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge variant={record.status === 'PRESENT' ? 'default' : 'destructive'}>
                          {record.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant={record.status === 'PRESENT' ? 'default' : 'outline'}
                            onClick={() => handleAttendanceChange(record.student.id, 'PRESENT')}
                          >
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={record.status === 'ABSENT' ? 'destructive' : 'outline'}
                            onClick={() => handleAttendanceChange(record.student.id, 'ABSENT')}
                          >
                            Absent
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}