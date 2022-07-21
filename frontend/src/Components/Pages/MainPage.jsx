import axios from 'axios';
import { Button } from 'react-bootstrap';
import WordsSearchForm from '../WordsSearchForm/WordsSearchForm';

function MainPage() {
    // const [testData, setTestData] = useState([]);

    // useEffect(() => {
    //     getTestData();
    // }, []);

    // const getTestData = async () => {
    //     await axios.get('http://127.0.0.1:8000/api/').then(res => {
    //         setTestData(res.data);
    //     }
    //     ).catch(err => {
    //         console.log(err);
    //     }
    //     );
    // }
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