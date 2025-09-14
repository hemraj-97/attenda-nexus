import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, User, Calendar, Phone, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { mockStudents, mockAttendance } from '../mocks/data';

export default function StudentDetails() {
  const { reg_no } = useParams<{ reg_no: string }>();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reg_no) {
      fetchStudentData();
    }
  }, [reg_no]);

  const fetchStudentData = () => {
    if (!reg_no) return;
    
    try {
      setLoading(true);
      const decodedRegNo = decodeURIComponent(reg_no);
      
      const studentData = mockStudents.find(s => s.reg_no === decodedRegNo) || null;
      setStudent(studentData);
      
      const attendance = mockAttendance.filter(a => a.reg_no === decodedRegNo);
      setAttendanceHistory(attendance);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">Loading student details...</div>
        </div>
      </AppShell>
    );
  }

  if (!student) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass-card border-glass-border">
            <CardContent className="text-center py-12">
              <User className="h-16 w-16 text-foreground-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Student Not Found</h3>
              <Button variant="outline" asChild>
                <Link to="/app/classes">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Classes
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/app/classes/${encodeURIComponent(student.classname)}/students`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              {student.name}
            </h1>
            <p className="text-foreground-muted">Student Profile</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-glass-border">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground-muted">Registration Number</p>
                    <p className="font-mono font-medium">{student.reg_no}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">Roll Number</p>
                    <p className="font-medium">{student.rollNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">Date of Birth</p>
                    <p className="font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">Gender</p>
                    <Badge variant="outline">{student.gender}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">Guardian Name</p>
                    <p className="font-medium">{student.guardianName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">Guardian Contact</p>
                    <p className="font-medium">{student.guardianContact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-glass-border">
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>Recent attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                    <p className="text-foreground-muted">No attendance records found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attendanceHistory.slice(0, 10).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 glass rounded-lg border border-glass-border/50">
                        <div>
                          <p className="font-medium text-foreground">{record.class_name}</p>
                          <p className="text-sm text-foreground-muted">{new Date(record.date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={record.status === 'PRESENT' ? 'default' : 'destructive'}>
                          {record.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="glass-card border-glass-border">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {Math.round((attendanceHistory.filter(a => a.status === 'PRESENT').length / Math.max(attendanceHistory.length, 1)) * 100)}%
                  </div>
                  <p className="text-sm text-foreground-muted">Attendance Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {attendanceHistory.length}
                  </div>
                  <p className="text-sm text-foreground-muted">Total Sessions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}