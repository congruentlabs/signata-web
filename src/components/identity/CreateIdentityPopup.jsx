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

function CreateAccountPopup({ open, handleClickClose, handleClickCreate }) {
  const [name, setName] = useState('');

  return (
    <Dialog open={open} keepMounted onClose={handleClickClose}>
      <DialogTitle>Create Signata Identity</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1">
            Every Signata Identity is like a blockchain wallet, but it has some
            extra features to make it more useful. Give your identity a name so
            you can easily recognise it.
          </Typography>
          <TextField
            label="Identity Name"
            placeholder="e.g. My Main Identity"
            variant="filled"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={(e) => handleClickCreate(e, name)}
          variant="contained"
          startIcon={<AddIcon />}
          disabled={!name}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateAccountPopup;
