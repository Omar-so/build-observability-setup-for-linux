import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer
} from "recharts";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import useFetch from "../hooks/fetch";

const Graphs = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  // Fetch Students per Month
  const new_student_month_per_year = useFetch("http://localhost:5000/api/student/countgraph");

  // Fetch Attendance per Day
  const attendance_day_per_month = useFetch("http://localhost:5000/api/Attendace/graph");

  // Debug logs
  console.log("Students API response:", new_student_month_per_year);
  console.log("Attendance API response:", attendance_day_per_month);

  // Transform Students Data
  useEffect(() => {
    if (new_student_month_per_year?.data?.count) {
      const formatted = new_student_month_per_year.data.count.map((item) => ({
        month: item.month || "Unknown", // X-axis
        students: item.totalStudents || 0, // Y-axis
      }));
      setStudentsData(formatted);
      console.log("Formatted students data:", formatted);
    }
  }, [new_student_month_per_year?.data]);

  // Transform Attendance Data
  useEffect(() => {
    if (attendance_day_per_month?.data?.data) {
      const formatted = attendance_day_per_month.data.data.map((item) => ({
        day: item.date || "Unknown", // X-axis
        attendance: item.totalAttendance || 0, // Y-axis
      }));
      setAttendanceData(formatted);
      console.log("Formatted attendance data:", formatted);
    }
  }, [attendance_day_per_month?.data]);

  // Loading states
  if (new_student_month_per_year?.loading || attendance_day_per_month?.loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading graphs...</Typography>
      </Box>
    );
  }

  // Error states
  if (new_student_month_per_year?.error || attendance_day_per_month?.error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading graph data
          {new_student_month_per_year?.error && (
            <Typography variant="body2">Students: {new_student_month_per_year.error}</Typography>
          )}
          {attendance_day_per_month?.error && (
            <Typography variant="body2">Attendance: {attendance_day_per_month.error}</Typography>
          )}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box 
        sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3 
        }}
      >
        {/* Students per Month (Bar Chart) */}
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Students per Month
          </Typography>
          {studentsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box 
              sx={{ 
                height: 300, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "grey.50"
              }}
            >
              <Typography color="text.secondary">No student data available</Typography>
            </Box>
          )}
        </Paper>

        {/* Attendance per Day (Line Chart) */}
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Attendance per Day
          </Typography>
          {attendanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendance" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Box 
              sx={{ 
                height: 300, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "grey.50"
              }}
            >
              <Typography color="text.secondary">No attendance data available</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Graphs;