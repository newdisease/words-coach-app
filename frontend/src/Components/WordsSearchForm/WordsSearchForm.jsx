import { useState } from 'react';
import axios from 'axios';
import { Button, Form, Col, Row, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { WordsFormValidatorsSchema as schema } from './WordsFormValidators';
import { useSelector } from 'react-redux';
import getTranslate from '../../Services/TranslatorService';


const WordsSearchForm = () => {
    const [translated, setTranslated] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register, formState: { errors }, handleSubmit } = useForm({
        resolver: yupResolver(schema)
    });

    const getData = async ({ expression }) => {
        setIsLoading(true);
        const data = await getTranslate(expression);
        setTranslated(data);
        setIsLoading(false);
    }

    return (
        <>
            <Row style={{ "maxHeight": "20vh", "minHeight": "20vh" }}
                className='d-flex justify-content-center align-items-end'>
                <Col xs={10} md={5} lg={3}>
                    {(!isLoading && !translated) && <div><p className='h5'>Write a word in <br /> <mark>English</mark> or <mark>Ukrainian</mark> </p></div>}
                    {isLoading && <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>}
                    {translated && <ShowTranslatedResult result={translated} />}
                </Col>
            </Row>
            <Form onSubmit={handleSubmit(getData)}>
                <Row style={{ "minHeight": "35vh" }}
                    className='d-flex justify-content-center align-items-center mb-5'>
                    <Col xs={10} md={5} lg={3}>
                        <Form.Group className="my-2">
                            <Form.Control size="lg" type="text" placeholder="Add a word..." {...register("expression")}></Form.Control>
                            <p style={{ minHeight: "1.5em" }} className="text-danger">{errors.expression?.message}</p>
                            <Button className={`col-sm-5 ${(isLoading || errors.expression) && "disabled"}`} type="submit" variant="warning" size="lg">Translate</Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

const ShowTranslatedResult = ({ result }) => {
    const { isAuthenticated } = useSelector(state => state.login);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { ukWord, enWord } = result;

    const addWordToDB = () => {
        setIsLoading(true);
        axios.post("dictionary/", { uk_word: ukWord, en_word: enWord })
            .then(() => {
                setIsSuccess(true);
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                setIsError(true);
                throw error;
            });
    }

    if (result) {
        return (
            <>
                {result.language === 'en' ?
                    <p className='h4'>{result.enWord} - <strong><mark>{result.ukWord}</mark></strong></p> :
                    <p className='h4'>{result.ukWord} - <strong><mark>{result.enWord}</mark></strong></p>}
                {!isLoading ? <Button variant="link" size="sm" disabled={!isAuthenticated} onClick={addWordToDB}>add to dictionary</Button> :
                    <Button variant="link"><Spinner animation="border" size="sm" /></Button>}
            </>
        )
    }
}

export default WordsSearchForm;
