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
  lime, blue, grey, orange, red,
} from '@mui/material/colors';
import {
  AppFooter,
  AppHeader,
  NoConnectionWarning,
  NetworkServices,
  ProductOverview,
  ManageIdentities,
} from './components';
import secureStorage from './utils/secureStorage';
import NanoIdentity from './components/identity/NanoIdentity';
import YourAccount from './components/account/YourAccount';

const dSataContractAddress = '0x49428f057dd9d20a8e4c6873e98afd8cd7146e3b';

function App() {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  // const sataBalance = useTokenBalance(getTokenContractAddress(chainId), account);
  // const dSataBalance = useTokenBalance(dSataContractAddress, account);
  // const sataPriceData = useUniswapSataPriceData();
  // const dSataPriceData = useUniswapDSataPriceData();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  // const [isSetup, setIsSetup] = useState(false);
  // const [signataEncryptionKey, setSignataEncryptionKey] = useState(null);
  // const [services, setServices] = useState([
  //   {
  //     id: 1,
  //     name: 'Test Broker',
  //     type: 'Broker',
  //     network: 'Ethereum',
  //     jurisdiction: 'Australia',
  //     staked: 100000,
  //     status: 'Active'
  //   },
  //   {
  //     id: 2,
  //     name: 'Test Oracle',
  //     type: 'Risk Oracle',
  //     network: 'Ethereum',
  //     jurisdiction: 'Australia',
  //     staked: 0,
  //     status: 'Active'
  //   }
  // ]);

  const [config, setConfig, isPersistent] = useLocalStorageState('config', []);
  const [seeds, setSeeds] = useState([]);
  const [encryptionPassword, setEncryptionPassword] = useState('');

  useEffect(() => {
    if (encryptionPassword) {
      try {
        const dat = secureStorage(encryptionPassword).getItem('seeds');
        console.log(dat);
        if (dat === null) {
          console.log('no seeds found');
          setSeeds([]);
        } else {
          console.log('found seeds');
          setSeeds(dat);
        }
      } catch (e) {
        console.error(e);
        setSeeds([]);
      }
    }
  }, [encryptionPassword, setSeeds]);

  useEffect(() => {
    if (seeds && encryptionPassword) {
      // update the localStorage with seeds every time they're changed
      secureStorage(encryptionPassword).setItem('seeds', seeds);
      // update the lastSaved for any sync jobs
      // setConfig({ ...config, lastSaved: Date.now() });
    }
  }, [seeds, encryptionPassword]);

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
        background: {
          paper: grey.A100,
        },
        mode: prefersDarkMode ? 'light' : 'light',
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
          account={account}
          handleClickDisconnect={handleClickDisconnect}
        />
      )}
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Box
          sx={{
            minHeight: '90vh',
            paddingTop: { xs: 1, sm: 2 },
            paddingBottom: { xs: 1, sm: 2 },
          }}
        >
          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="stretch"
            justifyContent="center"
          >
            {!account && <ProductOverview />}
            {!account && <NoConnectionWarning />}
            {account && <NanoIdentity />}
            {account && encryptionPassword && (
              <ManageIdentities seeds={seeds} setSeeds={setSeeds} />
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
            {/* {account && isSetup && (
              <Extras
                sataBalance={sataBalance}
                dSataBalance={dSataBalance}
                chainId={chainId}
                sataPriceData={sataPriceData}
                dSataPriceData={dSataPriceData}
                ethPrice={ethPrice}
              />
            )} */}
            {account && encryptionPassword && <NetworkServices />}
          </Grid>
        </Box>
      </Container>
      <AppFooter />
    </ThemeProvider>
  );
}

export default App;
