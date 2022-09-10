import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../Store";
import axios from "axios";
import { GoogleOAuthProvider } from '@react-oauth/google';

import Header from "./Header/Header";
import { MainPage, QuizPage, DictionaryPage, ErrorPage } from "./Pages";


axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

function App() {
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
          </main >
        </div>
      </GoogleOAuthProvider>
    </Provider >
  );
}

export default App;
