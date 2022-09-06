import React from "react";
import { MDBContainer, MDBCol } from "mdbreact";
import { Table } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import StateForm from './StateForm'
import LabelForm from './LabelForm'
import CommentPopUp from './CommentPopUp'
import AddIssuePopUp from './AddIssuesPopUp'

export default function ProjectsIssues({ issueService, sirenRes, usersProjects, usersIssues }) {
    const project = useParams().project
    const [fieldsValues, setFieldsValues] = React.useState({ issues: [], errorMessage: undefined, sirenResource: sirenRes });
    const headers = ['Id', 'Name', 'Creation Date', 'Description', 'State', 'Labels', 'Comments', 'Delete'].map(head => <Table.HeaderCell key={head} >{head}</Table.HeaderCell>)

    // Get specific project's issues
    React.useEffect(() => {

        setFieldsValues({ issues: usersIssues ? usersIssues.filter(issue => issue.project.name === project) : [], updatedSirenRes: sirenRes })

    }, [usersIssues, project, sirenRes]);

    const handleIssueServiceError = error => {
        console.log('Some bad happened:')
        console.error(error);
        return { errorMessage: 'Could not reach the API', issues: [] };
    }

    const deleteIssue = async (issueId) => {
        const deletedResource = await issueService.deleteIssue(issueId, fieldsValues.sirenResource)
        setFieldsValues({
            sirenResource: fieldsValues.sirenResource
                .filter(res => res.properties.issue.id !== deletedResource.properties.issue.id),
            issues: fieldsValues.issues
                .filter(issue => issue.id !== deletedResource.properties.issue.id)
        })
    }

    const addLabel = (issueId, label) => {
        issueService.addLabel({ presentLabel: label }, fieldsValues.sirenResource, issueId)
    }

    const addState = (issueId, state) => {
        issueService.addState({ presentState: state }, fieldsValues.sirenResource, issueId)
    }

    const issueToLine = issue => {
        if (issue) {
            return (
                <Table.Row>
                    <Table.Cell>{issue.id}</Table.Cell>
                    <Table.Cell>{issue.name}</Table.Cell>
                    <Table.Cell>{issue.creationDate}</Table.Cell>
                    <Table.Cell>{issue.description}</Table.Cell>
                    <Table.Cell><StateForm project={project} addNewState={state => addState(issue.id, state)} state={issue.state ? issue.state.presentState : 'No state available'} /></Table.Cell>
                    <Table.Cell><LabelForm project={project} addNewLabel={(label) => addLabel(issue.id, label)} label={issue.labels} /></Table.Cell>
                    <Table.Cell>{issue.comments ? <CommentPopUp project={project} comments={issue.comments.items} addComment={(newComment) => addComment(issue.id, newComment)} /> : 'No comments available'}</Table.Cell>
                    <Table.Cell>
                        <button type="button" className="btn-circle danger" onClick={e => deleteIssue(issue.id)}><i className="fa fa-times"></i></button>
                    </Table.Cell>
                </Table.Row>
            )
        }
    };

    const addComment = (id, newComment) => {
        issueService.addComment(fieldsValues.sirenResource.find(elem => elem.properties.issue.id === id), { items: [newComment] });
        fieldsValues.issues.find(issue => issue.id === id).comments.items.push(newComment)
    }

    const updateStateWithIssues = (addedIssueSirenResource) => {
        setFieldsValues( { issues: [...(fieldsValues.issues), addedIssueSirenResource.properties.issue], sirenResource: [sirenRes, addedIssueSirenResource] } )
    };

    return (
        <MDBContainer>
            <MDBCol md='12' className='d-flex justify-content-center'>
            </MDBCol>

            <Table >
                <Table.Header>
                    <Table.Row>
                        {headers}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {fieldsValues.issues.map(issueToLine)}
                </Table.Body>
            </Table>
            <AddIssuePopUp projectName={project} possibleStates={usersProjects ? usersProjects.find(prj => prj.name === project).projectsState.possibleStates : []} sirenRes={sirenRes} issueService={issueService} renderNewValues={updateStateWithIssues} />
        </MDBContainer>
    );
}
