import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { 
  Users, 
  Calendar, 
  BookOpen,
  ClipboardCheck,
  ArrowLeft,
  Plus,
  TrendingUp
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { mockClasses, mockStudents, mockAttendance } from '../mocks/data';
import { Class, Student } from '../types';

export default function ClassDetails() {
  const { classname } = useParams<{ classname: string }>();
  const { toast } = useToast();
  
  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<{
    totalDays: number;
    attendanceRate: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classname) {
      fetchClassData();
    }
  }, [classname]);

  const fetchClassData = () => {
    if (!classname) return;
    
    try {
      setLoading(true);
      const decodedClassName = decodeURIComponent(classname);
      const cls = mockClasses.find(c => c.classname === decodedClassName) || null;
      setClassData(cls);
      const studentsData = mockStudents.filter(s => s.classname === decodedClassName);
      setStudents(studentsData);
      const classRecords = mockAttendance.filter(a => a.class_name === decodedClassName);
      const totalDays = Array.from(new Set(classRecords.map(a => a.date))).length;
      const presentCount = classRecords.filter(a => a.status === 'PRESENT').length;
      const attendanceRate = classRecords.length ? (presentCount / classRecords.length) * 100 : 0;
      setAttendanceStats({ totalDays, attendanceRate });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="glass-card border-glass-border">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-16" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  if (!classData) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass-card border-glass-border">
            <CardContent className="text-center py-12">
              <BookOpen className="h-16 w-16 text-foreground-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Class Not Found
              </h3>
              <p className="text-foreground-muted mb-6">
                The requested class could not be found
              </p>
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
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/app/classes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              {classData.classname}
            </h1>
            <p className="text-foreground-muted">
              Class overview and management
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Active
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card border-glass-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-muted">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-neon-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {students.length}
              </div>
              <p className="text-xs text-foreground-muted">
                Enrolled students
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-muted">
                Attendance Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {attendanceStats?.attendanceRate.toFixed(1) || 0}%
              </div>
              <p className="text-xs text-foreground-muted">
                Overall rate
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-muted">
                Total Sessions
              </CardTitle>
              <Calendar className="h-4 w-4 text-neon-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {attendanceStats?.totalDays || 0}
              </div>
              <p className="text-xs text-foreground-muted">
                Recorded sessions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="glass-card border-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-neon-cyan" />
                <span>Students</span>
              </CardTitle>
              <CardDescription>
                Manage students in this class
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {students.length}
                  </p>
                  <p className="text-sm text-foreground-muted">
                    Enrolled students
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/app/classes/${encodeURIComponent(classData.classname)}/students`}>
                      View All
                    </Link>
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <Link to={`/app/classes/${encodeURIComponent(classData.classname)}/students`}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardCheck className="h-5 w-5 text-success" />
                <span>Attendance</span>
              </CardTitle>
              <CardDescription>
                Mark and view attendance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {attendanceStats?.attendanceRate.toFixed(1) || 0}%
                  </p>
                  <p className="text-sm text-foreground-muted">
                    Attendance rate
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/app/attendance">
                      View Records
                    </Link>
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <Link to="/app/attendance">
                      <ClipboardCheck className="h-4 w-4 mr-1" />
                      Mark
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Students */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
            <CardDescription>
              Latest students enrolled in this class
            </CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                <p className="text-foreground-muted mb-4">
                  No students enrolled yet
                </p>
                <Button variant="neon" asChild>
                  <Link to={`/app/classes/${encodeURIComponent(classData.classname)}/students`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Student
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {students.slice(0, 5).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 glass rounded-lg border border-glass-border/50">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-foreground">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {student.name}
                        </p>
                        <p className="text-sm text-foreground-muted">
                          Roll: {student.rollNumber} • Reg: {student.reg_no}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/app/students/${encodeURIComponent(student.reg_no)}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                ))}
                
                {students.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" asChild>
                      <Link to={`/app/classes/${encodeURIComponent(classData.classname)}/students`}>
                        View All {students.length} Students
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}