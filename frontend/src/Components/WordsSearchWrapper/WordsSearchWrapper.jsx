import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { WordsSearchFormValidatorsSchema as schema } from './WordsSearchFormValidators';
import { useSelector, useDispatch } from 'react-redux';
import { changeCountOfWordsInProgress } from '../Auth/AuthSlice';
import { MicIcon, TranslateIcon, AddDictionaryIcon, CorrectIcon, WrongIcon } from '../Common/Icons';
import { Alert, Button, Spinner, Title } from '../Common';
import { capitalizeFirstLetter } from '../Common/utils';

import classnames from 'classnames';
import './WordsSearchWrapper.scss';


const ADD_BUTTON_STATE_SUCCESS = 'success';
const ADD_BUTTON_STATE_ERROR = 'error';
const ADD_BUTTON_STATE_LOADING = 'loading';
const TITLE_STATE_SUCCESS = 'success';
const TITLE_STATE_ERROR = 'error';
const TITLE_STATE_LOADING = 'loading';

const AddToDictionaryButton = ({
    buttonAddState,
    addWordToDB,
    errorMessage,
    isAuthenticated
}) => {

    const icons = {
        [ADD_BUTTON_STATE_SUCCESS]: { renderClass: 'success', renderIcon: <CorrectIcon /> },
        [ADD_BUTTON_STATE_ERROR]: { renderClass: 'error', renderIcon: <WrongIcon /> },
    }
    const { renderClass, renderIcon } = icons[buttonAddState] || {}

    let buttonErrorMsg;
    if (!isAuthenticated) {
        buttonErrorMsg = 'You must be logged in to add a word';
    } else if (buttonAddState) {
        buttonErrorMsg = 'Please, add another word';
    }

    return (
        <>
            <div className='add-word-icon-wrap flex'>
                <Button
                    className={classnames('icon-dark-blue add-word-button', renderClass)}
                    btnType='circle'
                    disabled={!isAuthenticated || buttonAddState}
                    onClick={addWordToDB}
                >
                    {renderIcon || <AddDictionaryIcon />}
                </Button>
                {buttonErrorMsg && <span className='btn-error-msg'>{buttonErrorMsg}</span>}
            </div>
            {buttonAddState === ADD_BUTTON_STATE_ERROR &&
                <Alert message={errorMessage} />}
        </>
    )
}

const WordsSearchForm = ({ getData, translatedWord }) => {
    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const [buttonAddState, setButtonAddState] = useState(null);
    const [titleState, setTitleState] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const { isAuthenticated, user } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const { language, ukWord, enWord } = translatedWord || {};
    const wordsInProgress = user.words_in_progress;

    const addWordToDB = () => {
        setButtonAddState(ADD_BUTTON_STATE_LOADING);
        axios.post("dictionary/", { uk_word: ukWord, en_word: enWord })
            .then(() => {
                setButtonAddState(ADD_BUTTON_STATE_SUCCESS);
                localStorage.setItem("user", JSON.stringify({ ...user, words_in_progress: wordsInProgress + 1 }));
                dispatch(changeCountOfWordsInProgress(wordsInProgress + 1));
            })
            .catch(error => {
                setButtonAddState(ADD_BUTTON_STATE_ERROR);
                setErrorMessage('This word already exists');
            });
    }

    const showResult = (titleState) => {
        switch (titleState) {
            case TITLE_STATE_LOADING:
                return <Spinner spinnerSize='small' />;
            case TITLE_STATE_SUCCESS:
                return <>
                    <Title
                        title={language === 'EN' ?
                            capitalizeFirstLetter(ukWord) :
                            capitalizeFirstLetter(enWord)}
                        subtitle={language === 'EN' ?
                            <>🇬🇧&nbsp;&nbsp;{enWord}</> :
                            <>🇺🇦&nbsp;&nbsp;{ukWord}</>}
                        className='main-title'
                        childrenComponent={
                            <AddToDictionaryButton
                                buttonAddState={buttonAddState}
                                addWordToDB={addWordToDB}
                                errorMessage={errorMessage}
                                isAuthenticated={isAuthenticated} />
                        } />
                </>;
            case TITLE_STATE_ERROR:
                return <>
                    <Title />
                    <Alert message={errorMessage} />
                </>;
            default:
                return <Title />;
        }
    }

    const transtateWord = (expression) => {
        return axios.post("translate/", { word: expression }).then(response => {
            setTranslatedWord(response.data);
            setTitleState(TITLE_STATE_SUCCESS);
        }).catch(error => {
            setErrorMessage('This language is not supported');
            setTitleState(TITLE_STATE_ERROR);
        });
    }

    const getData = ({ expression }) => {
        setButtonAddState(null);
        setErrorMessage(null);
        setTitleState(TITLE_STATE_LOADING);
        transtateWord(expression);
    }

    return (
        <>
            {showResult(titleState)}
            <WordsSearchForm
                getData={getData}
                translatedWord={translatedWord} />
        </>
    )
}

export default WordsSearchWrapper;
