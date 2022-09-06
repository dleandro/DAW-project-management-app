import { useParams } from "react-router-dom";
import React from 'react';
import { MDBBtn, MDBCardTitle, MDBCol, MDBContainer, MDBRow } from "mdbreact";
import { Table } from "semantic-ui-react";
import { useCallback } from "react";

const headers = ['Possible State', 'Possible Transitions'].map(head => <Table.HeaderCell className={"text-center"} key={head} >{head}</Table.HeaderCell>);

const LabeledInput = ({ label, setValue }) => (<React.Fragment>
    <label htmlFor="defaultFormRegisterNameEx" className="grey-text">{label}</label>
    <input type="text" id="defaultFormRegisterNameEx" className="form-control" onChange={e => setValue(e.target.value)} /><br />
</React.Fragment>);


const FormPage = ({ withTransition, addState, addTransition }) => {
    const [state, setState] = React.useState('');
    const [transition, setTransition] = React.useState('');
    const submitRequest = () => withTransition ? addTransition({ state: state, stateTransitions: transition }) : addState(state);
    return (

        <MDBCol md="6">
            <form>
                <p className="h4 text-center mb-4">{withTransition ? 'Add Transition' : 'Add State'}</p>
                <LabeledInput label={'Your state'} setValue={val => setState({ presentState: val })} />
                {withTransition ? <LabeledInput label={'Your Transition'} setValue={val => setTransition([{ presentState: val }])} /> : undefined}
                <div className="text-center mt-4">
                    <MDBBtn color="unique" type="submit" onClick={submitRequest}>
                        Send
                            </MDBBtn>
                </div>
            </form>
        </MDBCol>
    );
};



const stateToArray = (state) => {
    const possibleStates = state.possibleStates.map(s => s.presentState);
    return possibleStates.map(st => (
        {
            state: st,
            transitions: state.possibleTransitions.filter(tran => tran.state.presentState === st).flatMap(trans => trans.stateTransitions).map(t => t.presentState)
        }));
}

export default function ProjectStates({ sirenRes, projectService }) {
    const { projectName } = useParams();
    const [fieldsValues, setFieldsValues] = React.useState({ states: '', errorMessage: undefined });
    const fetchStates = useCallback((serv) => serv.getSpecificProjectBySirenRes(sirenRes, projectName).then(sirenData => sirenData.properties.project.projectsState), [projectName, sirenRes])

    React.useEffect(() => {
        Promise.resolve(projectService)
            .then(fetchStates)
            .then(data => ({ states: stateToArray(data), errorMessage: undefined, sirenResource: sirenRes }))
            .catch(err => handleProjectServiceError(err))
            .then(values => setFieldsValues(val => values));

    }, [setFieldsValues, projectService, sirenRes, fetchStates]);

    const handleProjectServiceError = error => {
        console.log('Some bad happened:')
        console.error(error);
        return { errorMessage: 'Could not reach the API', projects: [] };
    }

    const postState = (state) => {
        console.log('Posting state: ', state)
        projectService.addState(state, sirenRes, projectName)
    }
    const postTransition = (tran) => {
        projectService.addTransition(tran, sirenRes, projectName)
    }
    const stateToLine = (state) => {
        return (<Table.Row>
            <Table.Cell><p className="text-primary px-2 font-weight-bold">{state.state}</p></Table.Cell>
            <Table.Cell>
                {state.transitions.map(tran => <li className="list-group-item mx-auto w-50">
                    <ul class="list-group list-group-horizontal mx-auto">
                        <p className="text-primary px-2 font-weight-bold">{state.state}</p>
                        <i className="far px-2 py-1 fa-arrow-alt-circle-right text-success font-weight-bold" />
                        <p className="text-default px-2 font-weight-bold">{tran}</p>
                    </ul>
                </li>)}
            </Table.Cell>
        </Table.Row>)
    }

    return (
        <React.Fragment>
            <MDBCardTitle className="mx-auto text-center float-none white z-depth-1 py-2 px-2">{projectName}</MDBCardTitle>
            <MDBContainer>
                <MDBRow>
                    <FormPage withTransition={true} addTransition={postTransition} />
                    <FormPage withTransition={false} addState={postState} />
                </MDBRow>
            </MDBContainer>
            <Table >
                <Table.Header>
                    <Table.Row>
                        {headers}
                    </Table.Row>
                </Table.Header>
                <Table.Body className={"text-center"}>
                    {fieldsValues.states ? fieldsValues.states.map(stateToLine) : undefined}
                </Table.Body>
            </Table>
        </React.Fragment>
    );
}
