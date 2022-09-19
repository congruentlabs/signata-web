import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import useLocalStorageState from 'use-local-storage-state';
import {
  Box, Grid, CircularProgress, Alert, Backdrop,
} from '@mui/material';
import axios from 'axios';
import ProductOverview from './app/ProductOverview';
import ManageIdentities from './identity/ManageIdentities';
import YourAccount from './app/YourAccount';
import UnderConstructionWarning from './app/UnderConstructionWarning';
import DevModeWarning from './app/DevModeWarning';
import UnsupportedChain from './app/UnsupportedChain';

function AppView({
  theme,
  account,
  identities,
  setIdentities,
  supportedChain,
  SUPPORTED_CHAINS,
  encryptionPassword,
  setEncryptionPassword,
}) {
  const [config, setConfig, isPersistent] = useLocalStorageState('config', []);
  const [isLoading, setLoading] = useState(false);
  const [advancedModeEnabled, setAdvancedModeEnabled] = useLocalStorageState(
    'advancedModeEnabled',
    { defaultValue: false },
  );
  const [ipfsAccount, setIpfsAccount] = useLocalStorageState('ipfsAccount', { defaultValue: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        console.log(`fetching identities for ${ipfsAccount || account}`);

        const response = await axios.get(
          `https://id-api.signata.net/api/v1/getIdentities${ipfsAccount || account}`,
        );

        // console.log({ response });
        if (response.status === 200) {
          setIpfsAccount(account);

          const ipfsResponse = await axios.get(
            `https://${response.data[0].cid}.ipfs.w3s.link/data.json`,
          );

          // console.log({ data: ipfsResponse.data });

          const decryptedData = CryptoJS.AES.decrypt(
            ipfsResponse.data,
            encryptionPassword,
          ).toString(CryptoJS.enc.Utf8);
          // console.log({ decryptedData });
          const decryptedIdentities = JSON.parse(decryptedData);
          // console.log({ decryptedIdentities });
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
      // console.log({ encryptedIdentities });
      // generate a hash of the encrypted content
      const idsBuf = Buffer.from(encryptedIdentities, 'utf8');
      const hashToSign = ethers.utils.keccak256(idsBuf);
      console.log({ hashToSign });
      // sign the hash
      // eslint-disable-next-line no-undef
      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [ipfsAccount || account, hashToSign],
      });
      console.log({ signature });

      console.log({
        encryptedData: encryptedIdentities,
        signature,
        address: ipfsAccount || account,
      });

      const response = await axios.post('https://id-api.signata.net/api/v1/saveIdentities', {
        encryptedData: encryptedIdentities,
        signature,
        address: ipfsAccount || account,
      });

      console.log({ response });

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
            advancedModeEnabled={advancedModeEnabled}
            identities={identities}
            setIdentities={setIdentities}
            updateIdentities={updateIdentities}
          />
        )}
        {account && (
          <YourAccount
            advancedModeEnabled={advancedModeEnabled}
            config={config}
            identities={identities}
            isPersistent={isPersistent}
            setAdvancedModeEnabled={setAdvancedModeEnabled}
            setConfig={setConfig}
            setEncryptionPassword={setEncryptionPassword}
            setIdentities={setIdentities}
            unlocked={encryptionPassword !== ''}
            updateIdentities={updateIdentities}
          />
        )}
      </Grid>
    </Box>
  );
}

export default AppView;
