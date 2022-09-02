import { Col, Row } from 'react-bootstrap';
import WordsSearchWrapper from '../WordsSearchWrapper/WordsSearchWrapper';
import { useSelector } from 'react-redux';
import GoogleAuth from '../Auth/GoogleAuth';
import Button from '../Common/Button';


function MainPage() {
    const { isAuthenticated, user } = useSelector(state => state.user);
    const isUserHasWordsInProgress = user.words_in_progress < 10;

    return (
        <>
            <div className='top-content'>
                <WordsSearchWrapper />
            </div>
            <div className='bottom-content tac'>
                {
                    (isUserHasWordsInProgress) &&
                    <p>
                        You must add {10 - user.words_in_progress} more word(s) to start learning
                    </p>
                }
                <Button
                    linkTo='/quiz'
                    btnType="lg"
                    raised
                    disabled={!isAuthenticated || isUserHasWordsInProgress}
                >
                    Start learning
                </Button>
            </div>
        </>
    );
}

export default MainPage;
