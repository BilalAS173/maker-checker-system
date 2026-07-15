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
              <Layout user={user} onLogout={handleLogout}>
                <Maker onLogout={handleLogout} project={selectedProject} user={user} />
                </Layout>
            )}

            {selectedProject !== null && selectedProject.role === "checker" && (
              <Layout user={user} onLogout={handleLogout}>
                <Checker onLogout={handleLogout} project={selectedProject} user={user} />
                </Layout>
            )}
        </div>
    
  );
}

export default App
