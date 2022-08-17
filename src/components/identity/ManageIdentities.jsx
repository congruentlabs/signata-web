import React, { useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { ethers } from 'ethers';
import { useTheme } from '@mui/material/styles';
import {
  useEthers,
  shortenIfAddress,
  DEFAULT_SUPPORTED_CHAINS,
} from '@usedapp/core';
import { generateMnemonic } from 'ethereum-cryptography/bip39';
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HowToRegIcon from '@mui/icons-material/HowToReg';
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
} from '@mui/material';
import ItemHeader from '../app/ItemHeader';
import ItemBox from '../app/ItemBox';

function ManageIdentities(props) {
  const { seeds, setSeeds } = props;
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
  const [editingSeed, setEditingSeed] = useState(null);

  const onCreateIdentity = (e) => {
    e.preventDefault();
    console.log(seeds);
    const newSeeds = Array.from(seeds);

    const identityWallet = ethers.Wallet.fromMnemonic(identitySeed);
    const identityAddress = identityWallet.address;
    const delegateWallet = ethers.Wallet.fromMnemonic(delegateSeed);
    const delegateAddress = delegateWallet.address;
    const securityWallet = ethers.Wallet.fromMnemonic(securitySeed);
    const securityAddress = securityWallet.address;
    newSeeds.push({
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
    setSeeds(newSeeds);
    setIdentitySeed('');
    setDelegateSeed('');
    setSecuritySeed('');
  };

  const onClickGenerate = (e) => {
    e.preventDefault();
    setIdentitySeed(generateMnemonic(wordlist));
    setDelegateSeed(generateMnemonic(wordlist));
    setSecuritySeed(generateMnemonic(wordlist));
  };

  const onRenameSeed = (e, seed) => {
    setNewName(seed.name || 'New Name');
    setEditingSeed(seed);
    setOpenRename(true);
  };

  const onRegisterSeed = (e, seed) => {
    e.preventDefault();
    // get the first address for all three seeds
    const identityWallet = ethers.Wallet.fromMnemonic(seed.identitySeed);
    const identityAddress = identityWallet.address;
    const delegateWallet = ethers.Wallet.fromMnemonic(seed.delegateSeed);
    const delegateAddress = delegateWallet.address;
    const securityWallet = ethers.Wallet.fromMnemonic(seed.securitySeed);
    const securityAddress = securityWallet.address;
  };

  const onLockSeed = (e, seed) => {
    e.preventDefault();
  };

  const onUnlockSeed = (e, seed) => {
    e.preventDefault();
  };

  const onRolloverSeed = (e, seed) => {
    e.preventDefault();
  };

  const onDeleteSeed = (e, seed) => {
    e.preventDefault();
    setEditingSeed(seed);
    setOpenDelete(true);
  };

  const onDestroySeed = (e, seed) => {
    e.preventDefault();
  };

  const onCloseDelete = () => {
    setOpenDelete(false);
    setEditingSeed(null);
  };

  const onCloseRename = () => {
    setOpenRename(false);
    setNewName('');
    setEditingSeed(null);
  };

  const onSubmitRename = (e) => {
    e.preventDefault();
    let newSeed = editingSeed;
    const newSeeds = Array.from(seeds);
    newSeeds.forEach((s, idx) => {
      if (s.identitySeed === newSeed.identitySeed) {
        newSeed = { ...newSeed, name: newName };
        newSeeds[idx] = newSeed;
      }
    });
    setSeeds(newSeeds);
    onCloseRename();
  };

  const onSubmitDelete = (e) => {
    const newSeeds = [];
    seeds.forEach((s) => {
      if (s.identitySeed !== editingSeed.identitySeed) {
        newSeeds.push(s);
      }
    });
    setSeeds(newSeeds);
    onCloseDelete();
  };

  return (
    <>
      <Dialog open={openDelete} onClose={onCloseDelete}>
        <DialogTitle>Delete Identity?</DialogTitle>
        <form onSubmit={onSubmitDelete}>
          <DialogContent>
            <Stack spacing={2}>
              <Alert severity="warning">
                Identities that have not been registered are
                deleted immediately and cannot be recovered.
              </Alert>
              <ButtonGroup fullWidth>
                <Button
                  onClick={onCloseDelete}
                  color="inherit"
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
                <Button
                  onClick={onCloseRename}
                  color="inherit"
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
      {seeds
        && seeds.map((seed) => (
          <Grid item xs={12} md={6} key={seed.identitySeed}>
            <ItemBox>
              <ItemHeader text={`Identity: ${seed.name || 'Unnamed'}`} />
              <CardContent>
                <Stack spacing={1}>
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
                        (network) => network.chainId === seed.chainId,
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
                    label={`Identity: ${seed.identityAddress}`}
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
                    label={`Delegate: ${seed.delegateAddress}`}
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
                    label={`Security: ${seed.securityAddress}`}
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
                    label={seed.locked ? 'Locked' : 'Unlocked'}
                    color={seed.locked ? 'error' : 'success'}
                    variant={seed.locked ? 'filled' : 'outlined'}
                    icon={seed.locked ? <LockIcon /> : <LockOpenIcon />}
                    sx={{
                      borderRadius: 0,
                      height: 28,
                      border: 1,
                      borderColor: 'black',
                    }}
                  />
                  <Chip
                    label={seed.registered ? 'Registered' : 'Unregistered'}
                    color={seed.registered ? 'success' : 'warning'}
                    variant={seed.registered ? 'outlined' : 'filled'}
                    icon={
                      seed.registered ? <HowToRegIcon /> : <ErrorOutlineIcon />
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
                    color="inherit"
                    orientation={isSm ? 'horizontal' : 'vertical'}
                  >
                    {!seed.registered && (
                      <Button
                        onClick={(e) => onRegisterSeed(e, seed)}
                        color="primary"
                      >
                        Register
                      </Button>
                    )}
                    <Button onClick={(e) => onRenameSeed(e, seed)}>
                      Rename
                    </Button>
                    {seed.registered && !seed.locked && (
                      <Button onClick={(e) => onLockSeed(e, seed)}>Lock</Button>
                    )}
                    {seed.registered && seed.locked && (
                      <Button onClick={(e) => onUnlockSeed(e, seed)}>
                        Unlock
                      </Button>
                    )}
                    {seed.registered && (
                      <Button onClick={(e) => onRolloverSeed(e, seed)}>
                        Rollover
                      </Button>
                    )}
                    {seed.registered && (
                      <Button onClick={(e) => onDestroySeed(e, seed)}>
                        Destroy
                      </Button>
                    )}
                    {!seed.registered && (
                      <Button onClick={(e) => onDeleteSeed(e, seed)}>
                        Delete
                      </Button>
                    )}
                  </ButtonGroup>
                </Stack>
              </CardContent>
            </ItemBox>
          </Grid>
        ))}

      <Grid item xs={12} md={6}>
        <ItemBox>
          <ItemHeader text="Add Identity" />
          <CardContent>
            <Stack spacing={1}>
              <Alert severity="info">
                Signata identities can be created by generating new seeds below,
                or specifying your own seeds if you want to import an existing
                identity.
              </Alert>
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
                  color="inherit"
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={onClickGenerate}
                >
                  Generate
                </Button>
              </ButtonGroup>
            </Stack>
          </CardContent>
        </ItemBox>
      </Grid>
    </>
  );
}

export default ManageIdentities;
