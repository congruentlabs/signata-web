import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export function ImportIdentityPopup({ open, handleClickClose, handleClickImport }) {
  return (
    <Dialog open={open} keepMounted onClose={handleClickClose}>
      <DialogTitle>Import Identity</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Connecting your web3 wallet to Signata means you accept our Terms &amp; Conditions and Privacy Policy.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickClose}>Cancel</Button>
        <Button onClick={handleClickImport}>Connect</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ImportIdentityPopup;
