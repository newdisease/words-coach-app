import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeCountOfWordsInProgress, DEC } from "../../Reducers/AuthSlice";

import { Button, Spinner } from "../Common";
import { CorrectIcon, WrongIcon } from "../Common/Icons";
import { COMPLETE, CORRECT, INCORRECT, IN_PROGRESS } from "./QuizConstants";
import QuizInput from "./QuizInput";

import "./Quiz.scss";

const QuizButton = ({ replyStatus, onClick, onSubmit, onRestart, user }) => {
  let status;
  if (replyStatus === IN_PROGRESS) {
    status = "check";
  } else if (replyStatus === COMPLETE) {
    status = "complete";
  } else {
    status = "next";
  }

  const buttons = {
    next: {
      renderButton: (
        <Button btnType="lg" raised onClick={onClick}>
          Next
        </Button>
      ),
    },
    check: {
      renderButton: (
        <Button
          type="submit"
          form="quiz-form"
          btnType="lg"
          raised
          onClick={onSubmit}
        >
          Check
        </Button>
      ),
    },
    complete: {
      renderButton: (
        <Button
          btnType="lg"
          raised
          disabled={user.words_in_progress < 10}
          onClick={(e) => onRestart(e)}
        >
          Restart
        </Button>
      ),
    },
  };
  return <>{buttons[status].renderButton}</>;
};

const QuizProgress = ({ quizProgress, replyStatus }) => {
  const icons = {
    CORRECT: { renderClass: "success", renderIcon: <CorrectIcon /> },
    INCORRECT: { renderClass: "error", renderIcon: <WrongIcon /> },
  };
  const { renderClass, renderIcon } = icons[replyStatus] || {};

  return (
    <div
      className={`progress-wrap ${replyStatus === INCORRECT ? "error" : ""}`}
      style={{
        "--num": quizProgress * 10,
      }}
    >
      <div className="dot"></div>
      <svg className={`circle ${replyStatus === COMPLETE ? "complete" : ""}`}>
        <circle cx="90" cy="90" r="85"></circle>
      </svg>
      <div className="progress-content">
        <>{quizProgress} / 10</>
        <span className={`status-icon flex ${renderClass ? renderClass : ""}`}>
          {renderIcon}
        </span>
      </div>
    </div>
  );
};

const TypedQuizAnswer = ({
  setAnswer,
  replyStatus,
  wordForCheck,
  isLoading,
}) => {
  if (!wordForCheck) {
    return null;
  }
  return (
    <>
      {isLoading ? (
        <Spinner spinnerSize="x-small" />
      ) : (
        <form id="quiz-form" className="quiz-form flex flex-j-b">
          <QuizInput
            setAnswer={setAnswer}
            amount={wordForCheck.length}
            replyStatus={replyStatus}
          />
        </form>
      )}
    </>
  );
};

const WordForQuestion = ({ word, replyStatus, score, isLoading }) => {
  if (!word) {
    return null;
  }
  const { wordForCheck, wordForQuestion } = word;
  return (
    <div className="question-word-wrap flex flex-j-b">
      <p className="question-word-top">
        {replyStatus === INCORRECT && wordForQuestion}
      </p>
      <p className="question-word-bottom">
        {isLoading ? (
          <Spinner spinnerSize="x-small" />
        ) : (
          <>{replyStatus !== INCORRECT ? wordForQuestion : wordForCheck}</>
        )}
      </p>
    </div>
  );
};

const QuizResult = ({ score }) => {
  return (
    <div className="quiz-result">
      <p className="result-text">
        You have got <br />{" "}
        <span className="result-score">{score} correct</span> answers
      </p>
    </div>
  );
};

const QuizWrapper = () => {
  const [quiz, setQuiz] = useState([]);
  const [index, setIndex] = useState(0);
  const [quizProgress, setQuizProgress] = useState(0);
  const [replyStatus, setReplyStatus] = useState(IN_PROGRESS);
  const [isLoading, setIsLoading] = useState(false);
  const [word, setWord] = useState({});
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.words_in_progress < 10) {
      navigate("/");
    } else {
      setIsLoading(true);
      axios.get("/quiz/").then((res) => {
        setQuiz(res.data);
        setIsLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.length === 0]);

  useEffect(() => {
    if (index < 10) {
      const task = quiz[index] || {};
      setWord(
        Math.floor(Math.random() * 2)
          ? {
              wordForQuestion: task.uk_word,
              wordForCheck: task.en_word,
            }
          : {
              wordForQuestion: task.en_word,
              wordForCheck: task.uk_word,
            }
      );
    } else {
      setReplyStatus(COMPLETE);
    }
  }, [index, quiz]);

  useEffect(() => {
    // click on Next if Enter is pressed
    if (replyStatus === CORRECT || replyStatus === INCORRECT) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyStatus]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onClick(e);
    }
  };

  const onUpdateItem = (id) => {
    setIsLoading(true);
    axios
      .patch(`/dictionary/${id}/`, { progress: quiz[index].progress + 1 })
      .then((res) => {
        if (res.data.progress > 2) {
          dispatch(changeCountOfWordsInProgress(DEC));
        }
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const onSubmit = (e) => {
    if (answer.toLowerCase() === word.wordForCheck) {
      setScore(score + 1);
      setReplyStatus(CORRECT);
      onUpdateItem(quiz[index].id);
    } else {
      setReplyStatus(INCORRECT);
    }
    setQuizProgress(quizProgress + 1);
  };

  const onClick = (e) => {
    e.preventDefault();
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setIndex((prevIndex) => prevIndex + 1);
    setAnswer("");
    setReplyStatus(IN_PROGRESS);
  };

  const onRestart = (e) => {
    e.preventDefault();
    setQuiz([]);
    setIndex(0);
    setQuizProgress(0);
    setReplyStatus(IN_PROGRESS);
    setScore(0);
  };

  return (
    <>
      <div>
        <QuizProgress quizProgress={quizProgress} replyStatus={replyStatus} />
        {replyStatus === COMPLETE ? (
          <QuizResult score={score} />
        ) : (
          <>
            <WordForQuestion
              word={word}
              replyStatus={replyStatus}
              score={score}
              isLoading={isLoading}
            />
            <TypedQuizAnswer
              onSubmit={onSubmit}
              setAnswer={setAnswer}
              replyStatus={replyStatus}
              wordForCheck={word.wordForCheck}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
      <QuizButton
        replyStatus={replyStatus}
        onClick={onClick}
        onSubmit={onSubmit}
        onRestart={onRestart}
        user={user}
      />
    </>
  );
};

export default QuizWrapper;
