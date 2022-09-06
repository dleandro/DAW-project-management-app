import React, { useEffect } from "react";
import { MDBContainer, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBInput, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBIcon } from "mdbreact";

export default function AddIssuePopUp({ projectName, possibleStates, sirenRes, issueService, renderNewValues }) {

    const [toggled, toggle] = React.useState(false);
    const [issueName, setIssueName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [presentState, setPresentState] = React.useState('STATE');
    const addIssueAndClose = () => {
        const emptyLabel = { presentLabel: "" };
        const emptyComment = { items: [] };
        const newIssue = { projectsName: projectName, name: issueName, description: description, labels: emptyLabel, state: { presentState: presentState }, comments: emptyComment };
        issueService.addIssue(newIssue, sirenRes).then(t => renderNewValues(t));
        toggle(false);
    };

    useEffect(() => {

    })

    return (
        <MDBContainer>
            <MDBBtn onClick={() => toggle(true)} className="mx-auto">
                Add Issue
            </MDBBtn>
            <MDBModal isOpen={toggled} toggle={() => toggle(false)} size="md" cascading>
                <MDBModalHeader toggle={() => toggle(false)} titleClass="d-inline title" className="text-center light-blue darken-3 white-text">
                    <MDBIcon icon="pencil-alt" />
                    Create a Issue
                </MDBModalHeader>
                <MDBModalBody>
                    <MDBInput label="Issue Name" value={issueName} onChange={e => setIssueName(e.target.value)} />
                    <MDBInput iconClass="dark-grey" label="Description" type="textarea" background value={description} onChange={e => setDescription(e.target.value)} />
                    <MDBDropdown >
                        <MDBDropdownToggle caret color="dark-grey">
                            {presentState}
                        </MDBDropdownToggle>
                        <MDBDropdownMenu basic>
                            {
                                possibleStates
                                    .map(state => <MDBDropdownItem onClick={(e) => setPresentState(e.target.value)} value={state.presentState} > {state.presentState} </MDBDropdownItem>)
                            }
                        </MDBDropdownMenu>
                    </MDBDropdown>
                    <div className="text-center mt-1-half">
                        <MDBBtn color="info" className="mb-2" onClick={addIssueAndClose}>
                            send
                            <MDBIcon icon="paper-plane" className="ml-1" />
                        </MDBBtn>
                    </div>
                </MDBModalBody>
            </MDBModal>
        </MDBContainer>
    );
}