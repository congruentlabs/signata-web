/* eslint-disable react/jsx-filename-extension */
import React from 'react';
// import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import { DAppProvider } from '@usedapp/core';
import { SnackbarProvider } from 'notistack';
// import './index.css';
import App from './App';
import { SubgraphProvider } from './SubgraphProvider';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <SubgraphProvider>
      <DAppProvider>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </DAppProvider>
    </SubgraphProvider>
  </React.StrictMode>,
);
