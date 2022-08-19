import { Nav, Navbar } from 'react-bootstrap';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { XLg } from 'react-bootstrap-icons'
import logout from '../Auth/Logout';

const LazyLogin = lazy(() => import('../Auth/LoginModal'));
const LazySignup = lazy(() => import('../Signup/SignupModal'));

const Navigation = () => {
    const { isAuthenticated } = useSelector(state => state.user);
    const [modalAuthShow, setModalAuthShow] = useState(false);
    const [modalRegistrationShow, setModalRegistrationShow] = useState(false);
    const [expanded, setExpanded] = useState(false);
    return (
        <>
            <Navbar
                expand="sm"
                expanded={expanded}
            >
                <Navbar.Brand
                    as={Link}
                    to="/">
                    Word coach app
                </Navbar.Brand>
                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    onClick={() => setExpanded(expanded ? false : "expanded")}
                    onBlur={() => setExpanded(false)}>
                    {expanded && <XLg size={30} />}
                </Navbar.Toggle>
                <Navbar.Collapse
                    className="justify-content-end mx-3"
                    id="basic-navbar-nav">
                    {!isAuthenticated ?
                        <Nav
                            variant="tabs">
                            <Nav.Link
                                onClick={() => {
                                    setModalAuthShow(true);
                                    setExpanded(false)
                                }
                                }>
                                Log In</Nav.Link>
                            <Nav.Link
                                onClick={() => {
                                    setModalRegistrationShow(true)
                                    setExpanded(false)
                                }
                                }>
                                Sign Up</Nav.Link>
                        </Nav>
                        : <Nav
                            variant="tabs">
                            <Nav.Link
                                as={NavLink}
                                to="/dictionary"
                                className={({ isActive }) => (isActive ? 'active' : '')}
                                onClick={() => {
                                    setExpanded(false)
                                }
                                }>
                                My dictionary
                            </Nav.Link>
                            <Nav.Link
                                onClick={() => {
                                    logout();
                                    setExpanded(false)
                                }
                                }>
                                Log Out
                            </Nav.Link>
                        </Nav>}
                </Navbar.Collapse>
            </Navbar>
            <Suspense fallback={<span className="visually-hidden">Loading...</span>}>
                <LazySignup
                    show={modalRegistrationShow}
                    onHide={() => setModalRegistrationShow(false)}
                />

                <LazyLogin
                    show={modalAuthShow}
                    onHide={() => setModalAuthShow(false)}
                />
            </Suspense>
        </>
    );
}

export default Navigation;