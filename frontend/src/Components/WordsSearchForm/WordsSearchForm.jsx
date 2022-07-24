import { useState } from 'react';
import { Button, Form, Col, Row, Spinner } from 'react-bootstrap';

import getTranslate from '../../Services/TranslatorService';

const WordsSearchForm = () => {
    const [word, setWord] = useState(null);
    const [translated, setTranslated] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getData = async (word) => {
        setIsLoading(true);
        const data = await getTranslate(word);
        setTranslated(data);
        setIsLoading(false);
    }

    return (
        <Form>
            <Row style={{ "maxHeight": "15vh", "minHeight": "15vh" }} className='d-flex justify-content-center align-items-end'>
                <Col xs={10} md={5} lg={3}>
                    {(!isLoading && !translated) && <div><p className='h5'>Write a word in <br /> <mark>English</mark> or <mark>Ukrainian</mark> </p></div>}
                    {isLoading && <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>}
                    {translated && <ShowTranslatedResult result={translated} />}
                </Col>
            </Row>
            <Row style={{ "minHeight": "35vh" }} className='d-flex justify-content-center align-items-center mb-5'>
                <Col xs={10} md={5} lg={3}>
                    <Form.Group className="my-2">
                        <Form.Control size="lg" type="text" placeholder="Add a word..." onChange={(e) => setWord(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button className={`col-sm-5 ${isLoading && "disabled"}`} type="submit" variant="warning" size="lg" onClick={(e) => {
                        e.preventDefault();
                        getData(word);
                    }}>Submit</Button>
                </Col>
            </Row>
        </Form>
    )
}

const ShowTranslatedResult = ({ result }) => {
    if (result) {
        return (
            <div>
                {result.language === 'en' ?
                    <p className='h4'>{result.enWord} - <strong><mark>{result.ukWord}</mark></strong></p> :
                    <p className='h4'>{result.ukWord} - <strong><mark>{result.enWord}</mark></strong></p>}
                <a className="btn btn-link btn-sm" href="#">add to dictionary</a>
            </div>
        )
    }
}

export default WordsSearchForm;
