import axios from 'axios';
import { loginUnsetUser } from "./AuthSlice";
import { store } from "../../Store";

// use dispatch inside a function
const logout = () => {
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
    store.dispatch(loginUnsetUser());

    axios.post("http://127.0.0.1:8000/api/accounts/token/logout/")
        .then(() => {
            axios.defaults.headers.common["Authorization"] = "";
        }
        )
        .catch(error => {
            axios.defaults.headers.common["Authorization"] = "";
            throw error;
        });
}

export default logout;