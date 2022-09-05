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
import LoadingState from './LoadingState';
import {
  getNanoContract,
  getNanoContractAddress,
  useGetSingleValue,
  useCreateNano,
  getIdContract,
  getIdContractAddress,
} from '../../hooks/chainHooks';
import NanoIdentity from './NanoIdentity';
import SignataIdentity from './SignataIdentity';
import { logLoading, shouldBeLoading } from '../../hooks/helpers';

function ManageIdentities(props) {
  const { identities, setIdentities, advancedModeEnabled } = props;
  const { chainId, account } = useEthers();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });
  const [identitySeed, setIdentitySeed] = useState('');
  const [delegateSeed, setDelegateSeed] = useState('');
  const [securitySeed, setSecuritySeed] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const nanoContract = getNanoContract(chainId);
  const idContract = getIdContract(chainId);
  const [isLoading, setLoading] = useState(false);
  const [DOMAIN_SEPARATOR, setDomainSeparator] = useState('');

  const {
    state: createNanoState,
    send: createNanoSend,
    resetState: createNanoResetState,
  } = useCreateNano(chainId);

  useEffect(() => {
    if (createNanoState) {
      logLoading(createNanoState, 'createNano');
      setLoading(shouldBeLoading(createNanoState.status));
    }
  }, [createNanoState]);

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

  const SALT = useGetSingleValue(
    'SALT',
    [],
    getIdContractAddress(chainId),
    idContract,
  );

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

  const nanoExists = useGetSingleValue(
    '_identityExists',
    [account],
    getNanoContractAddress(chainId),
    nanoContract,
  );

  // useEffect(() => {
  //   if (idContract && idContract.address) {
  //     console.log({
  //       TXTYPE_CREATE_DIGEST,
  //       TXTYPE_DESTROY_DIGEST,
  //       TXTYPE_LOCK_DIGEST,
  //       TXTYPE_UNLOCK_DIGEST,
  //       TXTYPE_ROLLOVER_DIGEST,
  //       chainId,
  //       idContract,
  //       contractAddress: getIdContractAddress(chainId),
  //     });
  //   }
  // }, [
  //   TXTYPE_CREATE_DIGEST,
  //   TXTYPE_DESTROY_DIGEST,
  //   TXTYPE_LOCK_DIGEST,
  //   TXTYPE_UNLOCK_DIGEST,
  //   TXTYPE_ROLLOVER_DIGEST,
  //   chainId,
  //   idContract,
  // ]);

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
      chainId,
      type: 'independent',
      creator: account,
    });
    setIdentities(newIds);
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
    setIdentities(newIds);
    setIdentitySeed('');
    setDelegateSeed('');
    setSecuritySeed('');
  };

  useEffect(() => {
    if (
      EIP712DOMAINTYPE_DIGEST
      && VERSION_DIGEST
      && NAME_DIGEST
      && SALT
      && chainId
      && idContract
    ) {
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
  }, [
    EIP712DOMAINTYPE_DIGEST,
    VERSION_DIGEST,
    NAME_DIGEST,
    chainId,
    SALT,
    idContract,
  ]);

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

  const handleChangeTab = (e, newTabValue) => {
    setTabValue(newTabValue);
  };

  return (
    <>
      {identities
        && identities.map((id) => (
          <Grid item xs={12} md={8} key={id.identitySeed}>
            <SignataIdentity
              identities={identities}
              setIdentities={setIdentities}
              chainId={chainId}
              id={id}
              idContract={idContract}
              DOMAIN_SEPARATOR={DOMAIN_SEPARATOR}
              TXTYPE_CREATE_DIGEST={TXTYPE_CREATE_DIGEST}
              TXTYPE_LOCK_DIGEST={TXTYPE_LOCK_DIGEST}
              TXTYPE_UNLOCK_DIGEST={TXTYPE_UNLOCK_DIGEST}
              TXTYPE_DESTROY_DIGEST={TXTYPE_DESTROY_DIGEST}
              TXTYPE_ROLLOVER_DIGEST={TXTYPE_ROLLOVER_DIGEST}
            />
          </Grid>
        ))}
      {nanoExists && (
        <Grid item xs={12} md={8}>
          <NanoIdentity />
        </Grid>
      )}
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
              <Tab label="Nano" />
              {advancedModeEnabled && <Tab label="Independent" />}
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
                  <Button
                    color="secondary"
                    startIcon={<RefreshIcon />}
                    onClick={onClickGenerate}
                  >
                    Generate
                  </Button>
                </ButtonGroup>
              </Paper>
              <Alert severity="info">
                Wallet identities are linked to your connected wallet. These are
                easy to use for authentication, but will link any on-chain
                identity information with the wallet you have connected with.
              </Alert>
            </Stack>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
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
              <Paper>
                <ButtonGroup
                  fullWidth
                  variant="text"
                  orientation={isSm ? 'horizontal' : 'vertical'}
                >
                  <Button
                    color="primary"
                    onClick={onCreateIdentity}
                    disabled={!identitySeed || !delegateSeed || !securitySeed}
                    startIcon={<AddIcon />}
                  >
                    Add Identity
                  </Button>
                  <Button
                    color="secondary"
                    startIcon={<RefreshIcon />}
                    onClick={onClickGenerate}
                  >
                    Generate
                  </Button>
                </ButtonGroup>
              </Paper>
              <Alert severity="info">
                Independent identities have all seeds randomly generated. These
                identities are useful for more privacy, but can be more
                difficult to use in some scenarios.
              </Alert>
            </Stack>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Stack spacing={2}>
              <TextField
                label="Identity Address"
                variant="outlined"
                color="info"
                size="small"
                value={account}
                disabled
              />
              <Paper>
                <ButtonGroup
                  fullWidth
                  variant="text"
                  orientation={isSm ? 'horizontal' : 'vertical'}
                >
                  <Button
                    color="primary"
                    onClick={onCreateNanoIdentity}
                    disabled={isLoading || nanoExists}
                    startIcon={<AddIcon />}
                  >
                    Create Nano Identity
                  </Button>
                </ButtonGroup>
              </Paper>
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
