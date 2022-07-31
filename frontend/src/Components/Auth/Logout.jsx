import axios from 'axios';
import { loginUnsetUser } from "./AuthSlice";
import { store } from "../../Store";


const logout = () => {
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
    store.dispatch(loginUnsetUser());

    axios.post("accounts/token/logout/")
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