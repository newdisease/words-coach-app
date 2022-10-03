import { textToSpeech } from "../../Services/TextToSpeech.js";
import { Button } from "../Common";
import { ResetIcon, TrashIcon, VolumeUpIcon } from "./Icons";
import { capitalizeFirstLetter } from "./utils";

import classnames from "classnames";
import "./WordsListItem.scss";

const MAX_PROGRESS = 3;

const WordsListItem = ({
  item,
  onDeleteItem,
  onUpdateItem,
  isLoading,
  isProgress,
  isBlue,
}) => {
  const { id, en_word, uk_word, progress, itemTitle } = item;

  const handleCardSubmit = (id) => {
    setTimeout(() => {
      onDeleteItem(id);
    }, 500);
  };

  return (
    <li
      className={classnames("flex flex-j-b item-wrapper", {
        "item-wrapper-blue": isBlue,
      })}
    >
      <div className="item">
        <p className="item-title">
          {en_word ? (
            <>
              {capitalizeFirstLetter(en_word)}{" "}
              <Button
                className="voice"
                btnType="icon"
                onClick={() => textToSpeech(en_word)}
              >
                <VolumeUpIcon />
              </Button>{" "}
            </>
          ) : (
            capitalizeFirstLetter(itemTitle)
          )}
        </p>
        <p className="item-content">{uk_word || "collection"}</p>
      </div>
      <div className="flex controls-wrapper">
        {isProgress && (
          <>
            {progress >= 0 && (
              <div className="flex item-progress">
                <div className="flex item-progress-bar">
                  {[...Array(MAX_PROGRESS)].map((item, key) => (
                    <span
                      className={classnames("dot", {
                        "dot-grey": key + 1 > progress,
                        "dot-blue": progress === MAX_PROGRESS,
                      })}
                      key={key}
                    ></span>
                  ))}
                </div>
                <p className="tac">
                  {progress}/{MAX_PROGRESS}{" "}
                </p>
              </div>
            )}
          </>
        )}
        {onUpdateItem && (
          <Button
            className="icon-blue"
            btnType="icon"
            onClick={() => onUpdateItem(id)}
            disabled={isLoading || progress === 0}
          >
            <ResetIcon />
          </Button>
        )}
        <Button
          className="icon-red"
          btnType="icon"
          onClick={(e) => {
            e.target.closest(".item-wrapper").classList.add("deleted");
            handleCardSubmit(id);
          }}
          disabled={isLoading}
        >
          <TrashIcon />
        </Button>
      </div>
    </li>
  );
};

export default WordsListItem;
