import MainPage from "./Pages/MainPage";
import Navigation from "./Header/Navigation";
import { Container } from "react-bootstrap";
import QuizPage from "./Pages/QuizPage";
import ErrorPage from "./Pages/ErrorPage";
import DictionaryPage from "./Pages/DictionaryPage";

function App() {
  return (
    <Container fluid="sm" className="mt-5 text-center">
      <Navigation />
      <MainPage />
      {/* <ErrorPage /> */}
      {/* <QuizPage /> */}
      {/* <DictionaryPage /> */}
    </Container >
  );
}

export default App;
