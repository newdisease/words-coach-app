import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import DictionaryList from "../Dictionary/Dictionary";


const DictionaryPage = () => {
    const { user, isAuthenticated } = useSelector(state => state.user);

    return (
        <>
            {!isAuthenticated ?
                <Navigate to='/' /> : <DictionaryList user={user} />}
        </>
    );
}

export default DictionaryPage;
