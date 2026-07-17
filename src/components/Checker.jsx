import { useState, useEffect } from "react";
import { Tabs, Tab, Box, Button, Paper, AppBar, Toolbar, Typography, TextField, InputAdornment } from "@mui/material";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
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
        if (updated[index].status==="Approved") {
            return;
        }
        updated[index].status="Rejected";
        setRequests(updated);
        localStorage.setItem("requests", JSON.stringify(updated));
     }
     function renderColumn(statusFilter) {
        const filtered=requests
        .map((request, index) => ({request, index}))
        .filter(({request}) => request.status  === statusFilter)
        .filter(({ request }) =>
            request.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.reason.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Days</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell> Decision</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map(({request, index}) => (
                            <TableRow key={index} >
                                <TableCell>{request.employee}</TableCell>
                                <TableCell>{request.days}</TableCell>
                                <TableCell>{request.reason}</TableCell>
                                <TableCell>
                                    <Button variant="contained"
                                    color={request.status=== "Approved" ? "success" : "inherit"}
                                    onClick={()=> approveRequest(index)}
                                    disabled={request.status === "Rejected"}
                                    sx={{marginRight: 1}}
                                    >
                                    Approve
                                    </Button>
                                    <Button variant="contained"
                                    color={request.status==="Rejected" ? "error" : "inherit"}
                                    onClick={()=> rejectRequest(index)}
                                    disabled={request.status==="Approved"}
                                    sx={{marginLeft: 1}}
                                    >
                                    Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
       
              
     }
     return (
        <Box sx={{ padding : 3 }}>
            <Box sx={{display: "flex", alignItems:"center", justifyContent: "space-between", marginBottom: 2}}>
            <Typography variant="h5" sx={{flexGrow: 1}}>Checker Dashboard</Typography>
                <TextField
                    size="small"
                    placeholder="Search Requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 250 }}
                />
           
            </Box>
       
          
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