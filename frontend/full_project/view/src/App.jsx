import { Route, Routes, useLocation } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import CollapsibleSidebar from './scence/global/sideBar';
import Dashboard from "./scence/dashboard/dashboard";
import StudentCreatePage from "./scence/addstudent/addstudent";
import StudentManagement from "./scence/table/table"
import ApplicationManagement from "./scence/application/application"
import AdminAuth from './scence/admin/admin'
import ProtectedRoute from "./utlity/protect";

function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();

  // Decide if we are on the signup page
  const isAuthPage = location.pathname === "/SignUp";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {isAuthPage ? (
          <Box 
            component="main"
            sx={{ 
              height: "100vh",
              width: "100vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Routes>
              <Route path="/SignUp" element={<AdminAuth />} />
            </Routes>
          </Box>
        ) : (
          /* App layout (with sidebar) */
          <Box sx={{ display: 'flex' }}>
            <CollapsibleSidebar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/AddStudent" element={<ProtectedRoute><StudentCreatePage /></ProtectedRoute>} />
                <Route path="/ViewStudent" element={<ProtectedRoute><StudentManagement /></ProtectedRoute>} />
                <Route path="/viewApplication" element={<ProtectedRoute><ApplicationManagement /></ProtectedRoute>} />
              </Routes>
            </Box>
          </Box>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
