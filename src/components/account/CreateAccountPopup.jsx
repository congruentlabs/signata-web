import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplayIcon from '@mui/icons-material/Replay';
import AddIcon from '@mui/icons-material/Add';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSnackbar } from 'notistack';
import { generateMnemonic } from 'ethereum-cryptography/bip39';
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english';

function CreateAccountPopup({ onClose, handleClickCreate }) {
  const [recoveryPassphrase, setRecoveryPassphrase] = useState('');
  const [firstConfirmChecked, setFirstConfirmChecked] = useState(false);
  const [secondConfirmChecked, setSecondConfirmChecked] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const m = generateMnemonic(wordlist);
    console.log(m);
    setRecoveryPassphrase(m);
  }, [setRecoveryPassphrase]);

  const handleClickGenerate = () => {
    const m = generateMnemonic(wordlist);
    console.log(m);
    setRecoveryPassphrase(m);
  };

  const handleClickCopy = async () => {
    await navigator.clipboard.writeText(recoveryPassphrase);
    enqueueSnackbar('Recovery Passphrase Copied!', { variant: 'success' });
  };

  return (
    <Dialog open keepMounted onClose={onClose}>
      <DialogTitle>Create Signata Account</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1">
            A Signata account is used to manage all of your identities. We do
            not store any of your information on our servers unless you want us
            to.
          </Typography>
          <Typography variant="body1">
            Your account recovery passphrase looks very similar to a seed phrase
            for a cryptocurrency wallet, but it is used specifically for your
            Signata identities. Do not use this recovery passphrase as a wallet,
            as you may accidentally expose your identities.
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

          <Typography variant="body1">
            Save this recovery passphrase somewhere secret, such as written down
            on a piece of paper or stored in a good password manager like
            {' '}
            <a
              href="https://bitwarden.com/?ref=signata.net"
              target="_blank"
              rel="noreferrer"
            >
              Bitwarden
            </a>
            . If someone else finds your recovery passphrase, they can steal
            your identities. If you lose your passphrase you and the Signata
            team will
            {' '}
            <b>never</b>
            {' '}
            be able to restore your account.
          </Typography>
          <FormControlLabel
            control={(
              <Switch
                checked={firstConfirmChecked}
                onChange={() => setFirstConfirmChecked(!firstConfirmChecked)}
                color="secondary"
              />
            )}
            label="I will never tell anyone my passphrase, even if it's someone offering me support. The only website that I will ever use it on is signata.net."
          />
          <FormControlLabel
            control={(
              <Switch
                checked={secondConfirmChecked}
                onChange={() => setSecondConfirmChecked(!secondConfirmChecked)}
                color="secondary"
              />
            )}
            label="I have saved a copy of my passphrase somewhere safe, because if I lose it I will never be able to restore my account, and Signata support will never be able to restore my account."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={(e) => handleClickCreate(e, recoveryPassphrase)}
          variant="contained"
          disabled={!firstConfirmChecked || !secondConfirmChecked}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateAccountPopup;
