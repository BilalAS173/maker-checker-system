import { useEffect, useState } from "react";
import {
    Box, Typography, TextField, Button, InputAdornment, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"

function Maker ({onLogout, project, user }) {
const [days, setDays]=useState(" ");
const [reason, setReason]=useState(" ");
const [view, setView]=useState("list")
const [searchTerm, setsearchTerm]=useState(" ")
const [requests, setRequests]=useState([])

useEffect( () => {
    loadMyRequests();
}, []
);

function loadMyRequests () {
    fetch( `http://localhost:5000/requests/${project.project_id}`)
    .then((res)=> (res.json()))
    .then((data) => {
        const mine= data.filter((r) => r.employee_name === user.name);
        setRequests(mine); 
    })
    .catch((err) => console.error(err));
}

function handleSubmit (e) {
    e.preventDefault();

    fetch("http://localhost:5000/requests", {
        method: "POST",
        headers: {"Content-Type" : "application/json" },
        body: JSON.stringify( {
            user_id:user.user_id,
            project_id:project.project_id,
            days,
            description: reason
        } )

    })
    .then((res) => res.json())
    .then((data) => {
        if (data.success) {
            setDays(" ");
            setReason(" ");
            loadMyRequests( );
            setView("list");
            alert("Request submited");
        }
            else {
                alert("Something went wrong when submitting the request");
            }

            
        } )
        .catch((err)  => {
            console.error(err);
            alert("Could not connect to server");
        });
    }

const filteredRequests= requests.filter((r) => r.description.toLowerCase().includes(searchTerm.toLowerCase()) 
);
return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2, color: "white"}}>
            <TextField
                size="small"
                placeholder="Search Requests..."
                value={searchTerm}
                onChange={(e) => setsearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{ width: 300 , color: "white"}}
            />

            {view === "list" && (
                <Button variant="contained" onClick={() => setView("form")}>
                    Add Request
                </Button>
            )}
        </Box>

        {view === "list" && (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Request Number</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Days</TableCell>
                            <TableCell>Reason</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRequests.map((r, i) => (
                            <TableRow key={r.request_id}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{r.employee_name}</TableCell>
                                <TableCell>{r.days}</TableCell>
                                <TableCell>{r.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )}

        {view === "form" && (
            <Box sx={{ maxWidth: 500 }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Add request
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Number of Days"
                            type="number"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
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
                        <Button type="submit" variant="contained">
                            Submit Request
                        </Button>
                        <Button variant="contained" onClick={() => setView("list")}>
                            Back
                        </Button>
                    </Box>
                </form>
            </Box>
        )}
    </Box>
);

}

export default Maker;