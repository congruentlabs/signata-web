import React, {
  useState, useMemo, useEffect, createContext,
} from 'react';
import { useEthers } from '@usedapp/core';
import { createTheme, ThemeProvider, experimental_sx as sx } from '@mui/material/styles';
import { Container, CssBaseline } from '@mui/material';
import {
  lime, orange, red, blue,
} from '@mui/material/colors';
import { HashRouter, Route, Routes } from 'react-router-dom';
import AppHeader from './components/app/AppHeader';
import AppFooter from './components/app/AppFooter';
import AppView from './components/AppView';
import IdentityView from './components/IdentityView';
import { SUPPORTED_CHAINS } from './hooks/helpers';
import NoConnectionWarning from './components/connection/NoConnectionWarning';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const { account, deactivate, chainId } = useEthers();
  const [identities, setIdentities] = useState([]);
  const [encryptionPassword, setEncryptionPassword] = useState('');
  const [supportedChain, setSupportedChain] = useState(false);
  const [mode, setMode] = useState('dark');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

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
        mode,
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
    [mode],
  );

  useEffect(() => {
    const chainName = SUPPORTED_CHAINS.find((network) => network.chainId === chainId)?.chainName;
    if (chainName) {
      setSupportedChain(true);
    } else {
      setSupportedChain(false);
    }
  }, [chainId]);

  const handleClickDisconnect = () => {
    deactivate();
    setIdentities([]);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {account ? (
          <AppHeader
            account={account}
            handleClickDisconnect={handleClickDisconnect}
            chainId={chainId}
            supportedChain={supportedChain}
            colorMode={colorMode}
            theme={theme}
          />
        ) : (
          <NoConnectionWarning theme={theme} />
        )}
        <Container maxWidth="md" sx={{ marginTop: 1 }}>
          <HashRouter>
            <Routes>
              <Route
                path="/"
                element={(
                  <AppView
                    account={account}
                    chainId={chainId}
                    encryptionPassword={encryptionPassword}
                    identities={identities}
                    setEncryptionPassword={setEncryptionPassword}
                    setIdentities={setIdentities}
                    SUPPORTED_CHAINS={SUPPORTED_CHAINS}
                    supportedChain={supportedChain}
                    theme={theme}
                  />
              )}
              />
              <Route
                path="identity/:id"
                element={(
                  <IdentityView
                    theme={theme}
                    account={account}
                    supportedChain={supportedChain}
                    SUPPORTED_CHAINS={SUPPORTED_CHAINS}
                    chainId={chainId}
                  />
              )}
              />
            </Routes>
          </HashRouter>
        </Container>
        <AppFooter colorMode={colorMode} theme={theme} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
