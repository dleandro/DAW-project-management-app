import React from "react";
import { MDBContainer, MDBInput, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBIcon } from "mdbreact";

export default function CommentPopUp({ project, comments, addComment }) {
    const commentsToList = comm => <ul className="list-group">{comm.map(comment => <li className="list-group-item list-group-item-success">{comment}</li>)}</ul>;

    const [toggled, toggle] = React.useState(false);
    const [newComment, setComment] = React.useState('');
    const addCommentAndClose = () => {
        addComment(newComment);
        toggle(false);
    };

    return (
        <MDBContainer>
            <MDBBtn onClick={() => toggle(true)} className="mx-auto">
                View Comments
            </MDBBtn>
            <MDBModal isOpen={toggled} toggle={() => toggle(false)} size="md" cascading>
                <MDBModalHeader toggle={() => toggle(false)} titleClass="d-inline title" className="text-center light-blue darken-3 white-text">
                    <MDBIcon icon="pencil-alt" />
                    Comments
                </MDBModalHeader>
                <MDBModalBody>
                    {commentsToList(comments)}´
                    {project ?
                        <React.Fragment>
                            <MDBInput iconClass="dark-grey" label="New Comment" onChange={e => setComment(e.target.value)} type="textarea" background />
                            <div className="text-center mt-1-half">
                                <MDBBtn color="danger" className="mb-2" onClick={addCommentAndClose}>
                                    Add
                            <MDBIcon icon="fas fa-plus-circle" className="ml-1" />
                                </MDBBtn>
                            </div>
                        </React.Fragment>
                        : null}
                </MDBModalBody>
            </MDBModal>
        </MDBContainer>
    );
}