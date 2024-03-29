import axios from "axios";
import { loginUnsetUser } from "../../Reducers/AuthSlice";
import { dictResetWords } from "../../Reducers/DictSlice";
import { store } from "../../Store";

const logout = () => {
  localStorage.removeItem("authTokens");
  store.dispatch(loginUnsetUser());
  store.dispatch(dictResetWords());

  axios
    .post("accounts/logout/")
    .then(() => {
      axios.defaults.headers.common["Authorization"] = "";
    })
    .catch((error) => {
      axios.defaults.headers.common["Authorization"] = "";
      throw error;
    });
};

export default logout;
