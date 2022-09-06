import React from "react";
import { MDBContainer, MDBCol } from "mdbreact";
import { Table } from "semantic-ui-react";


export default function IssuesPage({ usersIssues }) {
    const headers = ['Id', 'Name', 'Creation Date', 'Description', 'State', 'Labels', 'Comments', 'Delete'].map(head => <Table.HeaderCell key={head} >{head}</Table.HeaderCell>)

    const issueToLine = issue => {
        if (issue) {
            return (
                <Table.Row>
                    <Table.Cell>{issue.id}</Table.Cell>
                    <Table.Cell>{issue.name}</Table.Cell>
                    <Table.Cell>{issue.creationDate}</Table.Cell>
                    <Table.Cell>{issue.description}</Table.Cell>
                </Table.Row>
            )
        }
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
                    {usersIssues && usersIssues.map(issueToLine)}
                </Table.Body>
            </Table>
        </MDBContainer>
    );
}