import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  useEthers,
  shortenIfAddress,
} from '@usedapp/core';
import { useTheme, styled } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LinkIcon from '@mui/icons-material/Link';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  CardContent,
  Chip,
  Stack,
  useMediaQuery,
  Dialog,
  DialogContent,
  AlertTitle,
  TextField,
  Paper,
  DialogTitle,
} from '@mui/material';
import {
  getNanoContract,
  getNanoContractAddress,
  useGetSingleValue,
  useDelegateNano,
  useSelfLockNano,
} from '../../hooks/chainHooks';
import LoadingState from './LoadingState';
import ItemHeader from '../app/ItemHeader';
import ItemBox from '../app/ItemBox';
import { shouldBeLoading, logLoading, SUPPORTED_CHAINS } from '../../hooks/helpers';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function NanoIdentity() {
  const { chainId, account } = useEthers();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });

  const [isLoading, setLoading] = useState(false);
  const [openLock, setOpenLock] = useState(false);
  const [newDelegate, setNewDelegate] = useState('');
  const [newDelegateValid, setNewDelegateValid] = useState(false);
  const [openDelegateNano, setOpenDelegateNano] = useState(false);

  const nanoContract = getNanoContract(chainId);
  const identityLocked = useGetSingleValue(
    '_identityLocked',
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
    state: lockState,
    send: lockSend,
    resetState: lockResetState,
  } = useSelfLockNano(chainId);

  const {
    state: delegateState,
    send: delegateSend,
    resetState: delegateResetState,
  } = useDelegateNano(chainId);

  useEffect(() => {
    if (lockState) {
      logLoading(lockState, 'lockNano');
      setLoading(shouldBeLoading(lockState.status));
    }
  }, [lockState]);

  useEffect(() => {
    if (delegateState) {
      logLoading(delegateState, 'delegateNano');
      setLoading(shouldBeLoading(delegateState.status));
    }
  }, [delegateState]);

  const resetStates = () => {
    lockResetState();
    delegateResetState();
  };

  const handleClickLock = () => {
    setOpenLock(true);
  };

  const onCloseLock = () => {
    setOpenLock(false);
  };

  const handleConfirmLock = () => {
    setOpenLock(false);
    resetStates();
    lockSend();
  };

  const handleClickDelegate = () => {
    setOpenDelegateNano(true);
  };

  const onChangeNewDelegate = (e) => {
    setNewDelegate(e.target.value);
    try {
      ethers.utils.getAddress(e.target.value);
      setNewDelegateValid(true);
    } catch {
      setNewDelegateValid(false);
    }
  };

  const onCloseDelegate = () => {
    setOpenDelegateNano(false);
  };

  const onSubmitDelegateNano = (e) => {
    e.preventDefault();
    try {
      ethers.utils.getAddress(newDelegate);
      setNewDelegateValid(true);
      resetStates();
      delegateSend(newDelegate);
      setOpenDelegateNano(false);
    } catch {
      setNewDelegateValid(false);
    }
  };

  return (
    <>
      <Dialog open={openLock} onClose={onCloseLock}>
        <DialogTitle>Lock Nano Identity?</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {identityDelegate === account && (
              <Alert severity="warning">
                <AlertTitle>Identity Not Delegated!</AlertTitle>
                Your nano identity is not delegated. If you lock your identity,
                you cannot unlock it until you delegate it.
              </Alert>
            )}
            <Alert severity="info">
              Locking your identity will prevent it from being used to
              authenticate or by smart contracts that use Signata identities.
              You should only lock your identity if you think your wallet has
              been compromised.
            </Alert>
            <Paper>
              <ButtonGroup fullWidth>
                <Button onClick={onCloseLock} color="secondary" variant="text">
                  Cancel
                </Button>
                <Button
                  fullWidth
                  onClick={handleConfirmLock}
                  variant="contained"
                  color="error"
                  startIcon={<LockIcon />}
                >
                  Lock
                </Button>
              </ButtonGroup>
            </Paper>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog open={openDelegateNano} onClose={onCloseDelegate}>
        <DialogTitle>Delegate Nano Identity?</DialogTitle>
        <form onSubmit={onSubmitDelegateNano}>
          <DialogContent>
            <Stack spacing={2}>
              <Alert severity="info">
                Delegating your identity to another address means the delegate
                can make changes to your identity on your behalf. Make sure you
                only delegate to a trusted address.
              </Alert>
              <TextField
                label="New Delegate"
                variant="outlined"
                fullWidth
                color="info"
                value={newDelegate}
                onChange={onChangeNewDelegate}
              />
              <Paper>
                <ButtonGroup fullWidth variant="text">
                  <Button onClick={onCloseDelegate} color="secondary">
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={newDelegateValid === false}
                  >
                    Set New Delegate
                  </Button>
                </ButtonGroup>
              </Paper>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>
      <ItemBox>
        <ItemHeader text="Nano Identity" />
        <CardContent>
          <Stack spacing={2}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
              }}
              component="ul"
            >
              <ListItem>
                <Chip
                  icon={<LinkIcon />}
                  label={`Chain: ${
                    SUPPORTED_CHAINS.find(
                      (network) => network.chainId === chainId,
                    )?.chainName
                  }`}
                  color="default"
                />
              </ListItem>
              <ListItem>
                <Chip
                  icon={<FingerprintIcon />}
                  label="Registered"
                  color="success"
                  variant="outlined"
                />
              </ListItem>
              <ListItem>
                <Chip
                  label={
                    identityDelegate === account
                      ? 'Not Delegated'
                      : `Delegated to ${shortenIfAddress(identityDelegate)}`
                  }
                  color={identityDelegate === account ? 'error' : 'success'}
                  variant={identityDelegate === account ? 'outlined' : 'outlined'}
                  icon={<PermIdentityIcon />}
                />
              </ListItem>
              <ListItem>
                <Chip
                  label={identityLocked ? 'Locked' : 'Unlocked'}
                  color={identityLocked ? 'error' : 'success'}
                  variant={identityLocked ? 'filled' : 'outlined'}
                  icon={identityLocked ? <LockIcon /> : <LockOpenIcon />}
                />
              </ListItem>
            </Box>
            <LoadingState state={lockState} />
            <LoadingState state={delegateState} />
            <Paper>
              <ButtonGroup
                fullWidth
                variant="text"
                color="secondary"
                orientation={isSm ? 'horizontal' : 'vertical'}
              >
                {identityLocked === false && (
                  <Button
                    disabled={isLoading}
                    // startIcon={<LockIcon />}
                    onClick={handleClickLock}
                  >
                    Lock
                  </Button>
                )}
                <Button
                  disabled={isLoading}
                  // startIcon={<EditIcon />}
                  onClick={handleClickDelegate}
                >
                  Delegate
                </Button>
              </ButtonGroup>
            </Paper>
          </Stack>
        </CardContent>
      </ItemBox>
    </>
  );
}

export default NanoIdentity;
