import { useState } from "react";
import {
  Box,
  Typography,
  Select,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";

function Login({ onLogin }) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleClick() {

    const request= {
        employeeId: employeeId, 
        password: password 
    }
    
    console.log(request)
    await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
body: JSON.stringify({employee_id: employeeId, password}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log( " request result : ", data)
        if (data.error) {
          setError(data.error);
        } else {
          setError("");
          onLogin(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Could not connect to server");
      });
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 3,
      }}
    >
      <Typography variant="h4">Maker-Checker System</Typography>
      <Typography variant="body1" color="text.secondary">
        {" "}
        Please log in to continue
      </Typography>

      <TextField
        label="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        sx={{ minWidth: 250 }}
      />
      <TextField
        label="Password"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        sx={{ minWidth: 250 }}
      />

      {error && (
        <Typography color="error" variant="body2">
          {" "}
          {error}
        </Typography>
      )}
      <Button variant="contained" onClick={handleClick}>
        Continue
      </Button>
    </Box>
  );
}

export default Login;
