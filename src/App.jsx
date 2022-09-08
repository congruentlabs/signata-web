import React, { useState, useMemo, useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import useLocalStorageState from 'use-local-storage-state';
import {
  createTheme,
  ThemeProvider,
  experimental_sx as sx,
} from '@mui/material/styles';
import {
  Box, Container, Grid, CssBaseline, LinearProgress,
} from '@mui/material';
import {
  lime, orange, red, blue,
} from '@mui/material/colors';
import {
  AppFooter,
  AppHeader,
  NoConnectionWarning,
  // NetworkServices,
  ProductOverview,
  ManageIdentities,
  YourAccount,
  UnderConstructionWarning,
  DevModeWarning,
  // Subscription,
} from './components';
import secureStorage from './utils/secureStorage';
import UnsupportedChain from './components/app/UnsupportedChain';
import { SUPPORTED_CHAINS } from './hooks/helpers';

// const dSataContractAddress = '0x49428f057dd9d20a8e4c6873e98afd8cd7146e3b';

function App() {
  const {
    activateBrowserWallet, account, deactivate, chainId,
  } = useEthers();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [config, setConfig, isPersistent] = useLocalStorageState('config', []);
  const [identities, setIdentities] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState('');
  const [advancedModeEnabled, setAdvancedModeEnabled] = useLocalStorageState('advancedModeEnabled', { defaultValue: false });
  const [supportedChain, setSupportedChain] = useState(false);

  useEffect(() => {
    const chainName = SUPPORTED_CHAINS.find(
      (network) => network.chainId === chainId,
    )?.chainName;
    if (chainName) {
      setSupportedChain(true);
    } else {
      setSupportedChain(false);
    }
  }, [chainId]);

  useEffect(() => {
    if (encryptionPassword) {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
  }, [encryptionPassword, setIdentities]);

  useEffect(() => {
    if (identities && encryptionPassword) {
      // update the localStorage with identities every time they're changed
      setLoading(true);
      secureStorage(encryptionPassword).setItem('identities', identities);
      setLoading(false);
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
          main: blue.A700,
        },
        warning: {
          main: orange.A700,
        },
        error: {
          main: red.A700,
        },
        mode: prefersDarkMode ? 'light' : 'light',
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
        <Box
          sx={{
            minHeight: '80vh',
            paddingTop: { xs: 1, sm: 2 },
            paddingBottom: { xs: 1, sm: 2 },
          }}
        >
          <Grid
            container
            spacing={4}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
          >
            {window.location.hostname !== 'localhost' && (
              <UnderConstructionWarning />
            )}
            {window.location.hostname === 'localhost' && (
              <DevModeWarning />
            )}
            {!account && <ProductOverview />}
            {!account && <NoConnectionWarning />}
            {account && encryptionPassword && !supportedChain && (
              <UnsupportedChain SUPPORTED_CHAINS={SUPPORTED_CHAINS} />
            )}
            {isLoading && <Box sx={{ width: '100%', py: 3 }}><LinearProgress /></Box>}
            {account && encryptionPassword && supportedChain && (
              <ManageIdentities
                identities={identities}
                setIdentities={setIdentities}
                advancedModeEnabled={advancedModeEnabled}
              />
            )}
            {account && (
              <YourAccount
                config={config}
                setConfig={setConfig}
                isPersistent={isPersistent}
                setEncryptionPassword={setEncryptionPassword}
                unlocked={encryptionPassword !== ''}
                advancedModeEnabled={advancedModeEnabled}
                setAdvancedModeEnabled={setAdvancedModeEnabled}
                identities={identities}
                setIdentities={setIdentities}
              />
            )}
            {/* {account && encryptionPassword && <Subscription />} */}
            {/* {account && encryptionPassword && <NetworkServices />} */}
          </Grid>
        </Box>
      </Container>
      <AppFooter />
    </ThemeProvider>
  );
}

export default App;
