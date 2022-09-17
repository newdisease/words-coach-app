import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { fetchUserInfo } from "../Reducers/AuthSlice";
import { store } from "../Store";

import Header from "./Header/Header";
import { DictionaryPage, ErrorPage, MainPage, QuizPage } from "./Pages";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

function App() {
  useEffect(() => {
    store.dispatch(fetchUserInfo());
  }, []);

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/dictionary" element={<DictionaryPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </main>
        </div>
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App;
