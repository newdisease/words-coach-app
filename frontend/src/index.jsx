import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./Components/App";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/Style.scss';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
