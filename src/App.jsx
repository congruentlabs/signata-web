import React, { useState, useMemo } from 'react';
import { useEthers } from '@usedapp/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider, experimental_sx as sx } from '@mui/material/styles';
import { Container, CssBaseline } from '@mui/material';
import {
  lime, orange, red, blue,
} from '@mui/material/colors';
import { HashRouter, Route, Routes } from 'react-router-dom';
import {
  AppFooter, AppHeader, AppView, IdentityView,
} from './components';

// const dSataContractAddress = '0x49428f057dd9d20a8e4c6873e98afd8cd7146e3b';

function App() {
  const {
    activateBrowserWallet, account, deactivate, chainId,
  } = useEthers();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [identities, setIdentities] = useState([]);
  const [supportedChain, setSupportedChain] = useState(false);

  const theme = useMemo(
    () => createTheme({
      palette: {
        primary: {
          main: lime.A700,
        },
        secondary: {
          main: blue.A700,
        },
        warning: {
          main: orange.A700,
        },
        error: {
          main: red.A700,
        },
        mode: prefersDarkMode ? 'dark' : 'light',
      },
      typography: {
        fontFamily: 'Roboto Condensed',
      },
      components: {
        MuiAlert: {
          styleOverrides: {
            root: sx({
              borderRadius: 0,
              border: 1,
            }),
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 0,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 6,
            },
          },
        },
      },
    }),
    [prefersDarkMode],
  );

  const handleClickDisconnect = () => {
    deactivate();
    setIdentities([]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {account && (
        <AppHeader
          account={account}
          handleClickDisconnect={handleClickDisconnect}
          chainId={chainId}
          supportedChain={supportedChain}
        />
      )}
      <Container maxWidth="md" sx={{ marginTop: 1 }}>
        <HashRouter>
          <Routes>
            <Route
              path="/"
              element={(
                <AppView
                  theme={theme}
                  account={account}
                  identities={identities}
                  setIdentities={setIdentities}
                />
              )}
            />
            <Route path="identity/:id" element={<IdentityView theme={theme} account={account} />} />
          </Routes>
        </HashRouter>
      </Container>
      <AppFooter />
    </ThemeProvider>
  );
}

export default App;
