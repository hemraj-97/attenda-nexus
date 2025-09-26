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

export default function ClassDetails() {
  const { classname } = useParams();
  const { toast } = useToast();
  
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
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
      const presentRecords = classRecords.filter(a => a.status === 'PRESENT').length;
      const attendanceRate = totalDays > 0 ? Math.round((presentRecords / (studentsData.length * totalDays)) * 100) : 0;
      
      setAttendanceStats({
        totalDays,
        attendanceRate
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">Loading class details...</div>
        </div>
      </AppShell>
    );
  }

  if (!classData) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Class Not Found</h2>
            <p className="text-foreground-muted mb-6">The class you're looking for doesn't exist.</p>
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
              Manage class details, students, and attendance
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-glass-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground-muted">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{students.length}</p>
                </div>
                <Users className="h-8 w-8 text-neon-cyan" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground-muted">Active Days</p>
                  <p className="text-2xl font-bold text-foreground">{attendanceStats?.totalDays || 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-neon-purple" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground-muted">Attendance Rate</p>
                  <p className="text-2xl font-bold text-foreground">{attendanceStats?.attendanceRate || 0}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground-muted">Status</p>
                  <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
                </div>
                <BookOpen className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card border-glass-border hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <Link to={`/app/classes/${encodeURIComponent(classData.classname)}/students`} className="block">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Manage Students</h3>
                    <p className="text-sm text-foreground-muted">Add or edit student information</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <Link to="/app/attendance" className="block">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-success/20 to-neon-cyan/20 rounded-xl flex items-center justify-center">
                    <ClipboardCheck className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Mark Attendance</h3>
                    <p className="text-sm text-foreground-muted">Record student attendance</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-warning/20 to-neon-purple/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">View Reports</h3>
                  <p className="text-sm text-foreground-muted">Generate attendance reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Students */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Students</CardTitle>
                <CardDescription>Recently enrolled students in this class</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to={`/app/classes/${encodeURIComponent(classData.classname)}/students`}>
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Students Enrolled</h3>
                <p className="text-foreground-muted mb-4">Add students to get started with this class.</p>
                <Button variant="neon" asChild>
                  <Link to={`/app/classes/${encodeURIComponent(classData.classname)}/students`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Students
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {students.slice(0, 5).map((student) => (
                  <div key={student.id} className="flex items-center space-x-4 p-3 glass rounded-lg border border-glass-border">
                    <div className="h-10 w-10 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-foreground">
                        {student.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{student.name}</h4>
                      <p className="text-sm text-foreground-muted">Roll: {student.rollNumber}</p>
                    </div>
                    <Badge variant="outline">{student.reg_no}</Badge>
                  </div>
                ))}
                {students.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="ghost" asChild>
                      <Link to={`/app/classes/${encodeURIComponent(classData.classname)}/students`}>
                        View {students.length - 5} more students
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