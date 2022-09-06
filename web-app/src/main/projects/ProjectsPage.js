import React from 'react';
import { Table } from 'semantic-ui-react';
import PopUpAddProject from './popUpAddProject';
import { MDBCol } from 'mdbreact';
import { useHistory, Link } from "react-router-dom";

const headers = ['Name', 'Description', 'State', 'Delete Project'].map(head => <Table.HeaderCell key={head} >{head}</Table.HeaderCell>);
export default function ProjectsPage({ projectService, sirenRes, usersProjects, setProjects }) {
    const history = useHistory();

    const deleteProject = async (prjName) => {
        console.log(sirenRes)
        const deletedResource = await projectService.deleteProject(sirenRes, prjName)
        setProjects({
            sirenResource: sirenRes
                .filter(res => res.properties.project.name !== deletedResource.properties.project.name),
            usersProjects: usersProjects
                .filter(prj => prj.name !== deletedResource.properties.project.name)
        })
    }

    const projectToLine = prj => {
        console.log(prj)
        var link = `projects/issues/${prj.name}`
        return (
            <Table.Row key={prj.name} >
                <Table.Cell><Link to={link}>{prj.name}</Link></Table.Cell>
                <Table.Cell>{prj.description}</Table.Cell>
                <Table.Cell>
                    <button className="ui primary button" onClick={() => history.push(`/projects/${prj.name}/states`)}>Project
                    States
                </button>
                </Table.Cell>
                <Table.Cell>
                    <button type="button" className="btn-circle danger" onClick={e => deleteProject(prj.name)}>
                        <i className="fa fa-times"></i>
                    </button>
                </Table.Cell>
            </Table.Row>

        )
    };

    const handleProjectServiceError = error => {
        console.log('Some bad happened:')
        console.error(error);
        return { errorMessage: 'Could not reach the API', projects: [''] };
    };

    const createNewProject = async (newProject) => {
        try {
            const createdProject = await projectService.createNewProject(newProject, sirenRes)
            setProjects({ sirenResource: [...sirenRes, createdProject], usersProjects: [...usersProjects, createdProject.properties.project] })

        }
        catch (error) {
            handleProjectServiceError(error)
        }
    }


    return (
        <React.Fragment>
            <Table >
                <Table.Header>
                    <Table.Row>
                        {headers}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {usersProjects && usersProjects.map(projectToLine)}
                </Table.Body>
            </Table>
            <MDBCol md='12' className='d-flex justify-content-center'>
                <PopUpAddProject postProject={createNewProject} />
            </MDBCol>
        </React.Fragment>
    );
}