import React from "react";
import { MDBContainer, MDBInputGroup, MDBBtn, MDBIcon, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBBadge, } from "mdbreact";

export default function LabelForm({ project, addNewLabel, label }) {
    const possibleLabels = ['DEFECT', 'NEW_FUNCTIONALITY', 'EXPLORATION'];
    const taggedLabels = { DEFECT: 'warning', NEW_FUNCTIONALITY: 'info', EXPLORATION: 'default' };
    const [newLabel, setNewLabel] = React.useState('');
    const [inputLabel, setInputLabel] = React.useState('');

    const addLabel = () => {
        addNewLabel(newLabel)
        setInputLabel(<MDBBadge pill color={taggedLabels[newLabel]} >{newLabel}</MDBBadge>)
    }

    return (
        <MDBContainer>
            {project ?
                <MDBInputGroup containerClassName="mb-3" value={newLabel} onChange={e => setNewLabel(e.target.value)} append={<>
                    <MDBBtn outline color="info" className="m-0 px-2 py-0 mb-1 z-depth-0 rounded-0 ">LABELS</MDBBtn>
                    <MDBDropdown>
                        <MDBDropdownToggle outline color="info" size="md" className="m-0 px-2 z-depth-0 rounded-0">
                            <MDBIcon icon="caret-down" />
                        </MDBDropdownToggle>
                        <MDBDropdownMenu>{possibleLabels.map(tag => <MDBDropdownItem onClick={() => setNewLabel(tag)}>{tag}</MDBDropdownItem>)}</MDBDropdownMenu>
                    </MDBDropdown>
                    <MDBIcon className={'fa-3x green-text'} onClick={addLabel} icon="plus-circle" />
                </>
                } />
                : null}
            {inputLabel}
        </MDBContainer>
    );
}