import { Nav, Navbar } from 'react-bootstrap';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import Login from '../Auth/Login';
import Signup from '../Signup/Signup';
import Logout from '../Auth/Logout';

const Navigation = () => {
    const { isAuthenticated } = useSelector(state => state.login);
    const [modalAuthShow, setModalAuthShow] = useState(false);
    const [modalRegistrationShow, setModalRegistrationShow] = useState(false);
    const [expanded, setExpanded] = useState(false);
    return (
        <>
            <Navbar
                sticky="top"
                expand="sm"
                expanded={expanded}
                onClick={() => setExpanded(!expanded)}>
                <Navbar.Brand
                    as={Link}
                    to="/">
                    Word coach app
                </Navbar.Brand>
                <Navbar.Toggle
                    aria-controls="basic-navbar-nav" />
                <Navbar.Collapse
                    className="justify-content-end mx-3"
                    id="basic-navbar-nav">
                    {!isAuthenticated ?
                        <Nav
                            variant="tabs">
                            <Nav.Link
                                onClick={() => setModalAuthShow(true)}>
                                Login</Nav.Link>
                            <Nav.Link
                                onClick={() => setModalRegistrationShow(true)}>
                                Signup</Nav.Link>
                        </Nav>
                        : <Nav
                            variant="tabs">
                            <Nav.Link
                                as={NavLink}
                                to="/dictionary"
                                className={({ isActive }) => (isActive ? 'active' : '')}>
                                My dictionary
                            </Nav.Link>
                            <Nav.Link
                                onClick={Logout}>
                                Logout
                            </Nav.Link>
                        </Nav>}
                </Navbar.Collapse>
            </Navbar>
            <Signup
                show={modalRegistrationShow}
                onHide={() => setModalRegistrationShow(false)}
            />

            <Login
                show={modalAuthShow}
                onHide={() => setModalAuthShow(false)}
            />
        </>
    );
}

export default Navigation;