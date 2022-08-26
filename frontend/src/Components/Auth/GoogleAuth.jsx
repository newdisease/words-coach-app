import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { loginSetToken, loginSetUser, loginUnsetUser } from "./AuthSlice";
import { store } from "../../Store";


function GoogleAuth({ onHide, setIsLogedIn, setError }) {
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
            setIsLogedIn(true);
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
    <Button onClick={() => login()}>
      Sign in with Google 🚀
    </Button>
  );
}

export default GoogleAuth;
