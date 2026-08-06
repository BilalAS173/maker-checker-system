import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Tabs, Tab, Box, Button, Paper, AppBar, Toolbar, Typography, TextField, IconButton } from "@mui/material";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/userSlice";
import { clearProject } from "../store/projectSlice";
import {RequestData, RequestsResponse} from "./Maker"
import {LoginResponse, Project} from "./Login"

function Checker () {
    const project= useSelector((state : {project: Project | null}) => state.project);
    const user = useSelector((state: {user: LoginResponse | null}) => state.user);
    const dispatch  = useDispatch();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState(0);
    const [searchInput, setSearchInput]= useState("");

    const[ pendingRequests, setPendingRequests]= useState<RequestData[]>([]);
    const [pendingPage, setPendingPage]= useState(1);
    const [pendingTotalPages, setPendingTotalPages]= useState(1);

    const [approvedRequests, setApprovedRequests]= useState<RequestData[]>([]);
    const [approvedPage, setApprovedPage]= useState(1);
    const [approvedTotalPages, setApprovedTotalPages]= useState(1);

    const [rejectedRequests, setRejectedRequests]= useState<RequestData[]>([]);
    const [rejectedPage, setRejectedPage]= useState(1);
    const [rejectedTotalPages, setRejectedTotalPages]= useState(1);

    useEffect(() => {
        loadRequestsByStatus("Pending", pendingPage, setPendingRequests, setPendingTotalPages);
     }, [pendingPage, searchTerm]);

    useEffect (() => {
        loadRequestsByStatus("Approved", approvedPage, setApprovedRequests, setApprovedTotalPages);
    }, [approvedPage, searchTerm]);

    useEffect (() => {
        loadRequestsByStatus("Rejected", rejectedPage, setRejectedRequests, setRejectedTotalPages);
    }, [rejectedPage, searchTerm]);

    function handleAuthError(res: Response): boolean {
        if (res.status===403|| res.status===401) {
            dispatch(logout());
            dispatch(clearProject());
            navigate("/login");
            return true;
        }
        else {
            return false;
        }
    }
     async function loadRequestsByStatus (status: string, page: number, setDataFn: React.Dispatch<React.SetStateAction<RequestData[]>>, setTotalPagesFn : React.Dispatch<React.SetStateAction<number>>) {
      if (!user || !project) {
        return;
      }
        try {
        const res= await fetch( `http://localhost:5000/requests/${project.project_id}?page=${page}&limit=5&search=${searchTerm}&status=${status}`, 
        {
            headers : {
                "Authorization":   `Bearer ${user.token}`
            },
        }
     );
        if (handleAuthError(res)) {
            return;
        }
       const response: RequestsResponse = await res.json();
        setDataFn(response.data);
        setTotalPagesFn(response.totalPages);
        }
        catch(err) { 
            console.error(err);
        }
     }
     function handleTabChange (event : React.SyntheticEvent, newVal:number) {
        setActiveTab(newVal);
     }
     
     function approveRequest (request_id: number, currentStatus: string) {
        if (currentStatus==="Rejected") {
            return;
        }
        updateStatus(request_id, "Approved");
     }
       function rejectRequest (request_id: number, currentStatus: string) {
        if (currentStatus==="Approved") {
            return;
        }
        updateStatus(request_id, "Rejected");
     }
     function isValidSearchTerm (value : string) {
        const allowedPattern= /^[a-zA-Z0-9 ][a-zA-Z0-9 ']*[a-zA-Z0-9 ]$|^[a-zA-Z0-9 ]?$/;
        return allowedPattern.test(value);
    }

    function handleSearchSubmit () {
        if (isValidSearchTerm(searchInput)) {
            setSearchTerm(searchInput);
        }
        else {
            alert("Search term contains invalid characters.");
        }
    }

    async function updateStatus(request_id : number, newStatus : string) {
    if (!user || !project) {
        return;
      }
        try {
        const res= await fetch(`http://localhost:5000/requests/${request_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json",
                    "Authorization" : `Bearer ${user.token}`
         },
        body: JSON.stringify({ status: newStatus }),
        });
        
        if (handleAuthError(res)) {
            return;
        }

      const response=await res.json();
            if (response.success) {
                loadRequestsByStatus("Pending", pendingPage, setPendingRequests, setPendingTotalPages);
                if (newStatus === "Approved") {
                    loadRequestsByStatus("Approved", approvedPage, setApprovedRequests, setApprovedTotalPages);
                } else if (newStatus === "Rejected") {
                    loadRequestsByStatus("Rejected", rejectedPage, setRejectedRequests, setRejectedTotalPages);
                }
            } else {
                alert("Something went wrong while updating the request");
            }
        }
        catch(err) { 
            console.error(err);
        }
}
     function renderColumn(requestList: RequestData[], currentPage: number, totalPages: number, setPage: React.Dispatch<React.SetStateAction<number>>) {
        return (
            <>
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
                        {requestList.map((request) => (
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
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setPage(value)}
                sx={{ marginTop: 2}}
            >
            </Pagination>
            </>
        );
       
     }
     return (
        <Box sx={{ padding : 3 }}>
            <Box sx={{display: "flex", alignItems:"center", justifyContent: "space-between", marginBottom: 2}}>
            <Typography variant="h5" sx={{flexGrow: 1}}>Checker Dashboard</Typography>
                <TextField
                    size="small"
                    placeholder="Search Requests..."
                    value={searchInput}
                    onChange={(e) => {
                        const value=e.target.value;
                        setSearchInput(value);
                        if (value==="") {
                            setSearchTerm("");
                        }
                        }
                    }
                     onKeyDown={(e) => {
                            if (e.key==="Enter") {
                                handleSearchSubmit();
                            }
                        }}
                   /* InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}*/
                    sx={{ width: 250 }}
                />
                <IconButton onClick={handleSearchSubmit}>
                    <SearchIcon />
                </IconButton>
           
            </Box>
       
          
            <Tabs value={activeTab} onChange={handleTabChange} sx={{marginTop: 3}}>     
                <Tab label="Pending"></Tab>  
                <Tab label="Approved"></Tab>   
                <Tab label="Rejected"></Tab>        
            </Tabs> 
            <Box sx={{ marginTop: 2 }}>
        {activeTab === 0 && renderColumn(pendingRequests, pendingPage, pendingTotalPages, setPendingPage)}
        {activeTab === 1 && renderColumn(approvedRequests, approvedPage, approvedTotalPages, setApprovedPage)}
        {activeTab === 2 && renderColumn(rejectedRequests, rejectedPage, rejectedTotalPages, setRejectedPage)}
            </Box>     
       
       </Box>
     
    
    );
}
export default Checker;