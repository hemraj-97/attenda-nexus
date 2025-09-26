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
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <CardTitle className="text-2xl">{name}</CardTitle>
            <CardDescription>{email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <User className="h-5 w-5 text-neon-cyan" />
                  <span>Personal Information</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 glass rounded-lg border border-glass-border">
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-foreground-muted" />
                      <div>
                        <p className="text-sm text-foreground-muted">Full Name</p>
                        <p className="font-medium text-foreground">{name}</p>
                      </div>
                    </div>
                    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card border-glass-border">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                          <DialogDescription>
                            Update your personal information
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="editName">Full Name</Label>
                            <Input
                              id="editName"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="glass focus:border-primary/50"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setShowEditDialog(false);
                              setEditName(name);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleUpdateProfile}
                            disabled={updating}
                          >
                            {updating ? 'Updating...' : 'Update Profile'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex items-center justify-between p-4 glass rounded-lg border border-glass-border">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-foreground-muted" />
                      <div>
                        <p className="text-sm text-foreground-muted">Email Address</p>
                        <p className="font-medium text-foreground">{email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" disabled>
                      Cannot Change
                    </Button>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-neon-purple" />
                  <span>Account Settings</span>
                </h3>
                <div className="space-y-4">
                  <div className="p-4 glass rounded-lg border border-glass-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Account Status</p>
                        <p className="text-sm text-foreground-muted">Your account is active and verified</p>
                      </div>
                      <div className="h-2 w-2 bg-success rounded-full"></div>
                    </div>
                  </div>

                  <div className="p-4 glass rounded-lg border border-glass-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Data & Privacy</p>
                        <p className="text-sm text-foreground-muted">Manage your data and privacy settings</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-t border-glass-border pt-6">
                <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Sign Out</p>
                      <p className="text-sm text-foreground-muted">
                        Sign out of your account on this device
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle>Quick Statistics</CardTitle>
            <CardDescription>Your teaching activity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-cyan mb-2">4</div>
                <p className="text-sm text-foreground-muted">Classes</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-purple mb-2">86</div>
                <p className="text-sm text-foreground-muted">Students</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-2">92%</div>
                <p className="text-sm text-foreground-muted">Avg. Attendance</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning mb-2">15</div>
                <p className="text-sm text-foreground-muted">Days Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}