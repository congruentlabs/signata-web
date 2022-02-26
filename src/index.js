/* eslint-disable react/jsx-filename-extension */
import React from "react";
import ReactDOM from "react-dom";
import { DAppProvider } from "@usedapp/core";
import { SnackbarProvider } from 'notistack';
// import './index.css';
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const config = {};

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
