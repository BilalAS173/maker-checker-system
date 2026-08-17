import React, {useState} from "react";
import {useSelector} from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
} from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { LoginResponse } from "./Login";
import MenuIcon from "@mui/icons-material/Menu";

export interface LayoutProps {
  children: React.ReactNode;
  onLogout : () =>void;
  title: string;
}

function Layout({children, onLogout, title}: LayoutProps) {
  const user=useSelector((state: {user: LoginResponse}) => state.user);
  const [drawerOpen, setDrawerOpen]=useState(false);
  return (
     <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* //it should contain side bar and a box containing nav bar and content*/}
      <Box
        sx={{
          display: {xs: "none", md: "block"},
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
      <Drawer
      open={drawerOpen}
      onClose= {() => setDrawerOpen(false)}    
      >
        <Box
        sx= {{
          width:250,
          padding: 4,
        }}
        >
        <Typography variant="h6">Employee Portal</Typography>
        </Box>
      </Drawer>
     <Box sx={{ 
        width: {xs: "100%", md: "80%"}, display: "flex", flexDirection: "column" 
        }}>
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
          <Box
  sx={{
    flex: 1,
    display: "flex",
    alignItems: "center",
  }}
>
  <IconButton
    onClick={() => setDrawerOpen(true)}
    sx={{
      color: "white",
      display: { xs: "flex", md: "none" },
    }}
  >
    <MenuIcon />
  </IconButton>
</Box>
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
           <Typography sx = {{
              display : {
                xs: "none",
                sm: "block",
            }
            }}>{user.name}</Typography>
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
