import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import WordsSearchForm from '../WordsSearchForm/WordsSearchForm';
import { useSelector } from 'react-redux';


function MainPage() {
    const { isAuthenticated, user } = useSelector(state => state.user);

    const isUserHasWordsInProgress = user.words_in_progress < 10;

    return (
        <>
            <WordsSearchForm />

            <Row style={{ "maxHeight": "10vh", "minHeight": "10vh" }}
                className='d-flex justify-content-center align-items-center mb-1'>
                <Col xs={10} md={5} lg={3}>
                    {(isUserHasWordsInProgress) &&
                        <p className='text-success'>
                            You must add {10 - user.words_in_progress} more word(s) to start learning
                        </p>}
                </Col>
            </Row>

            <Row style={{ "maxHeight": "10vh", "minHeight": "10vh" }}
                className='d-flex justify-content-center align-items-center'>
                <Col xs={10} md={5} lg={3}>
                    <Button
                        as={Link}
                        variant="success"
                        size="lg"
                        to='/quiz'
                        className={(isUserHasWordsInProgress || !isAuthenticated) && "disabled"}>
                        Start learning
                    </Button>
                </Col>
            </Row>
        </>
    );
}

export default MainPage;
