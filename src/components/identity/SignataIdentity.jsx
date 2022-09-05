import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
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
import { shouldBeLoading, logLoading, SUPPORTED_CHAINS } from '../../hooks/helpers';

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
  const [hasKycNft, setHasKycNft] = useState(false);

  useEffect(() => {
    if (id) {
      setIdentityWallet(ethers.Wallet.fromMnemonic(id.identitySeed));
      if (id.type !== 'wallet') {
        setDelegateWallet(ethers.Wallet.fromMnemonic(id.delegateSeed));
      }
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
      logLoading(createState, 'create');
      setLoading(shouldBeLoading(createState.status));
    }
  }, [createState]);

  useEffect(() => {
    if (lockState) {
      logLoading(lockState, 'lock');
      setLoading(shouldBeLoading(lockState.status));
    }
  }, [lockState]);

  useEffect(() => {
    if (unlockState) {
      logLoading(unlockState, 'unlock');
      setLoading(shouldBeLoading(unlockState.status));
    }
  }, [unlockState]);

  useEffect(() => {
    if (destroyState) {
      logLoading(destroyState, 'destroy');
      setLoading(shouldBeLoading(destroyState.status));
    }
  }, [destroyState]);

  useEffect(() => {
    if (rolloverState) {
      logLoading(rolloverState, 'rollover');
      setLoading(shouldBeLoading(rolloverState.status));
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

  const onCreateWalletIdentity = async (e) => {
    e.preventDefault();
    createResetState();

    const inputHash = ethers.utils.keccak256(
      `${TXTYPE_CREATE_DIGEST}${id.delegateAddress
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
      id.delegateAddress,
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
    setOpenDelete(false);
  };

  const handleClickCopy = (e, dat) => {
    e.preventDefault();
    navigator.clipboard.writeText(dat);
  };

  const handleClickRequestKyc = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-undef
    const blockpass = new BlockpassKYCConnect('signata_f812a', {
      refId: id.identityAddress,
      elementId: `blockpass-kyc-connect-${id.identityAddress}`,
    });
    blockpass.startKYCConnect();
  };

  const handleClickClaimKycNft = (e) => {
    e.preventDefault();
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
              <Paper>
                <ButtonGroup fullWidth variant="text">
                  <Button
                    onClick={onCloseDelete}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    // fullWidth
                    type="submit"
                    variant="contained"
                    color="error"
                  >
                    Delete Identity
                  </Button>
                </ButtonGroup>
              </Paper>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>
      <Dialog open={openDestroy} onClose={onCloseDestroy}>
        <DialogTitle>Destroy Identity?</DialogTitle>
        <form onSubmit={onDestroyIdentity}>
          <DialogContent>
            <Stack spacing={2}>
              <Alert severity="warning">
                If you destroy your identity it will become permanently
                destroyed on the blockchain. You cannot restore a destroyed
                identity.
              </Alert>
              <Paper>
                <ButtonGroup fullWidth variant="text">
                  <Button
                    onClick={onCloseDestroy}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    // fullWidth
                    type="submit"
                    variant="contained"
                    color="error"
                  >
                    Destroy Identity
                  </Button>
                </ButtonGroup>
              </Paper>
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
              <Paper>
                <ButtonGroup fullWidth variant="text">
                  <Button
                    onClick={onCloseLock}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    // fullWidth
                    type="submit"
                    variant="contained"
                    color="warning"
                  >
                    Lock Identity
                  </Button>
                </ButtonGroup>
              </Paper>
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
              <Paper>
                <ButtonGroup fullWidth variant="text">
                  <Button
                    onClick={onCloseUnlock}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    // fullWidth
                    type="submit"
                    variant="contained"
                    color="warning"
                  >
                    Unlock Identity
                  </Button>
                </ButtonGroup>
              </Paper>
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
              <Paper>
                <ButtonGroup fullWidth variant="text">
                  <Button
                    onClick={onCloseRollover}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    // fullWidth
                    type="submit"
                    variant="contained"
                    color="warning"
                  >
                    Rollover Identity
                  </Button>
                </ButtonGroup>
              </Paper>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>
      <Dialog open={openRename} onClose={onCloseRename}>
        <DialogTitle>Rename Identity?</DialogTitle>
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
              <Paper>
                <ButtonGroup fullWidth variant="text">
                  <Button
                    onClick={onCloseRename}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Save New Name
                  </Button>
                </ButtonGroup>
              </Paper>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>
      <ItemBox>
        <ItemHeader text={`Identity: ${id.name || 'Unnamed'}`} />
        {/* <CardContent> */}
        <Stack spacing={2} sx={{ marginTop: 1 }}>
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
                px: 0.5,
                m: 0,
              }}
              component="ul"
            >
              <ListItem>
                {id.chainId === chainId ? (
                  <Chip
                    label={`Chain: ${
                      SUPPORTED_CHAINS.find(
                        (network) => network.chainId === id.chainId,
                      )?.chainName
                    }`}
                    color="success"
                    variant="outlined"
                    icon={<LinkIcon />}
                  />
                ) : (
                  <Chip
                    label={`Connect to ${
                      SUPPORTED_CHAINS.find(
                        (network) => network.chainId === id.chainId,
                      )?.chainName
                    } to manage this Identity`}
                    color="warning"
                    variant="outlined"
                    icon={<LinkOffIcon />}
                  />
                )}
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
          {id.chainId === chainId && (
          <Paper>
            <ButtonGroup
              fullWidth
              variant="text"
              disabled={isLoading || id.chainId !== chainId}
              color="secondary"
              orientation={isSm ? 'horizontal' : 'vertical'}
            >
              {!identityExists && (
              <Button onClick={id.type === 'wallet' ? onCreateWalletIdentity : onCreateIdentity} color="primary">
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
          </Paper>
          )}
          {id.chainId === chainId && identityExists && !hasKycNft && (
          <Paper>
            <ButtonGroup
              fullWidth
              variant="text"
              size="small"
              disabled={isLoading || id.chainId !== chainId}
              color="secondary"
              orientation={isSm ? 'horizontal' : 'vertical'}
            >
              <Button
                onClick={handleClickRequestKyc}
                id={`blockpass-kyc-connect-${id.identityAddress}`}
              >
                KYC Identity
              </Button>
              <Button
                onClick={handleClickClaimKycNft}
              >
                Claim KYC Right
              </Button>
            </ButtonGroup>
          </Paper>
          )}
        </Stack>
        {/* </CardContent> */}
      </ItemBox>
    </>
  );
}

export default SignataIdentity;
