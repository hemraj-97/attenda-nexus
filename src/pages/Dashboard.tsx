import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { 
  GraduationCap, 
  Users, 
  ClipboardCheck, 
  TrendingUp,
  Plus,
  Calendar,
  Clock,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockRecentActivity } from '../mocks/data';
import { classService } from '../services/classes';
import { studentService } from '../services/students';
import { attendanceService } from '../services/attendance';

interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  todayAttendanceProgress: number;
  weeklyAttendanceRate: number;
}

export default function Dashboard() {
  const { teacher } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity] = useState(mockRecentActivity);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!teacher) return;
      
      try {
        setLoading(true);
        
        // Fetch classes
        const classes = await classService.getClasses(teacher.id);
        
        // Fetch all students
        const students = await studentService.getAllStudents();
        
        // Calculate today's attendance progress (mock calculation)
        const todayProgress = Math.floor(Math.random() * 40) + 60; // 60-100%
        const weeklyRate = Math.floor(Math.random() * 20) + 75; // 75-95%
        
        setStats({
          totalClasses: classes.length,
          totalStudents: students.length,
          todayAttendanceProgress: todayProgress,
          weeklyAttendanceRate: weeklyRate
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [teacher]);

  const quickActions = [
    {
      title: 'Create New Class',
      description: 'Set up a new class for this semester',
      icon: GraduationCap,
      href: '/app/classes',
      variant: 'neon' as const
    },
    {
      title: 'Mark Attendance',
      description: 'Record student attendance',
      icon: ClipboardCheck,
      href: '/app/attendance',
      variant: 'default' as const
    },
    {
      title: 'View Reports',
      description: 'Check attendance analytics',
      icon: TrendingUp,
      href: '/app/attendance',
      variant: 'outline' as const
    }
  ];

  return (
    <AppShell>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Welcome back, {teacher?.name || 'Teacher'}!
          </h1>
          <p className="text-foreground-muted">
            Here's an overview of your classes and attendance data.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-glass-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-muted">
                Total Classes
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-neon-cyan" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-foreground">
                  {stats?.totalClasses || 0}
                </div>
              )}
              <p className="text-xs text-foreground-muted">
                Active this semester
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-muted">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-neon-purple" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-foreground">
                  {stats?.totalStudents || 0}
                </div>
              )}
              <p className="text-xs text-foreground-muted">
                Enrolled students
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-muted">
                Today's Progress
              </CardTitle>
              <ClipboardCheck className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-foreground">
                  {stats?.todayAttendanceProgress || 0}%
                </div>
              )}
              <p className="text-xs text-foreground-muted">
                Attendance marked
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-muted">
                Weekly Average
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-foreground">
                  {stats?.weeklyAttendanceRate || 0}%
                </div>
              )}
              <p className="text-xs text-foreground-muted">
                Attendance rate
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-glass-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-neon-cyan" />
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription>
                  Common tasks to get you started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickActions.map((action) => (
                    <Link key={action.title} to={action.href}>
                      <Card className="glass border-glass-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)] group cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="h-12 w-12 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                            <action.icon className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                            {action.title}
                  </h3>
                          <p className="text-xs text-foreground-muted">
                            {action.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="glass-card border-glass-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-neon-purple" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Latest updates from your classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.type === 'attendance_marked' ? 'bg-success' :
                        activity.type === 'student_added' ? 'bg-neon-cyan' :
                        'bg-neon-purple'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          {activity.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3 text-foreground-muted" />
                          <p className="text-xs text-foreground-muted">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                          {activity.className && (
                            <Badge variant="outline" className="text-xs">
                              {activity.className}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="mt-8">
          <Card className="glass-card border-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-success" />
                <span>Today's Schedule</span>
              </CardTitle>
              <CardDescription>
                Your classes for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                <p className="text-foreground-muted">
                  No classes scheduled for today
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/app/classes">
                    View All Classes
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}