import React from 'react'

/**
 * The context default value. 
 * 
 * I'm using it mostly for documentating the contract between the context provider and its consumers.
 * @property{object}  loginService - The login service instance.
 */
const UserContext = React.createContext()

export default UserContext