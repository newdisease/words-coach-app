import { Routes, Route } from "react-router-dom";
import Navigation from "./Header/Navigation";
import { Container } from "react-bootstrap";
import { MainPage, ErrorPage, QuizPage, DictionaryPage } from "./Pages";

function App() {
  return (
    <div className="app">
      <header>
        <Container fluid="sm" className="mt-5 text-center">
          <Navigation />
        </Container >
      </header>
      <main>
        <Container fluid="sm" className="mt-5 text-center">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/dictionary" element={<DictionaryPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Container >
      </main >
    </div>
  );
}

export default App;
