import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Maker ({onLogout}) {
const [employee, setEmployee]= useState(" ");
const [days, setDays]=useState(" ");
const [reason, setReason]=useState(" ");

function handleSubmit(e) {
e.preventDefault ();
const request = {
employee,
days,
reason,
status: "Pending"
};

let requests=JSON.parse(localStorage.getItem("requests")) || []
requests.push(request);
localStorage.setItem("requests", JSON.stringify(requests));
console.log("Request Saved: ", request);
setEmployee(" ");
setDays(" ");
setReason(" ");
}

return (
    <Box
        sx={{
            maxWidth: 500,
            margin: "40px auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
        }}
    >
    <Typography variant="h4">Submit a Request</Typography>
    <form onSubmit={handleSubmit}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}> </Box>

       <TextField
        label="Employee Name"
        value={employee} 
        onChange={(e) => setEmployee(e.target.value)}
        required
        fullWidth
        />
       <TextField
        label="Number of Days"
        type="number"
        value={days}
        onChange={(e) =>setDays(e.target.value)}
        required
        fullWidth
/>      
        <TextField
        label="Reason"
        value={reason}

        onChange={(e) => setReason(e.target.value)}
        required       
        fullWidth
        multiline
        rows={3}
        />

        <Button type="submit" variant="contained" color="primary">Submit Request</Button>
        <Button onClick={onLogout} variant="outlined" color="secondary">Logout</Button>
        
    </form>
    </Box>
);

}

export default Maker