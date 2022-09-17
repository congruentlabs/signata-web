import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import CryptoJS from 'crypto-js';
import useLocalStorageState from 'use-local-storage-state';
import {
  Grid,
  CardContent,
  ButtonGroup,
  Button,
  Stack,
  Alert,
  AlertTitle,
  TextField,
  useMediaQuery,
  Chip,
} from '@mui/material';
import ItemHeader from './ItemHeader';
import ItemBox from './ItemBox';
import ChangeDialog from '../identity/ChangeDialog';

function YourAccount(props) {
  const {
    config,
    setConfig,
    isPersistent,
    setEncryptionPassword,
    unlocked,
    identities,
    setIdentities,
    updateIdentities,
  } = props;
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [firstErrorMessage, setFirstErrorMessage] = useState('');
  const [restoreErrorMessage, setRestoreErrorMessage] = useState('');
  const [secondErrorMessage, setSecondErrorMessage] = useState('');
  const [showCapsWarning, setShowCapsWarning] = useState(false);
  const [openDownloadBackup, setOpenDownloadBackup] = useState(false);
  const [openRestoreBackup, setOpenRestoreBackup] = useState(false);
  const [backupFileName, setBackupFileName] = useState('');
  const [backupDataPassword, setBackupDataPassword] = useState('');
  const [advancedModeEnabled, setAdvancedModeEnabled] = useLocalStorageState(
    'advancedModeEnabled',
    { defaultValue: false },
  );
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });

  const onChangePassword = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 12) {
      setFirstErrorMessage('Password needs to be longer than 12 characters');
    } else {
      setFirstErrorMessage('');
    }
  };

  const onChangePasswordRepeat = (e) => {
    setPasswordRepeat(e.target.value);
    if (e.target.value !== password) {
      setSecondErrorMessage('Password does not match');
    } else {
      setSecondErrorMessage('');
    }
  };

  const onKeyDown = (keyEvent) => {
    if (keyEvent.getModifierState('CapsLock')) {
      setShowCapsWarning(true);
    } else {
      setShowCapsWarning(false);
    }
  };

  const onCreatePassword = (e) => {
    e.preventDefault();
    // set the password globally
    setEncryptionPassword(password);
    // hash the password so we can verify it later
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const hashedPassword = CryptoJS.PBKDF2(password, salt, {
      iterations: 10000,
    });
    // mark the config as hasAccount
    setConfig({
      ...config,
      hasAccount: true,
      salt: salt.toString(),
      hashedPassword: hashedPassword.toString(),
    });
  };

  const onUnlockPassword = (e) => {
    e.preventDefault();
    const salt = CryptoJS.enc.Hex.parse(config.salt);
    const hashedPassword = CryptoJS.PBKDF2(password, salt, {
      iterations: 10000,
    });
    if (hashedPassword.toString() === config.hashedPassword) {
      setEncryptionPassword(password);
    } else {
      setFirstErrorMessage('Incorrect password!');
    }
  };

  const onClickDownloadBackup = () => {
    setOpenDownloadBackup(true);
  };

  const onSubmitDownloadBackup = (e) => {
    e.preventDefault();
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(identities),
      backupDataPassword,
    ).toString();
    const element = document.createElement('a');
    const file = new Blob([encryptedData], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Signata-Backup-${new Date().toISOString()}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const onCloseDownloadBackup = () => {
    setOpenDownloadBackup(false);
  };

  const onClickRestoreBackup = () => {
    setOpenRestoreBackup(true);
    setBackupFileName('');
  };

  const onSubmitRestoreBackup = (e) => {
    e.preventDefault();
    try {
      setRestoreErrorMessage('');
      const file = e.target[2].files[0];

      if (file) {
        console.log(file);
        const reader = new FileReader();

        const onLoad = (evt) => {
          const fileContents = evt.target.result;
          const decryptedData = CryptoJS.AES.decrypt(fileContents, backupDataPassword).toString(
            CryptoJS.enc.Utf8,
          );
          const parsedData = JSON.parse(decryptedData);
          // TODO: validate that it is an identity array before saving it
          setIdentities(parsedData);
          updateIdentities(parsedData);
          setBackupFileName('');
        };

        reader.onload = onLoad;
        reader.readAsText(file);
      }
      setOpenRestoreBackup(false);
    } catch (error) {
      console.error(error);
      setRestoreErrorMessage(error.message);
    }
  };

  const onChangeBackupFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackupFileName(file.name);
    }
  };

  const onCloseRestoreBackup = () => {
    setOpenRestoreBackup(false);
  };

  return (
    <Grid item xs={12} md={6}>
      <ChangeDialog
        open={openDownloadBackup}
        onSubmit={onSubmitDownloadBackup}
        onClose={onCloseDownloadBackup}
        title="Download Backup?"
        alertSeverity="info"
        alertText="Download an encrypted backup of your Signata account to keep safe. Your backup password can be different to your account password."
        submitText="Download Backup"
        fields={[
          <TextField
            label="Backup Password"
            key="backup-data-password"
            type="password"
            variant="outlined"
            fullWidth
            required
            color="info"
            value={backupDataPassword}
            onChange={(e) => setBackupDataPassword(e.target.value)}
          />,
        ]}
      />
      <ChangeDialog
        open={openRestoreBackup}
        onSubmit={onSubmitRestoreBackup}
        onClose={onCloseRestoreBackup}
        title="Restore Backup?"
        alertSeverity="warning"
        alertText="Restoring will overwrite any identities you have saved. If you've added identities since you created this backup, export them now or you will lose them."
        submitText="Restore Backup"
        disableSubmit={!backupFileName}
        errorMessage={restoreErrorMessage}
        fields={[
          <TextField
            label="Backup Password"
            key="restore-data-password"
            type="password"
            variant="outlined"
            fullWidth
            required
            color="info"
            value={backupDataPassword}
            onChange={(e) => setBackupDataPassword(e.target.value)}
          />,
          <Button key="upload-button" variant="contained" component="label" color="secondary">
            Upload Backup
            <input
              hidden
              accept="text/plain"
              multiple={false}
              type="file"
              onChange={onChangeBackupFile}
            />
          </Button>,
          <TextField
            key="file-name"
            label="File to Upload"
            value={backupFileName}
            variant="standard"
            disabled
          />,
        ]}
      />
      <ItemBox>
        <ItemHeader text="Your Account" />
        <CardContent>
          {(!config || !config.hasAccount) && (
            <form onSubmit={onCreatePassword}>
              <Stack spacing={2}>
                <Alert severity="info">
                  <AlertTitle>Account Password</AlertTitle>
                  Your password encrypts all of your identities. Your encrypted identities are
                  stored on the Interplanetary File System (IPFS). Anyone can access your encrypted
                  files on IPFS, so make sure you use a strong unique password and store it
                  somewhere safe.
                </Alert>
                <Alert severity="warning">
                  If you&apos;ve already set up Signata on another device, use the exact same
                  password that you used on the other device, and the exact same connected wallet,
                  otherwise your identities will not be accessible.
                </Alert>
                <TextField
                  label="Password"
                  variant="outlined"
                  color="info"
                  type="password"
                  size="small"
                  onKeyDown={onKeyDown}
                  value={password}
                  error={firstErrorMessage !== ''}
                  onChange={onChangePassword}
                  helperText={firstErrorMessage}
                />
                <TextField
                  label="Repeat Password"
                  variant="outlined"
                  color="info"
                  type="password"
                  size="small"
                  onKeyDown={onKeyDown}
                  value={passwordRepeat}
                  error={secondErrorMessage !== ''}
                  onChange={onChangePasswordRepeat}
                  helperText={secondErrorMessage}
                />
                {showCapsWarning && <Alert severity="warning">Caps Lock is On</Alert>}
                <ButtonGroup fullWidth orientation={isSm ? 'horizontal' : 'vertical'}>
                  {(!config || !config.hasAccount) && (
                    <Button
                      color="primary"
                      variant="contained"
                      disabled={!password || password.length < 1 || password !== passwordRepeat}
                      onClick={onCreatePassword}
                    >
                      Set Password
                    </Button>
                  )}
                </ButtonGroup>
              </Stack>
            </form>
          )}

          {config && config.hasAccount && !unlocked && (
            <form onSubmit={onUnlockPassword}>
              <Stack spacing={2}>
                {!isPersistent && (
                  <Alert severity="error">
                    <AlertTitle>Not Persistent</AlertTitle>
                    This device won&apos;t save your data once you leave this app. It is not safe to
                    use Signata on this device as you may lose your identity data.
                  </Alert>
                )}
                <Alert severity="info">Unlock your account to access your identities.</Alert>
                <TextField
                  label="Password"
                  variant="outlined"
                  color="info"
                  type="password"
                  size="small"
                  onKeyDown={onKeyDown}
                  value={password}
                  error={firstErrorMessage !== ''}
                  onChange={onChangePassword}
                  helperText={firstErrorMessage}
                />
                {showCapsWarning && <Alert severity="warning">Caps Lock is On</Alert>}
                <Button
                  color="primary"
                  variant="contained"
                  disabled={!password || password.length < 1}
                  onClick={onUnlockPassword}
                >
                  Unlock
                </Button>
              </Stack>
            </form>
          )}

          {config && config.hasAccount && unlocked && (
            <Stack spacing={2}>
              <Alert severity="success">Account Unlocked</Alert>
              <ButtonGroup fullWidth orientation={isSm ? 'horizontal' : 'vertical'}>
                <Button color="secondary" variant="contained" onClick={onClickDownloadBackup}>
                  Download Backup
                </Button>
                <Button color="secondary" variant="contained" onClick={onClickRestoreBackup}>
                  Restore Backup
                </Button>
              </ButtonGroup>
              <Alert severity="info">
                Expert mode unlocks some additional features of Signata. Only use this if you
                understand what these extra features can be used for.
              </Alert>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                <Button
                  color="secondary"
                  onClick={() => setAdvancedModeEnabled(!advancedModeEnabled)}
                >
                  {advancedModeEnabled ? 'Disable Expert Mode' : 'Enable Expert Mode'}
                </Button>
                {advancedModeEnabled && <Chip label="Expert Mode Enabled" color="success" />}
              </Stack>

              {/* <TextField
                label="New Password"
                variant="outlined"
                color="info"
                type="password"
                size="small"
                onKeyDown={onKeyDown}
                value={password}
                error={firstErrorMessage !== ''}
                onChange={onChangePassword}
                helperText={firstErrorMessage}
              />
              <TextField
                label="New Repeat Password"
                variant="outlined"
                color="info"
                type="password"
                size="small"
                onKeyDown={onKeyDown}
                value={passwordRepeat}
                error={secondErrorMessage !== ''}
                onChange={onChangePasswordRepeat}
                helperText={secondErrorMessage}
              />
              <Button
                color="primary"
                variant="contained"
                disabled={!password || password.length < 1}
                onClick={onReplacePassword}
              >
                Replace Password
              </Button> */}
            </Stack>
          )}
        </CardContent>
      </ItemBox>
    </Grid>
  );
}

export default YourAccount;
