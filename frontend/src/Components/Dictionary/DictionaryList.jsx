import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "../../Hooks";
import {
  changeCountOfWordsInDictionary,
  changeCountOfWordsInProgress,
  DEC,
  INC,
} from "../../Reducers/AuthSlice";
import { dictUnsetWord } from "../../Reducers/DictSlice";
import { Button, Spinner, WordsListItem } from "../Common";

import "./DictionaryList.scss";

const SeacrhDictionaryWords = ({ setSearchWords }) => {
  const [output, setOutput] = useState("");
  const { request, error, clearError } = useAxios();

  useEffect(() => {
    const getData = setTimeout(() => {
      if (output.length >= 1) {
        clearError();
        request("get", `/dictionary/?search=${output}`)
          .then((res) => setSearchWords(res))
          .catch(console.log(error));
      } else {
        setSearchWords(null);
      }
    }, 500);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [output]);

  return (
    <input
      className="dict-search"
      type="text"
      placeholder="Search..."
      onChange={(e) => setOutput(e.target.value)}
    />
  );
};

const DictionaryList = ({ user }) => {
  const [dictionary, setDictionary] = useState([]);
  const [searchWords, setSearchWords] = useState(null);
  const [offset, setOffset] = useState(0);
  const { addedWords } = useSelector((state) => state.dict);
  const wordsInDictionary = user.words_in_dictionary;
  const { request, isLoading, error, clearError } = useAxios();

  const dispatch = useDispatch();

  const limit = 5;

  const onRequest = () => {
    request("get", `/dictionary/?limit=${limit}&offset=${offset}`).then((res) =>
      onDictionaryLoaded(res.results)
    );
  };

  useEffect(() => {
    clearError();
    onRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDictionaryLoaded = (newItems) => {
    setDictionary((prevDictionary) => [...prevDictionary, ...newItems]);
    setOffset(offset + limit);
  };

  const onUpdateItem = (id) => {
    const prevProgress = dictionary.find((item) => item.id === id).progress;
    request("patch", `/dictionary/${id}/`, { progress: 0 })
      .then((res) => {
        setDictionary(dictionary.map((item) => (item.id === id ? res : item)));
        if (prevProgress > 2) {
          dispatch(changeCountOfWordsInProgress(INC));
        }
      })
      .catch(console.log(error));
  };

  const onDeleteItem = (id) => {
    const prevProgress = dictionary.find((item) => item.id === id).progress;
    request("delete", `/dictionary/${id}/`)
      .then(() => {
        const filteredDictionary = dictionary.filter((item) => item.id !== id);
        setDictionary(filteredDictionary);
        setOffset((offset) => offset - 1);
        setSearchWords(
          searchWords ? searchWords.filter((item) => item.id !== id) : null
        );
        if (filteredDictionary.length === 0) {
          onRequest();
        }
        if (prevProgress < 3) {
          dispatch(changeCountOfWordsInProgress(DEC));
        }
        dispatch(changeCountOfWordsInDictionary(DEC));
        if (addedWords.find((item) => item.id === id)) {
          dispatch(dictUnsetWord(id));
        }
      })
      .catch(console.log(error));
  };

  return (
    <>
      <div className="dictionary-wrap">
        <SeacrhDictionaryWords setSearchWords={setSearchWords} />
        {isLoading && dictionary.length === 0 ? (
          <Spinner />
        ) : (
          <ul>
            {searchWords
              ? searchWords.map((item) => (
                  <WordsListItem
                    key={item.id}
                    item={item}
                    onDeleteItem={onDeleteItem}
                    onUpdateItem={onUpdateItem}
                    isProgress
                    isLoading={isLoading}
                  />
                ))
              : dictionary.map((item) => (
                  <WordsListItem
                    key={item.id}
                    item={item}
                    onDeleteItem={onDeleteItem}
                    onUpdateItem={onUpdateItem}
                    isProgress
                    isLoading={isLoading}
                  />
                ))}
          </ul>
        )}
        <div className="flex dict-control">
          {!searchWords && (
            <Button
              className="tac"
              btnType="md"
              raised
              onClick={onRequest}
              disabled={
                isLoading ||
                dictionary.length === wordsInDictionary ||
                dictionary.length === 0
              }
            >
              Load more
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default DictionaryList;
