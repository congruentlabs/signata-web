/* eslint-disable no-console */
import React, { useState, useMemo, useEffect } from "react";
import { useEthers, useTokenBalance } from "@usedapp/core";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import WalletLink from 'walletlink';
import Web3Modal from 'web3modal';
import { green, blue } from "@mui/material/colors";
import useLocalStorageState from "use-local-storage-state";
import {
  AppFooter,
  AppHeader,
  ConnectionPopup,
  CreateAccountPopup,
  CreateIdentityPopup,
  CreatePasswordPopup,
  EditIdentityPopup,
  ImportAccountPopup,
  ImportIdentityPopup,
  ManageAddons,
  ManageIdentities,
  NoAccountSection,
  NoConnectionWarning,
  ReplacePasswordPopup,
  TokenInfo
} from "./components";
import {
  useCreateIdentity,
  useDeleteIdentity,
  useMigrateIdentity,
  useLockIdentity,
  useUnlockIdentity,
  useBuyCloud,
  useUniswapSataPriceData,
  useUniswapDSataPriceData,
  useCoingeckoPrice
} from './hooks/chainHooks';
import { shouldBeLoading } from './hooks/helpers';
import "./App.css";

const infuraId = '5c79516b355c491bb8156fcf3a6a1d23';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId
    }
  },
  binancechainwallet: {
    package: true
  },
  walletlink: {
    package: WalletLink,
    options: {
      appName: 'Signata',
      infuraId
    }
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: 'Signata', // Required
      infuraId, // Required
      rpc: '', // Optional if `infuraId` is provided; otherwise it's required
      chainId: 1, // Optional. It defaults to 1 if not provided
      darkMode: false // Optional. Use dark theme, defaults to false
    }
  }
};

const OPEN_TYPES = {
  web3Connect: "web3-connect",
  createIdentity: "create-identity",
  createAccount: "create-account",
  importIdentity: "import-identity",
  importAccount: "import-account",
  editIdentity: "edit-identity",
  createPassword: "create-password",
  replacePassword: "replace-password",
};

const web3Modal = new Web3Modal({
  providerOptions
});

const sataContractAddress = '0x3ebb4A4e91Ad83BE51F8d596533818b246F4bEe1';
const dSataContractAddress = '0x49428f057dd9d20a8e4c6873e98afd8cd7146e3b';

function App() {
  const { activateBrowserWallet, activate, account, chainId, active } = useEthers();
  const sataBalance = useTokenBalance(sataContractAddress, account);
  const dSataBalance = useTokenBalance(dSataContractAddress, account);
  const sataPriceData = useUniswapSataPriceData();
  const dSataPriceData = useUniswapDSataPriceData();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  const [showCreateAccountPopup, setShowCreateAccountPopup] = useState(false);
  const [showReplacePasswordPopup, setShowReplacePasswordPopup] = useState(false);
  const [showCreatePasswordPopup, setShowCreatePasswordPopup] = useState(false);
  const [showImportAccountPopup, setShowImportAccountPopup] = useState(false);
  const [showCreateIdentityPopup, setShowCreateIdentityPopup] = useState(false);
  const [showImportIdentityPopup, setShowImportIdentityPopup] = useState(false);
  const [showEditIdentityPopup, setShowEditIdentityPopup] = useState(false);
  const [editingIdentity, setEditingIdentity] = useState(null);
  const [isSetup, setIsSetup] = useState(false);
  const [isCreateIdLoading, setCreateIdLoading] = useState(false);
  const [isUnlockIdLoading, setUnlockIdLoading] = useState(false);
  const [isBuyCloudLoading, setBuyCloudLoading] = useState(false);
  const [isLockIdLoading, setLockIdLoading] = useState(false);
  const [isDeleteIdLoading, setDeleteIdLoading] = useState(false);
  const [isMigrateIdLoading, setMigrateIdLoading] = useState(false);
  const { state: createState, send: createSend, resetState: createResetState } = useCreateIdentity();
  const { state: deleteState, send: deleteSend, resetState: deleteResetState } = useDeleteIdentity();
  const { state: migrateState, send: migrateSend, resetState: migrateResetState } = useMigrateIdentity();
  const { state: lockState, send: lockSend, resetState: lockResetState } = useLockIdentity();
  const { state: unlockState, send: unlockSend, resetState: unlockResetState } = useUnlockIdentity();
  const { state: buyCloudState, send: buyCloudSend, resetState: buyCloudResetState } = useBuyCloud();
  const ethPrice = useCoingeckoPrice('ethereum', 'usd');


  const [config, setConfig, isPersistent] = useLocalStorageState("config", []);
  // const [wallets, setWallets] = useLocalStorageState('wallets', []);
  const [identities, setIdentities] = useLocalStorageState("identities", []);
  // const [devices, setDevices] = useLocalStorageState('devices', []);
  // const [secureNotes, setSecureNotes] = useLocalStorageState('secureNotes', []);

  useEffect(() => {
    console.log(config || "no config found");
    // if a seedHash is present, then they've set up their account already, so close the setup section
    if (config && !config.seedHash) {
      setIsSetup(false);
    }
  }, [config]);

  useEffect(() => {
    activateBrowserWallet(); // just try to auto activate on load for metamask users
  }, []);

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

  useEffect(() => {
    if (createState) {
      console.log(createState);
      setCreateIdLoading(shouldBeLoading(createState.status));
    }
  }, [createState]);

  useEffect(() => {
    if (deleteState) {
      console.log(deleteState);
      setDeleteIdLoading(shouldBeLoading(deleteState.status));
    }
  }, [deleteState]);

  useEffect(() => {
    if (migrateState) {
      console.log(migrateState);
      setMigrateIdLoading(shouldBeLoading(migrateState.status));
    }
  }, [migrateState]);

  useEffect(() => {
    if (lockState) {
      console.log(lockState);
      setLockIdLoading(shouldBeLoading(lockState.status));
    }
  }, [lockState]);

  useEffect(() => {
    if (unlockState) {
      console.log(unlockState);
      setUnlockIdLoading(shouldBeLoading(unlockState.status));
    }
  }, [unlockState]);

  useEffect(() => {
    if (buyCloudState) {
      console.log(buyCloudState);
      setBuyCloudLoading(shouldBeLoading(buyCloudState.status));
    }
  }, [buyCloudState]);



  const addons = [
    {
      name: "Cloud Storage",
      status: "active",
      renewalDate: "2022-03-01",
    },
  ];

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: green[700],
          },
          secondary: {
            main: blue[700],
          },
          mode: prefersDarkMode ? "dark" : "light",
          typography: {
            fontFamily: "Montserrat",
          },
        },
      }),
    [prefersDarkMode]
  );

  const handleClickConfirmConnect = async () => {
    try {
      setShowConnectionPopup(false);
      const provider = await web3Modal.connect();

      await provider.enable();
      activate(provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpen = (type) => {
    console.log(`handleClickOpen: ${type}`);
    switch (type) {
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
      case OPEN_TYPES.createPassword:
        setShowCreatePasswordPopup(true);
        break;
      case OPEN_TYPES.replacePassword:
        setShowReplacePasswordPopup(true);
        break;
      default:
        break;
    }
  };

  const handleClickManageIdentity = (identity) => {
    console.log("handleClickManageIdentity");
    console.log(identity);
    setEditingIdentity(identity);
    handleClickOpen(OPEN_TYPES.editIdentity);
  };

  const handleClickClose = () => {
    console.log("handleClickClose");
    setShowCreateAccountPopup(false);
    setShowCreateIdentityPopup(false);
    setShowImportAccountPopup(false);
    setShowImportIdentityPopup(false);
    setShowConnectionPopup(false);
    setShowEditIdentityPopup(false);
    setShowCreatePasswordPopup(false);
    setEditingIdentity(null);
  };

  const handleClickConfirmCreateAccount = (e, recoveryPassphrase) => {
    console.log("handleClickConfirmCreateAccount");
    console.log(recoveryPassphrase);
  };

  const handleClickConfirmImportAccount = (e, recoveryPassphrase) => {
    console.log("handleClickConfirmImportAccount");
    console.log(recoveryPassphrase);
  };

  const handleClickConfirmCreateIdentity = () => {
    console.log("handleClickConfirmCreateIdentity");
    createResetState();
    createSend();
  };

  const handleClickConfirmImportIdentity = () => {
    console.log("handleClickConfirmImportIdentity");
    createResetState();
    createSend();
  };

  const handleClickBuyCloud = () => {
    console.log("handleClickBuyCloud");
    buyCloudSend();
  };

  const handleClickDeleteIdentity = () => {
    console.log("handleClickDeleteIdentity");
    deleteResetState();
    deleteSend();
  };

  const handleClickLockIdentity = () => {
    console.log("handleClickLockIdentity");
    lockResetState();
    lockSend();
  };

  const handleClickUnlockIdentity = () => {
    console.log("handleClickUnlockIdentity");
    unlockResetState();
    unlockSend();
  };

  const handleClickMigrateIdentity = () => {
    console.log("handleClickMigrateIdentity");
    migrateResetState();
    migrateSend();
  };

  const handleClickSaveIdentity = () => {
    console.log("handleClickSaveIdentity");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppHeader
        account={account}
        isSetup={isSetup}
        chainId={chainId}
        active={active}
        handleClickReplacePassword={() => handleClickOpen(OPEN_TYPES.replacePassword)}
      />
      <ConnectionPopup
        open={showConnectionPopup}
        handleClickConnect={handleClickConfirmConnect}
        handleClickClose={handleClickClose}
      />
      <CreateAccountPopup
        open={showCreateAccountPopup}
        handleClickCreate={handleClickConfirmCreateAccount}
        handleClickClose={handleClickClose}
      />
      <CreatePasswordPopup
        open={showCreatePasswordPopup}
        handleClickClose={handleClickClose}
      />
      <ReplacePasswordPopup
        open={showReplacePasswordPopup}
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
        isCreateIdLoading={isCreateIdLoading}
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
        createState={createState}
        deleteState={deleteState}
        migrateState={migrateState}
        lockState={lockState}
        unlockState={unlockState}
        isUnlockIdLoading={isUnlockIdLoading}
        isLockIdLoading={isLockIdLoading}
        isMigrateIdLoading={isMigrateIdLoading}
        isDeleteIdLoading={isDeleteIdLoading}
      />
      <Container maxWidth="md">
        <Box sx={{ minHeight: "90vh", paddingTop: 2 }}>
          <Grid
            container
            spacing={3}
            alignItems="center"
            justifyContent="center"
          >
            {!account && (
              <NoConnectionWarning
                handleClickConnect={() =>
                  handleClickOpen(OPEN_TYPES.web3Connect)
                }
              />
            )}
            {account && !isSetup && (
              <NoAccountSection
                active={active}
                handleClickCreate={() =>
                  handleClickOpen(OPEN_TYPES.createAccount)
                }
                handleClickImport={() =>
                  handleClickOpen(OPEN_TYPES.importAccount)
                }
              />
            )}
            {account && isSetup && (
              <ManageIdentities
                active={active}
                identities={identities}
                handleClickCreate={() =>
                  handleClickOpen(OPEN_TYPES.createIdentity)
                }
                handleClickImport={() =>
                  handleClickOpen(OPEN_TYPES.importIdentity)
                }
                handleClickManage={handleClickManageIdentity}
              />
            )}
            {account && isSetup && (
              <ManageAddons
                addons={addons}
                handleClickBuyCloud={handleClickBuyCloud}
                buyCloudState={buyCloudState}
                buyCloudResetState={buyCloudResetState}
                isBuyCloudLoading={isBuyCloudLoading}
              />
            )}
            {account && (
              <Grid item xs={12}>
                <Divider variant="middle" />
              </Grid>
            )}
            {account && (
              <Grid item xs={12}>
                <TokenInfo
                  sataBalance={sataBalance}
                  dSataBalance={dSataBalance}
                  chainId={chainId}
                  sataPriceData={sataPriceData}
                  dSataPriceData={dSataPriceData}
                  ethPrice={ethPrice}
                />
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
