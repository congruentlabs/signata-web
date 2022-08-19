import React from 'react';
import { useEthers } from '@usedapp/core';
import {
  Typography,
  Grid,
  Stack,
  ButtonGroup,
  Button,
  Box,
} from '@mui/material';
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

export function NoConnectionWarning() {
  const { activate } = useEthers();

  const handleClickConnect = async () => {
    try {
      const provider = await web3Modal.connect();

      await provider.enable();
      activate(provider);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Grid item xs={12} sm={10} md={8}>
      <Box
        sx={{
          borderRadius: 0,
          border: 1,
          p: 2,
        }}
      >
        <Stack spacing={1}>
          <Typography variant="body1" component="p" textAlign="center">
            To use Signata you must connect to a Web3 wallet. If you connect
            your wallet you agree to our Terms &amp; Conditions and Privacy
            Policy.
          </Typography>
          <ButtonGroup
            fullWidth
            variant="contained"
            size="small"
            color="secondary"
          >
            <Button target="_blank" href="terms.pdf" startIcon={<GavelIcon />}>
              Terms & Conditions
            </Button>
            <Button
              target="_blank"
              href="privacy.pdf"
              startIcon={<PolicyIcon />}
            >
              Privacy Policy
            </Button>
          </ButtonGroup>
          <ButtonGroup fullWidth>
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={handleClickConnect}
            >
              Connect
            </Button>
          </ButtonGroup>
        </Stack>
      </Box>
    </Grid>
  );
}

export default NoConnectionWarning;
