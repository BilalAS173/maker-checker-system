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
    const { page=1, limit=10, search= "", status=""}=req.query;
    const offset= (page-1)*limit;
    const searchPattern= `%${search}%`
    const dataQuery= `
    Select r.request_id, r.description, r.status, r.days,
    r.created_date, u.name AS employee_name
    FROM requests r
    JOIN users u ON r.user_id=u.user_id
    WHERE r.project_id=?
    AND (u.name LIKE ? OR r.description LIKE ?)
    ORDER BY r.created_date DESC
    LIMIT ? OFFSET ?
    `;

    const countQuery= `
    SELECT COUNT(*) AS total
    FROM requests r
    JOIN users u ON r.user_id=u.user_id
    WHERE r.project_id= ?
    AND r.status=?
    AND (u.name LIKE ? OR r.description LIKE ?)
    `;

db.query(countQuery, [projectId, status,searchPattern, searchPattern], (err, countResults) => {
 if (err) {
    console.error(err);
    return res.status(500).json({error: "Database error"});
 }
    const totalCount= countResults[0].total;
    const totalPages= Math.ceil(totalCount/limit);

    db.query(dataQuery , [projectId, status, searchPattern, searchPattern, Number(limit), Number(offset)], (err, 
        dataResults) => {
            if (err) {
                console.error(err);
                return res.status(500).json({error: "Database error"});
            }
        
        res.json ({
            data: dataResults,
            totalCount, 
            page: Number(page),
            totalPages,
        });
    });
  });
});

//for login
app.post("/login", (req, res)=> {
    const{ employee_id, password}=req?.body;
    console.log("user details ", employee_id, password)

    const userQuery= "SELECT * FROM users WHERE employee_id = ? AND password = ?";
    db.query(userQuery, [employee_id, password], (err, userResults) =>
    {
        console.log("userResults", userResults)
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
    user_id: user.user_id,
    employee_id: user.employee_id,
    name: user.name,
    projects: projectResults,
});
        });
    });
});

//Post a request for Maker
app.post ("/requests", (req, res) => {
const {user_id, project_id, days, description}=req.body;
const query= "INSERT INTO requests (user_id, project_id, days, description) VALUES (?,?,?,?)";
db.query(query, [user_id, project_id, days, description], (err, result) => {
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