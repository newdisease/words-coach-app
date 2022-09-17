import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { lazy, Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
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
import { WordsSearchFormValidatorsSchema as schema } from "./WordsSearchFormValidators";

import classnames from "classnames";
import "./WordsSearchWrapper.scss";

const ADD_BUTTON_STATE_SUCCESS = "success";
const ADD_BUTTON_STATE_ERROR = "error";
const ADD_BUTTON_STATE_LOADING = "loading";
const TITLE_STATE_SUCCESS = "success";
const TITLE_STATE_ERROR = "error";
const TITLE_STATE_LOADING = "loading";

const LazyEditTranslate = lazy(() => import("../Modals/EditTranslateModal"));

const AddToDictionaryButton = ({
  buttonAddState,
  addWordToDB,
  errorMessage,
  isAuthenticated,
}) => {
  const icons = {
    [ADD_BUTTON_STATE_SUCCESS]: {
      renderClass: "success",
      renderIcon: <CorrectIcon />,
    },
    [ADD_BUTTON_STATE_ERROR]: {
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
      {buttonAddState === ADD_BUTTON_STATE_ERROR && (
        <Alert message={errorMessage} />
      )}
    </>
  );
};

const WordsSearchForm = ({ getData, translatedWord }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translatedWord]);

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
          <Button className="voice-btn" disabled btnType="icon">
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
    setButtonAddState(ADD_BUTTON_STATE_LOADING);
    axios
      .post("dictionary/", { uk_word: ukWord, en_word: enWord })
      .then((res) => {
        setButtonAddState(ADD_BUTTON_STATE_SUCCESS);
        dispatch(changeCountOfWordsInProgress(INC));
        dispatch(changeCountOfWordsInDictionary(INC));
        dispatch(dictSetWord(res.data));
      })
      .catch((error) => {
        setButtonAddState(ADD_BUTTON_STATE_ERROR);
        setErrorMessage("This word already exists");
      });
  };

  const showResult = (titleState) => {
    switch (titleState) {
      case TITLE_STATE_LOADING:
        return <Spinner spinnerSize="small" />;
      case TITLE_STATE_SUCCESS:
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
      case TITLE_STATE_ERROR:
        return (
          <>
            <Title />
            <Alert message={errorMessage} />
          </>
        );
      default:
        return <Title />;
    }
  };

  const transtateWord = (expression) =>
    axios
      .post("translate/", { word: expression })
      .then((response) => {
        setTranslatedWord(response.data);
        setTitleState(TITLE_STATE_SUCCESS);
      })
      .catch((error) => {
        setErrorMessage("This language is not supported");
        setTitleState(TITLE_STATE_ERROR);
      });

  const getData = ({ expression }) => {
    setButtonAddState(null);
    setErrorMessage(null);
    setTitleState(TITLE_STATE_LOADING);
    transtateWord(expression);
  };

  return (
    <>
      {showResult(titleState)}
      <WordsSearchForm getData={getData} translatedWord={translatedWord} />
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
