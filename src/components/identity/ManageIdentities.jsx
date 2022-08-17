import React, { useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { useTheme } from '@mui/material/styles';
import { useEthers, shortenIfAddress, DEFAULT_SUPPORTED_CHAINS } from '@usedapp/core';
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
  CardActions,
  CardContent,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CreateIdentityPopup from './CreateIdentityPopup';
import EditIdentityPopup from './EditIdentityPopup';
import ImportIdentityPopup from './ImportIdentityPopup';
import ItemHeader from '../app/ItemHeader';
import ItemBox from '../app/ItemBox';

function ManageIdentities(props) {
  const { seeds, setSeeds } = props;
  const { chainId, account } = useEthers();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });
  const [showCreateIdentityPopup, setShowCreateIdentityPopup] = useState(false);
  const [showImportIdentityPopup, setShowImportIdentityPopup] = useState(false);
  const [editingIdentity, setEditingIdentity] = useState(null);
  const [showEditIdentityPopup, setShowEditIdentityPopup] = useState(false);
  const [identities, setIdentities] = useLocalStorageState('identities', []);
  const [identitySeed, setIdentitySeed] = useState('');
  const [delegateSeed, setDelegateSeed] = useState('');
  const [securitySeed, setSecuritySeed] = useState('');

  const onCreateIdentity = (e) => {
    e.preventDefault();
    console.log(seeds);
    const newSeeds = Array.from(seeds);
    newSeeds.push({
      identitySeed, delegateSeed, securitySeed, name: 'New Identity', chainId,
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
    e.preventDefault();
    let newSeed = seed;
    const newSeeds = Array.from(seeds);
    newSeeds.forEach((s, idx) => {
      if (s.identitySeed === seed.identitySeed) {
        newSeed = { ...newSeed, name: 'test' };
        newSeeds[idx] = newSeed;
      }
    });
    setSeeds(newSeeds);
  };

  const onRegisterSeed = (e, seed) => {
    e.preventDefault();
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
    const newSeeds = [];
    seeds.forEach((s) => {
      if (s.identitySeed !== seed.identitySeed) {
        newSeeds.push(s);
      }
    });
    setSeeds(newSeeds);
  };

  const onDestroySeed = (e, seed) => {
    e.preventDefault();
  };

  return (
    <>
      {showCreateIdentityPopup && <CreateIdentityPopup />}
      {showImportIdentityPopup && <ImportIdentityPopup />}
      {showEditIdentityPopup && (
        <EditIdentityPopup editingIdentity={editingIdentity} />
      )}
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
                    label={`Chain: ${DEFAULT_SUPPORTED_CHAINS.find(
                      (network) => network.chainId === seed.chainId,
                    )?.chainName}`}
                    color="default"
                    sx={{
                      borderRadius: 0,
                      height: 24,
                      border: 1,
                      borderColor: 'black',
                    }}
                  />
                  <Chip
                    label={`Identity: ${seed.identitySeed}`}
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
                    label={`Delegate: ${seed.delegateSeed}`}
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
                    label={`Security: ${seed.securitySeed}`}
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
                    color={seed.registered ? 'success' : 'info'}
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
                    <Button
                      onClick={(e) => onRenameSeed(e, seed)}
                      // startIcon={<EditIcon />}
                    >
                      Rename
                    </Button>
                    {seed.registered && !seed.locked && (
                      <Button
                        onClick={(e) => onLockSeed(e, seed)}
                        // startIcon={<EditIcon />}
                      >
                        Lock
                      </Button>
                    )}
                    {seed.registered && seed.locked && (
                      <Button
                        onClick={(e) => onUnlockSeed(e, seed)}
                      >
                        Unlock
                      </Button>
                    )}
                    {seed.registered && (
                    <Button
                      onClick={(e) => onRolloverSeed(e, seed)}
                      // startIcon={<EditIcon />}
                    >
                      Rollover
                    </Button>
                    )}
                    {seed.registered && (
                      <Button
                        onClick={(e) => onDestroySeed(e, seed)}
                        // startIcon={<EditIcon />}
                      >
                        Destroy
                      </Button>
                    )}
                    {!seed.registered && (
                      <Button
                        onClick={(e) => onDeleteSeed(e, seed)}
                        // startIcon={<EditIcon />}
                      >
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
