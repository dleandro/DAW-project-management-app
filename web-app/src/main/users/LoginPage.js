import React, { useContext, useState } from 'react'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBAlert } from 'mdbreact';
import UserContext from './UserContext'
import GoogleButton from 'react-google-button'

import 'mdbreact/dist/css/mdb.css';
import 'bootstrap-css-only/css/bootstrap.min.css';

const LoginForm = ({ userService}) => {

    const ctx = useContext(UserContext)

    const [username, setUsername] = useState(undefined)
    const [password, setPassword] = useState(undefined)
    const [userError, setError] = useState(undefined)

    const loginUser = (_) => {

        try {
            if (username && password) {
                userService.loginUser({ "username": username, "password": password })
                return
            }

            setError("Please insert username and password first")
        }
        catch (error) {
            handleIssueServiceError(error)
        }
    }

    const googleLogin = async (_) => {
        await ctx.userManager.signinRedirect()
    }

    const handleIssueServiceError = (error) => {
        console.error(error)

        console.error("Could not reach the API or the user doesn't exist")
    }

    return (

        <React.Fragment>

            {
                userError &&
                <MDBAlert color="dark" dismiss>
                    {userError}
                </MDBAlert>
            }

            <MDBContainer className="d-flex justify-content-center pl-5 pt-5 pb-5">
                <MDBRow>
                    <MDBCol md="12">
                        <form>
                            <p className="h5 text-center mb-4">Log in</p>
                            <div className="grey-text">
                                <MDBInput onChange={(e) => setUsername(e.target.value)} label="Type your username" icon="envelope" group type="email" validate error="wrong"
                                    success="right" />
                                <MDBInput onChange={(e) => setPassword(e.target.value)} label="Type your password" icon="lock" group type="password" validate />
                            </div>
                            <div className="text-center">
                                <MDBBtn onClick={loginUser}> Login </MDBBtn>
                            </div>
                        </form>
                        <GoogleButton onClick={googleLogin} />
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </React.Fragment>

    )

}

export default LoginForm;
