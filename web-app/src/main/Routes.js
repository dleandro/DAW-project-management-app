import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginPage from './users/LoginPage';
import SignUpPage from './users/SignUpPage'

import { getProjectService as ProjectService } from './projects/Service';
import { getIssueService as IssueService } from './issues/Service';
import { getUserService as UserService } from './users/Service';
import { getLinks } from './common/util/links';
import Projects from "./projects/Projects";

import LoginCallback from './users/LoginCallback'



function Routes({ homeInfo }) {

    // Do we have a link with the 'project' rel-type? If so, we are good to go.
    const isOnline = homeInfo && homeInfo.resources.project
    const projectService = !isOnline ? undefined :
        ProjectService(getLinks().API_BASE_URL + homeInfo.resources.project.href)

    // Do we have a link with the 'issue' rel-type? If so, we enable power control in the UI.
    const issueService = !homeInfo || !homeInfo.resources.issue ? undefined :
        IssueService(getLinks().API_BASE_URL + homeInfo.resources.issue.href)

    // Do we have a link with the 'user' rel-type? If so, we enable power control in the UI.
    const userService = !homeInfo || !homeInfo.resources.user ? undefined :
        UserService(getLinks().API_BASE_URL + homeInfo.resources.user.href)


    return (

        <Switch id={"switch"}  >
            <React.Fragment>

                <Route path={'/'} exact component={() => <SignUpPage userService={userService} />} />
                <Route path={'/projects'} component={() => <Projects projectService={projectService} issueService={issueService} />} />
                <Route path={'/login'} exact component={() => <LoginPage userService={userService} />} />
                <Route path={'/login/callback'} exact component={() => <LoginCallback userService={userService} />} />
                
            </React.Fragment>
        </Switch>

    );
}

export default Routes