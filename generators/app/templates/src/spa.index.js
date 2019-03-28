import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import AppComponent from "./App/app.component";
import { createBrowserHistory } from "history";
import "bootstrap/dist/css/bootstrap.min.css";

const history = createBrowserHistory();
// Find Object in index.html for starting point.
const destination = document.getElementById("root");

ReactDOM.render(
  <BrowserRouter>
    <AppComponent />
  </BrowserRouter>,
  destination
);
