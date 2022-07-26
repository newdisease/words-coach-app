import { useState } from 'react';
import { Button, Form, Col, Row, Spinner } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import getTranslate from '../../Services/TranslatorService';

const schema = yup.object({
    expression: yup.string()
        .min(2, 'must be at least 2 characters long')
        .max(15, 'an expression is too long')
        .matches(/^([^\s]*[\s]?[^\s]*){0,2}$/, { message: "too many words in the expression" })
        .matches(/^[а-яА-ЯіІїЇa-zA-Z\s']+$/, { message: "only letters are allowed" }),
}).required();

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
            <Row style={{ "maxHeight": "15vh", "minHeight": "15vh" }}
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
