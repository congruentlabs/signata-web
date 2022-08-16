import React, { useState, useEffect } from 'react';
import { useEthers, shortenIfAddress } from '@usedapp/core';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
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
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });

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
    <Grid item xs={12} md={6}>
      <Box
        sx={{
          minHeight: {
            md: 350,
          },
          borderRadius: 0,
          border: 1,
          borderColor: grey[600],
          backgroundColor: grey[50],
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{
            background: grey[300],
            fontFamily: 'Roboto Condensed',
            borderBottom: 1,
            borderColor: grey[600],
          }}
        >
          Your Nano Identity
        </Typography>
        <CardContent>
          <Stack spacing={1}>
            {identityExists ? (
              <Chip
                icon={<FingerprintIcon />}
                label="Identity Registered"
                color="primary"
                sx={{ borderRadius: 0 }}
              />
            ) : (
              <Alert severity="info">
                A nano identity is a limited version of a Signata identity. If
                you want to try Signata without setting up an account, you can
                register your connected wallet as a Nano Identity. If you hold
                10 SATA it is free to create a Nano identity, otherwise
                you&apos;ll have to pay a small fee.
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
            <ButtonGroup
              fullWidth
              orientation={isSm ? 'horizontal' : 'vertical'}
            >
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
              <Button
                color="inherit"
                target="_blank"
                href="https://docs.signata.net/"
                startIcon={<QuestionMarkIcon />}
              >
                Help
              </Button>
            </ButtonGroup>
          </Stack>
        </CardContent>
        <LoadingState state={createState} />
        <LoadingState state={lockState} />
      </Box>
    </Grid>
  );
}

export default NanoIdentity;
