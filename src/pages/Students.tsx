import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { 
  Plus, 
  Search, 
  Filter,
  ArrowLeft,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Student } from '../types';
import { mockStudents, generateId, generateRegNo } from '../mocks/data';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

export default function Students() {
  const { classname } = useParams<{ classname: string }>();
  const { toast } = useToast();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [formData, setFormData] = useState<{ 
    name: string;
    rollNumber: string;
    classname: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female' | 'Other';
    guardianName: string;
    guardianContact: string;
  }>({
    name: '',
    rollNumber: '',
    classname: '',
    dateOfBirth: '',
    gender: 'Male',
    guardianName: '',
    guardianContact: ''
  });

  useEffect(() => {
    if (classname) {
      const decodedClassName = decodeURIComponent(classname);
      setFormData(prev => ({ ...prev, classname: decodedClassName }));
      fetchStudents();
    }
  }, [classname]);

  const fetchStudents = async () => {
    if (!classname) return;
    try {
      setLoading(true);
      const decodedClassName = decodeURIComponent(classname);
      const studentsData = mockStudents.filter(s => s.classname === decodedClassName);
      setStudents(studentsData);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!validateForm()) return;
    try {
      setActionLoading(true);
      const decodedClassName = classname ? decodeURIComponent(classname) : '';
      const newStudent: Student = {
        id: generateId('student'),
        name: formData.name.trim(),
        reg_no: generateRegNo(decodedClassName || formData.classname),
        rollNumber: formData.rollNumber.trim(),
        classname: decodedClassName || formData.classname,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        guardianName: formData.guardianName,
        guardianContact: formData.guardianContact,
      };
      setStudents(prev => [newStudent, ...prev]);
      resetForm();
      setShowAddDialog(false);
      toast({ title: 'Success', description: `Student "${newStudent.name}" added successfully` });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    try {
      setActionLoading(true);
      setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
      setShowDeleteDialog(false);
      setSelectedStudent(null);
      toast({ title: 'Success', description: 'Student deleted successfully' });
    } finally {
      setActionLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter student name',
        variant: 'destructive'
      });
      return false;
    }
    
    if (!formData.rollNumber.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter roll number',
        variant: 'destructive'
      });
      return false;
    }
    
    if (!formData.dateOfBirth) {
      toast({
        title: 'Validation Error',
        description: 'Please enter date of birth',
        variant: 'destructive'
      });
      return false;
    }
    
    return true;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      rollNumber: '',
      classname: classname ? decodeURIComponent(classname) : '',
      dateOfBirth: '',
      gender: 'Male',
      guardianName: '',
      guardianContact: ''
    });
  };

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.reg_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderFilter === 'all' || student.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  return (
    <AppShell>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/app/classes/${classname}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Students - {classname ? decodeURIComponent(classname) : ''}
            </h1>
            <p className="text-foreground-muted">
              Manage students enrolled in this class
            </p>
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="neon">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-glass-border max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter student details to add them to the class
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Enter full name"
                    className="glass focus:border-primary/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number *</Label>
                  <Input
                    id="rollNumber"
                    value={formData.rollNumber}
                    onChange={(e) => handleFormChange('rollNumber', e.target.value)}
                    placeholder="Enter roll number"
                    className="glass focus:border-primary/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
                    className="glass focus:border-primary/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleFormChange('gender', value as any)}>
                    <SelectTrigger className="glass focus:border-primary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-glass-border">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guardianName">Guardian Name</Label>
                  <Input
                    id="guardianName"
                    value={formData.guardianName}
                    onChange={(e) => handleFormChange('guardianName', e.target.value)}
                    placeholder="Enter guardian name"
                    className="glass focus:border-primary/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guardianContact">Guardian Contact</Label>
                  <Input
                    id="guardianContact"
                    value={formData.guardianContact}
                    onChange={(e) => handleFormChange('guardianContact', e.target.value)}
                    placeholder="Enter contact number"
                    className="glass focus:border-primary/50"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddDialog(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddStudent}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Adding...' : 'Add Student'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass focus:border-primary/50"
            />
          </div>
          
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-48 glass focus:border-primary/50">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card border-glass-border">
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Students Table */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-neon-cyan" />
              <span>Students ({filteredStudents.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-foreground-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm || genderFilter !== 'all' ? 'No students found' : 'No students enrolled'}
                </h3>
                <p className="text-foreground-muted mb-6">
                  {searchTerm || genderFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Add your first student to get started'
                  }
                </p>
                {!searchTerm && genderFilter === 'all' && (
                  <Button variant="neon" onClick={() => setShowAddDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Student
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-glass-border hover:bg-glass/30">
                      <TableHead>Name</TableHead>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Reg No.</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>DOB</TableHead>
                      <TableHead>Guardian</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="border-glass-border hover:bg-glass/30">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-foreground">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">
                              {student.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {student.rollNumber}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {student.reg_no}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            student.gender === 'Male' ? 'default' :
                            student.gender === 'Female' ? 'secondary' : 'outline'
                          }>
                            {student.gender}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-foreground-muted">
                          {new Date(student.dateOfBirth).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="text-foreground">{student.guardianName}</div>
                            <div className="text-foreground-muted">{student.guardianContact}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-card border-glass-border">
                              <DropdownMenuItem asChild>
                                <Link to={`/app/students/${encodeURIComponent(student.reg_no)}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="glass-card border-glass-border">
            <DialogHeader>
              <DialogTitle>Delete Student</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedStudent?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedStudent(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteStudent}
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