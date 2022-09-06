import React from 'react';

import {MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBInputGroup} from "mdbreact";

function CardWithInputs(props) {
    const [fieldsValues, setFieldsValues] = React.useState(props.initialValues);

    const addInputBox = () =>setFieldsValues([...fieldsValues,'']);
    const removeInputBox= (index)=> {
        var temp = [...fieldsValues];
        temp.splice(index,1)
        setFieldsValues(temp);
    }
    const changeInputBoxValue= (i,evt)=> {
        var temp = [...fieldsValues];
        temp.splice(i,1,evt.target.value)
        setFieldsValues(temp);
    }

    React.useEffect(() => props.updateValues(fieldsValues), [fieldsValues, props]);

    return (
        <React.Fragment >
            <MDBCard>
                <MDBCardImage
                    className='blue-gradient white-text d-flex justify-content-center align-items-center flex-column p-4 rounded'
                    tag='div'
                >
                    <h2>{props.title}</h2>
                    <p>State Id: {props.subTitle}</p>
                </MDBCardImage>
                <MDBCardBody>
                    {fieldsValues.map((currElement, index)=>
                        <MDBInputGroup key={index} onChange={e=>changeInputBoxValue(index,e)} value={currElement?currElement:null} hint={props.inputLabel} containerClassName="mb-3"
                                       append={
                            <>
                                <MDBBtn color="danger" outline className="m-0 px-3 py-2 z-depth-0" onClick={e=>removeInputBox(index)}>
                                    Remove
                                </MDBBtn>
                            </>
                        }
                        />
                    )}
                    <MDBBtn outline color="info" onClick={addInputBox}>Add a Possible Transition From This State</MDBBtn>
                </MDBCardBody>
            </MDBCard>

        </React.Fragment>
    );
}
export default CardWithInputs;
