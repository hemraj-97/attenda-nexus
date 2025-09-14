import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { GraduationCap, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function SignUp() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter your full name',
        variant: 'destructive'
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter your email address',
        variant: 'destructive'
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive'
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        toast({
          title: 'Account Created!',
          description: 'Welcome to AttendanceAI. Your account has been created successfully.',
          duration: 5000
        });
        navigate('/app');
      }, 600);
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Sign Up Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { level: 0, text: '', color: '' };
    if (password.length < 6) return { level: 1, text: 'Weak', color: 'text-destructive' };
    if (password.length < 10) return { level: 2, text: 'Medium', color: 'text-warning' };
    return { level: 3, text: 'Strong', color: 'text-success' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 hero-gradient opacity-50" />
      
      <div className="relative w-full max-w-md">
        <Card className="glass-card border-glass-border shadow-[var(--shadow-glass)]">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-2xl flex items-center justify-center animate-glow">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-display font-bold text-foreground">
              Create Account
            </CardTitle>
            <CardDescription className="text-foreground-muted">
              Join AttendanceAI and revolutionize your classroom
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="glass focus:border-primary/50 focus:ring-primary/20"
                  placeholder="Dr. Sarah Chen"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="glass focus:border-primary/50 focus:ring-primary/20"
                  placeholder="sarah.chen@school.edu"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="glass focus:border-primary/50 focus:ring-primary/20 pr-10"
                    placeholder="Create a strong password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-foreground-muted" />
                    ) : (
                      <Eye className="h-4 w-4 text-foreground-muted" />
                    )}
                  </Button>
                </div>
                {formData.password && (
                  <div className="flex items-center space-x-2 text-xs">
                    <div className={`font-medium ${passwordStrength.color}`}>
                      {passwordStrength.text}
                    </div>
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.level >= 1 ? 'bg-destructive' : 'bg-transparent'
                        }`}
                        style={{ width: `${(passwordStrength.level / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="glass focus:border-primary/50 focus:ring-primary/20 pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-foreground-muted" />
                    ) : (
                      <Eye className="h-4 w-4 text-foreground-muted" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="flex items-center space-x-2 text-xs text-success">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                variant="neon" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-center text-sm text-foreground-muted">
                Already have an account?{' '}
                <Link to="/signin" className="text-primary hover:text-primary-glow font-medium">
                  Sign in here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center mt-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}