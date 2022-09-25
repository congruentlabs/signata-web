import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useTheme } from '@mui/material/styles';
import { useEthers } from '@usedapp/core';
import { generateMnemonic } from 'ethereum-cryptography/bip39';
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  Grid,
  Stack,
  TextField,
  useMediaQuery,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import ItemHeader from '../app/ItemHeader';
import ItemBox from '../app/ItemBox';
import TabPanel from './TabPanel';
import { useGetSingleValue, getIdContract, getIdContractAddress } from '../../hooks/chainHooks';
import SignataIdentity from './SignataIdentity';

function ManageIdentities(props) {
  const {
    identities, advancedModeEnabled, updateIdentities,
  } = props;
  const { chainId, account } = useEthers();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });
  const [identitySeed, setIdentitySeed] = useState('');
  const [delegateSeed, setDelegateSeed] = useState('');
  const [securitySeed, setSecuritySeed] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const idContract = getIdContract(chainId);
  const [DOMAIN_SEPARATOR, setDomainSeparator] = useState('');
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');

  const EIP712DOMAINTYPE_DIGEST = useGetSingleValue(
    'EIP712DOMAINTYPE_DIGEST',
    [],
    getIdContractAddress(chainId),
    idContract,
  );

  const VERSION_DIGEST = useGetSingleValue(
    'VERSION_DIGEST',
    [],
    getIdContractAddress(chainId),
    idContract,
  );

  const NAME_DIGEST = useGetSingleValue(
    'NAME_DIGEST',
    [],
    getIdContractAddress(chainId),
    idContract,
  );

  const SALT = useGetSingleValue('SALT', [], getIdContractAddress(chainId), idContract);

  const TXTYPE_CREATE_DIGEST = useGetSingleValue(
    'TXTYPE_CREATE_DIGEST',
    [],
    getIdContractAddress(chainId),
    idContract,
  );

  const TXTYPE_DESTROY_DIGEST = useGetSingleValue(
    'TXTYPE_DESTROY_DIGEST',
    [],
    getIdContractAddress(chainId),
    idContract,
  );

  const TXTYPE_LOCK_DIGEST = useGetSingleValue(
    'TXTYPE_LOCK_DIGEST',
    [],
    getIdContractAddress(chainId),
    idContract,
  );

  const TXTYPE_UNLOCK_DIGEST = useGetSingleValue(
    'TXTYPE_UNLOCK_DIGEST',
    [],
    getIdContractAddress(chainId),
    idContract,
  );

  const TXTYPE_ROLLOVER_DIGEST = useGetSingleValue(
    'TXTYPE_ROLLOVER_DIGEST',
    [],
    getIdContractAddress(chainId),
    idContract,
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
      name: 'New Independent Identity',
      type: 'independent',
      creator: account,
    });
    updateIdentities(newIds);
    // setIdentities(newIds);
    setIdentitySeed('');
    setDelegateSeed('');
    setSecuritySeed('');
  };

  const onCreateWalletIdentity = (e) => {
    e.preventDefault();
    console.log(identities);
    const newIds = Array.from(identities);

    const identityWallet = ethers.Wallet.fromMnemonic(identitySeed);
    const identityAddress = identityWallet.address;
    const securityWallet = ethers.Wallet.fromMnemonic(securitySeed);
    const securityAddress = securityWallet.address;
    newIds.push({
      identitySeed,
      securitySeed,
      identityAddress,
      delegateAddress: account,
      securityAddress,
      name: 'New Wallet Identity',
      chainId,
      type: 'wallet',
      creator: account,
    });
    updateIdentities(newIds);
    // setIdentities(newIds);
    setIdentitySeed('');
    setDelegateSeed('');
    setSecuritySeed('');
  };

  useEffect(() => {
    if (EIP712DOMAINTYPE_DIGEST && VERSION_DIGEST && NAME_DIGEST && SALT && chainId && idContract) {
      const domainSeparator = ethers.utils
        .keccak256(
          EIP712DOMAINTYPE_DIGEST
            + NAME_DIGEST.slice(2)
            + VERSION_DIGEST.slice(2)
            + chainId.toString(16).padStart(64, '0')
            + idContract.address.slice(2).padStart(64, '0')
            + SALT.slice(2),
        )
        .toString('hex');
      setDomainSeparator(domainSeparator);
    }
  }, [EIP712DOMAINTYPE_DIGEST, VERSION_DIGEST, NAME_DIGEST, chainId, SALT, idContract]);

  const onClickGenerate = (e) => {
    e.preventDefault();
    setIdentitySeed(generateMnemonic(wordlist));
    setDelegateSeed(generateMnemonic(wordlist));
    setSecuritySeed(generateMnemonic(wordlist));
  };

  const handleChangeTab = (e, newTabValue) => {
    setTabValue(newTabValue);
  };

  const onChangeIdentitySeed = (e) => {
    if (advancedModeEnabled) {
      setIdentitySeed(e.target.value);
    }
  };

  const onChangeDelegateSeed = (e) => {
    if (advancedModeEnabled) {
      setDelegateSeed(e.target.value);
    }
  };

  const onChangeSecuritySeed = (e) => {
    if (advancedModeEnabled) {
      setSecuritySeed(e.target.value);
    }
  };

  const onImportIdentity = (e) => {
    e.preventDefault();
    try {
      setImportError('');
      const newIds = Array.from(identities);
      const i = JSON.parse(importData);
      // TODO: validate the data
      newIds.push(i);
      updateIdentities(newIds);
      // setIdentities(newIds);
      setImportData('');
    } catch (error) {
      console.error(error);
      setImportError(error.message);
    }
  };

  return (
    <>
      {identities
        && identities.map((id) => (
          <Grid item xs={12} md={8} key={id.identitySeed}>
            <SignataIdentity
              identities={identities}
              updateIdentities={updateIdentities}
              account={account}
              chainId={chainId}
              id={id}
              idContract={idContract}
              DOMAIN_SEPARATOR={DOMAIN_SEPARATOR}
              TXTYPE_CREATE_DIGEST={TXTYPE_CREATE_DIGEST}
              TXTYPE_LOCK_DIGEST={TXTYPE_LOCK_DIGEST}
              TXTYPE_UNLOCK_DIGEST={TXTYPE_UNLOCK_DIGEST}
              TXTYPE_DESTROY_DIGEST={TXTYPE_DESTROY_DIGEST}
              TXTYPE_ROLLOVER_DIGEST={TXTYPE_ROLLOVER_DIGEST}
              advancedModeEnabled={advancedModeEnabled}
            />
          </Grid>
        ))}
      {identities && identities.length === 0 && (
        <Grid item xs={12} md={8}>
          <Alert severity="info">
            If you&apos;re expecting to see identities here that you&apos;ve already created, but
            nothing is showing up, please make sure you&apos;re using the same wallet that you
            originally starting using Signata with.
          </Alert>
        </Grid>
      )}
      {/* {nanoExists && (
        <Grid item xs={12} md={8}>
          <NanoIdentity />
        </Grid>
      )} */}
      <Grid item xs={12} md={8}>
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
              {/* {advancedModeEnabled && <Tab label="Nano" />} */}
              {advancedModeEnabled && <Tab label="Independent" />}
              {advancedModeEnabled && <Tab label="Import" />}
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
                onChange={onChangeIdentitySeed}
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
                onChange={onChangeSecuritySeed}
              />
              <Paper>
                <ButtonGroup
                  fullWidth
                  variant="text"
                  orientation={isSm ? 'horizontal' : 'vertical'}
                >
                  <Button
                    color="primary"
                    onClick={onCreateWalletIdentity}
                    disabled={!identitySeed || !delegateSeed || !securitySeed}
                    startIcon={<AddIcon />}
                  >
                    Add Identity
                  </Button>
                  <Button color="secondary" startIcon={<RefreshIcon />} onClick={onClickGenerate}>
                    Generate
                  </Button>
                </ButtonGroup>
              </Paper>
              <Alert severity="info">
                Wallet identities are linked to your connected wallet. These are easy to use for
                authentication, but will link any on-chain identity information with the wallet you
                have connected with.
              </Alert>
            </Stack>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <form onSubmit={onCreateIdentity}>
              <Stack spacing={2}>
                <TextField
                  label="Identity Seed"
                  variant="outlined"
                  color="info"
                  size="small"
                  value={identitySeed}
                  onChange={onChangeIdentitySeed}
                />
                <TextField
                  label="Delegate Seed"
                  variant="outlined"
                  color="info"
                  size="small"
                  value={delegateSeed}
                  onChange={onChangeDelegateSeed}
                />
                <TextField
                  label="Security Seed"
                  variant="outlined"
                  color="info"
                  size="small"
                  value={securitySeed}
                  onChange={onChangeSecuritySeed}
                />
                <Paper>
                  <ButtonGroup
                    fullWidth
                    variant="text"
                    orientation={isSm ? 'horizontal' : 'vertical'}
                  >
                    <Button
                      color="primary"
                      type="submit"
                      disabled={!identitySeed || !delegateSeed || !securitySeed}
                      startIcon={<AddIcon />}
                    >
                      Add Identity
                    </Button>
                    <Button color="secondary" startIcon={<RefreshIcon />} onClick={onClickGenerate}>
                      Generate
                    </Button>
                  </ButtonGroup>
                </Paper>
                <Alert severity="info">
                  Independent identities have all seeds randomly generated. These identities are
                  useful for more privacy, but can be more difficult to use in some scenarios.
                </Alert>
              </Stack>
            </form>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <form onSubmit={onImportIdentity}>
              <Stack spacing={2}>
                <TextField
                  label="Import Data"
                  variant="outlined"
                  color="info"
                  multiline
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                />
                <Paper>
                  <ButtonGroup
                    fullWidth
                    variant="text"
                    orientation={isSm ? 'horizontal' : 'vertical'}
                  >
                    <Button
                      color="primary"
                      type="submit"
                      disabled={!importData}
                      startIcon={<AddIcon />}
                    >
                      Import Identity
                    </Button>
                  </ButtonGroup>
                </Paper>
                {importError && (
                  <Alert severity="error">
                    <AlertTitle>Import Error</AlertTitle>
                    {importError}
                  </Alert>
                )}
                <Alert severity="info">
                  An imported identity needs to be correctly formatted as JSON data. Only import an
                  identity if you know what you are doing, as you may encounter unexpected system
                  behaviour with an invalid format identity.
                </Alert>
              </Stack>
            </form>
          </TabPanel>
        </ItemBox>
      </Grid>
    </>
  );
}

export default ManageIdentities;
