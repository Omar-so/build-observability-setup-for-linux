import React, { useEffect, useState } from "react";
import { Stack, Paper, Typography, Box } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [studentsData, setStudentsData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentStats, setStudentStats] = useState({});
  const [attendanceStats, setAttendanceStats] = useState({});
  const [subscriptionStats, setSubscriptionStats] = useState({});
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [graphDataLoading, setGraphDataLoading] = useState({
    students: true,
    attendance: true
  });

  // Fetch dashboard stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student stats
        const studentResponse = await fetch("http://localhost:5000/api/student?page=1&limit=1");
        const studentData = await studentResponse.json();
        
        setStudentStats(studentData);
        
        // Fetch today's attendance
        const attendanceResponse = await fetch("http://localhost:5000/api/attendance/today");
        const attendanceData = await attendanceResponse.json();
        setAttendanceStats(attendanceData);
        
        // Fetch this month's subscriptions
        const subscriptionResponse = await fetch("http://localhost:5000/api/subscription/this-month"); 
        const subscriptionData = await subscriptionResponse.json();
        setSubscriptionStats(subscriptionData);

      } catch (error)  {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setStudentsLoading(false);
        setAttendanceLoading(false);
        setSubscriptionLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch student graph data
  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        setGraphDataLoading(prev => ({...prev, students: true}));
        const response = await fetch("http://localhost:5000/api/student/count_graph");
        const data = await response.json();
             
        if (data && data.data) {
          const formatted = data.data.map((item) => ({
            month: `Month ${item.Month}`, 
            students: item.totalRegistrations || 0,
          }));
          setStudentsData(formatted);
        }
        
      } catch (error) {
        console.error("Error fetching student graph data:", error);
      } finally {
        setGraphDataLoading(prev => ({...prev, students: false}));
      }
    };
    
    fetchStudentsData();
  }, []);

  // Fetch attendance graph data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setGraphDataLoading(prev => ({...prev, attendance: true}));
        const response = await fetch("http://localhost:5000/api/attendance/graph");
        const data = await response.json();

        if (data?.data) {
          const formatted = data.data.map((item) => ({
            date: new Date(item.date).toLocaleDateString(),
            attendance: item.totalAttendance || 0,
          }));

          setAttendanceData(formatted);
        }
      } catch (error) {
        console.error("Error fetching attendance graph data:", error);
      } finally {
        setGraphDataLoading(prev => ({...prev, attendance: false}));
      }
    };
    
    fetchAttendanceData();
  }, []);

  return (
    <Stack
      spacing={4}
      direction="column"
      sx={{
        minHeight: "100vh",
        minWidth: "100%",
        alignItems: "center",
        p: 3,
      }}
    >
      {/* Dashboard Title */}
      <Typography
        fontSize="32px"
        fontWeight="bold"
        color="primary.main"
        sx={{ mb: 2 }}
      >
        Welcome to the Dashboard
      </Typography>

      {/* Stats Cards */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{ width: "100%" }}
      >
        {/* Total Students */}
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: 3,
            textAlign: "center",
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Total Students
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {studentsLoading ? "Loading..." : studentStats?.totalStudents || 0}
          </Typography>
        </Paper>

        {/* Attended Today */}
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: 3,
            textAlign: "center",
            bgcolor: "secondary.main",
            color: "secondary.contrastText",
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Attended Today
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {attendanceLoading ? "Loading..." : attendanceStats?.number || 0}
          </Typography>
        </Paper>

        {/* Subscribed This Month */}
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: 3,
            textAlign: "center",
            bgcolor: "success.main",
            color: "success.contrastText",
          }}
        >
          <PersonAddIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Subscribed This Month
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {subscriptionLoading ? "Loading..." : subscriptionStats?.number || 0}
          </Typography>
        </Paper>
      </Stack>

      {/* Charts Section */}
      <Box sx={{ width: "100%", mt: 4 }}>
        <Box 
          sx={{ 
            display: "grid", 
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 3 
          }}
        >
          {/* Students per Month Chart */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
              Students Registration This Year
            </Typography>
            {graphDataLoading.students ? (
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
                <Typography color="text.secondary">
                  Loading...
                </Typography>
              </Box>
            ) : studentsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studentsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#1976d2" name="New Students" />
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
                <Typography color="text.secondary">
                  No student data available
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Attendance Chart */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "secondary.main" }}>
              Daily Attendance Trends
            </Typography>
            {graphDataLoading.attendance ? (
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
                <Typography color="text.secondary">
                  Loading...
                </Typography>
              </Box>
            ) : attendanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#9c27b0" 
                    strokeWidth={2}
                    name="Attendance"
                    dot={{ fill: "#9c27b0", strokeWidth: 2, r: 4 }}
                  />
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
                <Typography color="text.secondary">
                  No attendance data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Stack>
  );
}