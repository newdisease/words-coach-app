import axios from "axios";
import classnames from "classnames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCountOfWordsInDictionary,
  changeCountOfWordsInProgress,
  DEC,
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
      axios
        .delete(`/dictionary/${id}/`)
        .then(() => {
          dispatch(changeCountOfWordsInDictionary(DEC));
          dispatch(changeCountOfWordsInProgress(DEC));
          dispatch(dictUnsetWord(id));
        })
        .catch((e) => console.log(e));
    } else {
      axios.get("/dictionary/").then((res) => {
        const idsForDel = [];
        const wordsInDictionary = res.data;
        const addedWords = wordsFromAddedCollections.find(
          (item) => item.set_of_words === id
        ).added_words;
        addedWords.forEach((word) => {
          const { uk_word, en_word } = word;
          const wordInDictionary = wordsInDictionary.find(
            (item) => item.uk_word === uk_word && item.en_word === en_word
          );
          idsForDel.push(wordInDictionary.id);
        });
        idsForDel.forEach((id) => {
          axios
            .delete(`/dictionary/${id}/`)
            .then(() => {
              dispatch(changeCountOfWordsInDictionary(DEC));
              if (
                wordsInDictionary.find((item) => item.id === id).progress < 3
              ) {
                dispatch(changeCountOfWordsInProgress(DEC));
              }
              dispatch(dictUnsetWord(id));
            })
            .catch((e) => console.log(e));
        });
        dispatch(dictUnsetWordFromCollection(id));
        dispatch(dictUnsetWord(id));
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
