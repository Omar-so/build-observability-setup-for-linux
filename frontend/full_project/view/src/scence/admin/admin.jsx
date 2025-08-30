import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Tabs,
  Tab,
  Container,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  AdminPanelSettings
} from '@mui/icons-material';
import { Navigate } from "react-router-dom";


function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminAuth() {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add this state

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setMessage('');
    setError('');
    setShowPassword(false);
  };

  const handleSignInChange = (field) => (event) => {
    setSignInData({ ...signInData, [field]: event.target.value });
    setError('');
    setMessage('');
  };

  const handleSignUpChange = (field) => (event) => {
    setSignUpData({ ...signUpData, [field]: event.target.value });
    setError('');
    setMessage('');
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/admin/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(signInData),
      });
        
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        setMessage(data.message || 'Login successful');
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true); // Set this to true to trigger navigation
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(signUpData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'User signed up successfully');
        // Reset form on success
        setSignUpData({ name: '', email: '', password: '' });
        // Optionally switch to sign in tab
        // setTabValue(0);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        height: '100vh', 
        width: '30%', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)', 
        overflow: 'hidden', 
        position: 'relative'
      }}
    >
            {isLoggedIn && <Navigate to="/" replace />}
        <Paper
          elevation={24}
          sx={{
            overflow: 'hidden',
            background: 'rgba(30, 30, 46, 0.95)', // Darker background
            backdropFilter: 'blur(20px)',
            height: '100%',
            color: '#fff' ,
          }}
        >
          <Card sx={{ boxShadow: 'none', background: 'transparent'  }}>
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <AdminPanelSettings
                  sx={{
                    fontSize: 48,
                    color: 'secondary.main', 
                    mb: 2
                  }}
                />
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    color: 'common.white', // White text
                    mb: 1
                  }}
                >
                  Admin Portal
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, color: 'grey.400' }} // Lighter gray text
                >
                  Secure access to administrative functions
                </Typography>
              </Box>

              {/* Tabs */}
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
                sx={{
                  mb: 3,
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                    backgroundColor: 'secondary.main'
                  },
                  '& .MuiTab-root': {
                    color: 'grey.400'
                  },
                  '& .Mui-selected': {
                    color: 'secondary.main !important'
                  }
                }}
              >
                <Tab
                  label="Sign In"
                  id="auth-tab-0"
                  aria-controls="auth-tabpanel-0"
                  sx={{ fontWeight: 600, minWidth: 120 }}
                />
                <Tab
                  label="Sign Up"
                  id="auth-tab-1"
                  aria-controls="auth-tabpanel-1"
                  sx={{ fontWeight: 600, minWidth: 120 }}
                />
              </Tabs>

              {/* Alert Messages */}
              {message && (
                <Alert
                  severity="success"
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    backgroundColor: 'rgba(46, 125, 50, 0.2)',
                    color: '#a5d6a7'
                  }}
                  onClose={() => setMessage('')}
                >
                  {message}
                </Alert>
              )}

              {error && (
                <Alert
                  severity="error"
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    backgroundColor: 'rgba(211, 47, 47, 0.2)',
                    color: '#e57373'
                  }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              {/* Sign In Tab */}
              <TabPanel value={tabValue} index={0}>
                <Box component="form" onSubmit={handleSignIn} noValidate>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={signInData.email}
                    onChange={handleSignInChange('email')}
                    required
                    autoComplete="email"
                    sx={{ 
                      mb: 3,
                      '& .MuiInputBase-input': {
                        color: '#fff'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'grey.400'
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'grey.600'
                        },
                        '&:hover fieldset': {
                          borderColor: 'secondary.main'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: 'grey.400' }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={signInData.password}
                    onChange={handleSignInChange('password')}
                    required
                    autoComplete="current-password"
                    sx={{ 
                      mb: 4,
                      '& .MuiInputBase-input': {
                        color: '#fff'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'grey.400'
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'grey.600'
                        },
                        '&:hover fieldset': {
                          borderColor: 'secondary.main'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'grey.400' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                            sx={{ color: 'grey.400' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading || !signInData.email || !signInData.password}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      backgroundColor: 'secondary.main',
                      '&:hover': {
                        backgroundColor: 'secondary.dark'
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: 'inherit' }} />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Box>
              </TabPanel>

              {/* Sign Up Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box component="form" onSubmit={handleSignUp} noValidate>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={signUpData.name}
                    onChange={handleSignUpChange('name')}
                    required
                    autoComplete="name"
                    sx={{ 
                      mb: 3,
                      '& .MuiInputBase-input': {
                        color: '#fff'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'grey.400'
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'grey.600'
                        },
                        '&:hover fieldset': {
                          borderColor: 'secondary.main'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: 'grey.400' }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={signUpData.email}
                    onChange={handleSignUpChange('email')}
                    required
                    autoComplete="email"
                    sx={{ 
                      mb: 3,
                      '& .MuiInputBase-input': {
                        color: '#fff'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'grey.400'
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'grey.600'
                        },
                        '&:hover fieldset': {
                          borderColor: 'secondary.main'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: 'grey.400' }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={signUpData.password}
                    onChange={handleSignUpChange('password')}
                    required
                    autoComplete="new-password"
                    sx={{ 
                      mb: 4,
                      '& .MuiInputBase-input': {
                        color: '#fff'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'grey.400'
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'grey.600'
                        },
                        '&:hover fieldset': {
                          borderColor: 'secondary.main'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'grey.400' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                            sx={{ color: 'grey.400' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading || !signUpData.name || !signUpData.email || !signUpData.password}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      backgroundColor: 'secondary.main',
                      '&:hover': {
                        backgroundColor: 'secondary.dark'
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: 'inherit' }} />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Box>
              </TabPanel>

              {/* Footer */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'grey.500' }}>
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Paper>
      
    </Box>
  );
}