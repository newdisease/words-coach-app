import axios from "axios";
import classnames from "classnames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCountOfWordsInDictionary,
  changeCountOfWordsInProgress,
  DEC,
} from "../../Reducers/AuthSlice";
import { dictUnsetWord } from "../../Reducers/DictSlice";
import { Button, WordsListItem } from "../Common";
import { ArrowDropDownIcon, ArrowDropUpIcon } from "../Common/Icons";
import "./AddedWordsList.scss";

const AddedWordsList = () => {
  const [isShown, setIsShown] = useState(false);
  const { addedWords } = useSelector((state) => state.dict);
  const dispatch = useDispatch();

  let listAddedWords = [...addedWords]?.reverse();
  if (!isShown) {
    listAddedWords = listAddedWords.slice(0, 3);
  }

  const onDeleteItem = (id) =>
    axios
      .delete(`/dictionary/${id}/`)
      .then(() => {
        dispatch(changeCountOfWordsInDictionary(DEC));
        dispatch(changeCountOfWordsInProgress(DEC));
        dispatch(dictUnsetWord(id));
      })
      .catch((e) => console.log(e));

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
