import axios from 'axios';
import { loginSetToken, loginSetUser, loginUnsetUser } from "./AuthSlice";
import { store } from "../../Store";

const login = (email, password) => {
  return axios
    .post("accounts/login/", { email, password })
    .then((response) => {
      const token = response.data['key'];
      store.dispatch(loginSetToken(token));
      localStorage.setItem("authTokens", token);
      axios.defaults.headers.common["Authorization"] = "Token " + token;
      axios.get("accounts/user/").then((response) => {
        store.dispatch(loginSetUser(response.data));
        localStorage.setItem("user", JSON.stringify(response.data));
      })
        .catch((error) => {
          store.dispatch(loginUnsetUser());
          localStorage.removeItem("authTokens");
          localStorage.removeItem("user");
          throw error;
        }
        );
    })
    .catch((error) => {
      throw error;
    }
    );
}

export default login;