import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../Store";
import axios from "axios";

import { MainPage, QuizPage, DictionaryPage } from "./Pages";
import { Container } from "react-bootstrap";
import Navigation from "./Navigation/Navigation";

const LazyErrorPage = lazy(() => import("./Pages/ErrorPage"));


axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <header>
          <Container fluid="sm" className="mt-3">
            <Navigation />
          </Container >
        </header>
        <Suspense fallback={
          <span className="visually-hidden">Loading...</span>}>
          <main>
            <Container fluid="sm" className="text-center">
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/dictionary" element={<DictionaryPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="*" element={<LazyErrorPage />} />
              </Routes>
            </Container >
          </main >
        </Suspense>
      </div>
    </Provider>
  );
}

export default App;
