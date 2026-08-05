import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
    Box, Typography, TextField, Button, InputAdornment, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
//import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"
import { logout } from "../store/userSlice";
import { clearProject } from "../store/projectSlice";
import { useNavigate } from "react-router-dom";
import { LoginResponse, Project } from "./Login";

export interface RequestData {
    request_id: number;
    employee_name: string;
    days: number;
    description: string;
    status: number;
}

export interface RequestsResponse {
    data: RequestData [];
}

function Maker () {

const user= useSelector((state : {user: LoginResponse}) => state.user);
const project= useSelector((state: {project: Project}) => state.project);
const dispatch = useDispatch();
const navigate = useNavigate();

const [days, setDays]=useState("");
const [reason, setReason]=useState("");
const [view, setView]=useState("list")
const [searchTerm, setsearchTerm]=useState("")
const [requests, setRequests]=useState<RequestData[]>([])
const [searchInput, setsearchInput]= useState("");

useEffect( () => {
    loadMyRequests();
}, []
);

function handleAuthError(res : Response ): boolean {
    if (res.status===401 || res.status===403) {
        dispatch(logout());
        dispatch(clearProject());
        navigate("/login");
        return true;
    }
    else {
        return false;
    }
}

async function loadMyRequests() {
 try {
    const res= await fetch(`http://localhost:5000/requests/${project.project_id}`,
  { 
     headers:  {
        "Authorization" : `Bearer ${user.token}`
     },
    }
 );
 if (handleAuthError(res)) {
    return;
 }
    const response : RequestsResponse = await res.json();
    const mine = response.data.filter((r) => r.employee_name === user.name);
        setRequests(mine);
    }
        catch(err) {
            console.error(err)
        };
}

async function handleSubmit(e) {
  try { 
    e.preventDefault();
   const res :Response = await fetch("http://localhost:5000/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
            "Authorization" : `Bearer ${user.token}`
         },
        body: JSON.stringify({
            project_id: project.project_id,
            days,
            description: reason,
        }),
    });
        if (handleAuthError(res)) {
            return;
        }
        const response= await res.json()
           if (response.success) {
                setDays(" ");
                setReason(" ");
                loadMyRequests();
                setView("list");
                alert("Request submitted");
            } else {
                alert("Something went wrong when submitting the request");
            }
            
        } catch(err) {
            console.error(err);
            alert("Could not connect to server");
        };
}

    function isValidSearchTerm (value : string) {
        const allowedPattern= /^[a-zA-Z0-9 ][a-zA-Z0-9 ']*[a-zA-Z0-9 ]$|^[a-zA-Z0-9 ]?$/;
        return allowedPattern.test(value);
    }

    function handleSearchSubmit () {
        if (isValidSearchTerm(searchInput)) {
            setsearchTerm(searchInput);
        }
        else {
            alert("Search term contains invalid characters.");
        }
    }

const filteredRequests= requests.filter((r) => r.description.toLowerCase().includes(searchTerm.toLowerCase()) 
);
return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2, color: "white"}}>
            <TextField
                size="small"
                placeholder="Search Requests..."
                value={searchInput}
                onChange={(e) => {
                    const value= e.target.value;
                    setsearchInput(value);
                if (value=== "") {
                    setsearchTerm("");
                }
            }
               } 
                onKeyDown= {(e) => {
                    if (e.key==="Enter") {
                        handleSearchSubmit();
                    }
                }}
                
            />

            <IconButton onClick={handleSearchSubmit}>
            <SearchIcon />
             </IconButton>
            

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
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRequests.map((r, i) => (
                            <TableRow key={r.request_id}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{r.employee_name}</TableCell>
                                <TableCell>{r.days}</TableCell>
                                <TableCell>{r.description}</TableCell>
                                <TableCell>
                                    <Chip label={r.status}
                                        color={r.status === "Approved" ? "success" : r.status=="Rejected"
                                            ? "error" : "default"
                                        }
                                    >
                                    </Chip>
                                </TableCell>
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