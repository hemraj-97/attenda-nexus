import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { 
  Plus, 
  Search, 
  Users, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  GraduationCap
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { mockClasses, mockStudents, mockTeacher, generateId } from '../mocks/data';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

export default function Classes() {
  
  const { toast } = useToast();
  
  const [classes, setClasses] = useState([]);
  const [studentCounts, setStudentCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [newClassName, setNewClassName] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    setLoading(true);
    const classesData = [...mockClasses];
    setClasses(classesData);
    const counts = {};
    for (const cls of classesData) {
      counts[cls.classname] = mockStudents.filter(s => s.classname === cls.classname).length;
    }
    setStudentCounts(counts);
    setLoading(false);
  };

  const handleCreateClass = async () => {
    if (!newClassName.trim()) return;
    
    try {
      setActionLoading(true);
      const newCls = { id: generateId('class'), classname: newClassName.trim(), teacherId: mockTeacher.id };
      setClasses(prev => [...prev, newCls]);
      setStudentCounts(prev => ({ ...prev, [newCls.classname]: 0 }));
      setNewClassName('');
      setShowCreateDialog(false);
      toast({
        title: 'Success',
        description: `Class "${newClassName}" created successfully`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create class',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRenameClass = async () => {
    if (!selectedClass || !renameValue.trim()) return;
    
    try {
      setActionLoading(true);
      setClasses(prev => prev.map(c => c.id === selectedClass.id ? { ...c, classname: renameValue.trim() } : c));
      setShowRenameDialog(false);
      setRenameValue('');
      setSelectedClass(null);
      toast({
        title: 'Success',
        description: 'Class renamed successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to rename class',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClass = async () => {
    if (!selectedClass) return;
    
    try {
      setActionLoading(true);
      setClasses(prev => prev.filter(c => c.id !== selectedClass.id));
      setShowDeleteDialog(false);
      setSelectedClass(null);
      toast({
        title: 'Success',
        description: 'Class deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete class',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.classname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Classes
            </h1>
            <p className="text-foreground-muted">
              Manage your classes and view student enrollment
            </p>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="neon" className="mt-4 sm:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Create Class
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-glass-border">
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
                <DialogDescription>
                  Enter a name for your new class
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="className">Class Name</Label>
                  <Input
                    id="className"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="e.g., Computer Science 101"
                    className="glass focus:border-primary/50"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateDialog(false);
                    setNewClassName('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateClass}
                  disabled={!newClassName.trim() || actionLoading}
                >
                  {actionLoading ? 'Creating...' : 'Create Class'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass focus:border-primary/50"
            />
          </div>
        </div>

        {/* Classes Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass-card border-glass-border">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredClasses.length === 0 ? (
          <Card className="glass-card border-glass-border">
            <CardContent className="text-center py-12">
              <GraduationCap className="h-16 w-16 text-foreground-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm ? 'No classes found' : 'No classes yet'}
              </h3>
              <p className="text-foreground-muted mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Create your first class to get started'
                }
              </p>
              {!searchTerm && (
                <Button variant="neon" onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Class
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <Card key={cls.id} className="glass-card border-glass-border group hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)]">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg text-foreground truncate group-hover:text-primary transition-colors">
                      {cls.classname}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-1 mt-1">
                      <Users className="h-3 w-3" />
                      <span>{studentCounts[cls.classname] || 0} students</span>
                    </CardDescription>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card border-glass-border">
                      <DropdownMenuItem asChild>
                        <Link to={`/app/classes/${encodeURIComponent(cls.classname)}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedClass(cls);
                          setRenameValue(cls.classname);
                          setShowRenameDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedClass(cls);
                          setShowDeleteDialog(true);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      Active
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-foreground-muted">
                      <Calendar className="h-3 w-3" />
                      <span>2024</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/app/classes/${encodeURIComponent(cls.classname)}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/app/classes/${encodeURIComponent(cls.classname)}/students`}>
                        <Users className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Rename Dialog */}
        <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
          <DialogContent className="glass-card border-glass-border">
            <DialogHeader>
              <DialogTitle>Rename Class</DialogTitle>
              <DialogDescription>
                Enter a new name for "{selectedClass?.classname}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="renameName">Class Name</Label>
                <Input
                  id="renameName"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="glass focus:border-primary/50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowRenameDialog(false);
                  setRenameValue('');
                  setSelectedClass(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRenameClass}
                disabled={!renameValue.trim() || actionLoading}
              >
                {actionLoading ? 'Renaming...' : 'Rename'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="glass-card border-glass-border">
            <DialogHeader>
              <DialogTitle>Delete Class</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedClass?.classname}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedClass(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteClass}
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}