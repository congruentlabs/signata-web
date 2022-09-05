import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useEthers, shortenIfAddress } from '@usedapp/core';
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
  Chip,
  Stack,
  useMediaQuery,
  Typography,
  TextField,
  Paper,
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
import ChangeDialog from './ChangeDialog';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function NanoIdentity() {
  const { chainId, account } = useEthers();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });
  const isXs = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  const [isLoading, setLoading] = useState(false);
  const [openLock, setOpenLock] = useState(false);
  const [newDelegate, setNewDelegate] = useState('');
  const [newDelegateValid, setNewDelegateValid] = useState(false);
  const [openDelegateNano, setOpenDelegateNano] = useState(false);

  const nanoContract = getNanoContract(chainId);
  const identityLocked = useGetSingleValue('_identityLocked', [account], getNanoContractAddress(chainId), nanoContract);

  const identityDelegate = useGetSingleValue(
    '_identityDelegate',
    [account],
    getNanoContractAddress(chainId),
    nanoContract,
  );

  const { state: lockState, send: lockSend, resetState: lockResetState } = useSelfLockNano(chainId);

  const { state: delegateState, send: delegateSend, resetState: delegateResetState } = useDelegateNano(chainId);

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

  const handleConfirmLock = (e) => {
    e.preventDefault();
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
      <ChangeDialog
        open={openLock}
        onClose={onCloseLock}
        onSubmit={handleConfirmLock}
        title="Lock Nano Identity?"
        alertSeverity="warning"
        alertText="Locking your identity will prevent it from being used to authenticate or by smart contracts that use Signata identities. You should only lock your identity if you think your wallet has been compromised."
        submitColor="error"
        submitText="Lock Nano Identity"
        fields={
          identityDelegate === account && (
            <Alert severity="warning" variant="filled" key="undelegated-warning">
              Your nano identity is not delegated. If you lock your identity, you cannot unlock it until you delegate
              it.
            </Alert>
          )
        }
      />
      <ChangeDialog
        open={openDelegateNano}
        onClose={onCloseDelegate}
        onSubmit={onSubmitDelegateNano}
        title="Lock Nano Identity?"
        alertSeverity="info"
        alertText="Delegating your identity to another address means the delegate can make changes to your identity on your behalf. Make sure you only delegate to a trusted address."
        submitColor="primary"
        submitText="Delegate Nano Identity"
        fields={[
          <TextField
            label="New Delegate"
            key="new-delegate"
            variant="outlined"
            fullWidth
            required
            color="info"
            value={newDelegate}
            onChange={onChangeNewDelegate}
          />,
        ]}
      />
      <ItemBox>
        <ItemHeader text="Nano Identity" logo="logo.png" />
        <Stack spacing={2} sx={{ marginTop: 1 }}>
          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontFamily: 'Roboto Mono' }} variant="body2" component="p">
              Identity:
              {isXs ? shortenIfAddress(account) : account}
              {/* <IconButton
                aria-label="copy identity"
                size="small"
                onClick={(e) => handleClickCopy(e, id.identityAddress)}
              >
                <ContentCopyIcon />
              </IconButton> */}
            </Typography>
            <Typography sx={{ fontFamily: 'Roboto Mono' }} variant="body2" component="p">
              Delegate:
              {isXs ? shortenIfAddress(identityDelegate) : identityDelegate}
              {/* <IconButton
                aria-label="copy identity"
                size="small"
                onClick={(e) => handleClickCopy(e, id.delegateAddress)}
              >
                <ContentCopyIcon />
              </IconButton> */}
            </Typography>
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
                  label={`Chain: ${SUPPORTED_CHAINS.find((network) => network.chainId === chainId)?.chainName}`}
                  color="default"
                />
              </ListItem>
              <ListItem>
                <Chip icon={<FingerprintIcon />} label="Registered" color="success" variant="outlined" />
              </ListItem>
              <ListItem>
                <Chip
                  label={identityLocked ? 'Locked' : 'Unlocked'}
                  color={identityLocked ? 'error' : 'success'}
                  variant={identityLocked ? 'filled' : 'outlined'}
                  icon={identityLocked ? <LockIcon /> : <LockOpenIcon />}
                />
              </ListItem>
              <ListItem>
                <Chip
                  label={
                    identityDelegate === account ? 'Not Delegated' : `Delegated to ${shortenIfAddress(identityDelegate)}`
                  }
                  color={identityDelegate === account ? 'warning' : 'success'}
                  variant="outlined"
                  icon={<PermIdentityIcon />}
                />
              </ListItem>
            </Box>
          </Box>
          <LoadingState state={lockState} />
          <LoadingState state={delegateState} />
          <Paper>
            <ButtonGroup fullWidth variant="text" color="secondary" orientation={isSm ? 'horizontal' : 'vertical'}>
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
      </ItemBox>
    </>
  );
}

export default NanoIdentity;
