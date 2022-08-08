import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import WordsSearchForm from '../WordsSearchForm/WordsSearchForm';
import { useSelector } from 'react-redux';

function MainPage() {
    const { isAuthenticated } = useSelector(state => state.login);

    return (
        <>
            <WordsSearchForm />
            <div>
                <Button as={Link} variant="success" size="lg"
                    to='/quiz' disabled={!isAuthenticated}>
                    Start learning
                </Button>
            </div>
        </>
    );
}

export default MainPage;
