import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Navigation from "./Navigation/Navigation";
import { Container } from "react-bootstrap";
import { MainPage, ErrorPage, QuizPage, DictionaryPage } from "./Pages";
import { store } from "../Store";
import axios from "axios";


axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <header>
          <Container fluid="sm" className="mt-5">
            <Navigation />
          </Container >
        </header>
        <main>
          <Container fluid="sm" className="text-center">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/dictionary" element={<DictionaryPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Container >
        </main >
      </div>
    </Provider>
  );
}

export default App;
