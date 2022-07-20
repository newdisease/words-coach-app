import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container } from 'react-bootstrap';

function MainPage() {
    const [testData, setTestData] = useState([]);

    useEffect(() => {
        getTestData();
    }, []);

    const getTestData = async () => {
        await axios.get('http://127.0.0.1:8000/api/').then(res => {
            setTestData(res.data);
        }
        ).catch(err => {
            console.log(err);
        }
        );
    }
    return (
        <Container className="mt-5">
            <h1>Test data from DRF</h1>
            <div>
                {testData.map((item) => (<div key={item.id}>
                    <p>{item.name} - <span>{item.age}</span></p>
                </div>
                ))}
            </div>
            <Button variant="primary" onClick={() => console.log('click')}>click</Button>
        </Container>
    );
}

export default MainPage;