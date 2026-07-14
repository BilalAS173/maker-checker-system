import { useState } from 'react'
import { Button } from "@mui/material";
import Maker from "./components/Maker";
import './App.css'
import Login from './components/Login'
import Checker from "./components/Checker";
import ProjectSelect from './components/ProjectSelect';

function App() {
  const [user, setUser] = useState(null)
  const [selectedProject, setSelectedProject]=useState(null)

  function handleLogin(matchedUser) {
    setUser(matchedUser);
  }
  function handleProjectSelect(project) {
    setSelectedProject(project);
    }
  
  function handleLogout() {
        setUser(null);
        setSelectedProject(null);
    }

  return (
      <div>
            {user === null && <Login onLogin={handleLogin} />}

            {user !== null && selectedProject === null && (
                <ProjectSelect user={user} onSelectProject={handleProjectSelect} />
            )}

            {selectedProject !== null && selectedProject.role === "maker" && (
                <Maker onLogout={handleLogout} project={selectedProject} user={user} />
            )}

            {selectedProject !== null && selectedProject.role === "checker" && (
                <Checker onLogout={handleLogout} project={selectedProject} user={user} />
            )}
        </div>
    
  );
}

export default App
