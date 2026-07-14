import {Box, Typography, Button, textFieldClasses} from "@mui/material"
function ProjectSelect({user, onSelectProject}) {
    return (
        <Box  
         sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                gap: 2,
            }}
        > 
            <Typography variant="h4"> Welcome, {user.name}</Typography>
            <Typography variant="body1" color="text.secondary"> Select a Project to continue, {user.name}</Typography>
            {user.projects.map((project) => (
                <Button
                key={project.project_id}
                variant="outlined"
             sx={{minwidth: 250}}
                onClick={() => onSelectProject(project)}
                >
                    {project.project_name} ({project.role})

                </Button>
            )
            )}

        </Box>
    );
}
export default ProjectSelect;