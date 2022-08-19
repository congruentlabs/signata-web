import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  useEthers,
  shortenIfAddress,
  DEFAULT_SUPPORTED_CHAINS,
} from '@usedapp/core';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import {
  Alert,
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

function NanoIdentity() {
  const { chainId, account } = useEthers();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });

  const [delegateAddress, setDelegateAddress] = useState('');
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
            <ButtonGroup fullWidth>
              <Button onClick={onCloseLock} color="secondary">
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
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog open={openDelegateNano} onClose={onCloseDelegate}>
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
              <ButtonGroup fullWidth>
                <Button onClick={onCloseDelegate} color="secondary">
                  Cancel
                </Button>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={newDelegateValid === false}
                >
                  Set New Delegate
                </Button>
              </ButtonGroup>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>
      <ItemBox>
        <ItemHeader text="Nano Identity" />
        <CardContent>
          <Stack spacing={2}>
            <Chip
              label={`Chain: ${
                DEFAULT_SUPPORTED_CHAINS.find(
                  (network) => network.chainId === chainId,
                )?.chainName
              }`}
              color="default"
              sx={{
                borderRadius: 0,
              }}
            />
            <Chip
              label={
                identityDelegate === account
                  ? 'Not Delegated'
                  : `Delegated to ${shortenIfAddress(identityDelegate)}`
              }
              color={identityDelegate === account ? 'error' : 'success'}
              variant={identityDelegate === account ? 'outlined' : 'outlined'}
              icon={<PermIdentityIcon />}
              sx={{
                borderRadius: 0,
              }}
            />
            <Chip
              label={identityLocked ? 'Locked' : 'Unlocked'}
              color={identityLocked ? 'error' : 'success'}
              variant={identityLocked ? 'filled' : 'outlined'}
              icon={identityLocked ? <LockIcon /> : <LockOpenIcon />}
              sx={{
                borderRadius: 0,
              }}
            />
            <Chip
              icon={<FingerprintIcon />}
              label="Identity Registered"
              color="default"
              variant="outlined"
              sx={{
                borderRadius: 0,
              }}
            />
            <LoadingState state={lockState} />
            <LoadingState state={delegateState} />
            <ButtonGroup
              fullWidth
              variant="contained"
              orientation={isSm ? 'horizontal' : 'vertical'}
            >
              {identityLocked === false && (
                <Button
                  color="secondary"
                  disabled={isLoading}
                  startIcon={<LockIcon />}
                  onClick={handleClickLock}
                >
                  Lock
                </Button>
              )}
              <Button
                color="secondary"
                disabled={isLoading}
                startIcon={<EditIcon />}
                onClick={handleClickDelegate}
              >
                Delegate
              </Button>
            </ButtonGroup>
          </Stack>
        </CardContent>
      </ItemBox>
    </>
  );
}

export default NanoIdentity;
