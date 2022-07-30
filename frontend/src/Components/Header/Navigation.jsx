import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useState } from 'react';
import Login from '../Auth/Login';
import Signup from '../Signup/Signup';
import Logout from '../Auth/Logout';

const Navigation = () => {
    const [modalAuthShow, setModalAuthShow] = useState(false);
    const [modalRegistrationShow, setModalRegistrationShow] = useState(false);
    return (
        <>
            <Navbar bg="light" className='mt-5'>
                <Navbar.Brand href="/">Word coach app</Navbar.Brand>
                <Nav>
                    <Nav.Link href="/dictionary">
                        Dictionary
                    </Nav.Link>
                </Nav>
                <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                    <Nav className="">
                        <NavDropdown title="John Dou" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={Logout}>
                                Logout
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => setModalAuthShow(true)}>
                                Login
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => setModalRegistrationShow(true)}>
                                Registration
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
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