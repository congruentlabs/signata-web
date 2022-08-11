import React, { useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  mnemonicToEntropy,
  validateMnemonic,
} from 'ethereum-cryptography/bip39';
import { getRandomBytesSync } from 'ethereum-cryptography/random';
import { HDKey } from 'ethereum-cryptography/hdkey';
import { scrypt } from 'ethereum-cryptography/scrypt';
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english';
import CreateAccountPopup from './CreateAccountPopup';
import ImportAccountPopup from './ImportAccountPopup';

function NoAccountSection(props) {
  const {
    setSignataEncryptionKey,
    setSignataAccountKey,
  } = props;
  const [config, setConfig] = useLocalStorageState('config', []);
  const [showCreateAccountPopup, setShowCreateAccountPopup] = useState(false);
  const [showImportAccountPopup, setShowImportAccountPopup] = useState(false);
  const [accountError, setAccountError] = useState('');

  const handleClickCreate = async (
    recoveryPassphrase,
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
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h6" align="center">
                Your Signata Account
              </Typography>
              <Alert severity="info" sx={{ borderRadius: 0 }}>
                <AlertTitle>No Signata Account on this Device</AlertTitle>
                This device has not been set up with a Signata account. Create a new
                account, or import your existing account.
              </Alert>
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
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
          </CardActions>
        </Card>
      </Grid>
    </>
  );
}

export default NoAccountSection;
