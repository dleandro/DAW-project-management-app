import React from "react";
import { MDBContainer, MDBInput, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBIcon, MDBBadge } from "mdbreact";

export default function StateForm({ project, addNewState, state }) {
    const [newState, setNewState] = React.useState('');
    const [toggled, toggle] = React.useState(false);

    const [displayState, setDisplay] = React.useState(state);

    const addState = () => {
        addNewState(newState)
        setDisplay(newState)
        toggle(false)
    }
    return (
        <MDBContainer>
            <MDBBadge pill color={'secondary'} >{displayState}</MDBBadge>
            {project ? <button onClick={() => toggle(true)} type="button" className="btn btn-outline-secondary waves-effect">Change State</button> : null}
            <MDBModal isOpen={toggled} toggle={() => toggle(false)} size="md" cascading>
                <MDBModalHeader toggle={() => toggle(false)} titleClass="d-inline title" className="text-center light-blue darken-3 white-text">
                    <MDBIcon icon="pencil-alt" />
                    States
                </MDBModalHeader>
                <MDBModalBody>
                    <MDBInput type="textarea" value={newState} onChange={e => setNewState(e.target.value)} icon="pencil-alt" iconClass="dark-grey" />
                    <div className="text-center mt-1-half">
                        <MDBBtn color="danger" className="mb-2" onClick={addState}>
                            Add
                            <MDBIcon icon="fas fa-plus-circle" className="ml-1" />
                        </MDBBtn>
                    </div>
                </MDBModalBody>
            </MDBModal>
        </MDBContainer>
    );
}
