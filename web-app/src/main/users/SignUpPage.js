import React, { useState } from 'react'
import { MDBJumbotron, MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBInput, MDBAlert } from 'mdbreact';

import 'mdbreact/dist/css/mdb.css';
import 'bootstrap-css-only/css/bootstrap.min.css';



const SignUp = ({ userService }) => {

    const [username, setUsername] = useState(undefined)
    const [password, setPassword] = useState(undefined)
    const [userError, setError] = useState(undefined)

    const registerUser = async (_) => {

        try {
            if (username && password) {
                userService.registerUser({ "username":username, "password":password })
                return
            }

            setError("Please insert username and password first")
        }
        catch (error) {
            handleIssueServiceError(error)
        }
    }


    const handleIssueServiceError = (error) => {
        console.error(error)

        console.error("Could not reach the API")
    }

    return (

        <React.Fragment>


            {
                userError &&
                <MDBAlert color="dark" dismiss>
                    {userError}
                </MDBAlert>
            }

            <MDBJumbotron style={{
                backgroundImage: `url(https://suportetecnologia.net.br/wp-content/uploads/2019/09/Background.png)`, backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh'
            }}>

                <MDBContainer className="d-flex justify-content-left pt-5 pb-5">
                    <MDBRow>
                        <MDBCol md='6'>
                            <MDBCard
                                className='card-image'
                                style={{
                                    width: '28rem',
                                    backgroundImage: "url(https://mdbootstrap.com/img/Photos/Others/pricing-table7.jpg)"
                                }}>
                                <div className='text-white rgba-stylish-strong py-5 px-5 z-depth-4'>
                                    <div className='text-center'>
                                        <h3 className='white-text mb-5 mt-4 font-weight-bold'>
                                            <strong>SIGN </strong>
                                            <strong className='black-text'>UP</strong>
                                        </h3>
                                    </div>
                                    <MDBInput onChange={(e) => setUsername(e.target.value)} label='Your username' group type='text' validate labelClass='white-text' />
                                    <MDBInput onChange={(e) => setPassword(e.target.value)} label='Your password' group type='password' validate labelClass='white-text' />

                                    <MDBRow className='d-flex align-items-center mb-4'>
                                        <div className='text-center mb-3 col-md-12'>
                                            <MDBBtn
                                                color='white'
                                                rounded
                                                type='button'
                                                className='btn-block z-depth-1'
                                                onClick={registerUser}>
                                                Sign up
                                    </MDBBtn>
                                        </div>
                                    </MDBRow>
                                    <MDBCol md='12'>
                                        <p className='font-small white-text d-flex justify-content-end'>
                                            Already have an account?
                                    <a href='/login' className='black-text ml-1 font-weight-bold'>
                                                Log in
                                    </a>
                                        </p>
                                    </MDBCol>
                                </div>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                    <MDBContainer className="pt-5">
                        <h2 style={{ color: "black", float: "right", margin: 100, fontSize: 30 }} ><strong>Welcome to Daw project application</strong></h2>
                    </MDBContainer>
                </MDBContainer>

            </MDBJumbotron>
        </React.Fragment>

    )
}

export default SignUp
