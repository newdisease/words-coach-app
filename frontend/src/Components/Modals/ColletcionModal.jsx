import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAxios } from "../../Hooks";
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
  const { request, isLoading } = useAxios();
  const dispatch = useDispatch();

  useEffect(() => {
    request("get", "wordssets/").then((data) => setCollections(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      request("post", `wordssets/${collection}/`)
        .then((data) => {
          if (!data.words_set) {
            setLoadedCollections((prevLoadedCollections) => [
              ...loadedCollections,
              data,
            ]);
            dispatch(
              dictSetWord({
                id: data.set_of_words,
                itemTitle: data.set_of_words,
              })
            );
            dispatch(addWordsFromCollection(data.count));
            dispatch(
              dictSetWordsFromCollection({
                set_of_words: data.set_of_words,
                added_words: data.added_words,
              })
            );
          }
          if (data.words_set) {
            setErrorMsgs((prevError) => [
              ...prevError,
              capitalizeFirstLetter(data.words_set),
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
