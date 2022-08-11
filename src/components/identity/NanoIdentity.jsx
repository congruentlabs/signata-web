import React, { useState, useEffect } from 'react';
import { useEthers, shortenIfAddress } from '@usedapp/core';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import UploadIcon from '@mui/icons-material/Upload';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import {
  Grid,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import {
  getNanoContract,
  getNanoContractAddress,
  useGetSingleValue,
  useCreateNano,
  useDelegateNano,
  useSelfLockNano,
} from '../../hooks/chainHooks';
import LoadingState from './LoadingState';

function NanoIdentity() {
  const { chainId, account } = useEthers();

  const [delegateAddress, setDelegateAddress] = useState('');
  const [isLoading, setLoading] = useState(false);

  const nanoContract = getNanoContract(chainId);
  const identityLocked = useGetSingleValue(
    '_identityLocked',
    [account],
    getNanoContractAddress(chainId),
    nanoContract,
  );

  const identityExists = useGetSingleValue(
    '_identityExists',
    [account],
    getNanoContractAddress(chainId),
    nanoContract,
  );

  const identityDelegate = useGetSingleValue(
    '_identityDelegate',
    [account],
    getNanoContractAddress(chainId),
    nanoContract,
  );

  const {
    state: createState,
    send: createSend,
    resetState: createResetState,
  } = useCreateNano();

  const {
    state: lockState,
    send: lockSend,
    resetState: lockResetState,
  } = useSelfLockNano();

  const {
    state: delegateState,
    send: delegateSend,
    resetState: delegateResetState,
  } = useDelegateNano();

  useEffect(() => {
    if (createState) {
      console.log(createState);
      if (createState.status === 'PendingSignature') {
        setLoading(true);
      }
      if (createState.status === 'Exception') {
        setLoading(false);
      }
      if (createState.status === 'None') {
        setLoading(false);
      }
      if (createState.status === 'Mining') {
        setLoading(true);
      }
      if (createState.status === 'Success') {
        setLoading(false);
      }
    }
  }, [createState]);

  useEffect(() => {
    if (lockState) {
      console.log(lockState);
      if (lockState.status === 'PendingSignature') {
        setLoading(true);
      }
      if (lockState.status === 'Exception') {
        setLoading(false);
      }
      if (lockState.status === 'None') {
        setLoading(false);
      }
      if (lockState.status === 'Mining') {
        setLoading(true);
      }
      if (lockState.status === 'Success') {
        setLoading(false);
      }
    }
  }, [lockState]);

  useEffect(() => {
    if (delegateState) {
      console.log(delegateState);
      if (delegateState.status === 'PendingSignature') {
        setLoading(true);
      }
      if (delegateState.status === 'Exception') {
        setLoading(false);
      }
      if (delegateState.status === 'None') {
        setLoading(false);
      }
      if (delegateState.status === 'Mining') {
        setLoading(true);
      }
      if (delegateState.status === 'Success') {
        setLoading(false);
      }
    }
  }, [delegateState]);

  const resetStates = () => {
    createResetState();
    lockResetState();
    delegateResetState();
  };

  const handleClickCreate = () => {
    resetStates();
    createSend();
  };

  const handleClickLock = () => {
    resetStates();
    lockSend();
  };

  const handleClickDelegate = () => {
    resetStates();
    delegateSend([delegateAddress]);
  };

  return (
    <Grid item xs={12} sm={6}>
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6" align="center">
              Your Nano Identity
            </Typography>
            {identityExists ? (
              <Chip
                icon={<FingerprintIcon />}
                label="Identity Registered"
                color="primary"
                sx={{ borderRadius: 0 }}
              />
            ) : (
              <Alert severity="info" sx={{ borderRadius: 0 }}>
                <AlertTitle>No Nano Identity</AlertTitle>
                This device has not been set up with a Signata account. Create a new
                account, or import your existing account.
              </Alert>
            )}
            {identityExists === true && identityLocked === false && (
              <Chip
                icon={<LockOpenIcon />}
                label="Identity Unlocked"
                color="primary"
                sx={{ borderRadius: 0 }}
              />
            )}
            {identityExists === true && identityLocked === true && (
              <Chip
                icon={<LockIcon />}
                label="Identity Locked"
                color="error"
                sx={{ borderRadius: 0 }}
              />
            )}
            {identityExists === true && identityDelegate === account && (
              <Chip
                icon={<PermIdentityIcon />}
                label="Not Delegated"
                color="secondary"
                sx={{ borderRadius: 0 }}
              />
            )}
            {identityExists === true && identityDelegate !== account && (
              <Chip
                icon={<PermIdentityIcon />}
                label={`Delegated to ${shortenIfAddress(identityDelegate)}`}
                color="primary"
                sx={{ borderRadius: 0 }}
              />
            )}
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          {!identityExists && (
            <Button
              color="primary"
              variant="contained"
              disabled={isLoading}
              startIcon={<AddIcon />}
              onClick={handleClickCreate}
            >
              Create
            </Button>
          )}
          {identityExists === true && identityLocked === false && (
            <Button
              color="error"
              variant="contained"
              disabled={isLoading}
              startIcon={<LockIcon />}
              onClick={handleClickLock}
            >
              Lock
            </Button>
          )}
          {identityExists === true && (
            <Button
              color="secondary"
              variant="contained"
              disabled={isLoading}
              startIcon={<EditIcon />}
              onClick={handleClickDelegate}
            >
              Delegate
            </Button>
          )}
          <IconButton
            color="inherit"
            size="small"
            target="_blank"
            href="https://docs.signata.net/"
          >
            <QuestionMarkIcon />
          </IconButton>
        </CardActions>
        <LoadingState state={createState} />
        <LoadingState state={lockState} />
      </Card>
    </Grid>
  );
}

export default NanoIdentity;
