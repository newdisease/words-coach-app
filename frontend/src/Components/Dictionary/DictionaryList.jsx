import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { changeCountOfWordsInProgress } from '../Auth/AuthSlice';
import { Button, Spinner, WordsListItem } from '../Common';

import './DictionaryList.scss';


const SeacrhDictionaryWords = () => {
  // todo: add search functionality
  return (
    <input
      className='dict-search'
      type="text"
      placeholder='Search...' />
  )
}

const DictionaryList = ({ user }) => {
  const [dictionary, setDictionary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  const dispatch = useDispatch();

  const limit = 5;
  const wordsInProgress = user.words_in_progress;

  const onRequest = () => {
    setIsLoading(true);
    axios.get(`/dictionary/?limit=${limit}&offset=${offset}`)
      .then(res => {
        onDictionaryLoaded(res.data.results);
        setIsLoading(false);
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    onRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDictionaryLoaded = (newItems) => {
    if (newItems.length < limit) {
      setDictionary([...dictionary, ...newItems]);
      setOffset(offset => limit);
      setIsEnd(true);
    } else if (newItems.length === 0) {
      setIsEnd(true);
    }
    else {
      setDictionary([...dictionary, ...newItems]);
      setOffset(offset => offset + limit);
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
          localStorage.setItem("user", JSON.stringify({ ...user, words_in_progress: wordsInProgress + 1 }));
          dispatch(changeCountOfWordsInProgress(
            wordsInProgress + 1
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
          localStorage.setItem("user", JSON.stringify({ ...user, words_in_progress: user.words_in_progress - 1 }));
          dispatch(changeCountOfWordsInProgress(
            wordsInProgress - 1
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
      {isLoading && !dictionary.length && <Spinner
        animation="border"
        role="status">
        <span
          className="visually-hidden">
          Loading...
        </span>
      </Spinner>}
      <div
        className='dictionary-wrap'>
        <SeacrhDictionaryWords />
        <ul>
          {dictionary.map(
            item => <WordsListItem
              key={item.id}
              item={item}
              onDeleteItem={onDeleteItem}
              onUpdateItem={onUpdateItem}
              isLoading={isLoading}
            />
          )}
        </ul>
        <div className='flex dict-control'>
          <Button
            className="tac"
            btnType="md"
            raised
            onClick={onRequest}
            disabled={(isLoading || isEnd || dictionary.length === 0)}>
            Load more
          </Button>
        </div>
      </div>
    </>
  )
}

export default DictionaryList;
