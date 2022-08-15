import { useState } from 'react';
import axios from 'axios';
import {
    Button, Form, Col, Row,
    Spinner, Alert
} from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { WordsFormValidatorsSchema as schema } from './WordsFormValidators';
import { useSelector, useDispatch } from 'react-redux';
import { changeCountOfWordsInProgress } from '../Auth/AuthSlice';
import getTranslate from '../../Services/TranslatorService';


const ActionsWithTranslatedResult = ({ result }) => {

    const { isAuthenticated, user } = useSelector(state => state.user);
    const [status, setStatus] = useState(null);
    const { ukWord, enWord } = result;

    const dispatch = useDispatch();

    const words_in_progress = user.words_in_progress;

    const addWordToDB = () => {
        setStatus("loading");
        axios.post("dictionary/", { uk_word: ukWord, en_word: enWord })
            .then(() => {
                setStatus("success");
                localStorage.setItem("user", JSON.stringify({ ...user, words_in_progress: words_in_progress + 1 }));
                dispatch(changeCountOfWordsInProgress(words_in_progress + 1));
            })
            .catch(error => {
                setStatus("error");
            });
    }

    const showResult = (status) => {
        switch (status) {
            case "loading":
                return <Button variant="link">
                    <Spinner animation="border" size="sm" />
                </Button>;
            case "success":
                return <Alert variant="success">
                    Word was added to the dictionary
                </Alert>;
            case "error":
                return <Alert variant="danger">
                    The word is already in the dictionary
                </Alert>;
            default:
                return <Button variant="link" size="sm"
                    disabled={!isAuthenticated} onClick={addWordToDB}>
                    add to dictionary
                </Button>;
        }
    }

    return (
        <>
            {showResult(status)}
        </>
    )
}


const ShowTranslatedResult = ({ result }) => {
    if (result) {
        return (
            <>
                {result.language === 'en' ?
                    <p className='h4'>
                        {result.enWord} - <strong><mark>{result.ukWord}
                        </mark></strong></p> :
                    <p className='h4'>
                        {result.ukWord} - <strong><mark>{result.enWord}
                        </mark></strong></p>}
                <ActionsWithTranslatedResult result={result} />
            </>
        )
    }
}


const ShowTranslatedPlug = () => {
    return (
        <div>
            <p className='h5'>
                Write a word in <br /> <mark>English</mark> or <mark>Ukrainian</mark>
            </p></div>
    )
}


const WordsSearchForm = () => {
    const [translated, setTranslated] = useState(null);
    const [action, setAction] = useState(null);
    const [error, setError] = useState(null);

    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema)
    });

    const showResult = (action) => {
        switch (action) {
            case "loading":
                return <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>;
            case "success":
                return <ShowTranslatedResult result={translated} />;
            case "error":
                return <Alert variant="danger">{error}</Alert>;
            default:
                return <ShowTranslatedPlug />;
        }
    }

    const getData = async ({ expression }) => {
        setError(null);
        setAction("loading");
        const data = await getTranslate(expression);
        if (data.language === 'This language is not supported') {
            setError(data.language);
            setAction("error");
        } else {
            setTranslated(data);
            setAction("success");
            reset();
        }
    }

    return (
        <>
            <Row style={{ "maxHeight": "20vh", "minHeight": "20vh" }}
                className='d-flex justify-content-center mt-3'>
                <Col xs={10} md={5} lg={3}>
                    {showResult(action)}
                </Col>
            </Row>
            <Form onSubmit={handleSubmit(getData)}>
                <Row style={{ "minHeight": "35vh" }}
                    className='d-flex justify-content-center align-items-center'>
                    <Col xs={10} md={5} lg={3}>
                        <Form.Group className="my-2">
                            <Form.Control
                                size="lg" type="text"
                                placeholder="Add a word..."
                                {...register("expression")}></Form.Control>
                            <p style={{ minHeight: "1.5em" }}
                                className="text-danger">
                                {errors.expression?.message}</p>
                            <Button className={`col-sm-5 ${action === "loading" && "disabled"}`}
                                type="submit" variant="warning" size="lg">
                                Translate
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default WordsSearchForm;
