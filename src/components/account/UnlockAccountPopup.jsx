import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LockOpenIcon from '@mui/icons-material/LockOpen';

function UnlockAccountPopup({ open, handleClickClose, handleClickConfirm }) {
  const [password, setPassword] = useState('');
  const [firstErrorMessage, setFirstErrorMessage] = useState('');

  const onChangePassword = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 12) {
      setFirstErrorMessage('Password needs to be longer than 12 characters');
    } else {
      setFirstErrorMessage('');
    }
  };

  return (
    <Dialog open={open} keepMounted onClose={handleClickClose}>
      <DialogTitle>Unlock your Signata Account</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1">Please enter your password to unlock your Signata account.</Typography>
          <TextField
            label="Password"
            type="password"
            error={firstErrorMessage}
            variant="standard"
            value={password}
            onChange={onChangePassword}
            helperText={firstErrorMessage}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => handleClickConfirm(e, password)}
          variant="contained"
          disabled={!password || password.length < 1}
          startIcon={<LockOpenIcon />}
        >
          Unlock Account
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UnlockAccountPopup;
