require("dotenv").config()
const express = require("express");
const cors= require("cors");
const db= require("./db");
const app = express();
const PORT = process.env.PORT || 5000 ;

app.use(cors());
app.use(express.json());

const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

//get all requests for a project
app.get("/requests/:projectId", verifyToken, (req, res) => {
    const { projectId }=req.params;
    const { page=1, limit=10, search= "", status=""}=req.query;
    const offset= (page-1)*limit;
    const searchPattern= `%${search}%`;
    const statusPattern= status === "" ? "%" : status;
    const dataQuery= `
    Select r.request_id, r.description, r.status, r.days,
    r.created_date, u.name AS employee_name
    FROM requests r
    JOIN users u ON r.user_id=u.user_id
    WHERE r.project_id=?
    AND r.status LIKE ?
    AND (u.name LIKE ? OR r.description LIKE ?)
    ORDER BY r.created_date DESC
    LIMIT ? OFFSET ?
    `;

    const countQuery= `
    SELECT COUNT(*) AS total
    FROM requests r
    JOIN users u ON r.user_id=u.user_id
    WHERE r.project_id= ?
    AND r.status LIKE ?
    AND (u.name LIKE ? OR r.description LIKE ?)
    `;

db.query(countQuery, [projectId, statusPattern,searchPattern, searchPattern], (err, countResults) => {
 if (err) {
    console.error(err);
    return res.status(500).json({error: "Database error"});
 }
    const totalCount= countResults[0].total;
    const totalPages= Math.ceil(totalCount/limit);

    db.query(dataQuery , [projectId, statusPattern, searchPattern, searchPattern, Number(limit), Number(offset)], (err, 
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
app.post("/login", async (req, res)=> {
    const{ employee_id, password}=req?.body;
    console.log("user details ", employee_id, password)

    const userQuery= "SELECT * FROM users WHERE employee_id = ?";
    db.query(userQuery, [employee_id], async (err, userResults) =>
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
        const passwordMatches= await bcrypt.compare(password, user.password)

        if (!passwordMatches) {
            return res.status(401).json({error: "Invalid Employee ID or password"});
        }

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
        
        const token= jwt.sign(
            {user_id: user.user_id, employee_id: user.employee_id, name: user.name},
            process.env.JWT_SECRET,
            {expiresIn: "30m"}
        );

   res.json({
    token,
    user_id: user.user_id,
    employee_id: user.employee_id,
    name: user.name,
    projects: projectResults,
});
        });
    });
});

function verifyToken(req, res, next) {
    const authHeader=req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "No token provided"});
    }
    const token=authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({error: "Invalid or expired token"});
        }
        req.user=decoded;
        next();
    });
}

function requireCheckerRole (req, res, next) {
    const {requestId} = req.params; //see inside req.params obj, see the property user_id and store it's value inside the variable named same as the property
    const {user_id} = req.user; //see inside req.user obj, see the property user_id and store it's value inside the variable named same as the property

    const query= ` 
        SELECT EXISTS (
        SELECT 1
        FROM requests r
        JOIN user_projects up ON r.project_id=up.project_id
        WHERE r.request_id= ?
        AND up.user_id= ?
        AND up.role='checker'
        ) AS authorized
    `;

    db.query(query, [requestId, user_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error:"Database error"});
        }
        const isAuthorized=results[0].authorized===1;
        if (!isAuthorized) {
            return res.status(403).json({error: "You are not authorized to perform this action."});
        }
        next();
    })

}

//Post a request for Maker
app.post ("/requests", verifyToken, requireMakerRole, (req, res) => {
const {project_id, days, description}=req.body;
const user_id= req.user.user_id;
const query= "INSERT INTO requests ( user_id, project_id, days, description) VALUES (?,?,?,?)";
db.query(query, [user_id, project_id, days, description], (err, result) => {
if(err) {
    console.error(err);
    return res.status(500).json({error: "Database Error"});
    }
res.json({success: true, request_id: result.insertId});
});
});

function requireMakerRole(req, res, next) {
    const {project_id} = req.body;
    const {user_id} = req.user;

    const query= `
        SELECT EXISTS (
        SELECT 1 
        FROM user_projects up
        WHERE up.project_id=?
        AND up.user_id=?
        AND up.role='maker'
        ) AS authorized
    `;

    db.query( query, [project_id, user_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: "Database error"});
        }
        const isAuthorized= results[0].authorized===1;
        if (!isAuthorized) {
            return res.status(403).json({error: "You are not allowed to submit a request for this project"})
        }
        next();
    });
}

//Patch a request's status (used by Checker's Approve/Reject buttons)
app.patch("/requests/:requestId", verifyToken, requireCheckerRole, (req, res) => {
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