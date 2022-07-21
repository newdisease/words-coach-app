import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useState } from 'react';
import ModalAuth from '../ModalUser/ModalAuth';
import ModalCreateAccount from '../ModalUser/ModalCreateAccount';

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
                            <NavDropdown.Item href="#">
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
            <ModalCreateAccount
                show={modalRegistrationShow}
                onHide={() => setModalRegistrationShow(false)}
            />

            <ModalAuth
                show={modalAuthShow}
                onHide={() => setModalAuthShow(false)}
            />
        </>
    );
}

export default Navigation;