import UserContext from './UserContext'
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
var jwt = require('jsonwebtoken');

export default function LoginCallback({ userService }) {

    const ctx = useContext(UserContext)
    const history = useHistory()

    useEffect(() => {

        const getUsers = async () => {
            const dbUsers = await userService.getUsers()

            if (dbUsers) {
                ctx.userManager.signinRedirectCallback()
                    .then(authenticatedUser => {
                        const userInfo = jwt.decode(authenticatedUser.id_token)
                        console.log(authenticatedUser)
                        if (!dbUsers.some(dbUser => dbUser.properties.user) || !dbUsers.some(dbUser => dbUser.properties.user.username === userInfo.username)) {
                            userService.registerUser({ username: userInfo.name, password: 'null' }, dbUsers)
                        }

                        console.log(userInfo.name)
                        ctx.setUser({ username: userInfo.name })
                    })
                    .catch(err => console.log(err))

            }
        }

        getUsers()

    }, [userService, ctx])

    return (
        <React.Fragment>
            {ctx.user.username && history.push('/projects')}
        </React.Fragment>)


}