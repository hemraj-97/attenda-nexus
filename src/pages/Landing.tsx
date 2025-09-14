import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { 
  GraduationCap, 
  Users, 
  ClipboardCheck, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import heroImage from '../assets/hero-bg.jpg';

const features = [
  {
    name: 'Smart Class Management',
    description: 'Create and organize classes with intelligent scheduling and automated notifications.',
    icon: GraduationCap,
  },
  {
    name: 'Student Analytics',
    description: 'Track student performance and attendance patterns with advanced analytics.',
    icon: Users,
  },
  {
    name: 'Digital Attendance',
    description: 'Mark attendance digitally with real-time synchronization and backup.',
    icon: ClipboardCheck,
  },
  {
    name: 'Performance Insights',
    description: 'Generate detailed reports and insights to improve educational outcomes.',
    icon: BarChart3,
  },
];

const stats = [
  { name: 'Classes Managed', value: '50K+' },
  { name: 'Students Tracked', value: '2M+' },
  { name: 'Attendance Records', value: '100M+' },
  { name: 'Schools Using', value: '5K+' },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax mouse effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 glass-card border-b border-glass-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="font-display font-bold text-2xl bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                AttendanceAI
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/signin">
                <Button variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="neon">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Image with Parallax */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 hero-gradient" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="font-display font-black text-5xl lg:text-7xl mb-8 bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent">
              Smart Attendance
              <br />
              <span className="text-4xl lg:text-6xl">Management System</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-foreground-muted mb-12 max-w-3xl mx-auto leading-relaxed">
              Revolutionize your classroom with AI-powered attendance tracking, 
              real-time analytics, and seamless student management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/signup">
                <Button variant="hero" size="hero" className="group">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <div className="flex items-center space-x-2 text-foreground-muted">
                <CheckCircle className="h-5 w-5 text-success" />
                <span>No credit card required</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.name} className="text-center animate-float">
                  <div className="text-3xl lg:text-4xl font-display font-bold text-neon-cyan mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-foreground-muted">
                    {stat.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl lg:text-5xl mb-6 text-foreground">
              Powerful Features for Modern Education
            </h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              Everything you need to manage attendance, track student progress, and improve educational outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.name} 
                className="glass-card border-glass-border group hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-4 text-foreground group-hover:text-primary transition-colors">
                    {feature.name}
                  </h3>
                  <p className="text-foreground-muted leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-bold text-4xl lg:text-5xl mb-6 text-foreground">
              Ready to Transform Your Classroom?
            </h2>
            <p className="text-xl text-foreground-muted mb-12">
              Join thousands of educators who have revolutionized their attendance management with AttendanceAI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/signup">
                <Button variant="hero" size="hero" className="group">
                  Get Started Now
                  <Star className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/signin">
                <Button variant="glass" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass-border glass-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="h-8 w-8 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                AttendanceAI
              </span>
            </div>
            
            <div className="text-sm text-foreground-muted">
              © 2024 AttendanceAI. Built for the future of education.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}