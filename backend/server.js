require("dotenv").config()
const express = require("express");
const cors= require("cors");
const db= require("./db");
const app = express();
const PORT = process.env.PORT || 5000 ;

app.use(cors());
app.use(express.json());

//get all requests for a project
app.get("/requests/:projectId", (req, res) => {
    const { projectId }=req.params;
    const query= `
    Select r.request_id, r.description, r.status,
    r.created_date, u.name AS employee_name
    FROM requests r
    JOIN users u ON r.user_id=u.user_id
    WHERE r.project_id=?
    ORDER BY r.created_date DESC
    `;

db.query(query, [projectId], (err, results) => {
 if (err) {
    console.error(err);
    return res.status(500).json({error: "Database error"});

 }  
 res.json(results); 
    });
});

//for login
app.post("/login", (req, res)=> {
    const{ employee_id, password}=req.body;
    const userQuery= "SELECT * FROM users WHERE employee_id = ? AND password = ?";
    db.query(userQuery, [employee_id, password], (err, userResults) =>
    {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database Error"});
        }
         if (userResults.length===0) {
            return res.status(401).json({ error: "Invalid Employee ID or password"});         
        }
        
        const user = userResults[0];
        const projectsQuery= `
        SELECT p.project_id, p.project_name, up.role
        FROM user_projects up
        JOIN projects p ON up.project_id=p.project_id
        WHERE up.user_id=?
        `;
        db.query(projectsQuery, [user.user_id], (err, projectResults) => 
        {
            if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database Error"});
        }
        res.json({
            user_id:user.user_id,
        employee_id:user.employee_id,
        name:user.name,
        projects: projectResults,
            });
        });
    });
});

//Post a request for Maker
app.post ("/requests", (req, res) => {
const {user_id, project_id, description}=req.body;
const query= "INSERT INTO requests (user_id, project_id, description) VALUES (?,?,?)";
db.query(query, [user_id, project_id, description], (err, result) => {
if(err) {
    console.error(err);
    return res.status(500).json({error: "Database Error"});
    }
res.json({success: true, request_id: result.insertId});
});
});


//Patch a request's status (used by Checker's Approve/Reject buttons)
app.patch("/requests/:requestId", (req, res) => {
    const {requestId} = req.params;
    const {status }=req.body;
    const query="UPDATE requests SET status = ? WHERE request_id= ?";
    db.query(query, [status, requestId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error : "Database error"});
        }
        res.json({success: true});
    });
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});