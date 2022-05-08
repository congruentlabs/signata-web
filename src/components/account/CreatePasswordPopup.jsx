import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";

function CreatePasswordPopup({ open, handleClickClose, handleClickCreate }) {
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [firstErrorMessage, setFirstErrorMessage] = useState("");
  const [secondErrorMessage, setSecondErrorMessage] = useState("");

  const onChangePassword = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 12) {
      setFirstErrorMessage("Password needs to be longer than 12 characters");
    } else {
      setFirstErrorMessage("");
    }
  };

  const onChangePasswordRepeat = (e) => {
    setPasswordRepeat(e.target.value);
    if (e.target.value !== password) {
      setSecondErrorMessage("Password does not match");
    } else {
      setSecondErrorMessage("");
    }
  };

  return (
    <Dialog open={open} keepMounted onClose={handleClickClose}>
      <DialogTitle>Set Signata Account Password</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1">
            To make it easier to access your account, you need to set your own
            password instead of using your recovery passphrase all the time.
          </Typography>
          <Typography variant="body1">
            Your password will encrypt your recovery passphrase locally. The
            Signata service does not store your encrypted recovery passphrase
            anywhere.
          </Typography>
          <TextField
            label="Password"
            type="password"
            error={firstErrorMessage !== ""}
            variant="standard"
            value={password}
            onChange={onChangePassword}
            helperText={firstErrorMessage}
          />
          <TextField
            label="Repeat Password"
            type="password"
            error={secondErrorMessage !== ""}
            variant="standard"
            value={passwordRepeat}
            onChange={onChangePasswordRepeat}
            helperText={secondErrorMessage}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={(e) => handleClickCreate(e, password)}
          variant="contained"
          disabled={
            !password || password.length < 1 || password !== passwordRepeat
          }
          startIcon={<AddIcon />}
        >
          Set Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreatePasswordPopup;
