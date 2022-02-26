import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { ButtonGroup, Typography } from "@mui/material";

export function ConnectionPopup({
  open,
  handleClickClose,
  handleClickConnect,
}) {
  return (
    <Dialog
        open={open}
        keepMounted
        onClose={handleClickClose}
      >
        <DialogTitle>Connect to Web3</DialogTitle>
        <DialogContent>
          <Typography variant="body1" component="p" gutterBottom>
            Connecting your web3 wallet to Signata means you accept our Terms
            &amp; Conditions and Privacy Policy.
          </Typography>
          <ButtonGroup
            fullWidth
            color="secondary"
            variant="outlined"
            size="small"
          >
            <Button target="_blank" href="terms.pdf">
              Terms & Conditions
            </Button>
            <Button target="_blank" href="privacy.pdf">
              Privacy Policy
            </Button>
          </ButtonGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose} color="info">
            Cancel
          </Button>
          <Button onClick={handleClickConnect} color="success" size="large">
            Connect
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default ConnectionPopup;
