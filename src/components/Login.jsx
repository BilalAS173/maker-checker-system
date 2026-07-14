import { useState } from "react";
import { Box, Typography, Select, TextField, MenuItem, Button, FormControl, InputLabel } from "@mui/material";

const users = [
    {
        employee_id: "C001",
        password: "checker123",
        name: "Bilal",
        projects: [
            { project_id: "P1", project_name: "XYZ", role: "maker" },
            { project_id: "P2", project_name: "ABC", role: "checker" },
        ],
    },
    {
        employee_id: "M001",
        password: "maker123",
        name: "Ali",
        projects: [
            { project_id: "P3", project_name: "Vacation Requests", role: "maker" },
        ],
    },
];

function Login ({onLogin}) {
   const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
function handleClick() {
    const matchedUser= users.find((user) => user.employee_id === employeeId && user.password===password);

    if (matchedUser) {
        setError ("")
        onLogin(matchedUser)

    }
    else {
        setError("Invalid Employee ID or password");
    }
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
        <Typography variant="body1" color="text.secondary"> Please log in to continue
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
        onChange= {(e) => setPassword(e.target.value)}
         sx={{ minWidth: 250 }}
        />

        {error && (
        <Typography color="error" variant="body2" > {error}</Typography>            
        )     
    }
        <Button variant="contained" onClick={handleClick}>Continue</Button>
    
     </Box>
    );
}

export default Login;
