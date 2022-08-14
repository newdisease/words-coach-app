import { Table, Button, ButtonGroup, Spinner } from 'react-bootstrap';
import { ArrowRepeat, Trash } from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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


const DictionaryList = () => {
  const [dictionary, setDictionary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  const limit = 5;

  const onRequest = () => {
    setIsLoading(true);
    axios.get(`/dictionary/?limit=${limit}&offset=${offset}`)
      .then(res => {
        onDictionaryLoaded(res.data.results);
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    onRequest();
  }, []);

  const onDictionaryLoaded = (newItems) => {
    if (newItems.length < limit) {
      setDictionary([...dictionary, ...newItems]);
      setOffset(offset => limit);
      setIsEnd(true);
      setIsLoading(false);
    } else if (newItems.length === 0) {
      setIsEnd(true);
      setIsLoading(false);
    }
    else {
      setDictionary([...dictionary, ...newItems]);
      setOffset(offset => offset + limit);
      setIsLoading(false);
    }
  }

  const onUpdateItem = (id) => {
    setIsLoading(true);
    axios.patch(`/dictionary/${id}/`, {
      progress: 0
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
        setOffset(offset => offset - 1);
      }
      )
      .catch(err => {
        console.log(err);
      }
      );
  }

  console.log(1, dictionary);

  return (
    <>
      {isLoading && !dictionary.length && <Spinner
        animation="border"
        role="status">
        <span
          className="visually-hidden">
          Loading...
        </span>
      </Spinner>}
      <Table
        className='mt-5'
        striped bordered hover size="sm">
        <thead>
          <tr>
            <th className='text-left'>en</th>
            <th style={{ 'width': '40%' }}>uk</th>
            <th style={{ 'width': '10%' }}>progress</th>
            <th style={{ 'width': '10%' }}>
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
      <ButtonGroup vertical="true">
        {!isEnd && < Button
          className='m-2'
          variant="primary"
          size="lg"
          onClick={onRequest}
          disabled={isLoading}>
          Load more
        </Button>}
        <Button
          as={Link}
          to="/"
          className='m-2'
          variant="success"
          size="lg"
          disabled={isLoading}>
          To the main page
        </Button>
      </ButtonGroup>
    </>
  )
}

export default DictionaryList;
