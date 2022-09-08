import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Button, Title, Item } from "../Common";

import QuizWrapper from "../Quiz/QuizWrapper";


const QuizPage = () => {
    const { isAuthenticated, user } = useSelector(state => state.user);
    console.log(user.words_in_progress)
    return (
        <>
            {!isAuthenticated || user.words_in_progress < 10 && <Navigate to="/" />}
            <div className="top-content">
                <Title
                    text={"Test your knowledge"}
                />
            </div>
            <div className='bottom-content bottom-content-full tac'>
                <QuizWrapper />
            </div>
        </>
    )
}

export default QuizPage;
