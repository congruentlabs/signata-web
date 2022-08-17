import React, { useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { grey } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import { useTheme } from '@mui/material/styles';
import {
  ButtonGroup,
  Alert,
  AlertTitle,
  Button,
  Grid,
  Box,
  CardContent,
  CardActions,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
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
  const { setSignataEncryptionKey, setSignataAccountKey } = props;
  const [config, setConfig] = useLocalStorageState('config', []);
  const [showCreateAccountPopup, setShowCreateAccountPopup] = useState(false);
  const [showImportAccountPopup, setShowImportAccountPopup] = useState(false);
  const [accountError, setAccountError] = useState('');
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });

  const handleClickCreate = async (recoveryPassphrase) => {
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
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            minHeight: {
              md: 350,
            },
            borderRadius: 0,
            border: 1,
            borderColor: grey[600],
            backgroundColor: grey[50],
          }}
        >
          <CardContent>
            <Stack spacing={1}>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  background: grey[300],
                  fontFamily: 'Roboto Condensed',
                  border: 1,
                  borderColor: 'black',
                }}
              >
                Your Signata Account
              </Typography>
              <Alert severity="info" sx={{ borderRadius: 0, border: 1 }}>
                <AlertTitle>No Signata Account on this Device</AlertTitle>
                This device has not been set up with a Signata account. Create a
                new account, or import your existing account.
              </Alert>
              <ButtonGroup
                fullWidth
                orientation={isSm ? 'horizontal' : 'vertical'}
              >
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
            </Stack>
          </CardContent>
        </Box>
      </Grid>
    </>
  );
}

export default NoAccountSection;
