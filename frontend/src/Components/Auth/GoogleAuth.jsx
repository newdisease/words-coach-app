import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { store } from "../../Store";
import { Button } from "../Common";
import { GoogleIcon } from "../Common/Icons";
import {
  loginSetToken,
  loginSetUser,
  loginUnsetUser,
} from "../../Reducers/AuthSlice";

function GoogleAuthButton({ onHide, setError }) {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) =>
      axios
        .post("accounts/google/", {
          access_token: tokenResponse["access_token"],
        })
        .then((response) => {
          const token = response.data.key;
          store.dispatch(loginSetToken(token));
          localStorage.setItem("authTokens", token);
          axios.defaults.headers.common["Authorization"] = "Token " + token;
          axios
            .get("accounts/user/")
            .then((response) => {
              store.dispatch(loginSetUser(response.data));
              onHide();
            })
            .catch((error) => {
              store.dispatch(loginUnsetUser());
              localStorage.removeItem("authTokens");
            });
        })
        .catch((error) => {
          setError("This email is already in use");
        }),
  });

  return (
    <Button btnType="circle" onClick={() => login()}>
      <GoogleIcon />
    </Button>
  );
}

export default function GoogleAuth(props) {
  if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) return null;
  return <GoogleAuthButton {...props} />;
}
