import { useState, useMemo } from 'react';
import { useEthers, useEtherBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { green, blue } from '@mui/material/colors';

import {
  AppHeader,
  AppFooter,
  CreateAccount,
  AddIdentity,
  ManageIdentities,
  NoConnectionWarning,
  ConnectionPopup,
  CreateAccountPopup,
  ImportAccountPopup,
  CreateIdentityPopup,
  ImportIdentityPopup,
  ManageAddons,
} from './components';
import './App.css';

function App() {
  const {
    activateBrowserWallet,
    account,
    chainId,
    active,
  } = useEthers();
  // const etherBalance = useEtherBalance(account);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  const [showCreateAccountPopup, setShowCreateAccountPopup] = useState(false);
  const [showImportAccountPopup, setShowImportAccountPopup] = useState(false);
  const [showCreateIdentityPopup, setShowCreateIdentityPopup] = useState(false);
  const [showImportIdentityPopup, setShowImportIdentityPopup] = useState(false);
  const [showEditIdentityPopup, setShowEditIdentityPopup] = useState(false);
  const [editingIdentity, setEditingIdentity] = useState(null);

  const identities = [{
    name: 'Main Identity',
    address: '0xfeb8f237873e846d9ddbf8a9477519ae3219984c',
    registered: false,
    locked: false,
  },
  {
    name: 'Private Identity',
    address: '0xB1cE9CE9cb1f2237ecbA5b3CaDF4860c86d24D63',
    registered: true,
    locked: true,
  }];

  const addons = [{
    name: 'Cloud Storage',
    status: 'active',
    renewalDate: '2022-03-01',
  }];

  const theme = useMemo(() => createTheme({
    palette: {
      primary: {
        main: green[700],
      },
      secondary: {
        main: blue[700],
      },
      mode: prefersDarkMode ? 'dark' : 'light',
      typography: {
        fontFamily: 'Montserrat',
      },
    },
  }), [prefersDarkMode]);

  const handleClickConnect = () => {
    setShowConnectionPopup(true);
  };

  const handleClickConfirmConnect = () => {
    activateBrowserWallet()
  };

  const handleClickCancelConnect = () => {
    setShowConnectionPopup(false);
  };

  const handleClickCreateAccount = () => {
    setShowCreateAccountPopup(true);
  };

  const handleClickImportAccount = () => {
    setShowImportAccountPopup(true);
  };

  const handleClickConfirmCreateAccount = () => {
    console.log('handleClickConfirmCreateAccount');
  };

  const handleClickConfirmImportAccount = () => {
    console.log('handleClickConfirmImportAccount');
  };

  const handleClickCreateIdentity = () => {
    setShowCreateIdentityPopup(true);
  };

  const handleClickImportIdentity = () => {
    setShowImportIdentityPopup(true);
  };

  const handleClickConfirmCreateIdentity = () => {
    console.log('handleClickConfirmCreateIdentity');
  };

  const handleClickConfirmImportIdentity = () => {
    console.log('handleClickConfirmImportIdentity');
  };

  const handleClickManageIdentity = (identity) => {
    console.log(identity);
    setEditingIdentity(identity);
    setShowEditIdentityPopup(true);
  };

  const handleClickBuyCloud = () => {
    console.log('handleClickBuyCloud');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppHeader
        account={account}
        chainId={chainId}
        active={active}
        handleClickConnect={handleClickConnect}
      />
      <ConnectionPopup
        open={showConnectionPopup}
        handleClickConnect={handleClickConfirmConnect}
        handleClickClose={handleClickCancelConnect}
      />
      <CreateAccountPopup
        open={showCreateAccountPopup}
        handleClickConfirm={handleClickConfirmCreateAccount}
        handleClickClose={() => { setShowCreateAccountPopup(false); }}
      />
      <ImportAccountPopup
        open={showImportAccountPopup}
        handleClickConfirm={handleClickConfirmImportAccount}
        handleClickClose={() => { setShowImportAccountPopup(false); }}
      />
      <CreateIdentityPopup
        open={showCreateIdentityPopup}
        handleClickConfirm={handleClickConfirmCreateIdentity}
        handleClickClose={() => { setShowCreateIdentityPopup(false); }}
      />
      <ImportIdentityPopup
        open={showImportIdentityPopup}
        handleClickConfirm={handleClickConfirmImportIdentity}
        handleClickClose={() => { setShowImportIdentityPopup(false); }}
      />
      <Container maxWidth="md" >
        <Box sx={{ minHeight: '100vh', paddingTop: 2 }}>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            {!account && (
              <NoConnectionWarning
                handleClickConnect={handleClickConnect}
              />
            )}
            {account && (
              <CreateAccount
                active={active}
                handleClickCreate={handleClickCreateAccount}
                handleClickImport={handleClickImportAccount}
              />
            )}
            {account && (
              <AddIdentity
                active={active}
              />
            )}
            {account && (
              <ManageIdentities
                active={active}
                identities={identities}
                handleClickCreate={handleClickCreateIdentity}
                handleClickImport={handleClickImportIdentity}
                handleClickManage={handleClickManageIdentity}
              />
            )}
            <Grid item xs={12}>
              <Divider variant="middle" />
            </Grid>
            {account && (
              <ManageAddons
                addons={addons}
                handleClickBuyCloud={handleClickBuyCloud}
              />
            )}
          </Grid>
        </Box>
      </Container>
      <AppFooter />
    </ThemeProvider>
  );
}

export default App;
