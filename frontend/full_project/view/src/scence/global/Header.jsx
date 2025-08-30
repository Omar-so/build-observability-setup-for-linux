import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import WidgetsIcon from "@mui/icons-material/Widgets";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState, useContext } from "react";
import SunnyIcon from "@mui/icons-material/Sunny";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import { ColorModeContext } from "../../theme";
import { useTheme } from "@mui/material/styles"; // ✅ Correct import

export default function ButtonAppBar() {
  const [select, setSelect] = useState("");
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  return (
<AppBar position="static" color="default"> {/* changed from "neutral" to "default" */}      <Toolbar
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          sx={{ color: "blue", fontWeight: "bold" }}
        >
          Back To Template
        </Button>

        <Box display="flex" alignItems="center">
          <IconButton
            color="secondary"
            aria-label="electric bolt"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid",
              borderColor: "divider",
              mr:"10px"
            }}
          >
            <ElectricBoltIcon />
          </IconButton>

          <IconButton color="secondary" aria-label="widgets">
            <WidgetsIcon />
          </IconButton>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              alignSelf: "center",
              height: 30,
              ml: "20px",
              mr: "20px",
              borderColor: "black",
              fontWeight: "normal",
            }}
          />

          <Select
            value={select}
            displayEmpty
            onChange={(e) => setSelect(e.target.value)}
            sx={(theme) => ({
              mr: 2,
              color: theme.palette.mode === "light" ? "black" : "blue",
              borderColor: "white",
              borderRadius: "2rem",
              fontSize: "large",
              width: "200px",
              height: "45px",
            })}
          >
            <MenuItem value="">Select Theme</MenuItem>
            <MenuItem value={10}>Custom theme</MenuItem>
            <MenuItem value={20}>Material Design 2</MenuItem>
          </Select>

          <IconButton
            color="inherit"
            onClick={colorMode.toggleColorMode}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid",
              borderColor: "divider", 
              backgroundColor:
                theme.palette.mode === "light" ? "grey.100" : "grey.900",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light" ? "grey.200" : "grey.800",
              },
            }}
          >
            {theme.palette.mode === "light" ? <SunnyIcon /> : <BedtimeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
