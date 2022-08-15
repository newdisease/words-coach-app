import {
  Form, Col, Row, Button,
  ProgressBar, Spinner, Placeholder
} from "react-bootstrap";
import { CheckLg } from 'react-bootstrap-icons'
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { changeCountOfWordsInProgress } from '../Auth/AuthSlice';
import { useDispatch, useSelector } from "react-redux";

import QuizInput from './QuizInput';
import { CORRECT, INCORRECT, IN_PROGRESS, COMPLETE } from './QuizConstants';


const QuizProgress = ({ quizProgress, replyStatus }) => {
  return (
    <Row className="d-flex justify-content-center align-items-center"
      style={{ "minHeight": "10vh" }}>
      <Col xs={11} md={11} lg={11}>
        <ProgressBar
          style={{ "minHeight": "25px", "maxWidth": "70vh" }}
          className="my-3 mx-auto"
          now={`${quizProgress}0`}
          label={`${quizProgress}/10`}
          variant={replyStatus === COMPLETE ? "success" : "primary"}
          max="100"
        />
      </Col>
    </Row>
  )
}

const TypedQuizAnswer = ({
  quiz,
  index,
  setReplyStatus,
  replyStatus,
  setIndex,
  setQuizProgress,
  quizProgress,
  wordForCheck
}) => {
  const [answer, setAnswer] = useState("");
  const { user } = useSelector(state => state.user);

  const dispatch = useDispatch();

  if (!wordForCheck) { return null }

  const onUpdateItem = (id) => {
    axios.patch(`/dictionary/${id}/`, { progress: quiz[index].progress + 1 })

      .then(res => {
        if (res.data.progress > 2) {
          dispatch(changeCountOfWordsInProgress(
            user.words_in_progress - 1
          ));
          localStorage.setItem("user", JSON.stringify({ ...user, words_in_progress: user.words_in_progress - 1 }));
        }
      })
      .catch(err => console.log(err));
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (answer === wordForCheck) {
      setReplyStatus(CORRECT);
      setQuizProgress(quizProgress + 1);
      onUpdateItem(quiz[index].id);
    } else {
      setReplyStatus(INCORRECT);
      setQuizProgress(quizProgress + 1);
    }
  }

  const onClick = (e) => {
    e.preventDefault();
    Array.from(document.querySelectorAll("input")).forEach(
      input => (input.value = "")
    );
    setIndex(prevIndex => prevIndex + 1);
    setAnswer("");
    setReplyStatus(IN_PROGRESS);
    if (e.key === "Enter") {
      onSubmit(e);
    }
  }

  const renderButton = (replyStatus) => {
    switch (replyStatus) {
      case IN_PROGRESS:
        return (
          <Button
            className='col-sm-5 my-2'
            variant="primary"
            type="submit"
            size="lg">
            Check
          </Button>
        );
      case CORRECT:
        return (
          <Button
            className='col-sm-5 my-2'
            variant='success'
            size="lg"
            type="submit"
            onClick={onClick}>
            Next
          </Button>
        );
      case INCORRECT:
        return (
          <Button
            className='col-sm-5 my-2'
            variant='danger'
            size="lg"
            type="submit"
            onClick={onClick}>
            Next
          </Button>
        );
      case COMPLETE:
        return (
          <Button
            className='col-sm-5 my-2'
            variant='primary'
            size="lg"
            type="submit"
            as={Link} to="/">
            To the main page
          </Button>
        );
      default:
        return null;
    }
  }

  return (
    <Row
      style={{ "minHeight": "25vh" }}
      className='d-flex justify-content-center align-items-center'
    >
      <Col xs={10} md={10} lg={10}>
        <Form onSubmit={onSubmit}>
          <QuizInput
            setAnswer={setAnswer}
            amount={wordForCheck.length}
            replyStatus={replyStatus}
          />
          {renderButton(replyStatus)}
        </Form>
      </Col>
    </Row>
  )
}

const WordForQuestion = ({ wordForQuestion, replyStatus }) => {
  return (
    <Row
      style={{ "minHeight": "10vh", "maxHeight": "10vh" }}
      className="d-flex justify-content-center align-items-center">

      <Col xs={10} md={10} lg={10}>
        {replyStatus !== COMPLETE ?
          <p className="h3 mt-3 mb-2">{wordForQuestion}</p> :
          <p className="h3 my-2 text-success">Training is complete</p>}
      </Col>
    </Row>
  )
}

const WordForCheck = ({ wordForCheck, replyStatus }) => {
  return (
    <Row style={{ "minHeight": "10vh", "maxHeight": "10vh" }}
      className="d-flex justify-content-center align-items-center">
      <Col xs={10} md={10} lg={10}>
        {replyStatus === INCORRECT &&
          <p className="h3 my-2 text-danger"> {wordForCheck}</p>}
        {replyStatus === CORRECT &&
          <p className="h3 my-2 text-success"><CheckLg size={35} /></p>}
        {replyStatus === IN_PROGRESS && <Placeholder
          as="p"
          size="lg"
          className="h3 my-2"
          animation="wave">
          <Placeholder xs={7} md={7} lg={7} />
        </Placeholder>}
        {replyStatus === COMPLETE &&
          <p className="h5 mt-5">You have got <strong>4</strong> correct answers</p>}
      </Col>
    </Row >
  )
}

const Quiz = () => {

  const [quiz, setQuiz] = useState([]);
  const [index, setIndex] = useState(0);
  const [quizProgress, setQuizProgress] = useState(0);
  const [replyStatus, setReplyStatus] = useState(IN_PROGRESS);
  const [isLoading, setIsLoading] = useState(false);
  const [word, setWord] = useState({});

  useEffect(() => {
    setIsLoading(true);
    axios.get("/quiz/").then(res => {
      setQuiz(res.data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (index < 10) {
      const task = quiz[index] || {};
      setWord(Math.floor(Math.random() * 2) ? {
        wordForQuestion: task.uk_word,
        wordForCheck: task.en_word
      } : {
        wordForQuestion: task.en_word,
        wordForCheck: task.uk_word
      });
    } else {
      setReplyStatus(COMPLETE);
    }
  }, [index, quiz]);

  return (
    <>
      <p className="h2 my-3">Learning words</p>
      <div style={{ "maxWidth": "80vh" }} className="mx-auto">
        <QuizProgress
          quizProgress={quizProgress}
          replyStatus={replyStatus} />
        {isLoading ? <Spinner animation="border" size="sm" /> : <>
          <WordForQuestion
            wordForQuestion={word.wordForQuestion}
            replyStatus={replyStatus} />
          <WordForCheck
            wordForCheck={word.wordForCheck}
            replyStatus={replyStatus} />
          <TypedQuizAnswer
            quiz={quiz}
            index={index}
            setReplyStatus={setReplyStatus}
            replyStatus={replyStatus}
            setIndex={setIndex}
            setQuizProgress={setQuizProgress}
            quizProgress={quizProgress}
            wordForCheck={word.wordForCheck} />
        </>}
      </div>
    </>
  )
}

export default Quiz;
