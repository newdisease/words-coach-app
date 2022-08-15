import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import Quiz from "../Quiz/Quiz";


const QuizPage = () => {
    const { isAuthenticated } = useSelector(state => state.user);
    return (
        <>
            {!isAuthenticated ? <Navigate to='/' /> : <Quiz />}
        </>
    )
}

export default QuizPage;
