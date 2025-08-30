import React, { useState } from "react";

// Material UI
import {
  Card,
  CardContent,
  Box,
  Grid,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const AttendanceCalendar = ({ attendance }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get all days in the current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  // Check if a date has attendance
  const hasAttendance = (date) => {
    if (!date) return false;
    
    return attendance.some(record => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getDate() === date.getDate() &&
        recordDate.getMonth() === date.getMonth() &&
        recordDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Format date for display
  const formatDate = (date) => {
    return date ? date.getDate() : '';
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const days = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={prevMonth}>
            <Typography variant="h6">&lt;</Typography>
          </IconButton>
          <Typography variant="h6" component="h3">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          <IconButton onClick={nextMonth}>
            <Typography variant="h6">&gt;</Typography>
          </IconButton>
        </Box>
        
        <Grid container spacing={1} sx={{ display:'flex' , justifyContent:'center', marginRight:'20px' }}>

          {/* Calendar days */}
          {days.map((day, index) => (
            <Grid item xs={1.7} key={index} sx={{ textAlign: 'center', height: 40 }}>
              {day ? (
                <Badge
                  badgeContent={hasAttendance(day) ? "✓" : null}
                  color="success"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: 16,
                      height: 20,
                      minWidth: 20,
                      borderRadius: '50%',
                      top: -5,
                      right: -5
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: hasAttendance(day) ? '#e8f5e9' : 'transparent',
                      border: hasAttendance(day) ? '1px solid #4caf50' : '1px solid #e0e0e0',
                      margin: '0 auto',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: hasAttendance(day) ? '#c8e6c9' : '#f5f5f5'
                      }
                    }}
                  >
                    <Typography variant="body2">
                      {formatDate(day)}
                    </Typography>
                  </Box>
                </Badge>
              ) : (
                <Box sx={{ width: 36, height: 36 }} />
              )}
            </Grid>
          ))}
        </Grid>
        
        {/* Legend */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Box sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: '#e8f5e9',
              border: '1px solid #4caf50',
              mr: 1
            }} />
            <Typography variant="caption">Present</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle color="success" sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption">Attendance marked</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AttendanceCalendar;