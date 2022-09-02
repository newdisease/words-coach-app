import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { loginSetToken, loginSetUser, loginUnsetUser } from "./AuthSlice";
import { store } from "../../Store";
import { Button } from '../Common';
import { GoogleIcon } from '../Common/Icons';


function GoogleAuth({ onHide, setError }) {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      return axios.post("accounts/google/", { access_token: tokenResponse['access_token'] })
        .then(response => {
          const token = response.data.key;
          store.dispatch(loginSetToken(token));
          localStorage.setItem("authTokens", token);
          axios.defaults.headers.common["Authorization"] = "Token " + token;
          axios.get("accounts/user/").then((response) => {
            store.dispatch(loginSetUser(response.data));
            localStorage.setItem("user", JSON.stringify(response.data));
            onHide();
          })
            .catch((error) => {
              store.dispatch(loginUnsetUser());
              localStorage.removeItem("authTokens");
              localStorage.removeItem("user");
            }
            );
        })
        .catch((error) => {
          setError("This email is already in use. Try to login with your email and password.");
        }
        );
    }
  })

  return (
    <Button
      btnType="circle"
      onClick={() => login()}
    >
      <GoogleIcon />
    </Button>
  );
}

export default GoogleAuth;
