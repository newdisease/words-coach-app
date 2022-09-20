import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addWordsFromCollection } from "../../Reducers/AuthSlice";
import {
  dictSetWord,
  dictSetWordsFromCollection,
} from "../../Reducers/DictSlice";
import { Button, Modal, Spinner } from "../Common";
import { CheckIcon } from "../Common/Icons";
import { capitalizeFirstLetter } from "../Common/utils";

const CollectionModal = ({ show, onHide, setErrorMsgs }) => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState([]);
  const [loadedCollections, setLoadedCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    axios.get("wordssets/").then((res) => {
      setCollections(res.data);
      setIsLoading(false);
    });
  }, []);

  const handleOnChange = (e) => {
    const data = e.target.value;
    if (selectedCollection.includes(data)) {
      setSelectedCollection(selectedCollection.filter((item) => item !== data));
    } else {
      setSelectedCollection([...selectedCollection, data]);
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setErrorMsgs([]);
    selectedCollection.forEach((collection) => {
      axios
        .post(`wordssets/${collection}/`)
        .then((res) => {
          if (!res.data.words_set) {
            setLoadedCollections((prevLoadedCollections) => [
              ...loadedCollections,
              res.data,
            ]);
            dispatch(
              dictSetWord({
                id: res.data.set_of_words,
                itemTitle: res.data.set_of_words,
              })
            );
            dispatch(addWordsFromCollection(res.data.count));
            dispatch(
              dictSetWordsFromCollection({
                set_of_words: res.data.set_of_words,
                added_words: res.data.added_words,
              })
            );
          }
          if (res.data.words_set) {
            setErrorMsgs((prevError) => [
              ...prevError,
              capitalizeFirstLetter(res.data.words_set),
            ]);
          }
        })
        .catch((err) => console.log(err));
    });
    onHide();
  };

  return (
    <>
      <Modal show={show} onHide={onHide} title="Select Collection">
        <div className="checkbox-form-wrap">
          <form className="checkbox-form" id="collections-form">
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                {collections.map((collection) => (
                  <div className="collection flex" key={collection.id}>
                    <input
                      className="collection-checkbox-input"
                      id={collection.id}
                      type="checkbox"
                      name={collection.name}
                      value={collection.id}
                      onChange={(e) => handleOnChange(e)}
                    />
                    <CheckIcon />
                    <div className="collection-checkbox">
                      <label htmlFor={collection.id}>
                        {capitalizeFirstLetter(collection.name)}
                      </label>
                      <p>{collection.word_count} words</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </form>
        </div>
        <div className="modal--controls tac">
          <Button
            form="collections-form"
            type="submit"
            btnType="lg-modal"
            raised
            onClick={(e) => handleOnSubmit(e)}
            disabled={selectedCollection.length === 0}
          >
            Add collection
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CollectionModal;
