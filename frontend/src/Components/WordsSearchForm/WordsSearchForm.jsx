import { Button, Form, Col, Row } from 'react-bootstrap';

const WordsSearchForm = () => {
    return (
        <Form>
            <Row style={{ "minHeight": "50vh" }} className='d-flex justify-content-center align-items-center'>
                <Col xs={10} md={5} lg={3}>
                    <Form.Group className="mb-1">
                        <Form.Control size="lg" type="text" placeholder="Add a word..." />
                    </Form.Group>
                    <Button className='col-sm-5' type="submit" variant="warning" size="lg">Submit</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default WordsSearchForm;
