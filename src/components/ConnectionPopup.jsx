import { forwardRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ConnectionPopup = ({
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
        <DialogTitle>Connecting to Web3</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Connecting your web3 wallet to Signata means you accept
            our Terms &amp; Conditions and Privacy Policy.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>Cancel</Button>
          <Button onClick={handleClickConnect}>Connect</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};