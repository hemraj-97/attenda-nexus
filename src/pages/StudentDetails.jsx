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
  const { reg_no } = useParams();
  const { toast } = useToast();
  const [student, setStudent] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
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
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Student Not Found</h2>
            <p className="text-foreground-muted mb-6">The student you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/app/classes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Classes
              </Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const attendanceRate = attendanceHistory.length > 0 
    ? Math.round((attendanceHistory.filter(a => a.status === 'PRESENT').length / attendanceHistory.length) * 100)
    : 0;

  return (
    <AppShell>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
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
            <p className="text-foreground-muted">
              Student Profile and Attendance Details
            </p>
          </div>
        </div>

        {/* Student Info Card */}
        <Card className="glass-card border-glass-border mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {student.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <CardTitle className="text-2xl">{student.name}</CardTitle>
                <CardDescription className="text-lg">
                  {student.classname} • Roll #{student.rollNumber}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-neon-cyan" />
                  <div>
                    <p className="text-sm text-foreground-muted">Registration Number</p>
                    <p className="font-mono text-foreground">{student.reg_no}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-neon-purple" />
                  <div>
                    <p className="text-sm text-foreground-muted">Date of Birth</p>
                    <p className="text-foreground">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm text-foreground-muted">Gender</p>
                    <Badge variant={
                      student.gender === 'Male' ? 'default' :
                      student.gender === 'Female' ? 'secondary' : 'outline'
                    }>
                      {student.gender}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm text-foreground-muted">Guardian Name</p>
                    <p className="text-foreground">{student.guardianName || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm text-foreground-muted">Guardian Contact</p>
                    <p className="text-foreground font-mono">{student.guardianContact || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-neon-cyan" />
                  <div>
                    <p className="text-sm text-foreground-muted">Class</p>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      {student.classname}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card border-glass-border">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-foreground mb-2">{attendanceHistory.length}</div>
              <p className="text-sm text-foreground-muted">Total Days</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-glass-border">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-success mb-2">
                {attendanceHistory.filter(a => a.status === 'PRESENT').length}
              </div>
              <p className="text-sm text-foreground-muted">Present</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-glass-border">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{attendanceRate}%</div>
              <p className="text-sm text-foreground-muted">Attendance Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance History */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>
              Recent attendance records for {student.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceHistory.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Attendance Records</h3>
                <p className="text-foreground-muted">
                  No attendance has been recorded for this student yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {attendanceHistory
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 glass rounded-lg border border-glass-border"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`h-3 w-3 rounded-full ${
                          record.status === 'PRESENT' ? 'bg-success' : 'bg-destructive'
                        }`} />
                        <div>
                          <p className="font-medium text-foreground">
                            {new Date(record.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-foreground-muted">{record.class_name}</p>
                        </div>
                      </div>
                      <Badge
                        variant={record.status === 'PRESENT' ? 'default' : 'destructive'}
                        className={record.status === 'PRESENT' ? 'bg-success/20 text-success border-success/30' : ''}
                      >
                        {record.status}
                      </Badge>
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