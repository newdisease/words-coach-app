import MainPage from "./Pages/MainPage";
import Navigation from "./Header/Navigation";
import { Container } from "react-bootstrap";

function App() {
  return (
    <Container fluid="sm" className="mt-5 text-center">
      <Navigation />
      <MainPage />
    </Container >
  );
}

export default App;
