import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../../users/UserContext';
import { MDBNavbar, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBIcon, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdbreact';
import logo from '../util/daw.png'

const UpperBar = ({ username }) => {

    const items = [{ link: '/projects', text: 'Projects' }, { link: '/projects/issues', text: 'Issues' }];

    const history = useHistory()

    const ctx = useContext(UserContext)
    const loginButtonBehaviour = () => history.push('/login')


    return (
        <MDBNavbar color="white" dark expand="md">
            <MDBNavbarNav left>
                <button style={{ border: "none", outline: "none", backgroundColor: "white" }}>
                    <img src={logo} onClick={() => history.push('/')} alt="Logo" height="42" width="42" />
                </button>
            </MDBNavbarNav>

            <MDBNavbarNav style={{ visibility: ctx.user.username ? 'visible' : 'hidden' }}>
                {items.map(item => <MDBNavItem key={item.text}>
                    <MDBNavLink to={item.link} className="black-text">{item.text}</MDBNavLink>
                </MDBNavItem>)}
            </MDBNavbarNav>

            <MDBNavbarNav right>
                {
                    ctx.user.username ?
                        <React.Fragment>

                            <MDBDropdown >
                                <MDBDropdownToggle caret color="white">
                                    {ctx.user.username}
                                </MDBDropdownToggle>
                                <MDBDropdownMenu basic>
                                    <MDBDropdownItem onClick={(_) => {
                                        ctx.userManager.signoutRedirect()
                                        window.location.assign('/')
                                    }
                                    } > Logout</MDBDropdownItem>
                                </MDBDropdownMenu>
                            </MDBDropdown>

                        </React.Fragment> :
                        <button style={{ border: "none", outline: "none", backgroundColor: "white" }}>
                            <MDBIcon size="1x" icon="user" onClick={loginButtonBehaviour} />
                        </button>
                }
            </MDBNavbarNav>

        </MDBNavbar>
    )
}

export default UpperBar