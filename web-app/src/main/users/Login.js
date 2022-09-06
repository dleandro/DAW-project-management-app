import React, { Component } from 'react'
import UserContext from './UserContext'
import { UserManager } from 'oidc-client'
var jwt = require('jsonwebtoken');


const userManager = new UserManager({
    authority: "https://accounts.google.com/.well-known/openid-configuration",
    client_id: "520137707887-msolgh01v2plakggg8j2jq74numsl1hc.apps.googleusercontent.com",
    redirect_uri: "http://localhost:3000/login/callback",
    scope: "profile"
})

class Login extends Component {

    // Context state
    state = {
        user: { username: undefined, password: undefined },
        setUser: (newUser) => this.setState(_ => ({ user: newUser })),
        userManager
    }

    async componentDidMount(prevProps, prevState) {
        const authenticatedUser = await userManager.getUser()

        if (authenticatedUser) {

            this.state.setUser({ username: jwt.decode(authenticatedUser.id_token).name })

        }
    }

    render() {
        return (
            <UserContext.Provider value={this.state}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export default Login