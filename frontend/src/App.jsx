import { useSelector, useDispatch } from 'react-redux';
//import { useState } from 'react';
import { login, logout } from './store/userSlice';
import { selectProject, clearProject } from './store/projectSlice';
import { Button } from "@mui/material";
import Maker from "./components/Maker";
import './App.css'
import Login from './components/Login'
import Checker from "./components/Checker";
import ProjectSelect from './components/ProjectSelect';
import Layout from './components/layout'
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom'

function App() {
  const user= useSelector((state) => user.state);
  const dispatch= useDispatch();

  const selectProject=useSelector((state) => project.state);
  const navigate= useNavigate();

  function handleLogin(matchedUser) {
    dispatch(login(matchedUser));
    navigate("/projects");
  }
  function handleProjectSelect(project) {
    dispatch(selectProject(project));
    if (project.role === "maker" ) {
      navigate("/maker");
    }
    else {
       navigate("/checker");
    }
    }
  
  function handleLogout() {
    dispatch(logout());
    dispatch(clearProject());
    navigate("/login");
    }

  return (
      <Routes>
         <Route path="/login" element={<Login onLogin={handleLogin} />}>
         </Route>

         <Route path="/projects"
         element={
          user ? ( <ProjectSelect onSelectProject={handleProjectSelect}></ProjectSelect>) 
          : (
            <Navigate to="/login" />
          )
         }
         >
         </Route>
         <Route path="/maker" element={
          user && selectedProject ? (
            <Layout onLogout={handleLogout} title={"View Requests"}>
            <Maker />
            </Layout>
          ) : (
            <Navigate to="/login"></Navigate>
          )
         }
      />
         <Route path="/checker"
         element={
          user && selectedProject ? (
            <Layout onLogout={handleLogout} title={"Approval Queue"}>
              <Checker />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
         }
         />
<Route path="*" element={<Navigate to="/login" />} />
       
      </Routes>
      
  );
}

export default App;
