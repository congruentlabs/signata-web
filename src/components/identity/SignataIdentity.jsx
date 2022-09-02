import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { DEFAULT_SUPPORTED_CHAINS } from '@usedapp/core';
import { useTheme, styled } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import LinkIcon from '@mui/icons-material/Link';
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
  DialogTitle,
  TextField,
  Box,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import {
  useCreateIdentity,
  useLockIdentity,
  useUnlockIdentity,
  useDestroyIdentity,
  useRolloverIdentity,
  useGetSingleValue,
  getIdContractAddress,
} from '../../hooks/chainHooks';
import LoadingState from './LoadingState';
import ItemHeader from '../app/ItemHeader';
import ItemBox from '../app/ItemBox';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function SignataIdentity({
  identities,
  setIdentities,
  chainId,
  id,
  DOMAIN_SEPARATOR,
  idContract,
  TXTYPE_CREATE_DIGEST,
  TXTYPE_LOCK_DIGEST,
  TXTYPE_UNLOCK_DIGEST,
  TXTYPE_DESTROY_DIGEST,
  TXTYPE_ROLLOVER_DIGEST,
}) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });

  const [isLoading, setLoading] = useState(false);
  const [openLock, setOpenLock] = useState(false);
  const [newDelegate, setNewDelegate] = useState('');
  const [newSecurity, setNewSecurity] = useState('');
  const [newDelegateValid, setNewDelegateValid] = useState(false);
  const [newSecurityValid, setNewSecurityValid] = useState(false);
  const [openRename, setOpenRename] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUnlock, setOpenUnlock] = useState(false);
  const [openRollover, setOpenRollover] = useState(false);
  const [openDestroy, setOpenDestroy] = useState(false);
  const [newName, setNewName] = useState('');
  const [identityWallet, setIdentityWallet] = useState(null);
  const [delegateWallet, setDelegateWallet] = useState(null);
  const [securityWallet, setSecurityWallet] = useState(null);

  useEffect(() => {
    if (id) {
      setIdentityWallet(ethers.Wallet.fromMnemonic(id.identitySeed));
      setDelegateWallet(ethers.Wallet.fromMnemonic(id.delegateSeed));
      setSecurityWallet(ethers.Wallet.fromMnemonic(id.securitySeed));
    }
  }, [id]);

  const {
    state: createState,
    send: createSend,
    resetState: createResetState,
  } = useCreateIdentity(chainId);

  const {
    state: lockState,
    send: lockSend,
    resetState: lockResetState,
  } = useLockIdentity(chainId);

  const {
    state: unlockState,
    send: unlockSend,
    resetState: unlockResetState,
  } = useUnlockIdentity(chainId);

  const {
    state: destroyState,
    send: destroySend,
    resetState: destroyResetState,
  } = useDestroyIdentity(chainId);

  const {
    state: rolloverState,
    send: rolloverSend,
    resetState: rolloverResetState,
  } = useRolloverIdentity(chainId);

  const identityExists = useGetSingleValue(
    '_identityExists',
    [id.identityAddress || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  const identityDestroyed = useGetSingleValue(
    '_identityDestroyed',
    [id.identityAddress || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  const identityLocked = useGetSingleValue(
    '_identityLocked',
    [id.identityAddress || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  const identityLockCount = useGetSingleValue(
    '_identityLockCount',
    [id.identityAddress || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  const identityRolloverCount = useGetSingleValue(
    '_identityRolloverCount',
    [id.identityAddress || ''],
    getIdContractAddress(chainId),
    idContract,
  );

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
    if (unlockState) {
      console.log(unlockState);
      if (unlockState.status === 'PendingSignature') {
        setLoading(true);
      }
      if (unlockState.status === 'Exception') {
        setLoading(false);
      }
      if (unlockState.status === 'Mining') {
        setLoading(true);
      }
      if (unlockState.status === 'Success') {
        setLoading(false);
      }
    }
  }, [unlockState]);

  useEffect(() => {
    if (destroyState) {
      console.log(destroyState);
      if (destroyState.status === 'PendingSignature') {
        setLoading(true);
      }
      if (destroyState.status === 'Exception') {
        setLoading(false);
      }
      if (destroyState.status === 'Mining') {
        setLoading(true);
      }
      if (destroyState.status === 'Success') {
        setLoading(false);
      }
    }
  }, [destroyState]);

  useEffect(() => {
    if (rolloverState) {
      console.log(rolloverState);
      if (rolloverState.status === 'PendingSignature') {
        setLoading(true);
      }
      if (rolloverState.status === 'Exception') {
        setLoading(false);
      }
      if (rolloverState.status === 'Mining') {
        setLoading(true);
      }
      if (rolloverState.status === 'Success') {
        setLoading(false);
      }
    }
  }, [rolloverState]);

  const onCreateIdentity = async (e) => {
    e.preventDefault();
    createResetState();

    const inputHash = ethers.utils.keccak256(
      `${TXTYPE_CREATE_DIGEST}${delegateWallet.address
        .slice(2)
        .padStart(64, '0')}${securityWallet.address
        .slice(2)
        .padStart(64, '0')}`,
    );
    const hashToSign = ethers.utils.keccak256(
      `0x1901${DOMAIN_SEPARATOR.slice(2)}${inputHash.slice(2)}`,
    );
    const { r, s, v } = new ethers.utils.SigningKey(
      identityWallet.privateKey,
    ).signDigest(hashToSign);

    createSend(
      v,
      r,
      s,
      identityWallet.address,
      delegateWallet.address,
      securityWallet.address,
    );
  };

  const handleClickLock = (e) => {
    e.preventDefault();
    setOpenLock(true);
  };

  const onCloseLock = (e) => {
    e.preventDefault();
    setOpenLock(false);
  };

  const onLockIdentity = (e) => {
    e.preventDefault();
    setOpenLock(false);
    lockResetState();

    const inputHash = ethers.utils.keccak256(
      `${TXTYPE_LOCK_DIGEST}${identityLockCount
        .toHexString()
        .slice(2)
        .padStart(64, '0')}`,
    );
    const hashToSign = ethers.utils.keccak256(
      `0x1901${DOMAIN_SEPARATOR.slice(2)}${inputHash.slice(2)}`,
    );
    const { r, s, v } = new ethers.utils.SigningKey(
      delegateWallet.privateKey,
    ).signDigest(hashToSign);

    lockSend(identityWallet.address, v, r, s);
  };

  const handleClickUnlock = (e) => {
    e.preventDefault();
    setOpenUnlock(true);
  };

  const onCloseUnlock = (e) => {
    e.preventDefault();
    setOpenUnlock(false);
  };

  const onUnlockIdentity = (e) => {
    e.preventDefault();
    setOpenUnlock(false);
    unlockResetState();

    const inputHash = ethers.utils.keccak256(
      `${TXTYPE_UNLOCK_DIGEST}${identityLockCount
        .toHexString()
        .slice(2)
        .padStart(64, '0')}`,
    );
    const hashToSign = ethers.utils.keccak256(
      `0x1901${DOMAIN_SEPARATOR.slice(2)}${inputHash.slice(2)}`,
    );
    const { r, s, v } = new ethers.utils.SigningKey(
      securityWallet.privateKey,
    ).signDigest(hashToSign);

    unlockSend(identityWallet.address, v, r, s);
  };

  const handleClickRollover = (e) => {
    e.preventDefault();
    setOpenRollover(true);
  };

  const onCloseRollover = (e) => {
    e.preventDefault();
    setOpenRollover(false);
  };

  const onRolloverIdentity = (e) => {
    e.preventDefault();
    setOpenRollover(false);
    rolloverResetState();

    const inputHash = ethers.utils.keccak256(
      `${TXTYPE_ROLLOVER_DIGEST}${newDelegate.address
        .slice(2)
        .padStart(64, '0')}${newSecurity.address
        .slice(2)
        .padStart(64, '0')}${identityRolloverCount
        .toHexString()
        .slice(2)
        .padStart(64, '0')}`,
    );
    const hashToSign = ethers.utils.keccak256(
      `0x1901${DOMAIN_SEPARATOR.slice(2)}${inputHash.slice(2)}`,
    );
    const {
      r: delegateR,
      s: delegateS,
      v: delegateV,
    } = new ethers.utils.SigningKey(delegateWallet.privateKey).signDigest(
      hashToSign,
    );
    const {
      r: securityR,
      s: securityS,
      v: securityV,
    } = new ethers.utils.SigningKey(securityWallet.privateKey).signDigest(
      hashToSign,
    );

    rolloverSend(
      identityWallet.address,
      delegateV,
      delegateR,
      delegateS,
      securityV,
      securityR,
      securityS,
      newDelegate,
      newSecurity,
    );
  };

  const handleClickDestroy = (e) => {
    e.preventDefault();
    setOpenDestroy(true);
  };

  const onCloseDestroy = (e) => {
    e.preventDefault();
    setOpenDestroy(false);
  };

  const onDestroyIdentity = (e) => {
    e.preventDefault();
    setOpenDestroy(false);
    destroyResetState();

    const inputHash = ethers.utils.keccak256(`${TXTYPE_DESTROY_DIGEST}`);
    const hashToSign = ethers.utils.keccak256(
      `0x1901${DOMAIN_SEPARATOR.slice(2)}${inputHash.slice(2)}`,
    );
    const {
      r: delegateR,
      s: delegateS,
      v: delegateV,
    } = new ethers.utils.SigningKey(delegateWallet.privateKey).signDigest(
      hashToSign,
    );
    const {
      r: securityR,
      s: securityS,
      v: securityV,
    } = new ethers.utils.SigningKey(securityWallet.privateKey).signDigest(
      hashToSign,
    );

    destroySend(
      identityWallet.address,
      delegateV,
      delegateR,
      delegateS,
      securityV,
      securityR,
      securityS,
    );
  };

  const handleClickRename = (e) => {
    e.preventDefault();
    setNewName(id.name || 'New Name');
    setOpenRename(true);
  };

  const onCloseRename = (e) => {
    e.preventDefault();
    setOpenRename(false);
    setNewName('');
  };

  const onSubmitRename = (e) => {
    e.preventDefault();
    let newId = id;
    const newIds = Array.from(identities);
    newIds.forEach((s, idx) => {
      if (s.identitySeed === newId.identitySeed) {
        newId = { ...newId, name: newName };
        newIds[idx] = newId;
      }
    });
    setIdentities(newIds);
    onCloseRename(e);
  };

  const handleClickDelete = (e) => {
    e.preventDefault();
    setOpenDelete(true);
  };

  const onCloseDelete = (e) => {
    e.preventDefault();
    setOpenDelete(false);
  };

  const onSubmitDelete = (e) => {
    e.preventDefault();
    const newSeeds = [];
    identities.forEach((s) => {
      if (s.identitySeed !== id.identitySeed) {
        newSeeds.push(s);
      }
    });
    setIdentities(newSeeds);
    onCloseDelete();
  };

  const handleClickCopy = (e, dat) => {
    e.preventDefault();
    navigator.clipboard.writeText(dat);
  };

  return (
    <>
      <Dialog open={openDelete} onClose={onCloseDelete}>
        <DialogTitle>Delete Identity?</DialogTitle>
        <form onSubmit={onSubmitDelete}>
          <DialogContent>
            <Stack spacing={2}>
              <Alert severity="warning">
                Identities that have not been registered are deleted immediately
                and cannot be recovered.
              </Alert>
              <ButtonGroup fullWidth>
                <Button
                  onClick={onCloseDelete}
                  color="secondary"
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  // fullWidth
                  type="submit"
                  variant="contained"
                  color="error"
                  size="large"
                >
                  Delete Identity
                </Button>
              </ButtonGroup>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>
      <Dialog open={openDestroy} onClose={onCloseDestroy}>
        <DialogTitle>Destory Identity?</DialogTitle>
        <form onSubmit={onDestroyIdentity}>
          <DialogContent>
            <Stack spacing={2}>
              <Alert severity="warning">
                If you destroy your identity it will become permanently
                destroyed on the blockchain. You cannot restore a destroyed
                identity.
              </Alert>
              <ButtonGroup fullWidth>
                <Button
                  onClick={onCloseDestroy}
                  color="secondary"
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  // fullWidth
                  type="submit"
                  variant="contained"
                  color="error"
                  size="large"
                >
                  Destroy Identity
                </Button>
              </ButtonGroup>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>
      <Dialog open={openLock} onClose={onCloseLock}>
        <DialogTitle>Lock Identity?</DialogTitle>
        <form onSubmit={onLockIdentity}>
          <DialogContent>
            <Stack spacing={2}>
              <Alert severity="warning">
                If you want to prevent your identity from being modified or
                used, you can lock it on the blockchain. If you believe your
                identity might have been compromised, locking it is an easy way
                to restrict its use.
              </Alert>
              <ButtonGroup fullWidth>
                <Button
                  onClick={onCloseLock}
                  color="secondary"
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  // fullWidth
                  type="submit"
                  variant="contained"
                  color="warning"
                  size="large"
                >
                  Lock Identity
                </Button>
              </ButtonGroup>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>
      <Dialog open={openUnlock} onClose={onCloseUnlock}>
        <DialogTitle>Unlock Identity?</DialogTitle>
        <form onSubmit={onUnlockIdentity}>
          <DialogContent>
            <Stack spacing={2}>
              <Alert severity="warning">
                If your identity is locked and you believe it is safe to use
                again, you can unlock it on the blockchain. Only unlock it if
                you think the threat is gone. If you think your identity is
                compromised, it is recommended to Rollover the identity instead.
              </Alert>
              <ButtonGroup fullWidth>
                <Button
                  onClick={onCloseUnlock}
                  color="secondary"
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  // fullWidth
                  type="submit"
                  variant="contained"
                  color="warning"
                  size="large"
                >
                  Unlock Identity
                </Button>
              </ButtonGroup>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>
      <Dialog open={openRollover} onClose={onCloseRollover}>
        <DialogTitle>Unlock Identity?</DialogTitle>
        <form onSubmit={onRolloverIdentity}>
          <DialogContent>
            <Stack spacing={2}>
              <Alert severity="warning">
                Rolling over an identity means your Delegate and Security
                wallets will be changed for it. Your identity address remains
                the same. Only rollover your identity if you think it might have
                been compromised.
              </Alert>
              <TextField
                label="New Delegate Seed"
                variant="outlined"
                fullWidth
                color="info"
                value={newDelegate}
                onChange={(e) => setNewDelegate(e.target.value)}
              />
              <TextField
                label="New Security Seed"
                variant="outlined"
                fullWidth
                color="info"
                value={newSecurity}
                onChange={(e) => setNewSecurity(e.target.value)}
              />
              <ButtonGroup fullWidth>
                <Button
                  onClick={onCloseRollover}
                  color="secondary"
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  // fullWidth
                  type="submit"
                  variant="contained"
                  color="warning"
                  size="large"
                >
                  Rollover Identity
                </Button>
              </ButtonGroup>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>
      <Dialog open={openRename} onClose={onCloseRename}>
        <form onSubmit={onSubmitRename}>
          <DialogContent>
            <Stack spacing={2}>
              <Alert severity="info">
                Identity names are just so you can easily identify your
                identities, like specifying if one is for a specific purpose.
                The names are not visible to anyone else, and are not written to
                the blockchain.
              </Alert>
              <TextField
                label="New Name"
                variant="outlined"
                fullWidth
                color="info"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <ButtonGroup fullWidth>
                <Button
                  onClick={onCloseRename}
                  color="secondary"
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Save New Name
                </Button>
              </ButtonGroup>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>
      <ItemBox>
        <ItemHeader text={`Identity: ${id.name || 'Unnamed'}`} />
        <CardContent>
          <Stack spacing={2}>
            <Box
              sx={{
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontFamily: 'Roboto Mono' }} variant="overline" component="p">
                Identity:
                {id.identityAddress}
                <IconButton
                  aria-label="copy identity"
                  size="small"
                  onClick={(e) => handleClickCopy(e, id.identityAddress)}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Typography>
              <Typography sx={{ fontFamily: 'Roboto Mono' }} variant="overline" component="p">
                Delegate:
                {id.delegateAddress}
                <IconButton
                  aria-label="copy identity"
                  size="small"
                  onClick={(e) => handleClickCopy(e, id.delegateAddress)}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Typography>
              <Typography sx={{ fontFamily: 'Roboto Mono' }} variant="overline" component="p">
                Security:
                {id.securityAddress}
                <IconButton
                  aria-label="copy identity"
                  size="small"
                  onClick={(e) => handleClickCopy(e, id.securityAddress)}
                >
                  <ContentCopyIcon />
                </IconButton>
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
                    label={`Chain: ${
                      DEFAULT_SUPPORTED_CHAINS.find(
                        (network) => network.chainId === id.chainId,
                      )?.chainName
                    }`}
                    color={id.chainId === chainId ? 'success' : 'warning'}
                    variant="outlined"
                    icon={
                      id.chainId === chainId ? <LinkIcon /> : <LinkOffIcon />
                    }
                  />
                </ListItem>
                {id.chainId === chainId && !identityDestroyed && (
                  <ListItem>
                    <Chip
                      label={identityExists ? 'Registered' : 'Unregistered'}
                      color={identityExists ? 'success' : 'warning'}
                      variant={identityExists ? 'outlined' : 'filled'}
                      icon={
                        identityExists ? (
                          <FingerprintIcon />
                        ) : (
                          <ErrorOutlineIcon />
                        )
                      }
                    />
                  </ListItem>
                )}
                {id.chainId === chainId && !identityDestroyed && (
                  <ListItem>
                    <Chip
                      label={identityLocked ? 'Locked' : 'Unlocked'}
                      color={identityLocked ? 'error' : 'success'}
                      variant={identityLocked ? 'filled' : 'outlined'}
                      icon={identityLocked ? <LockIcon /> : <LockOpenIcon />}
                    />
                  </ListItem>
                )}
                {id.chainId === chainId && identityExists && identityDestroyed && (
                  <ListItem>
                    <Chip
                      label="Destroyed"
                      color="error"
                      variant="filled"
                      icon={<ErrorOutlineIcon />}
                    />
                  </ListItem>
                )}
              </Box>
            </Box>
            <LoadingState state={createState} />
            <LoadingState state={lockState} />
            <LoadingState state={unlockState} />
            <LoadingState state={rolloverState} />
            <LoadingState state={destroyState} />
            <ButtonGroup
              fullWidth
              variant="contained"
              disabled={isLoading || id.chainId !== chainId}
              color="secondary"
              orientation={isSm ? 'horizontal' : 'vertical'}
            >
              {!identityExists && (
                <Button onClick={onCreateIdentity} color="primary">
                  Register
                </Button>
              )}
              <Button onClick={handleClickRename}>Rename</Button>
              {identityExists && !identityLocked && (
                <Button onClick={handleClickLock}>Lock</Button>
              )}
              {identityExists && identityLocked && (
                <Button onClick={handleClickUnlock}>Unlock</Button>
              )}
              {identityExists && (
                <Button onClick={handleClickRollover} disabled>
                  Rollover
                </Button>
              )}
              {identityExists && (
                <Button onClick={handleClickDestroy}>Destroy</Button>
              )}
              {!identityExists && (
                <Button onClick={handleClickDelete}>Delete</Button>
              )}
            </ButtonGroup>
          </Stack>
        </CardContent>
      </ItemBox>
    </>
  );
}

export default SignataIdentity;
