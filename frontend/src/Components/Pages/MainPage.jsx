import { Button } from 'react-bootstrap';
import WordsSearchForm from '../WordsSearchForm/WordsSearchForm';

function MainPage() {


    return (
        <div>
            <WordsSearchForm />
            <div>
                <Button variant="success" size="lg" href='/quiz'>
                    Start a test
                </Button>
            </div>
        </div>
    );
}

export default MainPage;