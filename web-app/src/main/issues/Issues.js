import { Route, Switch } from "react-router-dom";
import React from "react";
import IssuesPage from "../issues/IssuesPage";
import ProjectsIssues from "./ProjectsIssues";

export default function Issues({ issueService, usersProjects }) {
    const [issues, setIssues] = React.useState({ errorMessage: undefined, sirenResource: undefined, usersIssues: undefined });

    const handleProjectServiceError = error => {
        console.error(error);
        return { errorMessage: 'Could not reach the API' };
    }

    // Fetch the authenticated user's created issues
    React.useEffect(() => {
        const fetchData = async () => {
            try {

                const sirenResource = await issueService.getIssues()
                var usersIssues = issueService.convertToIssues(sirenResource)
                usersIssues = usersIssues.some(issue => issue !== undefined) ?
                    usersIssues
                        .filter(issue => usersProjects
                            .some(project => issue.project.name === project.name)) :
                    []

                setIssues({ sirenResource, usersIssues })
            } catch (error) {
                handleProjectServiceError(error)
            }
        }

        fetchData()
    }, [issueService, usersProjects]);

    return (
        <Switch id={'switch2'}  >
            <React.Fragment>

                <React.Fragment>

                    <Route path={'/projects/issues'} exact component={() => <IssuesPage issueService={issueService} sirenRes={issues.sirenResource} usersIssues={issues.usersIssues} />} />
                    <Route path={'/projects/issues/:project'} exact component={() => <ProjectsIssues issueService={issueService} sirenRes={issues.sirenResource} usersProjects={usersProjects} usersIssues={issues.usersIssues} />} />

                </React.Fragment>

            </React.Fragment>
        </Switch>
    )
}