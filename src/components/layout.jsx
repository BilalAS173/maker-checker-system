import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { purple } from "@mui/material/colors";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

function Layout({ children, user, onLogout, title }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* //it should contain side bar and a box containing nav bar and content*/}
      <Box
        sx={{
          width: "20%",
          backgroundColor: "white",
          borderRight: "1px solid #e0e0e0",
          color: "black",
          padding: 6,
        }}
      >
        <Typography variant="h6">Employee Portal</Typography>
        {/* side bar content goes here*/}
      </Box>
      <Box sx={{ width: "80%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#711F7E",
            color: "white",
            display: "flex",
            padding: "12px 40px",
            boxSizing: "border-box",
            alignItems: "center",
          }}
        >
          <Box sx={{flex: 1}} />
          <Box sx={{flex: 1, textAlign: "center"}}>
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Box sx={{
            flex:1,
            display: "flex",
            justifyContent:"flex-end",
            alignItems:"center",
            gap: 1
          }}>
            <Typography>{user.name}</Typography>
            <IconButton onClick={onLogout} sx={{color: "white"}} >
              <PowerSettingsNewIcon />
            </IconButton>

          </Box>
        </Box>

        <Box sx={{ flex: 1, padding: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}

export default Layout;
