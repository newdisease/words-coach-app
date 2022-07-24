import { Form, Col, Row, Button, ProgressBar } from "react-bootstrap"
import { ArrowLeftCircle, ArrowRightCircle } from 'react-bootstrap-icons';


const QuizPage = () => {

    return (
        <>
            <p className="h2 my-3">Quiz</p>
            <div style={{ "maxWidth": "80vh" }} className="mx-auto">
                <ProgressBar
                    style={{ "minHeight": "25px", "maxWidth": "70vh" }}
                    className="my-3 mx-auto"
                    now="10"
                    label="1/10"
                />
                <Row
                    style={{ "minHeight": "15vh" }}>
                    <Col xs={2} md={2} lg={2} className="my-auto">
                        <ArrowLeftCircle className="text-primary" size={30} />
                    </Col>
                    <Col xs={8} md={8} lg={8}>
                        <p className="h3 mt-5 mb-2">дівчина</p>
                        <p className="h4 mt-2 mb-5"><strong>g i r l</strong></p>
                    </Col>
                    <Col xs={2} md={2} lg={2} className="my-auto">
                        <ArrowRightCircle className="text-primary" size={30} />
                    </Col>
                </Row>
                <Form>
                    <Row
                        style={{ "minHeight": "25vh" }}
                        className='d-flex justify-content-center align-items-center'
                    >

                        <Col xs={12} md={12} lg={12}>
                            <Form.Group className="mb-1 d-flex justify-content-center">
                                <Form.Control style={{ "maxWidth": "6vh" }} className="mx-1 text-center" type="text" maxLength="1" />
                                <Form.Control style={{ "maxWidth": "6vh" }} className="mx-1 text-center" type="text" maxLength="1" />
                                <Form.Control style={{ "maxWidth": "6vh" }} className="mx-1 text-center" type="text" maxLength="1" />
                                <Form.Control style={{ "maxWidth": "6vh" }} className="mx-1 text-center" type="text" maxLength="1" />
                                <Form.Control style={{ "maxWidth": "6vh" }} className="mx-1 text-center" type="text" maxLength="1" />
                            </Form.Group>
                            <Button className='col-sm-5 my-2' type="submit" variant="success" size="lg">Check</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    )
}

export default QuizPage;
