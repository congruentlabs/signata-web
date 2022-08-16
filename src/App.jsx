import React, { useState, useMemo, useEffect } from 'react';
import { useEthers, useTokenBalance } from '@usedapp/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box, Container, Grid, CssBaseline,
} from '@mui/material';
import {
  lime, blue, grey, orange, red,
} from '@mui/material/colors';
import useLocalStorageState from 'use-local-storage-state';
import {
  AppFooter,
  AppHeader,
  NoConnectionWarning,
  NetworkServices,
  ProductOverview,
  NoPersistenceWarning,
  Extras,
  ManageIdentities,
  NoAccountSection,
} from './components';
import {
  useUniswapSataPriceData,
  useUniswapDSataPriceData,
  useCoingeckoPrice,
  getTokenContractAddress,
} from './hooks/chainHooks';
import NanoIdentity from './components/identity/NanoIdentity';

const dSataContractAddress = '0x49428f057dd9d20a8e4c6873e98afd8cd7146e3b';

function App() {
  const {
    activateBrowserWallet, account, chainId, active, deactivate,
  } = useEthers();
  const sataBalance = useTokenBalance(getTokenContractAddress(chainId), account);
  const dSataBalance = useTokenBalance(dSataContractAddress, account);
  const sataPriceData = useUniswapSataPriceData();
  const dSataPriceData = useUniswapDSataPriceData();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isSetup, setIsSetup] = useState(false);
  const [signataAccountKey, setSignataAccountKey] = useState(null);
  const [signataEncryptionKey, setSignataEncryptionKey] = useState(null);
  const ethPrice = useCoingeckoPrice('ethereum', 'usd');
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
  // const [wallets, setWallets] = useLocalStorageState('wallets', []);
  // const [devices, setDevices] = useLocalStorageState('devices', []);
  // const [secureNotes, setSecureNotes] = useLocalStorageState('secureNotes', []);

  useEffect(() => {
    console.log(config || 'no config found');
    if (config && !config.accountId) {
      setIsSetup(false);
    }
    // if an accountId is present, then they've set up their account already, so
    // close the setup section
    if (config && config.accountId) {
      setIsSetup(true);
    }
    // if (config && !config.encryptedKey) {
    //   setShowCreatePasswordPopup(true);
    // }
    // if (config && config.encryptedKey && !signataAccountKey) {
    //   setShowUnlockAccountPopup(true);
    // }
  }, [config, signataAccountKey]);

  useEffect(() => {
    activateBrowserWallet(); // just try to auto activate on load for metamask users
  }, [activateBrowserWallet]);

  // const identities = [
  //   {
  //     name: 'Main Identity',
  //     address: '0xfeb8f237873e846d9ddbf8a9477519ae3219984c',
  //     registered: false,
  //     locked: false,
  //   },
  //   {
  //     name: 'Private Identity',
  //     address: '0xB1cE9CE9cb1f2237ecbA5b3CaDF4860c86d24D63',
  //     registered: true,
  //     locked: true,
  //   }
  // ];

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
    setSignataAccountKey({});
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
            {account && !isPersistent && <NoPersistenceWarning />}
            {account && (
              <NanoIdentity />
            )}
            {account && !isSetup && (
              <NoAccountSection
                active={active}
                setSignataEncryptionKey={setSignataEncryptionKey}
              />
            )}
            {account && isSetup && (
              <ManageIdentities />
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
            {account && isSetup && (
              <NetworkServices />
            )}
          </Grid>
        </Box>
      </Container>
      <AppFooter />
    </ThemeProvider>
  );
}

export default App;
