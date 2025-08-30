import React, { useState, useContext } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar,
  Avatar,
  Divider,
  Badge,
  Typography
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  LightMode as SunnyIcon,
  DarkMode as BedtimeIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { ColorModeContext } from "../../theme";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 240;

export default function CollapsibleSidebar() {
  const [open, setOpen] = useState(true);
  const [isOnline] = useState(true);
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const nav = useNavigate();
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 60,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        transition: "width 0.3s",
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 60,
          transition: "width 0.3s",
          overflowX: "hidden",
        },
      }}
    >
      <Toolbar sx={{ display: 'flex',  justifyContent: open ? "space-between" : "center", alignItems: 'center' }}>
        <IconButton onClick={toggleDrawer} >
          <MenuIcon />
        </IconButton>
        {open && (
          <IconButton
            onClick={colorMode.toggleColorMode}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: theme.palette.mode === "light" ? "grey.100" : "grey.900",
              "&:hover": {
                backgroundColor: theme.palette.mode === "light" ? "grey.200" : "grey.800",
              },
            }}
          >
            {theme.palette.mode === "light" ? <SunnyIcon /> : <BedtimeIcon />}
          </IconButton>
        )}
      </Toolbar>

      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <List>
          {open && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: isOnline ? "#44b700" : "grey",
                    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                  },
                }}
              >
                <Avatar sx={{ width: 80, height: 80, mb: 1 }} />
              </Badge>
              <Typography variant="h6" sx={{ fontFamily: "Poppins", fontWeight: 700 }}>
                Welcome, Admin
              </Typography>
            </Box>
          )}

          <ListItem button onClick={() => nav("/")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Dashboard" />}
          </ListItem>

          <ListItem button onClick={() => nav("/AddStudent")}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Add Student" />}
          </ListItem>

          <ListItem button onClick={() => nav("/ViewStudent")}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            {open && <ListItemText primary="View Students" />}
          </ListItem>

          <ListItem button onClick={() => nav("/viewApplication")}>
            <ListItemIcon>
              <AdminIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Applications" />}
          </ListItem>
        </List>

        <Divider />
        <Box sx={{ flexGrow: 1 }} />

        <List>
          <ListItem button onClick={() => {
            localStorage.removeItem('token');
            nav("/SignUp");
          }}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Logout" />}
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}