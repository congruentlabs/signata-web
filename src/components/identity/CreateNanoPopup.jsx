import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';

import { useCreateNano } from '../../hooks/chainHooks';
import { shouldBeLoading } from '../../hooks/helpers';

function CreateNanoPopup({ open, handleClickClose }) {
  const [name, setName] = useState('');
  const [isCreateIdLoading, setCreateIdLoading] = useState(false);
  const {
    state: createState,
    send: createSend,
    resetState: createResetState,
  } = useCreateNano();

  const handleClickCreate = (e) => {
    createResetState();
    createSend();
  };

  useEffect(() => {
    if (createState) {
      console.log(createState);
      setCreateIdLoading(shouldBeLoading(createState.status));
    }
  }, [createState]);

  return (
    <Dialog open={open} keepMounted onClose={handleClickClose}>
      <DialogTitle>Create Nano Identity</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1">
            Nano identities are directly attached to your web3 wallet. You
            can use a nano identity to try out Signata, but they do not provide
            all the features of a Signata identity.
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

export default CreateNanoPopup;
