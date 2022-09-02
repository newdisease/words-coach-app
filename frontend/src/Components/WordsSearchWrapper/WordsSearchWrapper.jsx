import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { WordsSearchFormValidatorsSchema as schema } from './WordsSearchFormValidators';
import { useSelector, useDispatch } from 'react-redux';
import { changeCountOfWordsInProgress } from '../Auth/AuthSlice';
import getTranslate from '../../Services/TranslatorService';
import { MicIcon, TranslateIcon } from '../Common/Icons';
import { Alert, Button, Spinner, Title } from '../Common';

import './WordsSearchWrapper.scss';


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
                return
                <Spinner spinnerSize="large" />;
            case "success":
                return
                <Alert
                    type="success"
                    message="The word added to dictionary" />;
            case "error":
                return
                <Alert
                    type="error"
                    message="The word is already in the dictionary" />
            default:
                return <Button
                    disabled={!isAuthenticated}
                    onClick={addWordToDB}
                >
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


const TranslatedResult = ({ result }) => {
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

const WordsSearchForm = ({ getData, translatedWord }) => {
    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        reset();
    }, [translatedWord]);

    return (
        <form
            onSubmit={handleSubmit(getData)}
        >
            <div className="search-wrap">
                <div className="search">
                    <input
                        maxLength={16}
                        type="text"
                        placeholder='Add a word...'
                        {...register("expression")}
                    />
                    <Button
                        className="voice-btn"
                        disabled
                        btnType="icon"
                    >
                        <MicIcon />
                    </Button>
                </div>
                <Button
                    className="translate"
                    type="submit"
                    disabled={errors.expression}
                >
                    <TranslateIcon />
                </Button>
            </div>
            {errors.expression && <p
                className="validation-msg"
            >
                {errors.expression.message}
            </p>}
        </form>
    )
}

const WordsSearchWrapper = () => {
    const [translatedWord, setTranslatedWord] = useState(null);
    const [action, setAction] = useState(null);
    const [error, setError] = useState(null);

    const showResult = (action) => {
        switch (action) {
            case "loading":
                return <Spinner spinnerSize='medium' />;
            case "success":
                return <TranslatedResult result={translatedWord} />;
            case "error":
                return <>
                    <Title />
                    <Alert
                        type="error"
                        message={error} />
                </>;
            default:
                return <Title />;
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
            setTranslatedWord(data);
            setAction("success");
        }
    }

    return (
        <>
            {showResult(action)}
            <WordsSearchForm
                getData={getData}
                translatedWord={translatedWord} />
        </>
    )
}

export default WordsSearchWrapper;
