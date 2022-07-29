import React, { useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import {
  mnemonicToEntropy,
  validateMnemonic,
} from 'ethereum-cryptography/bip39';
import { getRandomBytesSync } from 'ethereum-cryptography/random';
import { HDKey } from 'ethereum-cryptography/hdkey';
import { scrypt } from 'ethereum-cryptography/scrypt';
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english';
import { CreateAccountPopup, ImportAccountPopup } from '..';

function NoAccountSection() {
  const [config, setConfig] = useLocalStorageState('config', []);
  const [showCreateAccountPopup, setShowCreateAccountPopup] = useState(false);
  const [showImportAccountPopup, setShowImportAccountPopup] = useState(false);
  const [accountError, setAccountError] = useState('');

  const handleClickCreate = async (
    e,
    recoveryPassphrase,
    setSignataEncryptionKey,
    setSignataAccountKey,
  ) => {
    console.log('handleClickConfirmCreateAccount');
    setAccountError('');
    try {
      const isValid = validateMnemonic(recoveryPassphrase, wordlist);
      console.log(isValid);
      if (isValid) {
        const entropy = mnemonicToEntropy(recoveryPassphrase, wordlist);
        const salt = getRandomBytesSync(32);
        const iv = getRandomBytesSync(16);
        const encryptionKeyBytes = await scrypt(entropy, salt, 16384, 8, 1, 32);
        const encryptionKey = { salt, iv };
        setSignataEncryptionKey({
          salt,
          iv,
          encryptionKeyBytes,
          entropy,
        });

        const hdKey = HDKey.fromMasterSeed(entropy);
        setSignataAccountKey(hdKey);
        setConfig({
          ...config,
          accountId: hdKey.publicExtendedKey,
          encryptionKey,
        });
        setShowCreateAccountPopup(false);
      } else {
        setAccountError('Invalid Recovery Passphrase');
      }
    } catch (error) {
      console.error(error);
      setAccountError(error.message);
    }
  };

  return (
    <>
      {showCreateAccountPopup && (
        <CreateAccountPopup
          onClose={() => setShowCreateAccountPopup(false)}
          handleClickCreate={handleClickCreate}
        />
      )}
      {showImportAccountPopup && (
        <ImportAccountPopup
          onClose={() => setShowImportAccountPopup(false)}
          handleClickImport={handleClickCreate}
        />
      )}
      <Grid item xs={12}>
        <Alert severity="info">
          <AlertTitle>No Signata Account on this Device</AlertTitle>
          This device has not been set up with a Signata account. Create a new
          account, or import your existing account.
        </Alert>
      </Grid>
      <Grid item xs={12} textAlign="center">
        <ButtonGroup size="large">
          <Button
            color="primary"
            variant="contained"
            onClick={() => setShowCreateAccountPopup(true)}
            startIcon={<AddIcon />}
          >
            Create Account
          </Button>
          <Button
            color="secondary"
            onClick={() => setShowImportAccountPopup(true)}
            startIcon={<UploadIcon />}
          >
            Import Account
          </Button>
        </ButtonGroup>
      </Grid>
    </>
  );
}

export default NoAccountSection;
