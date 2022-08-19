import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useTheme } from '@mui/material/styles';
import {
  useEthers,
  DEFAULT_SUPPORTED_CHAINS,
} from '@usedapp/core';
import { generateMnemonic } from 'ethereum-cryptography/bip39';
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english';
import AddIcon from '@mui/icons-material/Add';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Alert,
  Button,
  ButtonGroup,
  DialogContent,
  CardContent,
  Chip,
  Dialog,
  Grid,
  Stack,
  TextField,
  DialogTitle,
  useMediaQuery,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import ItemHeader from '../app/ItemHeader';
import ItemBox from '../app/ItemBox';
import TabPanel from './TabPanel';
import LoadingState from './LoadingState';
import {
  getNanoContract,
  getNanoContractAddress,
  useGetSingleValue,
  useCreateNano,
} from '../../hooks/chainHooks';
import NanoIdentity from './NanoIdentity';

function ManageIdentities(props) {
  const { identities, setIdentities } = props;
  const { chainId, account } = useEthers();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });
  const [identitySeed, setIdentitySeed] = useState('');
  const [delegateSeed, setDelegateSeed] = useState('');
  const [securitySeed, setSecuritySeed] = useState('');
  const [openRename, setOpenRename] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const nanoContract = getNanoContract(chainId);
  const [isLoading, setLoading] = useState(false);

  const {
    state: createNanoState,
    send: createNanoSend,
    resetState: createNanoResetState,
  } = useCreateNano();

  const nanoExists = useGetSingleValue(
    '_identityExists',
    [account],
    getNanoContractAddress(chainId),
    nanoContract,
  );

  const onCreateIdentity = (e) => {
    e.preventDefault();
    console.log(identities);
    const newIds = Array.from(identities);

    const identityWallet = ethers.Wallet.fromMnemonic(identitySeed);
    const identityAddress = identityWallet.address;
    const delegateWallet = ethers.Wallet.fromMnemonic(delegateSeed);
    const delegateAddress = delegateWallet.address;
    const securityWallet = ethers.Wallet.fromMnemonic(securitySeed);
    const securityAddress = securityWallet.address;
    newIds.push({
      identitySeed,
      delegateSeed,
      securitySeed,
      identityAddress,
      delegateAddress,
      securityAddress,
      name: 'New Identity',
      chainId,
      creator: account,
    });
    setIdentities(newIds);
    setIdentitySeed('');
    setDelegateSeed('');
    setSecuritySeed('');
  };

  useEffect(() => {
    if (createNanoState) {
      console.log(createNanoState);
      if (createNanoState.status === 'PendingSignature') {
        setLoading(true);
      }
      if (createNanoState.status === 'Exception') {
        setLoading(false);
      }
      if (createNanoState.status === 'Mining') {
        setLoading(true);
      }
      if (createNanoState.status === 'Success') {
        setLoading(false);
      }
    }
  }, [createNanoState]);

  const resetStates = () => {
    createNanoResetState();
  };

  const onCreateNanoIdentity = () => {
    resetStates();
    createNanoSend();
  };

  const onClickGenerate = (e) => {
    e.preventDefault();
    setIdentitySeed(generateMnemonic(wordlist));
    setDelegateSeed(generateMnemonic(wordlist));
    setSecuritySeed(generateMnemonic(wordlist));
  };

  const onRenameSeed = (e, seed) => {
    setNewName(seed.name || 'New Name');
    setEditingId(seed);
    setOpenRename(true);
  };

  const onRegisterSeed = (e, id) => {
    e.preventDefault();
    // get the first address for all three seeds
    const identityWallet = ethers.Wallet.fromMnemonic(id.identitySeed);
    const delegateWallet = ethers.Wallet.fromMnemonic(id.delegateSeed);
    const securityWallet = ethers.Wallet.fromMnemonic(id.securitySeed);
  };

  const onLockSeed = (e, id) => {
    e.preventDefault();
  };

  const onUnlockSeed = (e, id) => {
    e.preventDefault();
  };

  const onRolloverSeed = (e, id) => {
    e.preventDefault();
  };

  const onDeleteSeed = (e, id) => {
    e.preventDefault();
    setEditingId(id);
    setOpenDelete(true);
  };

  const onDestroySeed = (e, id) => {
    e.preventDefault();
  };

  const onCloseDelete = () => {
    setOpenDelete(false);
    setEditingId(null);
  };

  const onCloseRename = () => {
    setOpenRename(false);
    setNewName('');
    setEditingId(null);
  };

  const onSubmitRename = (e) => {
    e.preventDefault();
    let newId = editingId;
    const newIds = Array.from(identities);
    newIds.forEach((s, idx) => {
      if (s.identitySeed === newId.identitySeed) {
        newId = { ...newId, name: newName };
        newIds[idx] = newId;
      }
    });
    setIdentities(newIds);
    onCloseRename();
  };

  const onSubmitDelete = (e) => {
    const newSeeds = [];
    identities.forEach((s) => {
      if (s.identitySeed !== editingId.identitySeed) {
        newSeeds.push(s);
      }
    });
    setIdentities(newSeeds);
    onCloseDelete();
  };

  const handleChangeTab = (e, newTabValue) => {
    setTabValue(newTabValue);
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
                <Button onClick={onCloseDelete} color="secondary">
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
      <Dialog open={openRename} onClose={onCloseRename}>
        <form onSubmit={onSubmitRename}>
          <DialogContent>
            <Stack spacing={2}>
              <Alert severity="info">
                Identity names are just so you can easily identify which
                identity is which. The names are not visible to anyone else, and
                are not written to the blockchain.
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
                <Button onClick={onCloseRename} color="secondary">
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
      {identities && identities.map((id) => (
        <Grid item xs={12} md={6} key={id.identitySeed}>
          <ItemBox>
            <ItemHeader text={`Identity: ${id.name || 'Unnamed'}`} />
            <CardContent>
              <Stack spacing={2}>
                {/* <Chip
                    label={seed.address && shortenIfAddress(seed.address)}
                    color="default"
                    sx={{
                      borderRadius: 0,
                      height: 48,
                      border: 1,
                      borderColor: 'black',
                    }}
                  /> */}
                <Chip
                  label={`Chain: ${
                    DEFAULT_SUPPORTED_CHAINS.find(
                      (network) => network.chainId === id.chainId,
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
                  label={`Identity: ${id.identityAddress}`}
                  color="default"
                  variant="outlined"
                  sx={{
                    borderRadius: 0,
                    height: 24,
                    border: 1,
                    borderColor: 'black',
                  }}
                />
                <Chip
                  label={`Delegate: ${id.delegateAddress}`}
                  color="default"
                  variant="outlined"
                  sx={{
                    borderRadius: 0,
                    height: 24,
                    border: 1,
                    borderColor: 'black',
                  }}
                />
                <Chip
                  label={`Security: ${id.securityAddress}`}
                  color="default"
                  variant="outlined"
                  sx={{
                    borderRadius: 0,
                    height: 24,
                    border: 1,
                    borderColor: 'black',
                  }}
                />
                <Chip
                  label={id.locked ? 'Locked' : 'Unlocked'}
                  color={id.locked ? 'error' : 'success'}
                  variant={id.locked ? 'filled' : 'outlined'}
                  icon={id.locked ? <LockIcon /> : <LockOpenIcon />}
                  sx={{
                    borderRadius: 0,
                    height: 28,
                    border: 1,
                    borderColor: 'black',
                  }}
                />
                <Chip
                  label={id.registered ? 'Registered' : 'Unregistered'}
                  color={id.registered ? 'success' : 'warning'}
                  variant={id.registered ? 'outlined' : 'filled'}
                  icon={
                      id.registered ? <FingerprintIcon /> : <ErrorOutlineIcon />
                    }
                  sx={{
                    borderRadius: 0,
                    height: 28,
                    border: 1,
                    borderColor: 'black',
                  }}
                />
                <ButtonGroup
                  fullWidth
                  size="small"
                  variant="contained"
                  color="secondary"
                  orientation={isSm ? 'horizontal' : 'vertical'}
                >
                  {!id.registered && (
                  <Button
                    onClick={(e) => onRegisterSeed(e, id)}
                    color="primary"
                  >
                    Register
                  </Button>
                  )}
                  <Button onClick={(e) => onRenameSeed(e, id)}>Rename</Button>
                  {id.registered && !id.locked && (
                  <Button onClick={(e) => onLockSeed(e, id)}>Lock</Button>
                  )}
                  {id.registered && id.locked && (
                  <Button onClick={(e) => onUnlockSeed(e, id)}>
                    Unlock
                  </Button>
                  )}
                  {id.registered && (
                  <Button onClick={(e) => onRolloverSeed(e, id)}>
                    Rollover
                  </Button>
                  )}
                  {id.registered && (
                  <Button onClick={(e) => onDestroySeed(e, id)}>
                    Destroy
                  </Button>
                  )}
                  {!id.registered && (
                  <Button onClick={(e) => onDeleteSeed(e, id)}>
                    Delete
                  </Button>
                  )}
                </ButtonGroup>
              </Stack>
            </CardContent>
          </ItemBox>
        </Grid>
      ))}
      {nanoExists && (
        <Grid item xs={12} md={6}>
          <NanoIdentity />
        </Grid>
      )}
      <Grid item xs={12} md={6}>
        <ItemBox>
          <ItemHeader text="Add Identity" />
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              textColor="primary"
              indicatorColor="primary"
              centered
            >
              <Tab label="Wallet" />
              <Tab label="Independent" />
              <Tab label="Nano" />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <Stack spacing={2}>
              <TextField
                label="Identity Seed"
                variant="outlined"
                color="info"
                size="small"
                value={identitySeed}
              />
              <TextField
                label="Delegate Address"
                variant="outlined"
                color="info"
                size="small"
                value={account}
                disabled
              />
              <TextField
                label="Security Seed"
                variant="outlined"
                color="info"
                size="small"
                value={securitySeed}
              />
              <ButtonGroup
                fullWidth
                orientation={isSm ? 'horizontal' : 'vertical'}
              >
                <Button
                  color="primary"
                  onClick={onCreateIdentity}
                  variant="contained"
                  disabled={!identitySeed || !delegateSeed || !securitySeed}
                  startIcon={<AddIcon />}
                >
                  Add Identity
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={onClickGenerate}
                >
                  Generate
                </Button>
              </ButtonGroup>
              <Alert severity="info">
                Wallet identities are linked to your connected wallet. These are
                easy to use for authentication, but will link any on-chain
                identity information with the wallet you have connected with.
              </Alert>
            </Stack>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Stack spacing={2}>
              <TextField
                label="Identity Seed"
                variant="outlined"
                color="info"
                size="small"
                value={identitySeed}
              />
              <TextField
                label="Delegate Seed"
                variant="outlined"
                color="info"
                size="small"
                value={delegateSeed}
              />
              <TextField
                label="Security Seed"
                variant="outlined"
                color="info"
                size="small"
                value={securitySeed}
              />
              <ButtonGroup
                fullWidth
                orientation={isSm ? 'horizontal' : 'vertical'}
              >
                <Button
                  color="primary"
                  onClick={onCreateIdentity}
                  variant="contained"
                  disabled={!identitySeed || !delegateSeed || !securitySeed}
                  startIcon={<AddIcon />}
                >
                  Add Identity
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={onClickGenerate}
                >
                  Generate
                </Button>
              </ButtonGroup>
              <Alert severity="info">
                Independent identities have all seeds randomly generated. These
                identities are useful for more privacy, but can be more
                difficult to use in some scenarios.
              </Alert>
            </Stack>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Stack spacing={2}>
              <TextField
                label="Identity Address"
                variant="outlined"
                color="info"
                size="small"
                value={account}
                disabled
              />
              <ButtonGroup
                fullWidth
                orientation={isSm ? 'horizontal' : 'vertical'}
              >
                <Button
                  color="primary"
                  onClick={onCreateNanoIdentity}
                  variant="contained"
                  disabled={isLoading || nanoExists}
                  startIcon={<AddIcon />}
                >
                  Create Nano Identity
                </Button>
              </ButtonGroup>
              <LoadingState state={createNanoState} />
              {nanoExists ? (
                <Alert severity="success">
                  You already have a nano identity on this network.
                </Alert>
              ) : (
                <Alert severity="info">
                  A nano identity is a limited version of a Signata identity. If
                  you want to try out Signata, you can register your connected
                  wallet as a Nano Identity. If you hold 10 SATA it is free to
                  create a Nano identity, otherwise you&apos;ll have to pay a
                  small fee.
                </Alert>
              )}
            </Stack>
          </TabPanel>
        </ItemBox>
      </Grid>
    </>
  );
}

export default ManageIdentities;
