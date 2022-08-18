import { Row, Col, Button } from "react-bootstrap";

const ErrorPage = () => {
    return (
        <>
            <Row style={{ "minHeight": "50vh" }}
                className="d-flex justify-content-center align-items-center">
                <Col xs={10} md={9} lg={6} className="text-center">
                    <span className="display-1 d-block">404</span>
                    <div className="mb-4 lead">
                        The page you are looking for was not found.</div>
                    <Button className='col-sm-5'
                        type="submit" variant="primary" size="lg" href="/" >
                        To the main page</Button>
                </Col>
            </Row>
        </>
    )
}

export default ErrorPage;
