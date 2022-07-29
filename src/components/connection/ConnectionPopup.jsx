import React from 'react';
import { useEthers } from '@usedapp/core';
import {
  ButtonGroup,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from '@mui/material';
import CableIcon from '@mui/icons-material/Cable';
import PolicyIcon from '@mui/icons-material/Policy';
import GavelIcon from '@mui/icons-material/Gavel';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import WalletLink from 'walletlink';
import Web3Modal from 'web3modal';

const infuraId = '5c79516b355c491bb8156fcf3a6a1d23';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId,
    },
  },
  binancechainwallet: {
    package: true,
  },
  walletlink: {
    package: WalletLink,
    options: {
      appName: 'Signata',
      infuraId,
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: 'Signata', // Required
      infuraId, // Required
      rpc: '', // Optional if `infuraId` is provided; otherwise it's required
      chainId: 1, // Optional. It defaults to 1 if not provided
      darkMode: false, // Optional. Use dark theme, defaults to false
    },
  },
};

const web3Modal = new Web3Modal({
  providerOptions,
});

function ConnectionPopup({ handleClose }) {
  const { activate } = useEthers();

  const handleClickConnect = async () => {
    try {
      const provider = await web3Modal.connect();

      await provider.enable();
      activate(provider);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open keepMounted onClose={handleClose}>
      <DialogTitle>Connect to Web3</DialogTitle>
      <DialogContent>
        <Typography variant="body1" component="p" gutterBottom>
          Connecting your Web3 wallet to Signata means you agree to our Terms
          &amp; Conditions and Privacy Policy.
        </Typography>
        <ButtonGroup fullWidth color="secondary" variant="text" size="small">
          <Button target="_blank" href="terms.pdf" startIcon={<GavelIcon />}>
            Terms & Conditions
          </Button>
          <Button target="_blank" href="privacy.pdf" startIcon={<PolicyIcon />}>
            Privacy Policy
          </Button>
        </ButtonGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleClickConnect}
          color="success"
          size="large"
          variant="contained"
          startIcon={<CableIcon />}
        >
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConnectionPopup;
