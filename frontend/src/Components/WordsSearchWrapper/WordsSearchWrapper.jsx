import { yupResolver } from "@hookform/resolvers/yup";
// import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import axios from "axios";
import { lazy, Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  changeCountOfWordsInDictionary,
  changeCountOfWordsInProgress,
  INC,
} from "../../Reducers/AuthSlice";
import { dictSetWord } from "../../Reducers/DictSlice";
import { Alert, Button, Spinner, Title } from "../Common";
import {
  AddDictionaryIcon,
  CorrectIcon,
  MicIcon,
  TranslateIcon,
  VolumeUpIcon,
  WrongIcon,
} from "../Common/Icons";
import { capitalizeFirstLetter, spellTranslatedWord } from "../Common/utils";
import VoicePlug from "./VoicePlug";
import { WordsSearchFormValidatorsSchema as schema } from "./WordsSearchFormValidators";

import classnames from "classnames";
import "./WordsSearchWrapper.scss";

const STATE_SUCCESS = "success";
const STATE_ERROR = "error";
const STATE_LOADING = "loading";
const STATE_VOICE = "voice";

const LazyEditTranslate = lazy(() => import("../Modals/EditTranslateModal"));

// // Speechly API for speech recognition polyfill
// const appId = process.env.REACT_APP_SPEECHLY_ID;
// const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
// SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

const AddToDictionaryButton = ({
  buttonAddState,
  addWordToDB,
  errorMessage,
  isAuthenticated,
}) => {
  const icons = {
    [STATE_SUCCESS]: {
      renderClass: "success",
      renderIcon: <CorrectIcon />,
    },
    [STATE_ERROR]: {
      renderClass: "error",
      renderIcon: <WrongIcon />,
    },
  };
  const { renderClass, renderIcon } = icons[buttonAddState] || {};

  let buttonErrorMsg;
  if (!isAuthenticated) {
    buttonErrorMsg = "You must be logged in to add a word";
  } else if (buttonAddState) {
    buttonErrorMsg = "Please, add another word";
  }

  return (
    <>
      <div className="add-word-icon-wrap flex">
        <Button
          className={classnames("icon-dark-blue add-word-button", renderClass)}
          btnType="circle"
          disabled={!isAuthenticated || buttonAddState}
          onClick={addWordToDB}
        >
          {renderIcon || <AddDictionaryIcon />}
        </Button>
        {buttonErrorMsg && (
          <span className="btn-error-msg">{buttonErrorMsg}</span>
        )}
      </div>
      {buttonAddState === STATE_ERROR && <Alert message={errorMessage} />}
    </>
  );
};

const WordsSearchForm = ({
  getData,
  translatedWord,
  setTitleState,
  titleState,
}) => {
  const [prevState, setPrevState] = useState(null);
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translatedWord]);

  useEffect(() => {
    if (!listening) {
      SpeechRecognition.stopListening();
      setTitleState(prevState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  useEffect(() => {
    if (transcript) {
      setValue("expression", transcript.toLowerCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  const handleOnClikOrTapStart = () => {
    setPrevState(titleState);
    if (browserSupportsSpeechRecognition) {
      resetTranscript();
      setTitleState(STATE_VOICE);
      SpeechRecognition.startListening({
        language: "en-US",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(getData)}>
      <div className="search-wrap">
        <div className="search">
          <input
            maxLength={16}
            type="text"
            placeholder="Add a word..."
            {...register("expression")}
          />
          <Button
            className={classnames("voice-btn", {
              active: listening,
            })}
            btnType="icon"
            onMouseDown={handleOnClikOrTapStart}
            onTouchStart={handleOnClikOrTapStart}
            disabled={!browserSupportsSpeechRecognition}
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
      {
        <p className="validation-msg">
          {errors.expression && errors.expression.message}
        </p>
      }
    </form>
  );
};

const WordsSearchWrapper = () => {
  const [translatedWord, setTranslatedWord] = useState(null);
  const [buttonAddState, setButtonAddState] = useState(null);
  const [titleState, setTitleState] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showTranslateModal, setShowTranslateModal] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { language, ukWord, enWord } = translatedWord || {};

  const addWordToDB = () => {
    setButtonAddState(STATE_LOADING);
    axios
      .post("dictionary/", { uk_word: ukWord, en_word: enWord })
      .then((res) => {
        setButtonAddState(STATE_SUCCESS);
        dispatch(changeCountOfWordsInProgress(INC));
        dispatch(changeCountOfWordsInDictionary(INC));
        dispatch(dictSetWord(res.data));
      })
      .catch((error) => {
        setButtonAddState(STATE_ERROR);
        setErrorMessage("This word already exists");
      });
  };

  const showResult = (titleState) => {
    switch (titleState) {
      case STATE_LOADING:
        return <Spinner spinnerSize="small" />;
      case STATE_SUCCESS:
        return (
          <>
            <Title
              title={
                language === "EN" ? (
                  capitalizeFirstLetter(ukWord)
                ) : (
                  <>
                    {capitalizeFirstLetter(enWord)}{" "}
                    <Button
                      className="icon-blue"
                      btnType="icon"
                      onClick={() => spellTranslatedWord(enWord)}
                    >
                      <VolumeUpIcon />
                    </Button>
                  </>
                )
              }
              subtitle={
                <>
                  {language === "EN" ? (
                    <>🇬🇧&nbsp;&nbsp;{enWord}</>
                  ) : (
                    <>🇺🇦&nbsp;&nbsp;{ukWord}</>
                  )}{" "}
                  {buttonAddState === null && (
                    <>
                      <span>/</span>
                      <Button
                        btnType="link"
                        onClick={() => setShowTranslateModal(true)}
                        disabled={!isAuthenticated || buttonAddState !== null}
                      >
                        edit
                      </Button>
                    </>
                  )}
                </>
              }
              className="main-title"
              childrenComponent={
                <AddToDictionaryButton
                  buttonAddState={buttonAddState}
                  addWordToDB={addWordToDB}
                  errorMessage={errorMessage}
                  isAuthenticated={isAuthenticated}
                />
              }
            />
          </>
        );
      case STATE_ERROR:
        return (
          <>
            <Title />
            <Alert message={errorMessage} />
          </>
        );
      case STATE_VOICE:
        return <VoicePlug />;
      default:
        return <Title />;
    }
  };

  const transtateWord = (expression) =>
    axios
      .post("translate/", { word: expression })
      .then((response) => {
        setTranslatedWord(response.data);
        setTitleState(STATE_SUCCESS);
      })
      .catch((error) => {
        setErrorMessage("This language is not supported");
        setTitleState(STATE_ERROR);
      });

  const getData = ({ expression }) => {
    setButtonAddState(null);
    setErrorMessage(null);
    setTitleState(STATE_LOADING);
    transtateWord(expression);
  };

  return (
    <>
      {showResult(titleState)}
      <WordsSearchForm
        getData={getData}
        translatedWord={translatedWord}
        titleState={titleState}
        setTitleState={setTitleState}
      />
      <Suspense fallback={<span>Loading...</span>}>
        {showTranslateModal && (
          <LazyEditTranslate
            show={showTranslateModal}
            onHide={() => setShowTranslateModal(false)}
            translatedWord={translatedWord}
            setTranslatedWord={setTranslatedWord}
            language={language}
          />
        )}
      </Suspense>
    </>
  );
};

export default WordsSearchWrapper;
