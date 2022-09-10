import React, { useState, useEffect } from 'react';
import { ethers, BigNumber } from 'ethers';
import axios from 'axios';
import { useTheme, styled } from '@mui/material/styles';
import { shortenIfAddress, useTokenAllowance } from '@usedapp/core';
import { formatUnits } from '@ethersproject/units';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import LinkIcon from '@mui/icons-material/Link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  ButtonGroup,
  Chip,
  Stack,
  useMediaQuery,
  TextField,
  Box,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  CardActionArea,
  ButtonBase,
  LinearProgress,
} from '@mui/material';
import {
  useCreateIdentity,
  useLockIdentity,
  useUnlockIdentity,
  useDestroyIdentity,
  useRolloverIdentity,
  useGetSingleValue,
  getIdContractAddress,
  useClaimKycNft,
  getTokenContractAddress,
  getKycClaimContractAddress,
  useTokenApprove,
  getKycClaimContract,
} from '../../hooks/chainHooks';
import LoadingState from './LoadingState';
import ItemHeader from '../app/ItemHeader';
import ItemBox from '../app/ItemBox';
import { shouldBeLoading, logLoading, SUPPORTED_CHAINS } from '../../hooks/helpers';
import ChangeDialog from './ChangeDialog';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function SignataIdentity({
  identities,
  setIdentities,
  account,
  chainId,
  id,
  DOMAIN_SEPARATOR,
  idContract,
  TXTYPE_CREATE_DIGEST,
  TXTYPE_LOCK_DIGEST,
  TXTYPE_UNLOCK_DIGEST,
  TXTYPE_DESTROY_DIGEST,
  TXTYPE_ROLLOVER_DIGEST,
  advancedModeEnabled,
}) {
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
  const [newSecurity, setNewSecurity] = useState('');
  // const [newDelegateValid, setNewDelegateValid] = useState(false);
  // const [newSecurityValid, setNewSecurityValid] = useState(false);
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
  const [exportData, setExportData] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [kycErrorMessage, setKycErrorMessage] = useState('');
  const [showBlockpassButton, setShowBlockpassButton] = useState(false);
  const claimAllowance = useTokenAllowance(getTokenContractAddress(chainId), account, getKycClaimContractAddress(chainId));

  useEffect(() => {
    if (showBlockpassButton) {
      const blockpass = new window.BlockpassKYCConnect('signata_f812a', {
        refId: id.identityAddress,
        elementId: `blockpass-kyc-connect-${id.delegateAddress}`,
      });

      blockpass.startKYCConnect();

      blockpass.on('KYCConnectSuccess', () => {
        setLoading(false);
      });
    }
  }, [id, showBlockpassButton]);

  useEffect(() => {
    if (id) {
      try {
        setLoading(true);
        setIdentityWallet(ethers.Wallet.fromMnemonic(id.identitySeed));
        if (id.type !== 'wallet') {
          setDelegateWallet(ethers.Wallet.fromMnemonic(id.delegateSeed));
        }
        setSecurityWallet(ethers.Wallet.fromMnemonic(id.securitySeed));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  const {
    state: createState,
    send: createSend,
    resetState: createResetState,
  } = useCreateIdentity(chainId);

  const { state: lockState, send: lockSend, resetState: lockResetState } = useLockIdentity(chainId);

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

  const {
    state: claimKycNftState,
    send: claimKycNftSend,
    resetState: claimKycNftResetState,
  } = useClaimKycNft(chainId);

  const {
    state: approveState,
    send: approveSend,
    resetState: approveResetState,
  } = useTokenApprove(chainId);

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

  const kycClaimPrice = useGetSingleValue(
    'feeAmount',
    [],
    getKycClaimContractAddress(chainId),
    getKycClaimContract(chainId),
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

  useEffect(() => {
    if (claimKycNftState) {
      logLoading(claimKycNftState, 'claimKycNft');
      setLoading(shouldBeLoading(claimKycNftState.status));
    }
  }, [claimKycNftState]);

  useEffect(() => {
    if (approveState) {
      logLoading(approveState, 'approve');
      setLoading(shouldBeLoading(approveState.status));
    }
  }, [approveState]);

  const resetStates = () => {
    createResetState();
    lockResetState();
    unlockResetState();
    destroyResetState();
    rolloverResetState();
  };

  const onCreateIdentity = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage('');
      setLoading(true);
      resetStates();

      const inputHash = ethers.utils.keccak256(
        `${TXTYPE_CREATE_DIGEST}${delegateWallet.address
          .slice(2)
          .padStart(64, '0')}${securityWallet.address.slice(2).padStart(64, '0')}`,
      );
      const hashToSign = ethers.utils.keccak256(
        `0x1901${DOMAIN_SEPARATOR.slice(2)}${inputHash.slice(2)}`,
      );
      const { r, s, v } = new ethers.utils.SigningKey(identityWallet.privateKey).signDigest(
        hashToSign,
      );

      createSend(v, r, s, identityWallet.address, delegateWallet.address, securityWallet.address);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onCreateWalletIdentity = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage('');
      resetStates();

      const inputHash = ethers.utils.keccak256(
        `${TXTYPE_CREATE_DIGEST}${id.delegateAddress
          .slice(2)
          .padStart(64, '0')}${securityWallet.address.slice(2).padStart(64, '0')}`,
      );
      const hashToSign = ethers.utils.keccak256(
        `0x1901${DOMAIN_SEPARATOR.slice(2)}${inputHash.slice(2)}`,
      );
      const { r, s, v } = new ethers.utils.SigningKey(identityWallet.privateKey).signDigest(
        hashToSign,
      );

      createSend(v, r, s, identityWallet.address, id.delegateAddress, securityWallet.address);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClickLock = (e) => {
    e.preventDefault();
    setOpenLock(true);
  };

  const onCloseLock = (e) => {
    e.preventDefault();
    setOpenLock(false);
  };

  const onLockIdentity = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage('');
      setLoading(true);
      setOpenLock(false);
      resetStates();

      const inputHash = ethers.utils.keccak256(
        `${TXTYPE_LOCK_DIGEST}${identityLockCount.toHexString().slice(2).padStart(64, '0')}`,
      );
      const hashToSign = ethers.utils.keccak256(
        `0x1901${DOMAIN_SEPARATOR.slice(2)}${inputHash.slice(2)}`,
      );

      if (!id.delegateSeed) {
        // it's a wallet identity without a delegateSeed
        // eslint-disable-next-line no-undef
        const ethResult = await ethereum.request({
          method: 'eth_sign',
          params: [account, hashToSign],
        });
        const sig = ethResult.substr(2);
        const r = `0x${sig.slice(0, 64)}`;
        const s = `0x${sig.slice(64, 128)}`;
        const v = `0x${sig.slice(128, 130)}`;
        lockSend(identityWallet.address, v, r, s);
      } else {
        const { r, s, v } = new ethers.utils.SigningKey(delegateWallet.privateKey).signDigest(
          hashToSign,
        );
        lockSend(identityWallet.address, v, r, s);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
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
    try {
      setErrorMessage('');
      setLoading(true);
      setOpenUnlock(false);
      resetStates();

      const inputHash = ethers.utils.keccak256(
        `${TXTYPE_UNLOCK_DIGEST}${identityLockCount.toHexString().slice(2).padStart(64, '0')}`,
      );
      const hashToSign = ethers.utils.keccak256(
        `0x1901${DOMAIN_SEPARATOR.slice(2)}${inputHash.slice(2)}`,
      );
      const { r, s, v } = new ethers.utils.SigningKey(securityWallet.privateKey).signDigest(
        hashToSign,
      );

      unlockSend(identityWallet.address, v, r, s);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClickRollover = (e) => {
    e.preventDefault();
    setOpenRollover(true);
  };

  const onCloseRollover = (e) => {
    e.preventDefault();
    setOpenRollover(false);
  };

  const onRolloverIdentity = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage('');
      setLoading(true);
      setOpenRollover(false);
      resetStates();

      const inputHash = ethers.utils.keccak256(
        `${TXTYPE_ROLLOVER_DIGEST}${newDelegate.address
          .slice(2)
          .padStart(64, '0')}${newSecurity.address
          .slice(2)
          .padStart(64, '0')}${identityRolloverCount.toHexString().slice(2).padStart(64, '0')}`,
      );
      const hashToSign = ethers.utils.keccak256(
        `0x1901${DOMAIN_SEPARATOR.slice(2)}${inputHash.slice(2)}`,
      );
      const {
        r: securityR,
        s: securityS,
        v: securityV,
      } = new ethers.utils.SigningKey(securityWallet.privateKey).signDigest(hashToSign);

      if (!id.delegateSeed) {
        // it's a wallet identity without a delegateSeed
        // eslint-disable-next-line no-undef
        const ethResult = await ethereum.request({
          method: 'eth_sign',
          params: [account, hashToSign],
        });
        const sig = ethResult.substr(2);
        const delegateR = `0x${sig.slice(0, 64)}`;
        const delegateS = `0x${sig.slice(64, 128)}`;
        const delegateV = `0x${sig.slice(128, 130)}`;
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
      } else {
        const {
          r: delegateR,
          s: delegateS,
          v: delegateV,
        } = new ethers.utils.SigningKey(delegateWallet.privateKey).signDigest(hashToSign);
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
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClickDestroy = (e) => {
    e.preventDefault();
    setOpenDestroy(true);
  };

  const onCloseDestroy = (e) => {
    e.preventDefault();
    setOpenDestroy(false);
  };

  const onDestroyIdentity = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage('');
      setLoading(true);
      setOpenDestroy(false);
      resetStates();

      const inputHash = ethers.utils.keccak256(`${TXTYPE_DESTROY_DIGEST}`);
      const hashToSign = ethers.utils.keccak256(
        `0x1901${DOMAIN_SEPARATOR.slice(2)}${inputHash.slice(2)}`,
      );

      const {
        r: securityR,
        s: securityS,
        v: securityV,
      } = new ethers.utils.SigningKey(securityWallet.privateKey).signDigest(hashToSign);

      if (!id.delegateSeed) {
        // it's a wallet identity without a delegateSeed
        // eslint-disable-next-line no-undef
        const ethResult = await ethereum.request({
          method: 'eth_sign',
          params: [account, hashToSign],
        });
        const sig = ethResult.substr(2);
        const delegateR = `0x${sig.slice(0, 64)}`;
        const delegateS = `0x${sig.slice(64, 128)}`;
        const delegateV = `0x${sig.slice(128, 130)}`;
        destroySend(
          identityWallet.address,
          delegateV,
          delegateR,
          delegateS,
          securityV,
          securityR,
          securityS,
        );
      } else {
        const {
          r: delegateR,
          s: delegateS,
          v: delegateV,
        } = new ethers.utils.SigningKey(delegateWallet.privateKey).signDigest(hashToSign);
        destroySend(
          identityWallet.address,
          delegateV,
          delegateR,
          delegateS,
          securityV,
          securityR,
          securityS,
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
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
    try {
      setLoading(true);
      setErrorMessage('');
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
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
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
    setLoading(true);
    const newSeeds = [];
    identities.forEach((s) => {
      if (s.identitySeed !== id.identitySeed) {
        newSeeds.push(s);
      }
    });
    setIdentities(newSeeds);
    setOpenDelete(false);
    setLoading(false);
  };

  // const handleClickCopy = (e, dat) => {
  //   e.preventDefault();
  //   navigator.clipboard.writeText(dat);
  // };

  const handleClickClaimKycNft = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setKycErrorMessage('');
      const response = await axios.get(
        `https://id-api.signata.net/api/v1/requestKyc/${id.delegateAddress}`,
      );
      if (response && response.data && response.data.sigS) {
        // call chain
        console.log(response.data);
        claimKycNftResetState();
        const salt = `0x${response.data.salt}`;
        console.log({
          delegateAddress: id.delegateAddress,
          sigV: response.data.sigV,
          sigR: response.data.sigR,
          sigS: response.data.sigS,
          salt,
        });
        claimKycNftSend(
          id.delegateAddress,
          response.data.sigV,
          response.data.sigR,
          response.data.sigS,
          salt,
        );
      } else {
        console.log(response);
        setKycErrorMessage('No claim found. Have you completed KYC?');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickExport = (e) => {
    e.preventDefault();
    if (exportData) {
      setExportData('');
    } else {
      setExportData(JSON.stringify(id, false, 2));
    }
  };

  const onClickBlockpassKyc = (e) => {
    e.preventDefault();
    console.log('onClickBlockpassKyc');
    setShowBlockpassButton(true);
  };

  const handleClickApproveKycNft = (e) => {
    e.preventDefault();
    console.log('handleClickApproveKycNft');
    approveResetState();
    approveSend(getKycClaimContractAddress(chainId), BigNumber.from('1000000000000000000000'));
  };

  return (
    <>
      <ChangeDialog
        open={openDelete}
        onClose={onCloseDelete}
        onSubmit={onSubmitDelete}
        title="Delete Identity?"
        alertSeverity="warning"
        alertText="Identities that have not been registered are deleted immediately and cannot be recovered."
        submitColor="error"
        submitText="Delete Identity"
      />
      <ChangeDialog
        open={openDestroy}
        onClose={onCloseDestroy}
        onSubmit={onDestroyIdentity}
        title="Destroy Identity?"
        alertSeverity="warning"
        alertText="If you destroy your identity it will become permanently destroyed on the blockchain. You cannot restore a destroyed identity."
        submitColor="error"
        submitText="Destroy Identity"
      />
      <ChangeDialog
        open={openLock}
        onClose={onCloseLock}
        onSubmit={onLockIdentity}
        title="Lock Identity?"
        alertSeverity="warning"
        alertText="If you want to prevent your identity from being modified or used, you can lock it on the blockchain. If you believe your identity might have been compromised, locking it is an easy way to restrict its use."
        submitColor="warning"
        submitText="Lock Identity"
      />
      <ChangeDialog
        open={openUnlock}
        onClose={onCloseUnlock}
        onSubmit={onUnlockIdentity}
        title="Unlock Identity?"
        alertSeverity="warning"
        alertText="If your identity is locked and you believe it is safe to use again, you can unlock it on the blockchain. Only unlock it if you think the threat is gone. If you think your identity is compromised, it is recommended to Rollover the identity instead."
        submitColor="warning"
        submitText="Unlock Identity"
      />
      <ChangeDialog
        open={openRollover}
        onClose={onCloseRollover}
        onSubmit={onRolloverIdentity}
        title="Rollover Identity?"
        alertSeverity="warning"
        alertText="Rolling over an identity means your Delegate and Security wallets will be changed for it. Your identity address remains the same. Only rollover your identity if you think it might have been compromised."
        submitColor="warning"
        submitText="Rollover Identity"
        fields={[
          <TextField
            label="New Delegate Seed"
            key="new-delegate-seed"
            variant="outlined"
            fullWidth
            required
            color="info"
            value={newDelegate}
            onChange={(e) => setNewDelegate(e.target.value)}
          />,
          <TextField
            label="New Security Seed"
            key="new-security-seed"
            variant="outlined"
            fullWidth
            required
            color="info"
            value={newSecurity}
            onChange={(e) => setNewSecurity(e.target.value)}
          />,
        ]}
      />
      <ChangeDialog
        open={openRename}
        onClose={onCloseRename}
        onSubmit={onSubmitRename}
        title="Rename Identity?"
        alertSeverity="warning"
        alertText="Identity names are just so you can easily identify your identities, like specifying if one is for a specific purpose. The names are not visible to anyone else, and are not written to the blockchain."
        submitColor="warning"
        submitText="Save New Name"
        fields={[
          <TextField
            label="New Name"
            key="new-name"
            variant="outlined"
            fullWidth
            required
            color="info"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />,
        ]}
      />
      <ItemBox>
        <ItemHeader
          text={`Identity: ${id.name || 'Unnamed'}`}
          colored={id.chainId === chainId}
          logo="logo.png"
        />
        <Stack spacing={2} sx={{ marginTop: 1 }}>
          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontFamily: 'Roboto Mono' }} variant="body2" component="p">
              Identity:
              {isXs ? shortenIfAddress(id.identityAddress) : id.identityAddress}
            </Typography>
            <Typography sx={{ fontFamily: 'Roboto Mono' }} variant="body2" component="p">
              Delegate:
              {isXs ? shortenIfAddress(id.delegateAddress) : id.delegateAddress}
            </Typography>
            <Typography sx={{ fontFamily: 'Roboto Mono' }} variant="body2" component="p">
              Security:
              {isXs ? shortenIfAddress(id.securityAddress) : id.securityAddress}
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
                      SUPPORTED_CHAINS.find((network) => network.chainId === id.chainId)?.chainName
                    }`}
                    color="success"
                    variant="outlined"
                    icon={<LinkIcon />}
                    size={isXs ? 'small' : 'medium'}
                  />
                ) : (
                  <Chip
                    label={`Connect to ${
                      SUPPORTED_CHAINS.find((network) => network.chainId === id.chainId)?.chainName
                    } to manage this Identity`}
                    color="default"
                    variant="outlined"
                    size={isXs ? 'small' : 'medium'}
                    icon={<LinkOffIcon />}
                  />
                )}
              </ListItem>
              {id.chainId === chainId && !id.delegateSeed && id.delegateAddress === account && (
                <ListItem>
                  <Chip
                    label="Connected Wallet"
                    color="success"
                    variant="outlined"
                    size={isXs ? 'small' : 'medium'}
                    icon={<AccountBalanceWalletIcon />}
                  />
                </ListItem>
              )}
              {id.chainId === chainId && !id.delegateSeed && id.delegateAddress !== account && (
                <ListItem>
                  <Chip
                    label="Connect to Delegate Wallet"
                    color="warning"
                    variant="outlined"
                    size={isXs ? 'small' : 'medium'}
                    icon={<AccountBalanceWalletIcon />}
                  />
                </ListItem>
              )}
              {id.chainId === chainId && !identityDestroyed && (
                <ListItem>
                  <Chip
                    label={identityExists ? 'Registered' : 'Unregistered'}
                    color={identityExists ? 'success' : 'warning'}
                    variant={identityExists ? 'outlined' : 'filled'}
                    size={isXs ? 'small' : 'medium'}
                    icon={identityExists ? <FingerprintIcon /> : <ErrorOutlineIcon />}
                  />
                </ListItem>
              )}
              {id.chainId === chainId && !identityDestroyed && (
                <ListItem>
                  <Chip
                    label={identityLocked ? 'Locked' : 'Unlocked'}
                    color={identityLocked ? 'error' : 'success'}
                    variant={identityLocked ? 'filled' : 'outlined'}
                    size={isXs ? 'small' : 'medium'}
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
                    size={isXs ? 'small' : 'medium'}
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
          {id.chainId === chainId && !id.delegateSeed && (
            <Paper>
              <ButtonGroup
                fullWidth
                variant="text"
                disabled={isLoading || id.delegateAddress !== account}
                color="secondary"
                orientation={isSm ? 'horizontal' : 'vertical'}
              >
                {!identityExists && (
                  <Button
                    onClick={id.type === 'wallet' ? onCreateWalletIdentity : onCreateIdentity}
                    color="primary"
                  >
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
                {identityExists && <Button onClick={handleClickDestroy}>Destroy</Button>}
                {(!identityExists || advancedModeEnabled) && (
                  <Button onClick={handleClickDelete}>Delete</Button>
                )}
                {identityExists && advancedModeEnabled && (
                  <Button onClick={handleClickExport}>Export</Button>
                )}
              </ButtonGroup>
            </Paper>
          )}
          {isLoading && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          )}
          {id.chainId === chainId && id.delegateSeed && (
            <Paper>
              <ButtonGroup
                fullWidth
                variant="text"
                disabled={isLoading}
                color="secondary"
                orientation={isSm ? 'horizontal' : 'vertical'}
              >
                {!identityExists && (
                  <Button
                    onClick={id.type === 'wallet' ? onCreateWalletIdentity : onCreateIdentity}
                    color="primary"
                  >
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
                {identityExists && <Button onClick={handleClickDestroy}>Destroy</Button>}
                {(!identityExists || advancedModeEnabled) && (
                  <Button onClick={handleClickDelete}>Delete</Button>
                )}
                {identityExists && advancedModeEnabled && (
                  <Button onClick={handleClickExport}>Export</Button>
                )}
              </ButtonGroup>
            </Paper>
          )}
          {exportData && <TextField multiline value={exportData} />}
          {errorMessage && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
          )}
          {id.chainId === chainId && identityExists && !hasKycNft && (
            <Accordion sx={{ textAlign: 'center' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>NFT Rights</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <Alert severity="info" variant="outlined" sx={{ textAlign: 'left' }}>
                    You can purchase NFT rights with SATA tokens. These rights are provided by
                    Signata, but rights can also be issued by other providers.
                  </Alert>
                  <Card sx={{ m: 2, textAlign: 'center' }}>
                    <CardActionArea
                      component={ButtonBase}
                      onClick={onClickBlockpassKyc}
                      disabled={isLoading}
                    >
                      <CardContent>
                        <img src="blockpass.png" alt="Blockpass Logo" style={{ maxWidth: 200 }} />
                        <Typography gutterBottom variant="h5" component="div" textAlign="left">
                          Blockpass KYC
                          {' ('}
                          {formatUnits(kycClaimPrice || 0, 18)}
                          {' '}
                          SATA)
                        </Typography>
                        <Typography variant="body2" textAlign="left">
                          KYC with Congruent Labs (Australia) verifying your identity using
                          Blockpass. Excluding residents of the following sanctioned countries:
                          Central African Republic, Democratic Republic of the Congo, Eritrea,
                          Lebanon, Libya, Myanmar, Russia, Somalia, Sudan, Yemen, Zimbabwe, Crimea
                          and Sevastopol, Iran, Syria, and North Korea.
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                  <Button
                    fullWidth
                    id={`blockpass-kyc-connect-${id.delegateAddress}`}
                    sx={{ display: showBlockpassButton ? 'inline' : 'none' }}
                    disabled={isLoading}
                  >
                    Start KYC
                  </Button>
                  <Alert severity="info" variant="outlined" sx={{ textAlign: 'left' }}>
                    Once you have completed KYC with a provider, click the below button to claim
                    your KYC NFT.
                  </Alert>
                  <Button fullWidth onClick={handleClickApproveKycNft} disabled={isLoading || claimAllowance >= 1000000000000000000000}>
                    Approve
                  </Button>
                  <Button fullWidth onClick={handleClickClaimKycNft} disabled={isLoading || claimAllowance < 1000000000000000000000}>
                    Claim KYC NFT
                  </Button>
                  <LoadingState state={claimKycNftState} />
                  <LoadingState state={approveState} />
                  {kycErrorMessage && (
                    <Alert severity="error">
                      {kycErrorMessage}
                    </Alert>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
          )}
        </Stack>
      </ItemBox>
    </>
  );
}

export default SignataIdentity;
