import { useState, useEffect } from "react";
import { Tabs, Tab, Box, Button, Paper, AppBar, Toolbar, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function Checker ({onLogout}) {
    const[requests, setRequests]=useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState(0);
    useEffect(() => {
        const stored=JSON.parse(localStorage.getItem("requests")) || []
        setRequests(stored);
     }, []);
     function handleTabChange (event, newVal) {
        setActiveTab(newVal);
     }
     function approveRequest (index) {
        const updated= [...requests];
        if (updated[index].status==="Rejected") {
            return;
        }
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
        .filter(({ request }) =>
            request.employee.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(({request, index}) => (
            <Paper key={index} sx={{ padding:2, marginBottom:2}}>
                <Typography>Employee: {request.employee}</Typography>
                <Typography>Days: {request.days}</Typography>
                <Typography>Reason: {request.reason}</Typography>
                <Box sx={{marginTop: 1}}>
                    <Button variant="contained" color={request.status === "Approved" ? "success" : "inherit"}
                    onClick={() => approveRequest(index)}
                    disabled={request.status === "Rejected"}
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
            <Toolbar sx={{ display: "flex", alignItems: "center"}}>
            
            <Typography variant="h6" sx={{flexGrow: 1}}>Checker Dashboard</Typography>
            <Box sx={{display: "flex", alignItems: "center", gap:2}}>
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
                </Box>
            </Toolbar>
          </AppBar>  
            <Tabs value={activeTab} onChange={handleTabChange} sx={{marginTop: 3}}>     
                <Tab label="Pending"></Tab>  
                <Tab label="Approved"></Tab>   
                <Tab label="Rejected"></Tab>        
            </Tabs> 
            <Box sx={{ marginTop: 2 }}>
        {activeTab === 0 && renderColumn("Pending")}
        {activeTab === 1 && renderColumn("Approved")}
        {activeTab === 2 && renderColumn("Rejected")}
            </Box>     
       
       </Box>
     
    
    );
}
export default Checker;