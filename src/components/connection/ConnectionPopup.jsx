import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { ButtonGroup, Typography } from '@mui/material';
import CableIcon from '@mui/icons-material/Cable';
import PolicyIcon from '@mui/icons-material/Policy';
import GavelIcon from '@mui/icons-material/Gavel';

export function ConnectionPopup({
  open,
  handleClickClose,
  handleClickConnect,
}) {
  return (
    <Dialog open={open} keepMounted onClose={handleClickClose}>
      <DialogTitle>Connect to Web3</DialogTitle>
      <DialogContent>
        <Typography variant="body1" component="p" gutterBottom>
          Connecting your Web3 wallet to Signata means you agree to our Terms
          &amp; Conditions and Privacy Policy.
        </Typography>
        <ButtonGroup fullWidth color="secondary" variant="text" size="small">
          <Button target="_blank" href="terms.pdf" startIcon={<GavelIcon />}>
            Terms & Conditions
          </Button>
          <Button target="_blank" href="privacy.pdf" startIcon={<PolicyIcon />}>
            Privacy Policy
          </Button>
        </ButtonGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleClickConnect}
          color="success"
          size="large"
          variant="contained"
          startIcon={<CableIcon />}
        >
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConnectionPopup;
