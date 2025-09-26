import React from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { mockTeacher } from '../mocks/data';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  ClipboardCheck, 
  User,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { name: 'Classes', href: '/app/classes', icon: GraduationCap },
  { name: 'Attendance', href: '/app/attendance', icon: ClipboardCheck },
  { name: 'Profile', href: '/app/profile', icon: User },
];

export const AppShell = ({ children }) => {
  const teacher = mockTeacher;
  const signOut = () => { window.location.href = '/signin'; };
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const isActive = (path) => {
    if (path === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col glass-card border-r border-glass-border">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-glass-border">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                AttendanceAI
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                    active
                      ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                      : "text-foreground-muted hover:bg-glass/50 hover:text-foreground hover:backdrop-blur-xl"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      active ? "text-primary" : "group-hover:text-primary"
                    )}
                  />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-glass-border p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {teacher?.name?.charAt(0).toUpperCase() || 'T'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {teacher?.name || 'Teacher'}
                </p>
                <p className="text-xs text-foreground-muted truncate">
                  {teacher?.email || 'teacher@school.edu'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 glass-card border-b border-glass-border px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex flex-1 justify-end">
            <div className="text-sm text-foreground-muted">
              Welcome back, <span className="text-foreground font-medium">{teacher?.name}</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          {children}
        </main>
      </div>
    </div>
  );
};