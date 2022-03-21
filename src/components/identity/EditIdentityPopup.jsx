import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export function EditIdentityPopup({
  // editingIdentity,
  open,
  handleClickClose,
  handleClickDelete,
  handleClickLock,
  handleClickUnlock,
  handleClickMigrate,
  handleClickSave,
}) {
  return (
    <Dialog
        open={open}
        keepMounted
        onClose={handleClickClose}
      >
        <DialogTitle>Edit Identity</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A Signata account is used to manage all of your identities. We do
            not store your account on our servers unless you want us to.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>Cancel</Button>
          <Button onClick={handleClickSave}>Save Changes</Button>
          <Button onClick={handleClickDelete}>Destroy</Button>
          <Button onClick={handleClickLock}>Lock</Button>
          <Button onClick={handleClickUnlock}>Unlock</Button>
          <Button onClick={handleClickMigrate}>Migrate</Button>
        </DialogActions>
      </Dialog>
  );
}

export default EditIdentityPopup;
