import React, { useState, useEffect } from 'react';
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
  } = useSelfLockNano();

  const {
    state: delegateState,
    send: delegateSend,
    resetState: delegateResetState,
  } = useDelegateNano();

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

  const handleClickDelegate = () => {
    resetStates();
    delegateSend([delegateAddress]);
  };

  const onCloseLock = () => {
    setOpenLock(false);
  };

  const handleConfirmLock = () => {
    setOpenLock(false);
    resetStates();
    lockSend();
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
              <Button onClick={onCloseLock} color="inherit">
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
      <ItemBox>
        <ItemHeader text="Nano Identity" />
        <CardContent>
          <Stack spacing={1}>
            <Chip
              label={`Chain: ${
                DEFAULT_SUPPORTED_CHAINS.find(
                  (network) => network.chainId === chainId,
                )?.chainName
              }`}
              color="default"
              sx={{
                borderRadius: 0,
                height: 24,
                border: 1,
                borderColor: 'black',
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
                height: 28,
                border: 1,
                borderColor: 'black',
              }}
            />
            <Chip
              label={identityLocked ? 'Locked' : 'Unlocked'}
              color={identityLocked ? 'error' : 'success'}
              variant={identityLocked ? 'filled' : 'outlined'}
              icon={identityLocked ? <LockIcon /> : <LockOpenIcon />}
              sx={{
                borderRadius: 0,
                height: 28,
                border: 1,
                borderColor: 'black',
              }}
            />
            <Chip
              icon={<FingerprintIcon />}
              label="Identity Registered"
              color="default"
              variant="outlined"
              sx={{
                borderRadius: 0,
                height: 24,
                border: 1,
                borderColor: 'black',
              }}
            />
            <ButtonGroup
              fullWidth
              size="small"
              variant="contained"
              orientation={isSm ? 'horizontal' : 'vertical'}
            >
              {identityLocked === false && (
                <Button
                  color="inherit"
                  disabled={isLoading}
                  startIcon={<LockIcon />}
                  onClick={handleClickLock}
                >
                  Lock
                </Button>
              )}
              <Button
                color="inherit"
                disabled={isLoading}
                startIcon={<EditIcon />}
                onClick={handleClickDelegate}
              >
                Delegate
              </Button>
            </ButtonGroup>
          </Stack>
        </CardContent>
        <LoadingState state={lockState} />
      </ItemBox>
    </>
  );
}

export default NanoIdentity;
