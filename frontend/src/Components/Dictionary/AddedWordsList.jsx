import axios from "axios";
import classnames from "classnames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeWordsFromCollectionInDict,
  removeWordsFromCollectionInProgress,
} from "../../Reducers/AuthSlice";
import {
  dictUnsetWord,
  dictUnsetWordFromCollection,
} from "../../Reducers/DictSlice";
import { Button, WordsListItem } from "../Common";
import { ArrowDropDownIcon, ArrowDropUpIcon } from "../Common/Icons";
import "./AddedWordsList.scss";

const AddedWordsList = () => {
  const [isShown, setIsShown] = useState(false);
  const { addedWords, wordsFromAddedCollections } = useSelector(
    (state) => state.dict
  );
  const dispatch = useDispatch();

  let listAddedWords = [...addedWords]?.reverse();
  if (!isShown) {
    listAddedWords = listAddedWords.slice(0, 3);
  }

  const onDeleteItem = (id) => {
    if (typeof id === "number") {
      const word = addedWords.find((item) => item.id === id);
      axios
        .post("/dictionary/delete/", {
          words: [word],
        })
        .then((res) => {
          dispatch(dictUnsetWord(id));
          dispatch(removeWordsFromCollectionInDict(res.data.deleted_words));
          dispatch(
            removeWordsFromCollectionInProgress(
              res.data.deleted_words_in_progress
            )
          );
        })
        .catch((e) => console.log(e));
    } else {
      const wordsSet = wordsFromAddedCollections.find(
        (item) => item.set_of_words === id
      );
      axios
        .post("/dictionary/delete/", {
          words: wordsSet.added_words,
        })
        .then((res) => {
          if (!res.data.message) {
            dispatch(removeWordsFromCollectionInDict(res.data.deleted_words));
            dispatch(
              removeWordsFromCollectionInProgress(
                res.data.deleted_words_in_progress
              )
            );
            dispatch(dictUnsetWordFromCollection(id));
            dispatch(dictUnsetWord(id));
          } else {
            console.log(res.data.message);
            dispatch(dictUnsetWordFromCollection(id));
            dispatch(dictUnsetWord(id));
          }
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <div className="added-words-wrap">
      <ul className={classnames("added-words-list")}>
        {listAddedWords?.map((item) => (
          <WordsListItem
            key={item.id}
            item={item}
            onDeleteItem={onDeleteItem}
            isBlue
          />
        ))}
      </ul>
      {addedWords.length > 3 && (
        <Button
          className="expand-btn"
          btnType="circle"
          onClick={() => setIsShown(!isShown)}
        >
          {isShown ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </Button>
      )}
    </div>
  );
};

export default AddedWordsList;
