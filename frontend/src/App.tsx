import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from './store/userSlice';
import { selectProject, clearProject } from './store/projectSlice';
import Maker from "./components/Maker";
import './App.css';
import Login from './components/Login';
import Checker from "./components/Checker";
import ProjectSelect from './components/ProjectSelect';
import Layout from './components/layout';
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import {LoginResponse, Project} from './components/Login';

function App() {
  const user= useSelector((state : {user: LoginResponse | null}) => state.user);
  const dispatch= useDispatch();

  const selectedProject=useSelector((state : {project: Project | null}) => state.project);
  const navigate= useNavigate();

  function handleLogin(matchedUser : LoginResponse) {
    dispatch(login(matchedUser));
    navigate("/projects");
  }
  function handleProjectSelect(project : Project) {
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
