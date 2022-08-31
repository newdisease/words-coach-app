import { Table, Button, ButtonGroup, Spinner } from 'react-bootstrap';
import { ArrowRepeat, Trash } from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { changeCountOfWordsInProgress } from '../Auth/AuthSlice';

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


const DictionaryList = ({ user }) => {
  const [dictionary, setDictionary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  const dispatch = useDispatch();

  const limit = 10;
  const words_in_progress = user.words_in_progress;

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
    const prevProgress = dictionary.find(item => item.id === id).progress;
    setIsLoading(true);
    axios.patch(`/dictionary/${id}/`, {
      progress: 0
    })
      .then(res => {
        setDictionary(
          dictionary.map(item => item.id === id ? res.data : item));
        setIsLoading(false);
        if (prevProgress > 2) {
          localStorage.setItem("user", JSON.stringify({ ...user, words_in_progress: words_in_progress + 1 }));
          dispatch(changeCountOfWordsInProgress(
            words_in_progress + 1
          ));
        }
      })
      .catch(err => console.log(err));
  }

  const onDeleteItem = (id) => {
    const prevProgress = dictionary.find(item => item.id === id).progress;
    setIsLoading(true);
    axios.delete(`/dictionary/${id}/`)
      .then(() => {
        setDictionary(dictionary.filter(item => item.id !== id));
        setIsLoading(false);
        setOffset(offset => offset - 1);
        if (prevProgress < 3) {
          localStorage.setItem("user", JSON.stringify({ ...user, words_in_progress: words_in_progress - 1 }));
          dispatch(changeCountOfWordsInProgress(
            words_in_progress - 1
          ));
        }
      }
      )
      .catch(err => {
        console.log(err);
      }
      );
  }

  return (
    <>
      {dictionary.length === 0 ? <div>
        <p className='h5 m-3'>No words in the dictionary</p>
      </div> :
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
                <th style={{ 'width': '45%' }}>en</th>
                <th style={{ 'width': '45%' }}>uk</th>
                <th style={{ 'width': '5%' }}>progress</th>
                <th style={{ 'width': '5%' }}>
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
        </>}
      <ButtonGroup vertical="true">
        {(!isEnd && dictionary.length !== 0) && < Button
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
