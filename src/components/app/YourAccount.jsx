import React, { useState } from 'react';
import { grey } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import CryptoJS from 'crypto-js';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
  Grid,
  Chip,
  CardContent,
  ButtonGroup,
  Button,
  Stack,
  Alert,
  AlertTitle,
  TextField,
  useMediaQuery,
} from '@mui/material';
import ItemHeader from './ItemHeader';
import ItemBox from './ItemBox';

function YourAccount(props) {
  const {
    config, setConfig, isPersistent, setEncryptionPassword, unlocked,
  } = props;
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [firstErrorMessage, setFirstErrorMessage] = useState('');
  const [secondErrorMessage, setSecondErrorMessage] = useState('');
  const [showCapsWarning, setShowCapsWarning] = useState(false);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });

  const onChangePassword = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 12) {
      setFirstErrorMessage('Password needs to be longer than 12 characters');
    } else {
      setFirstErrorMessage('');
    }
  };

  const onChangePasswordRepeat = (e) => {
    setPasswordRepeat(e.target.value);
    if (e.target.value !== password) {
      setSecondErrorMessage('Password does not match');
    } else {
      setSecondErrorMessage('');
    }
  };

  const onKeyDown = (keyEvent) => {
    if (keyEvent.getModifierState('CapsLock')) {
      setShowCapsWarning(true);
    } else {
      setShowCapsWarning(false);
    }
  };

  const onCreatePassword = (e) => {
    e.preventDefault();
    // set the password globally
    setEncryptionPassword(password);
    // hash the password so we can verify it later
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const hashedPassword = CryptoJS.PBKDF2(password, salt, {
      iterations: 10000,
    });
    // mark the config as hasAccount
    setConfig({
      ...config,
      hasAccount: true,
      salt: salt.toString(),
      hashedPassword: hashedPassword.toString(),
    });
  };

  const onUnlockPassword = (e) => {
    e.preventDefault();
    const salt = CryptoJS.enc.Hex.parse(config.salt);
    const hashedPassword = CryptoJS.PBKDF2(password, salt, {
      iterations: 10000,
    });
    if (hashedPassword.toString() === config.hashedPassword) {
      setEncryptionPassword(password);
    } else {
      setFirstErrorMessage('Incorrect password!');
    }
  };

  return (
    <Grid item xs={12} md={6}>
      <ItemBox>
        <ItemHeader text="Your Account" />
        <CardContent>
          {(!config || !config.hasAccount) && (
            <form onSubmit={onCreatePassword}>
              <Stack spacing={1}>
                {!isPersistent && (
                  <Alert severity="error">
                    <AlertTitle>Not Persistent</AlertTitle>
                    This device won&apos;t save your data once you leave this app.
                    It is not safe to use Signata on this device as you may lose
                    your identity data.
                  </Alert>
                )}
                <Alert severity="info">
                  <AlertTitle>Account Password</AlertTitle>
                  Your password encrypts all of your identities. Your identities are
                  only saved on this device. If you clear your browser cache, or use
                  this app in a private window, you might lose your data once you
                  leave this app.
                </Alert>
                <TextField
                  label="Password"
                  variant="outlined"
                  color="info"
                  type="password"
                  size="small"
                  onKeyDown={onKeyDown}
                  value={password}
                  error={firstErrorMessage !== ''}
                  onChange={onChangePassword}
                  helperText={firstErrorMessage}
                />
                <TextField
                  label="Repeat Password"
                  variant="outlined"
                  color="info"
                  type="password"
                  size="small"
                  onKeyDown={onKeyDown}
                  value={passwordRepeat}
                  error={secondErrorMessage !== ''}
                  onChange={onChangePasswordRepeat}
                  helperText={secondErrorMessage}
                />
                {showCapsWarning && (
                  <Alert severity="warning">Caps Lock is On</Alert>
                )}
                <ButtonGroup
                  fullWidth
                  orientation={isSm ? 'horizontal' : 'vertical'}
                >
                  {(!config || !config.hasAccount) && (
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={
                          !password
                          || password.length < 1
                          || password !== passwordRepeat
                        }
                    onClick={onCreatePassword}
                  >
                    Set Password
                  </Button>
                  )}
                </ButtonGroup>
              </Stack>
            </form>
          )}

          {config && config.hasAccount && !unlocked && (
            <form onSubmit={onUnlockPassword}>
              <Stack spacing={1}>
                {!isPersistent && (
                  <Alert severity="error">
                    <AlertTitle>Not Persistent</AlertTitle>
                    This device won&apos;t save your data once you leave this app.
                    It is not safe to use Signata on this device as you may lose
                    your identity data.
                  </Alert>
                )}
                <Alert severity="info">
                  Unlock your account to access your identities.
                </Alert>
                <TextField
                  label="Password"
                  variant="outlined"
                  color="info"
                  type="password"
                  size="small"
                  onKeyDown={onKeyDown}
                  value={password}
                  error={firstErrorMessage !== ''}
                  onChange={onChangePassword}
                  helperText={firstErrorMessage}
                />
                {showCapsWarning && (
                <Alert severity="warning">Caps Lock is On</Alert>
                )}
                <Button
                  color="primary"
                  variant="contained"
                  disabled={!password || password.length < 1}
                  onClick={onUnlockPassword}
                >
                  Unlock
                </Button>
              </Stack>
            </form>
          )}

          {config && config.hasAccount && unlocked && (
            <Stack spacing={1}>
              <Alert severity="success">Account Unlocked</Alert>
              <ButtonGroup
                fullWidth
                orientation={isSm ? 'horizontal' : 'vertical'}
              >
                <Button color="secondary" variant="contained" disabled>
                  Download Backup
                </Button>
                <Button color="secondary" variant="contained" disabled>
                  Restore Backup
                </Button>
              </ButtonGroup>
              {/* <TextField
                label="New Password"
                variant="outlined"
                color="info"
                type="password"
                size="small"
                onKeyDown={onKeyDown}
                value={password}
                error={firstErrorMessage !== ''}
                onChange={onChangePassword}
                helperText={firstErrorMessage}
              />
              <TextField
                label="New Repeat Password"
                variant="outlined"
                color="info"
                type="password"
                size="small"
                onKeyDown={onKeyDown}
                value={passwordRepeat}
                error={secondErrorMessage !== ''}
                onChange={onChangePasswordRepeat}
                helperText={secondErrorMessage}
              />
              <Button
                color="primary"
                variant="contained"
                disabled={!password || password.length < 1}
                onClick={onReplacePassword}
              >
                Replace Password
              </Button> */}
            </Stack>
          )}
        </CardContent>
      </ItemBox>
    </Grid>
  );
}

export default YourAccount;
