import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ButtonGroup from "@mui/material/ButtonGroup";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ReplayIcon from "@mui/icons-material/Replay";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from 'notistack';
import { generateMnemonic } from 'bip39';

function CreateAccountPopup({
  open,
  handleClickClose,
  handleClickConnect,
}) {
  const [recoveryPassphrase, setRecoveryPassphrase] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const m = generateMnemonic().toLowerCase();
    console.log(m);
    setRecoveryPassphrase(m);
  }, [setRecoveryPassphrase]);

  const handleClickGenerate = () => {
    console.log('handleClickGenerate');
    const m = generateMnemonic().toLowerCase();
    console.log(m);
    setRecoveryPassphrase(m);
  };

  const handleClickCopy = async () => {
    console.log('handleClickCopy');
    await navigator.clipboard.writeText(recoveryPassphrase);
    enqueueSnackbar('Recovery Passphrase Copied!');
  };

  return (
    <Dialog open={open} keepMounted onClose={handleClickClose}>
      <DialogTitle>Create Signata Account</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1">
            A Signata account is used to manage all of your identities. We do
            not store your account on our servers unless you want us to.
          </Typography>
          <Typography variant="body1">
            Your account looks very similar to a seed phrase for a wallet, but
            it is used specifically for your account identities. Do not use the
            same seed as a wallet, as you may expose your identities to more
            risk.
          </Typography>
          <TextField
            label="Signata Recovery Passphrase"
            variant="filled"
            value={recoveryPassphrase}
            multiline
            InputProps={{
              readOnly: true,
            }}
          />
          <ButtonGroup fullWidth color="secondary">
            <Button onClick={handleClickCopy} startIcon={<ContentCopyIcon />}>
              Copy
            </Button>
            <Button onClick={handleClickGenerate} startIcon={<ReplayIcon />}>
              Generate
            </Button>
          </ButtonGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClickClose}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={(e) => handleClickConnect(e, recoveryPassphrase)}
          variant="contained"
          startIcon={<AddIcon />}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateAccountPopup;
