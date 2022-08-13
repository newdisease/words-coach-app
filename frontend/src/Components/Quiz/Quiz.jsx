import { Form, Col, Row, Button, ProgressBar, Spinner } from "react-bootstrap";
import { useEffect, useState, useCallback } from "react";
import QuizInput from './QuizInput';
import axios from 'axios';

export const IN_PROGRESS = "IN_PROGRESS";
export const CORRECT = "CORRECT";
export const INCORRECT = "INCORRECT";

const QuizProgress = ({ progress }) => {
  return (
    <ProgressBar
      style={{ "minHeight": "25px", "maxWidth": "70vh" }}
      className="my-3 mx-auto"
      now={`${progress}0`}
      label={`${progress}/10`}
    />
  )
}

const TypedQuizAnswer = ({
  setReplyStatus,
  replyStatus,
  setIndex,
  wordForCheck
}) => {
  const [answer, setAnswer] = useState("");

  if (!wordForCheck) { return null }

  const onSubmit = (e) => {
    e.preventDefault();
    if (answer === wordForCheck) {
      setReplyStatus(CORRECT);
    } else {
      setReplyStatus(INCORRECT);
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
        )
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

const WordForQuestion = ({ wordForQuestion }) => {
  return (
    <Row
      style={{ "minHeight": "5vh" }}
      className="d-flex justify-content-center align-items-center">

      <Col xs={10} md={10} lg={10}>
        <p className="h3 mt-5 mb-2">{wordForQuestion}</p>
      </Col>
    </Row>
  )
}

const WordForCheck = ({ wordForCheck, replyStatus }) => {
  return (
    <Row style={{ "minHeight": "10vh", "maxHeight": "10vh" }}
      className="d-flex justify-content-center align-items-center">
      <Col xs={10} md={10} lg={10}>
        {replyStatus === INCORRECT && <p className="h3 mt-2 mb-2 text-danger">{wordForCheck}</p>}
        {replyStatus === CORRECT && <p className="h3 mt-2 mb-2 text-success">{wordForCheck}</p>}
        {replyStatus === IN_PROGRESS && <p className="h3 mt-2 mb-2 text-primary">Try to translate</p>}
      </Col>
    </Row>
  )
}

const Quiz = () => {

  const [quiz, setQuiz] = useState([]);
  const [index, setIndex] = useState(0);
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
    const task = quiz[index] || {};
    setWord(Math.floor(Math.random() * 2) ? {
      wordForQuestion: task.uk_word,
      wordForCheck: task.en_word
    } : {
      wordForQuestion: task.en_word,
      wordForCheck: task.uk_word
    });
  }, [index, quiz]);

  return (
    <>
      <p className="h2 my-3">Quiz</p>
      <div style={{ "maxWidth": "80vh" }} className="mx-auto">
        <QuizProgress progress={index + 1} />
        {isLoading ? <Spinner animation="border" size="sm" /> : <>
          <WordForQuestion wordForQuestion={word.wordForQuestion} />
          <WordForCheck wordForCheck={word.wordForCheck} replyStatus={replyStatus} />
          <TypedQuizAnswer
            setReplyStatus={setReplyStatus}
            replyStatus={replyStatus}
            setIndex={setIndex}
            wordForCheck={word.wordForCheck} />
        </>}
      </div>
    </>
  )
}

export default Quiz;
