import { lazy, Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button } from "../Common";
import AddedWordsList from "../Dictionary/AddedWordsList";
import WordsSearchWrapper from "../WordsSearchWrapper/WordsSearchWrapper";

const LazyCollections = lazy(() => import("../Modals/ColletcionModal"));

function MainPage() {
  const [modalCollectionShow, setModalCollectionShow] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState([]);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const isUserHasWordsInProgress = user.words_in_progress < 10;

  return (
    <>
      {errorMsgs.length > 0 && (
        <Alert message={`${errorMsgs.toString()}: words already exist`} />
      )}
      <div className="top-content">
        <WordsSearchWrapper />
        <AddedWordsList />
      </div>
      <div className="bottom-content tac">
        <div className="bottom-content-words flex">
          <p className="words-text">
            {isUserHasWordsInProgress
              ? `Add min ${10 - user.words_in_progress} word(s) or select`
              : "You can also learn words from"}
          </p>
          <Button
            btnType="sm"
            outline
            disabled={!isAuthenticated}
            onClick={() => setModalCollectionShow(true)}
          >
            Collection
          </Button>
        </div>
        <Button
          linkTo="/quiz"
          btnType="lg"
          raised
          disabled={!isAuthenticated || isUserHasWordsInProgress}
        >
          Start learning
        </Button>
      </div>

      <Suspense fallback={<span>Loading...</span>}>
        {modalCollectionShow && (
          <LazyCollections
            show={modalCollectionShow}
            onHide={() => setModalCollectionShow(false)}
            setErrorMsgs={setErrorMsgs}
          />
        )}
      </Suspense>
    </>
  );
}

export default MainPage;
