import { useState } from 'react'
import { Button } from "@mui/material";
import Maker from "./components/Maker";
import './App.css'
import Login from './components/Login'
import Checker from "./components/Checker";
import ProjectSelect from './components/ProjectSelect';
import Layout from './components/layout'
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom'

function App() {
  const [user, setUser] = useState(null);
  const [selectedProject, setSelectedProject]=useState(null);
  const navigate=useNavigate();

  function handleLogin(matchedUser) {
    setUser(matchedUser);
    navigate("/projects");
  }
  function handleProjectSelect(project) {
    setSelectedProject(project);
    if (project.role === "maker" ) {
      navigate("/maker");
    }
    else {
       navigate("/checker");
    }
    }
  
  function handleLogout() {
        setUser(null);
        setSelectedProject(null);
        navigate("/login");
    }

  return (
      <Routes>
         <Route path="/login" element={<Login onLogin={handleLogin}></Login>}>
         </Route>

         <Route path="/projects"
         element={
          user ? ( <ProjectSelect user={user} onSelectProject={handleProjectSelect}></ProjectSelect>) 
          : (
            <Navigate to="/login" />
          )
         }
         >

         </Route>
         <Route path="/maker" element={
          user && selectedProject ? (
            <Layout user={user} onLogout={handleLogout}>
            <Maker project={selectedProject} user={user}></Maker>
            </Layout>
          ) : (
            <Navigate to="/login"></Navigate>
          )
         }
      />
         <Route path="/checker"
         element={
          user && selectedProject ? (
            <Layout user={user} onLogout={handleLogout}>
              <Checker user={user} project={selectedProject}></Checker>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
         }
         />

       
      </Routes>
      
  );
}

export default App
