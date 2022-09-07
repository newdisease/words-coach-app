import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Button, Title, Item } from "../Common";

import QuizWrapper from "../Quiz/QuizWrapper";


const QuizPage = () => {
    const { isAuthenticated } = useSelector(state => state.user);
    return (
        <>
            {!isAuthenticated && <Navigate to="/" />}
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
