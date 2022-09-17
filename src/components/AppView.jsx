import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import { useEthers } from '@usedapp/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import useLocalStorageState from 'use-local-storage-state';
import {
  Box, Grid, CircularProgress, Alert, Backdrop,
} from '@mui/material';
import axios from 'axios';
import {
  NoConnectionWarning,
  // NetworkServices,
  ProductOverview,
  ManageIdentities,
  YourAccount,
  UnderConstructionWarning,
  DevModeWarning,
  // Subscription,
} from '.';
import UnsupportedChain from './app/UnsupportedChain';
import { SUPPORTED_CHAINS } from '../hooks/helpers';

// const dSataContractAddress = '0x49428f057dd9d20a8e4c6873e98afd8cd7146e3b';

function AppView({
  theme, account, identities, setIdentities,
}) {
  const { activateBrowserWallet, deactivate, chainId } = useEthers();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [config, setConfig, isPersistent] = useLocalStorageState('config', []);
  const [isLoading, setLoading] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState('');
  const [advancedModeEnabled, setAdvancedModeEnabled] = useLocalStorageState(
    'advancedModeEnabled',
    { defaultValue: false },
  );
  const [supportedChain, setSupportedChain] = useState(false);
  const [ipfsAccount, setIpfsAccount] = useLocalStorageState('ipfsAccount', { defaultValue: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const chainName = SUPPORTED_CHAINS.find((network) => network.chainId === chainId)?.chainName;
    if (chainName) {
      setSupportedChain(true);
    } else {
      setSupportedChain(false);
    }
  }, [chainId]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        console.log(`fetching identities for ${ipfsAccount || account}`);

        const response = await axios.get(
          `https://id-api.signata.net/api/v1/getIdentities${ipfsAccount || account}`,
        );

        console.log(response);
        if (response.status === 200) {
          setIpfsAccount(account);

          const ipfsResponse = await axios.get(
            `https://${response.data[0].cid}.ipfs.w3s.link/data.json`,
          );

          console.log(ipfsResponse.data);

          const decryptedData = CryptoJS.AES.decrypt(
            ipfsResponse.data,
            encryptionPassword,
          ).toString(CryptoJS.enc.Utf8);
          console.log(decryptedData);
          const decryptedIdentities = JSON.parse(decryptedData);
          console.log(decryptedIdentities);
          setIdentities(decryptedIdentities);
        } else if (response.status === 204) {
          setIdentities([]);
        } else {
          setErrorMessage(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (encryptionPassword && account) {
      getData();
    }
  }, [encryptionPassword, setIdentities, account, setIpfsAccount, ipfsAccount]);

  const updateIdentities = async (ids) => {
    try {
      setLoading(true);
      setErrorMessage('');
      // encrypt the data
      const encryptedIdentities = CryptoJS.AES.encrypt(
        JSON.stringify(ids),
        encryptionPassword,
      ).toString();
      console.log(encryptedIdentities);
      // generate a hash of the encrypted content
      const hashToSign = ethers.utils.keccak256(Buffer.from(encryptedIdentities, 'utf8'));
      console.log(hashToSign);
      // sign the hash
      // eslint-disable-next-line no-undef
      const ethResult = await ethereum.request({
        method: 'eth_sign',
        params: [ipfsAccount || account, hashToSign],
      });
      console.log(ethResult);

      console.log({
        encryptedData: encryptedIdentities,
        signature: ethResult,
        address: ipfsAccount || account,
      });

      const response = await axios.post('https://id-api.signata.net/api/v1/saveIdentities', {
        encryptedData: encryptedIdentities,
        signature: ethResult,
        address: ipfsAccount || account,
      });

      console.log(response);

      setIdentities(ids);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        paddingTop: { xs: 1, sm: 2 },
        paddingBottom: { xs: 1, sm: 2 },
      }}
    >
      <Grid container spacing={4} direction="row" justifyContent="center" alignItems="stretch">
        {window.location.hostname !== 'localhost' && <UnderConstructionWarning />}
        {window.location.hostname === 'localhost' && <DevModeWarning />}
        {!account && <ProductOverview />}
        {!account && <NoConnectionWarning />}
        {account && encryptionPassword && !supportedChain && (
          <UnsupportedChain SUPPORTED_CHAINS={SUPPORTED_CHAINS} />
        )}
        {errorMessage && (
          <Grid item xs={12} textAlign="center">
            <Alert severity="error">{errorMessage}</Alert>
          </Grid>
        )}
        {isLoading && (
          <Backdrop open sx={{ color: '#fff', zIndex: () => theme.zIndex.drawer + 1 }}>
            <CircularProgress />
          </Backdrop>
        )}
        {account && encryptionPassword && supportedChain && (
          <ManageIdentities
            identities={identities}
            setIdentities={setIdentities}
            advancedModeEnabled={advancedModeEnabled}
            updateIdentities={updateIdentities}
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
      </Grid>
    </Box>
  );
}

export default AppView;
