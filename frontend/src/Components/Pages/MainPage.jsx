import { Button } from 'react-bootstrap';
import WordsSearchForm from '../WordsSearchForm/WordsSearchForm';
import { useSelector } from 'react-redux';

function MainPage() {
    const { isAuthenticated } = useSelector(state => state.login);

    return (
        <div>
            <WordsSearchForm />
            <div>
                <Button variant="success" size="lg" href='/quiz' disabled={!isAuthenticated}>
                    Start learning
                </Button>
            </div>
        </div>
    );
}

export default MainPage;