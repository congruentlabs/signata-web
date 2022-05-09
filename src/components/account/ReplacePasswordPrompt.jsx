import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { validateMnemonic } from 'bip39';

function ReplacePasswordPopup({ open, handleClickClose, handleClickCreate }) {
  const [recoveryPassphrase, setRecoveryPassphrase] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [passphraseErrorMessage, setPassphraseErrorMessage] = useState('');
  const [firstErrorMessage, setFirstErrorMessage] = useState('');
  const [secondErrorMessage, setSecondErrorMessage] = useState('');

  const onChangePassphrase = (e) => {
    setRecoveryPassphrase(e.target.value);
    if (e.target.value && e.target.value.split(' ').length !== 12) {
      setPassphraseErrorMessage('Your passphrase is 12 words long, separated by spaces');
    } else {
      setPassphraseErrorMessage('');
    }
  };

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

  return (
    <Dialog open={open} keepMounted onClose={handleClickClose}>
      <DialogTitle>Set Signata Account Password</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1">
            To replace your password, you need to provide your recovery passphrase.
          </Typography>
          <TextField
            label="Recovery Passphrase"
            error={passphraseErrorMessage !== ''}
            variant="standard"
            value={recoveryPassphrase}
            onChange={onChangePassphrase}
            helperText={passphraseErrorMessage}
          />
          <TextField
            label="Password"
            type="password"
            error={firstErrorMessage !== ''}
            variant="standard"
            value={password}
            onChange={onChangePassword}
            helperText={firstErrorMessage}
          />
          <TextField
            label="Repeat Password"
            type="password"
            error={secondErrorMessage !== ''}
            variant="standard"
            value={passwordRepeat}
            onChange={onChangePasswordRepeat}
            helperText={secondErrorMessage}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={(e) => handleClickCreate(e, password)}
          variant="contained"
          disabled={!password || password.length < 1 || password !== passwordRepeat}
          startIcon={<RefreshIcon />}
        >
          Replace Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReplacePasswordPopup;
