import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Navigation = () => {
    return (
        <Navbar bg="light" className='mt-5'>
            <Navbar.Brand href="#">Word coach app</Navbar.Brand>
            <Nav>
                <Nav.Link href="#">
                    Dictionary
                </Nav.Link>
            </Nav>
            <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                <Nav className="">
                    <NavDropdown title="John Dou" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#">
                            Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Navigation;