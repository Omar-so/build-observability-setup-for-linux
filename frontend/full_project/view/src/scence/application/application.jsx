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
  Chip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Search,
  Delete,
  CheckCircle,
  Cancel,
  PersonAdd,
  Close
} from '@mui/icons-material';

const ApplicationManagement = () => {
  // State variables
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalApplications, setTotalApplications] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [applicationToAction, setApplicationToAction] = useState(null);
  const [createStudentForm, setCreateStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch applications on component mount and when page/limit changes
  useEffect(() => {
    fetchApplications();
  }, [page, rowsPerPage]);

  // Function to fetch applications with pagination
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/application?page=${page + 1}&limit=${rowsPerPage}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setApplications(data.applications || []);
        setTotalApplications(data.totalApplication || 0);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const Search_Application = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/application/search?name=${SearchTerm}`,
        { method: 'GET' }
      );
      
      if (response.ok) {
        setSuccess('Application rejected successfully');
        fetchApplications(); // Refresh the list
      } else {
        setError('Failed to reject application');
      }
    } catch (err) {
      setError('Network error during rejection');
    } finally {
      setDeleteDialogOpen(false);
      setApplicationToAction(null);
    }
  };

  // Function to delete an application (reject)
  const deleteApplication = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/application/${applicationToAction}`,
        { method: 'DELETE' }
      );
      
      if (response.ok) {
        setSuccess('Application rejected successfully');
        fetchApplications(); // Refresh the list
      } else {
        setError('Failed to reject application');
      }
    } catch (err) {
      setError('Network error during rejection');
    } finally {
      setDeleteDialogOpen(false);
      setApplicationToAction(null);
    }
  };

  // Function to create a student from application (accept)
  const createStudentFromApplication = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', createStudentForm.name);
      formDataToSend.append('email', createStudentForm.email);
      formDataToSend.append('phone', createStudentForm.phone);
      if (createStudentForm.image) {
        formDataToSend.append('image', createStudentForm.image);
      }

      const response = await fetch('http://localhost:5000/api/student', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        // If student creation is successful, delete the application
        const deleteResponse = await fetch(
          `http://localhost:5000/api/application/${applicationToAction}`,
          { method: 'DELETE' }
        );
        
        if (deleteResponse.ok) {
          setSuccess('Application accepted and student created successfully!');
          fetchApplications(); 
        } else {
          setError('Student created but failed to remove application');
        }
      } else {
        setError(data.message || 'Failed to create student');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setAcceptDialogOpen(false);
      setApplicationToAction(null);
      setCreateStudentForm({
        name: '',
        email: '',
        phone: '',
        image: null
      });
      setImagePreview(null);
    }
  };

  // Handle file upload for create student form
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCreateStudentForm(prev => ({
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

  // Open accept dialog with application data
  const openAcceptDialog = (application) => {
    setApplicationToAction(application._id);
    setCreateStudentForm({
      name: application.name || '',
      email: application.email || '',
      phone: application.phone || '',
      image: application.image || null
    });
    setAcceptDialogOpen(true);
  };

  // Open reject dialog
  const openRejectDialog = (applicationId) => {
    setApplicationToAction(applicationId);
    setDeleteDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Application Management System
          </Typography>
        </Toolbar>
      </AppBar>

      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Pending Applications
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              onClick={fetchApplications}
            >
              Refresh
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
                <TableCell>Applicant</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Applied On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress sx={{ mt: 2 }} />
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((application) => (
                  <TableRow key={application._id} hover>
                    <TableCell>
                      <Avatar src={application.image} alt={application.name}>
                        {application.name ? application.name.charAt(0) : 'A'}
                      </Avatar>
                    </TableCell>
                    <TableCell>{application.name || 'N/A'}</TableCell>
                    <TableCell>{application.email || 'N/A'}</TableCell>
                    <TableCell>{application.phone || 'N/A'}</TableCell>
                    <TableCell>
                      {formatDate(application.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label="Pending" 
                        color="warning" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="success"
                        onClick={() => openAcceptDialog(application)}
                        title="Accept Application"
                      >
                        <CheckCircle />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => openRejectDialog(application._id)}
                        title="Reject Application"
                      >
                        <Cancel />
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
          count={totalApplications}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Reject Application</DialogTitle>
        <DialogContent>
          Are you sure you want to reject this application? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteApplication} color="error" autoFocus>
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Accept Application Dialog */}
      <Dialog
        open={acceptDialogOpen}
        onClose={() => setAcceptDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonAdd sx={{ mr: 1 }} />
            Accept Application & Create Student
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Review and confirm the student information before accepting this application.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mb: 2,
                border: '2px dashed #ccc',
                bgcolor: imagePreview ? 'transparent' : '#f5f5f5'
              }}
              src={createStudentForm.image}
            >
              {!createStudentForm.image && <PersonAdd sx={{ fontSize: 40, color: '#999' }} />}
            </Avatar>
            
            <Button
              component="label"
              variant="outlined"
              size="small"
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </Button>
          </Box>

          <TextField
            fullWidth
            label="Full Name"
            value={createStudentForm.name}
            onChange={(e) => setCreateStudentForm({...createStudentForm, name: e.target.value})}
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={createStudentForm.email}
            onChange={(e) => setCreateStudentForm({...createStudentForm, email: e.target.value})}
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={createStudentForm.phone}
            onChange={(e) => setCreateStudentForm({...createStudentForm, phone: e.target.value})}
            margin="normal"
            required
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAcceptDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={createStudentFromApplication} 
            variant="contained" 
            color="success"
            startIcon={<CheckCircle />}
          >
            Accept & Create Student
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ApplicationManagement;