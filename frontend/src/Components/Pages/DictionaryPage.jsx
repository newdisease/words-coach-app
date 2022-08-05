import { Table, Button, ButtonGroup, Spinner } from 'react-bootstrap';
import { ArrowRepeat, Trash } from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const DictionaryItem = ({ item, onDeleteItem, onUpdateItem, isLoading }) => {
    const { id, en_word, uk_word, progress } = item;

    return (
        <tr>
            <td>{en_word}</td>
            <td>{uk_word}</td>
            <td>{progress}/3</td>
            <td>
                <ButtonGroup>
                    <Button size='sm'
                        className="mx-1"
                        onClick={() => onUpdateItem(id)}
                        disabled={isLoading}
                    >
                        <ArrowRepeat size={20} />
                    </Button>
                    <Button size='sm'
                        className="mx-1"
                        onClick={() => onDeleteItem(id)}
                        disabled={isLoading}
                    >
                        <Trash size={20} />
                    </Button>
                </ButtonGroup>
            </td>
        </tr>
    )
}


const DictionaryPage = () => {
    const [dictionary, setDictionary] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const onRequest = () => {
        setIsLoading(true);
        axios.get('/dictionary/')
            .then(res => {
                setDictionary(res.data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        onRequest();
    }, []);

    const onUpdateItem = (id) => {
        setIsLoading(true);
        axios.patch(`/dictionary/${id}/`, {
            progress: 1
        })
            .then(res => {
                setDictionary(
                    dictionary.map(item => item.id === id ? res.data : item));
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }

    const onDeleteItem = (id) => {
        setIsLoading(true);
        axios.delete(`/dictionary/${id}/`)
            .then(() => {
                setDictionary(dictionary.filter(item => item.id !== id));
                setIsLoading(false);
            }
            )
            .catch(err => {
                console.log(err);
            }
            );
    }

    return (
        <>
            {isLoading && !dictionary.length && <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>}
            <Table className='mt-5' striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th className='text-left'>en</th>
                        <th>uk</th>
                        <th style={{ 'width': '40px' }}>progress</th>
                        <th style={{ 'width': '40px' }}>
                            actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {dictionary.map(
                        item => <DictionaryItem
                            key={item.id}
                            item={item}
                            onDeleteItem={onDeleteItem}
                            onUpdateItem={onUpdateItem}
                            isLoading={isLoading}
                        />
                    )}
                </tbody>
            </Table>
            <Button className='mt-3' variant="primary" size="lg"
                disabled={isLoading}>
                Load more
            </Button>
        </>
    )
}

export default DictionaryPage;