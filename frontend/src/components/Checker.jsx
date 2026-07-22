import { useState, useEffect } from "react";
import { Tabs, Tab, Box, Button, Paper, AppBar, Toolbar, Typography, TextField, InputAdornment } from "@mui/material";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function Checker ({project}) {
    const[requests, setRequests]=useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState(0);
    useEffect(() => {
        loadRequests();
     }, []);

     function loadRequests () {
        fetch( `http://localhost:5000/requests/${project.project_id}`)
        .then((res)  => res.json())
        .then ((data) => setRequests(data) )
        .catch((err) => console.error(err));
     }
     function handleTabChange (event, newVal) {
        setActiveTab(newVal);
     }
     
     function approveRequest (request_id, currentStatus) {
        if (currentStatus==="Rejected") {
            return;
        }
        updateStatus(request_id, "Approved");
     }
       function rejectRequest (request_id, currentStatus) {
        if (currentStatus==="Approved") {
            return;
        }
        updateStatus(request_id, "Rejected");
     }

     function updateStatus (request_id, newStatus) {
        fetch( `http://localhost:5000/requests/${request_id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({status: newStatus}),

        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    loadRequests();
                } else {
                    alert("Something went wrong while updating the request");
                }
            })
            .catch((err) => console.error(err));
     }

     function renderColumn(statusFilter) {
        const filtered=requests
        .filter((request) => request.status  === statusFilter)
        .filter((request ) =>
            request.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.description.toLowerCase().includes(searchTerm.toLowerCase())
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
                        {filtered.map((request) => (
                            <TableRow key={request.request_id} >
                                <TableCell>{request.employee_name}</TableCell>
                                <TableCell>{request.days}</TableCell>
                                <TableCell>{request.description}</TableCell>
                                <TableCell>
                                    <Button variant="contained"
                                    color={request.status=== "Approved" ? "success" : "inherit"}
                                    onClick={()=> approveRequest(request.request_id, request.status)}
                                    disabled={request.status === "Rejected"}
                                    sx={{marginRight: 1}}
                                    >
                                    Approve
                                    </Button>
                                    <Button variant="contained"
                                    color={request.status==="Rejected" ? "error" : "inherit"}
                                    onClick={()=> rejectRequest(request.request_id, request.status)}
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