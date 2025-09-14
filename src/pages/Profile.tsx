import React, { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { User, Edit, Mail, Shield } from 'lucide-react';
import { mockTeacher } from '../mocks/data';
import { useToast } from '../hooks/use-toast';

export default function Profile() {
  const [name, setName] = useState(mockTeacher.name);
  const email = mockTeacher.email;
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState(name);
  const [updating, setUpdating] = useState(false);

  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter your name',
        variant: 'destructive'
      });
      return;
    }
    setName(editName.trim());
    setShowEditDialog(false);
    toast({ title: 'Success', description: 'Profile updated successfully' });
  };

  const handleSignOut = () => {
    window.location.href = '/signin';
    toast({ title: 'Signed Out', description: 'You have been signed out successfully' });
  };

  return (
    <AppShell>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Profile Settings
          </h1>
          <p className="text-foreground-muted">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card className="glass-card border-glass-border mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-neon-cyan" />
              <span>Personal Information</span>
            </CardTitle>
            <CardDescription>
              Your account details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6 mb-6">
              <div className="h-20 w-20 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {name?.charAt(0).toUpperCase() || 'T'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {name || 'Teacher'}
                </h3>
                <p className="text-foreground-muted flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{email}</span>
                </p>
              </div>
              
              <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setEditName(name)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-glass-border">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your profile information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Enter your full name"
                        className="glass focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        value={email}
                        disabled
                        className="glass opacity-50"
                      />
                      <p className="text-xs text-foreground-muted mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowEditDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpdateProfile}
                      disabled={updating || !editName.trim()}
                    >
                      {updating ? 'Updating...' : 'Save Changes'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-foreground-muted">Account Type</p>
                <p className="font-medium text-foreground flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Teacher</span>
                </p>
              </div>
              <div>
                <p className="text-foreground-muted">Member Since</p>
                <p className="font-medium text-foreground">January 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="glass-card border-glass-border mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-neon-purple" />
              <span>Security</span>
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 glass rounded-lg border border-glass-border/50">
                <div>
                  <p className="font-medium text-foreground">Password</p>
                  <p className="text-sm text-foreground-muted">Last updated: Recently</p>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 glass rounded-lg border border-glass-border/50">
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-foreground-muted">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible account actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 glass rounded-lg border border-destructive/30">
              <div>
                <p className="font-medium text-foreground">Sign Out</p>
                <p className="text-sm text-foreground-muted">Sign out from your account</p>
              </div>
              <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}