import React, { useState, useMemo, useEffect } from 'react';
import { useEthers, useTokenBalance } from '@usedapp/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import useLocalStorageState from 'use-local-storage-state';
import {
  createTheme,
  ThemeProvider,
  experimental_sx as sx,
} from '@mui/material/styles';
import {
  Box, Container, Grid, CssBaseline,
} from '@mui/material';
import {
  lime, grey, orange, red,
} from '@mui/material/colors';
import {
  AppFooter,
  AppHeader,
  NoConnectionWarning,
  NetworkServices,
  ProductOverview,
  ManageIdentities,
  YourAccount,
} from './components';
import secureStorage from './utils/secureStorage';

// const dSataContractAddress = '0x49428f057dd9d20a8e4c6873e98afd8cd7146e3b';

function App() {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [config, setConfig, isPersistent] = useLocalStorageState('config', []);
  const [identities, setIdentities] = useState([]);
  const [encryptionPassword, setEncryptionPassword] = useState('');

  useEffect(() => {
    if (encryptionPassword) {
      try {
        const dat = secureStorage(encryptionPassword).getItem('identities');
        console.log(dat);
        if (dat === null) {
          console.log('no identities found');
          setIdentities([]);
        } else {
          console.log('found identities');
          setIdentities(dat);
        }
      } catch (e) {
        console.error(e);
        setIdentities([]);
      }
    }
  }, [encryptionPassword, setIdentities]);

  useEffect(() => {
    if (identities && encryptionPassword) {
      // update the localStorage with identities every time they're changed
      secureStorage(encryptionPassword).setItem('identities', identities);
      // update the lastSaved for any sync jobs
      // setConfig({ ...config, lastSaved: Date.now() });
    }
  }, [identities, encryptionPassword]);

  useEffect(() => {
    activateBrowserWallet(); // just try to auto activate on load for metamask users
  }, [activateBrowserWallet]);

  const theme = useMemo(
    () => createTheme({
      palette: {
        primary: {
          main: lime.A700,
        },
        secondary: {
          main: grey[900],
        },
        warning: {
          main: orange.A700,
        },
        error: {
          main: red.A700,
        },
        mode: prefersDarkMode ? 'dark' : 'light',
        // mode: 'light',
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
              // boxShadow: 'none',
            },
          },
        },
      },
    }),
    [prefersDarkMode],
  );

  const handleClickDisconnect = () => {
    deactivate();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {account && (
        <AppHeader
          darkMode={theme.palette.mode === 'dark'}
          account={account}
          handleClickDisconnect={handleClickDisconnect}
        />
      )}
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Box
          sx={{
            minHeight: '80vh',
            paddingTop: { xs: 1, sm: 2 },
            paddingBottom: { xs: 1, sm: 2 },
          }}
        >
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
          >
            {!account && <ProductOverview />}
            {!account && <NoConnectionWarning />}
            {account && encryptionPassword && (
              <ManageIdentities identities={identities} setIdentities={setIdentities} />
            )}
            {account && (
              <YourAccount
                config={config}
                setConfig={setConfig}
                isPersistent={isPersistent}
                setEncryptionPassword={setEncryptionPassword}
                unlocked={encryptionPassword !== ''}
              />
            )}
            {account && encryptionPassword && <NetworkServices />}
          </Grid>
        </Box>
      </Container>
      <AppFooter />
    </ThemeProvider>
  );
}

export default App;
