import axios from "axios";
import { store } from "../../Store";
import {
  loginSetToken,
  loginSetUser,
  loginUnsetUser,
} from "../../Reducers/AuthSlice";

const login = (email, password) =>
  axios
    .post("accounts/login/", { email, password })
    .then((response) => {
      const token = response.data["key"];
      store.dispatch(loginSetToken(token));
      localStorage.setItem("authTokens", token);
      axios.defaults.headers.common["Authorization"] = "Token " + token;
      axios
        .get("accounts/user/")
        .then((response) => {
          store.dispatch(loginSetUser(response.data));
        })
        .catch((error) => {
          store.dispatch(loginUnsetUser());
          localStorage.removeItem("authTokens");
          throw error;
        });
    })
    .catch((error) => {
      throw error;
    });

export default login;
