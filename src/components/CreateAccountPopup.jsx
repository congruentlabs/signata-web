import { forwardRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CreateAccountPopup = ({
  open,
  handleClickClose,
  handleClickConnect,
}) => {
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClickClose}
      >
        <DialogTitle>Create Signata Account</DialogTitle>
        <DialogContent>
          <Stack>
            <Typography variant="body1" gutterBottom>
              A Signata account is used to manage all of your identities. We do not store your account on our servers unless you want us to.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Your account looks very similar to 
            </Typography>
            <TextField
              label="Recovery Passphrase"
              variant="outlined"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>Cancel</Button>
          <Button onClick={handleClickConnect} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};