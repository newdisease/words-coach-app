import { useSelector } from "react-redux";
import Button from "../Common/Button";
import AddedWordsList from "../Dictionary/AddedWordsList";
import WordsSearchWrapper from "../WordsSearchWrapper/WordsSearchWrapper";

function MainPage() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const isUserHasWordsInProgress = user.words_in_progress < 10;

  return (
    <>
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
          <Button btnType="sm" outline disabled>
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
    </>
  );
}

export default MainPage;
