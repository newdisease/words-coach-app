import MainPage from "./Pages/MainPage";
import Navigation from "./Header/Navigation";
import { Container } from "react-bootstrap";
import ErrorPage from "./Pages/ErrorPage";

function App() {
  return (
    <Container fluid="sm" className="mt-5 text-center">
      <Navigation />
      <MainPage />
      {/* <ErrorPage /> */}
    </Container >
  );
}

export default App;
