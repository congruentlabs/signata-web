import { useState, useMemo, useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { green, blue } from '@mui/material/colors';
import useLocalStorageState from 'use-local-storage-state';

import {
  AppHeader,
  AppFooter,
  CreateAccount,
  ManageIdentities,
  NoConnectionWarning,
  ConnectionPopup,
  CreateAccountPopup,
  ImportAccountPopup,
  CreateIdentityPopup,
  ImportIdentityPopup,
  EditIdentityPopup,
  ManageAddons,
} from './components';
import './App.css';

const OPEN_TYPES = {
  web3Connect: 'web3-connect',
  createIdentity: 'create-identity',
  createAccount: 'create-account',
  importIdentity: 'import-identity',
  importAccount: 'import-account',
  editIdentity: 'edit-identity',
}

// LicenseInfo.setLicenseKey(
//   'bf57be20472e85bfdfef0d081e052e6dT1JERVI6MTg2MjEsRVhQSVJZPTE2MzY1MzA2OTUwMDAsS0VZVkVSU0lPTj0x',
// );

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
  const [isSetup, setIsSetup] = useState(undefined);

  const [config, setConfig, isPersistent] = useLocalStorageState('config', []);
  // const [wallets, setWallets] = useLocalStorageState('wallets', []);
  const [identities, setIdentities] = useLocalStorageState('identities', []);
  // const [devices, setDevices] = useLocalStorageState('devices', []);
  // const [secureNotes, setSecureNotes] = useLocalStorageState('secureNotes', []);

  useEffect(() => {
    console.log(config);
    // if a seedHash is present, then they've set up their account already, so close the setup section
    if (config && !config.seedHash) {
      setIsSetup(false);
    }
  }, [config]);

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

  const handleClickConfirmConnect = () => {
    activateBrowserWallet()
  };

  const handleClickManageIdentity = (identity) => {
    console.log(identity);
    setEditingIdentity(identity);
    handleClickOpen(OPEN_TYPES.editIdentity);
  };

  const handleClickOpen = (type) => {
    switch(type) {
      case OPEN_TYPES.createAccount:
        setShowCreateAccountPopup(true);
        break;
      case OPEN_TYPES.createIdentity:
        setShowCreateIdentityPopup(true);
        break;
      case OPEN_TYPES.importAccount:
        setShowImportAccountPopup(true);
        break;
      case OPEN_TYPES.importIdentity:
        setShowImportIdentityPopup(true);
        break;
      case OPEN_TYPES.editIdentity:
        setShowEditIdentityPopup(true);
        break;
      case OPEN_TYPES.web3Connect:
        setShowConnectionPopup(true);
        break;
      default:
        break;
    }
  };

  const handleClickClose = () => {
    setShowCreateAccountPopup(false);
    setShowCreateIdentityPopup(false);
    setShowImportAccountPopup(false);
    setShowImportIdentityPopup(false);
    setShowConnectionPopup(false);
    setShowEditIdentityPopup(false);
    setEditingIdentity(null);
  };

  const handleClickConfirmCreateAccount = () => {
    console.log('handleClickConfirmCreateAccount');
  };

  const handleClickConfirmImportAccount = () => {
    console.log('handleClickConfirmImportAccount');
  };

  const handleClickConfirmCreateIdentity = () => {
    console.log('handleClickConfirmCreateIdentity');
  };

  const handleClickConfirmImportIdentity = () => {
    console.log('handleClickConfirmImportIdentity');
  };

  const handleClickBuyCloud = () => {
    console.log('handleClickBuyCloud');
  };

  const handleClickDeleteIdentity = () => {
    console.log('handleClickDeleteIdentity');
  };
  
  const handleClickLockIdentity = () => {
    console.log('handleClickLockIdentity');
  };

  const handleClickUnlockIdentity = () => {
    console.log('handleClickUnlockIdentity');
  };

  const handleClickMigrateIdentity = () => {
    console.log('handleClickMigrateIdentity');
  };

  const handleClickSaveIdentity = () => {
    console.log('handleClickSaveIdentity');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppHeader
        account={account}
        chainId={chainId}
        active={active}
        handleClickConnect={() => handleClickOpen(OPEN_TYPES.web3Connect)}
      />
      <ConnectionPopup
        open={showConnectionPopup}
        handleClickConnect={handleClickConfirmConnect}
        handleClickClose={handleClickClose}
      />
      <CreateAccountPopup
        open={showCreateAccountPopup}
        handleClickConfirm={handleClickConfirmCreateAccount}
        handleClickClose={handleClickClose}
      />
      <ImportAccountPopup
        open={showImportAccountPopup}
        handleClickConfirm={handleClickConfirmImportAccount}
        handleClickClose={handleClickClose}
      />
      <CreateIdentityPopup
        open={showCreateIdentityPopup}
        handleClickConfirm={handleClickConfirmCreateIdentity}
        handleClickClose={handleClickClose}
      />
      <ImportIdentityPopup
        open={showImportIdentityPopup}
        handleClickConfirm={handleClickConfirmImportIdentity}
        handleClickClose={handleClickClose}
      />
      <EditIdentityPopup
        editingIdentity={editingIdentity}
        open={showEditIdentityPopup}
        handleClickClose={handleClickClose}
        handleClickDelete={handleClickDeleteIdentity}
        handleClickLock={handleClickLockIdentity}
        handleClickUnlock={handleClickUnlockIdentity}
        handleClickMigrate={handleClickMigrateIdentity}
        handleClickSave={handleClickSaveIdentity}
      />
      <Container maxWidth="md">
        <Box sx={{ minHeight: '100vh', paddingTop: 2 }}>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            {!account && (
              <NoConnectionWarning
                handleClickConnect={() => handleClickOpen(OPEN_TYPES.web3Connect)}
              />
            )}
            {account && (
              <CreateAccount
                active={active}
                handleClickCreate={() => handleClickOpen(OPEN_TYPES.createAccount)}
                handleClickImport={() => handleClickOpen(OPEN_TYPES.importAccount)}
              />
            )}
            {account && (
              <ManageIdentities
                active={active}
                identities={identities}
                handleClickCreate={() => handleClickOpen(OPEN_TYPES.createIdentity)}
                handleClickImport={() => handleClickOpen(OPEN_TYPES.importIdentity)}
                handleClickManage={handleClickManageIdentity}
              />
            )}
            {account && (
              <ManageAddons
                addons={addons}
                handleClickBuyCloud={handleClickBuyCloud}
              />
            )}
            {account && (
              <Grid item xs={12}>
                <Divider variant="middle" />
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
      <AppFooter />
    </ThemeProvider>
  );
}

export default App;
