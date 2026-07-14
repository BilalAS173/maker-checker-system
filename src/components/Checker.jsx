import { useState, useEffect } from "react";
import { Box, Button, Paper, AppBar, Toolbar, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function Checker ({onLogout}) {
    const[requests, setRequests]=useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        const stored=JSON.parse(localStorage.getItem("requests")) || []
        setRequests(stored);
     }, []);
     function approveRequest (index) {
        const updated= [...requests];
        updated[index].status="Approved";
        setRequests(updated);
        localStorage.setItem("requests", JSON.stringify(updated));
     }
       function rejectRequest (index) {
        const updated= [...requests];
        updated[index].status="Rejected";
        setRequests(updated);
        localStorage.setItem("requests", JSON.stringify(updated));
     }
     function renderColumn(statusFilter) {
        return requests
        .map((request, index) => ({request, index}))
        .filter(({request}) => request.status  === statusFilter)
        .map(({request, index}) => (
            <Paper key={index} sx={{ padding:2, marginBottom:2}}>
                <Typography>Employee: {request.employee}</Typography>
                <Typography>Days: {request.days}</Typography>
                <Typography>Reason: {request.reason}</Typography>
                <Box sx={{marginTop: 1}}>
                    <Button variant="contained" color={request.status === "Approved" ? "success" : "inherit"}
                    onClick={() => approveRequest(index)}
                    >
                        Approve 
                    </Button>
                    <Button
                        variant="contained"
                        color={request.status === "Rejected" ? "error" : "inherit"}
                        onClick={() => rejectRequest(index)}
                        sx={{ marginLeft: 1}}
                        > Reject
                    </Button>
                </Box>

            </Paper>
        ));
     }
     return (
        <Box sx={{ padding : 3 }}>
            <AppBar position="static" sx={{backgroundColor: "#711F7E"}}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between"}}>
            
            <Typography variant="h6">Checker Dashboard</Typography>
                <TextField size="small" placeholder="Search Requests..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: ( 
                    <InputAdornment position="start">
                        <SearchIcon sx={{color: "white"}}>
                        </SearchIcon>
                        </InputAdornment>


                ),
              }}
                sx={{ 
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius : 1,
                    input: {color : "white"},
                    width: 250,
                }}
            />
            <Button onClick={onLogout} variant="outlined" sx={{ color: "white", borderColor: "white" }}>
                    Logout
                </Button>
            </Toolbar>
          </AppBar>  
            <Box sx={{ display: "flex", gap: 3, marginTop: 3 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>Pending</Typography>
                    {renderColumn("Pending")}
                </Box>
            
            <Box sx= {{flex: 1}}>
                <Typography variant="h6" gutterBottom>Approved</Typography>
                {renderColumn("Approved")}
                
            </Box>

            <Box sx= {{flex: 1}}>
                <Typography variant="h6" gutterBottom>Rejected</Typography>
                {renderColumn("Rejected")}
            </Box>                        
       </Box>
    </Box>
    );
}
export default Checker;