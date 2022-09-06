import { Route, Switch } from "react-router-dom";
import ProjectsPage from "./ProjectsPage";
import React, { useContext } from "react";
import ProjectStates from "./ProjectStates";
import Issues from '../issues/Issues'
import UserContext from "../users/UserContext";

export default function Projects({ projectService, issueService }) {
    const [projects, setProjects] = React.useState({ errorMessage: undefined, sirenResource: undefined, usersProjects: undefined });
    const ctx = useContext(UserContext)
    const handleProjectServiceError = error => {
        console.error(error);
        return { errorMessage: 'Could not reach the API' };
    }

    // Fetch the authenticated user's projects
    React.useEffect(() => {

        const fetchData = async () => {

            try {
                const sirenResource = await projectService.getProjects()
                var usersProjects = projectService.convertToProjects(sirenResource)
                usersProjects = usersProjects.some(project => project !== undefined) ?
                    usersProjects
                        .filter(project => project.users.items.includes(ctx.user.username)) :
                    []

                setProjects({ sirenResource, usersProjects })
            } catch (error) {
                handleProjectServiceError(error)
            }

        }
        fetchData()
    }, [projectService, ctx]);

    return (
        <Switch id={'switch2'}  >
            <React.Fragment>

                <Route path={'/projects/issues'} component={() => <Issues issueService={issueService} usersProjects={projects.usersProjects} />} />
                <Route path={'/projects/:projectName/states'} exact component={() => <ProjectStates sirenRes={projects.sirenResource} projectService={projectService} usersProjects={projects.usersProjects} />} />
                <Route path={'/projects'} exact component={() => <ProjectsPage sirenRes={projects.sirenResource} projectService={projectService} usersProjects={projects.usersProjects} setProjects={setProjects} />} />

            </React.Fragment>

        </Switch>
    )
}