import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import DictionaryList from "../Dictionary/Dictionary";


const DictionaryPage = () => {
    const { isAuthenticated } = useSelector(state => state.user);

    return (
        <>
            {!isAuthenticated ? <Navigate to='/' /> : <DictionaryList />}
        </>
    );
}

export default DictionaryPage;
