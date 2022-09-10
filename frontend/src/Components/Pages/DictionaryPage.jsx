import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import DictionaryList from "../Dictionary/DictionaryList";
import { Button, Title, Item } from "../Common";


const DictionaryPage = () => {
    const { user, isAuthenticated } = useSelector(state => state.user);

    return (
        <>
            {!isAuthenticated && <Navigate to="/" />}

            <div className="top-content">
                <Title
                    title="My dictionary"
                    childrenComponent={
                        <>
                            <p>{user.words_in_progress}</p>
                            <span>words</span>
                        </>
                    }
                />
            </div>
            <div className='bottom-content bottom-content-top'>
                <DictionaryList user={user} />
            </div>
        </>
    );
}

export default DictionaryPage;
