/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { DAppProvider } from '@usedapp/core';
import { SnackbarProvider } from 'notistack';
import App from './App';
import { SubgraphProvider } from './SubgraphProvider';

const container = document.getElementById('root');
const root = createRoot(container);

const config = {
  autoConnect: true,
  fastMulticallEncoding: true,
};

root.render(
  <React.StrictMode>
    <SubgraphProvider>
      <DAppProvider config={config}>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </DAppProvider>
    </SubgraphProvider>
  </React.StrictMode>,
);
