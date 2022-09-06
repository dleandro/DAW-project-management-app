import React from "react";
import { MDBContainer, MDBInput, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBIcon, } from "mdbreact";
import CardWithInputs from "../common/jsx-elements/CardWithInputs";
import UserContext from '../users/UserContext'
import { useContext } from "react";
import { useState } from "react";


export default function PopUpAddProject(props) {
    const ctx = useContext(UserContext)
    const [stateCount, setStateCount] = useState(2)
    const [modal, setModal] = useState(false)
    const [inputState, setInputStates] = useState('')
    const [projectName, setprojectName] = useState('')
    const [description, setDescription] = useState('')
    const [states, setStates] = useState([])

    const refactorStates = (state) => {
        const possibleStates = state.map(elem => ({ presentState: elem.stateName }));
        const possibleTransitions = state.map(elem => ({ state: { presentState: elem.stateName }, stateTransitions: elem.transitions.map(tran => ({ presentState: tran })) }));
        return { possibleStates: possibleStates, possibleTransitions: possibleTransitions }
    }

    const toggle = () => {
        console.log(modal)
        setModal(!modal);
    };

    const setInputState = (e) => setInputStates(e.target.value)

    const addStateInput = () => setStates([...states, { id: setStateCount(stateCount + 1), stateName: inputState, transitions: [''] }]);

    const updateState = (stateIndex, values) => {
        var temp = states
        temp[stateIndex].transitions = values
        setStates(temp)
    }

    return (
        <MDBContainer>
            <MDBBtn onClick={toggle} className="mx-auto">
                Add Project
                </MDBBtn>
            <MDBModal isOpen={modal} toggle={toggle} size="md" cascading>
                <MDBModalHeader toggle={toggle} titleClass="d-inline title" className="text-center light-blue darken-3 white-text">
                    <MDBIcon icon="pencil-alt" />
                        Create a Project
                    </MDBModalHeader>
                <MDBModalBody>
                    <MDBInput label="Project name" onChange={(e) => setprojectName(e.target.value)} />
                    <MDBInput iconClass="dark-grey" label="Description" type="textarea" background onChange={(e) => setDescription(e.target.value)} />
                    <h3>Possible States For This Project's Issues</h3>
                    {states.map((state, idx) =>
                        <CardWithInputs key={state.stateName} initialValues={state.transitions} updateValues={(val) => updateState(idx, val)} title={state.stateName} subTitle={state.id} inputLabel={'Possible Transition'} />
                    )}

                    <MDBInput label="New State" onChange={setInputState} type="textarea" rows="2" icon="pencil-alt" iconClass="dark-grey" />

                    <MDBBtn outline color="danger" onClick={addStateInput}>Add State</MDBBtn>
                    <div className="text-center mt-1-half">
                        <MDBBtn color="info" className="mb-2" onClick={() => { toggle(); props.postProject({ name: projectName, description, users: { items: [ctx.user.username] }, projectsState: refactorStates(states) }) }}>
                            send
                                <MDBIcon icon="paper-plane" className="ml-1" />
                        </MDBBtn>
                    </div>
                </MDBModalBody>
            </MDBModal>
        </MDBContainer>
    );
}
