import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  InputAdornment,
  Tabs,
  Tab,
  Chip,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Badge
} from '@mui/material';
import {
  Search,
  Delete,
  Edit,
  Add,
  CloudUpload,
  AddAPhoto,
  Payment,
  EventAvailable,
  History,
  Close,
  CheckCircle,
  Event
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AttendanceCalendar from '../../component/clender'
import TabPanel from '../../component/tabpanel'


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});



const StudentManagement = () => {
  // State variables
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  
  // Form data states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    image: null
  });
  
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    image: null
  });

  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage]);

  // Function to fetch students with pagination
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/student?page=${page + 1}&limit=${rowsPerPage}`
      );
      const data = await response.json();

      console.log( "data " , data)
      if (response.ok) {
        setStudents(data.students);
        setTotalStudents(data.totalStudents);
      } else {
        setError('Failed to fetch students');
      }
    } catch (err) {
      setError('Network error. Please try again. ' , err);
    } finally {
      setLoading(false);
    }
  };

  // Function to search students by name
  const searchStudents = async () => {
    if (!searchTerm.trim()) {
      fetchStudents();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/student/search?name=${searchTerm}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setStudents(data.data);
        setTotalStudents(data.data.length);
      } else {
        setError('Search failed');
      }
    } catch (err) {
      setError('Network error during search' , err);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a student
  const deleteStudent = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/student/${studentToDelete}`,
        { method: 'DELETE' }
      );
      
      if (response.ok) {
        setSuccess('Student deleted successfully');
        fetchStudents(); // Refresh the list
      } else {
        setError('Failed to delete student');
      }
    } catch (err) {
      setError('Network error during deletion' , err);
    } finally {
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  // Function to update a student
  const updateStudent = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/student/${editFormData.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editFormData.name,
            email: editFormData.email,
            phone: editFormData.phone,
          }),
        }
      );
      
      if (response.ok) {
        setSuccess('Student updated successfully');
        fetchStudents(); // Refresh the list
        setEditDialogOpen(false);
      } else {
        setError('Failed to update student');
      }
    } catch (err) {
      setError('Network error during update' , err);
    }
  };

  // Function to create a new student
  const createStudent = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch('http://localhost:5000/api/student', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Student created successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          image: null
        });
        setImagePreview(null);
        setCreateDialogOpen(false);
        fetchStudents(); // Refresh the list
      } else {
        setError(data.message || 'Failed to create student');
      }
    } catch (err) {
      setError('Network error. Please try again.' ,err);
    }
  };

  // Function to pay subscription
  const paySubscription = async (studentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/subscription/pay?id=${studentId}`,
        { method: 'POST' }
      );
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Subscription payment successful');
        if (selectedStudent && selectedStudent._id === studentId) {
          fetchSubscriptions(studentId);
        }
      } else {
        setError(data.error || 'Failed to process subscription');
      }
    } catch (err) {
      setError('Network error during subscription payment' , err);
    }
  };

  // Function to fetch subscriptions
  const fetchSubscriptions = async (studentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/subscription/display?id=${studentId}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setSubscriptions(data.data || []);
      } else {
        setError('Failed to fetch subscriptions');
      }
    } catch (err) {
      setError('Network error fetching subscriptions' ,err);
    }
  };

  // Function to mark attendance
  const markAttendance = async (studentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/attendance/mark?id=${studentId}`,
        { method: 'POST' }
      );
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Attendance marked successfully');
        // Refresh attendance data if we're viewing a student's details
        if (selectedStudent && selectedStudent._id === studentId) {
          fetchAttendance(studentId);
        }
      } else {
        setError(data.error || 'Failed to mark attendance');
      }
    } catch (err) {
      setError('Network error marking attendance' ,err);
    }
  };

  // Function to fetch attendance
  const fetchAttendance = async (studentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/attendance/display?id=${studentId}`
      );
      const data = await response.json();
      
      if (response.ok) {
        // Add dates if the API doesn't return them
        const attendanceWithDates = (data.data || []).map((record, index) => {
          // If record doesn't have a date, create one (for demo purposes)
          if (!record.date) {
            const date = new Date();
            date.setDate(date.getDate() - index);
            return { ...record, date: date.toISOString() };
          }
          return record;
        });
        setAttendance(attendanceWithDates);
      } else {
        setError('Failed to fetch attendance');
      }
    } catch (err) {
      setError('Network error fetching attendance' ,err);
    }
  };

  // Handle file upload for create form
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Open student details
  const openStudentDetails = (student) => {
    setSelectedStudent(student);
    fetchSubscriptions(student._id);
    fetchAttendance(student._id);
    setTabValue(1); // Switch to details tab
  };

  // Open edit dialog with student data
  const openEditDialog = (student) => {
    setEditFormData({
      id: student._id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      image: null
    });
    setEditDialogOpen(true);
  };

  // Reset create form
  const resetCreateForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      image: null
    });
    setImagePreview(null);
    setCreateDialogOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Student Management System
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<Add />}
            onClick={resetCreateForm}
          >
            Add Student
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Student List" />
          <Tab label="Student Details" disabled={!selectedStudent} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Student List
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchStudents()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ mr: 1, width: 300 }}
              />
              <Button 
                variant="contained" 
                onClick={searchStudents}
              >
                Search
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress sx={{ mt: 2 }} />
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow 
                      key={student._id} 
                      hover 
                      onClick={() => openStudentDetails(student)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Avatar src={student.image} alt={student.name} />
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>
                        {new Date(student.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(student);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            setStudentToDelete(student._id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Delete />
                        </IconButton>
                        <IconButton
                          color="success"
                          onClick={(e) => {
                            e.stopPropagation();
                            paySubscription(student._id);
                          }}
                        >
                          <Payment />
                        </IconButton>
                        <IconButton
                          color="info"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAttendance(student._id);
                          }}
                        >
                          <EventAvailable />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalStudents}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1} sx={{ display : "flex" , alignItems : "center" , justifyContent : "center" }}> 
        {selectedStudent && (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h2">
                Student Details: {selectedStudent.name}
              </Typography>
              <Button 
                startIcon={<Close />}
                onClick={() => {
                  setSelectedStudent(null);
                  setTabValue(0);
                }}
              >
                Close
              </Button>
            </Box>

            <Grid  spacing={3} >
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={selectedStudent.image}
                      sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                    />
                    <Typography variant="h6">{selectedStudent.name}</Typography>
                    <Typography color="textSecondary">{selectedStudent.email}</Typography>
                    <Typography color="textSecondary">{selectedStudent.phone}</Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        color="success" 
                        startIcon={<Payment />}
                        onClick={() => paySubscription(selectedStudent._id)}
                        sx={{ mr: 1, mb: 1 }}
                      >
                        Pay Subscription
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="info" 
                        startIcon={<EventAvailable />}
                        onClick={() => markAttendance(selectedStudent._id)}
                        sx={{ mb: 1 }}
                      >
                        Mark Attendance
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
                
                {/* Subscription History */}
                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Subscription History
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {subscriptions.length > 0 ? (
                      <List>
                        {subscriptions.map((sub, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={new Date(sub.createdAt).toLocaleDateString()}
                            />
                            <Chip label="Paid" color="success" size="small" />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography color="textSecondary">
                        No subscription records found
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                {/* Attendance Calendar */}
                <AttendanceCalendar attendance={attendance} />
                
                {/* Attendance List */}
                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Attendance Records
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {attendance.length > 0 ? (
                      <List>
                        {attendance.map((record, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={new Date(record.date).toLocaleDateString()}
                              secondary={`Status: ${record.status || 'Present'}`}
                            />
                            <CheckCircle color="success" />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography color="textSecondary">
                        No attendance records found
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        )}
      </TabPanel>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this student? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteStudent} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Full Name"
            value={editFormData.name}
            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={editFormData.email}
            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={editFormData.phone}
            onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={updateStudent} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Student Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Student</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mb: 2,
                border: '2px dashed #ccc',
                bgcolor: imagePreview ? 'transparent' : '#f5f5f5'
              }}
              src={imagePreview}
            >
              {!imagePreview && <AddAPhoto sx={{ fontSize: 40, color: '#999' }} />}
            </Avatar>
            
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
            >
              Upload Image
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </Box>

          <TextField
            fullWidth
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            margin="normal"
            required
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={createStudent} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentManagement;