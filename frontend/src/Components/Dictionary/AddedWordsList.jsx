import classnames from "classnames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "../../Hooks";
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
  const { request } = useAxios();
  const dispatch = useDispatch();

  let listAddedWords = [...addedWords]?.reverse();
  if (!isShown) {
    listAddedWords = listAddedWords.slice(0, 3);
  }

  const onDeleteItem = (id) => {
    if (typeof id === "number") {
      const word = addedWords.find((item) => item.id === id);
      request("post", "/dictionary/delete/", { words: [word] }).then((data) => {
        dispatch(dictUnsetWord(id));
        dispatch(removeWordsFromCollectionInDict(data.deleted_words));
        dispatch(
          removeWordsFromCollectionInProgress(data.deleted_words_in_progress)
        );
      });
    } else {
      const wordsSet = wordsFromAddedCollections.find(
        (item) => item.set_of_words === id
      );
      request("post", "/dictionary/delete/", {
        words: wordsSet.added_words,
      }).then((data) => {
        if (!data.message) {
          dispatch(removeWordsFromCollectionInDict(data.deleted_words));
          dispatch(
            removeWordsFromCollectionInProgress(data.deleted_words_in_progress)
          );
          dispatch(dictUnsetWordFromCollection(id));
          dispatch(dictUnsetWord(id));
        } else {
          console.log(data.message);
          dispatch(dictUnsetWordFromCollection(id));
          dispatch(dictUnsetWord(id));
        }
      });
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
