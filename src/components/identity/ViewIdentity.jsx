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
  Chip,
  Stack,
  useMediaQuery,
  Box,
  Typography,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  CardActionArea,
  ButtonBase,
  LinearProgress,
} from '@mui/material';
import {
  useGetSingleValue,
  getIdContractAddress,
  useClaimKycNft,
  getTokenContractAddress,
  getKycClaimContractAddress,
  useTokenApprove,
  getKycClaimContract,
  getRightsContractAddress,
  getRightsContract,
} from '../../hooks/chainHooks';
import LoadingState from './LoadingState';
import ItemHeader from '../app/ItemHeader';
import ItemBox from '../app/ItemBox';
import { shouldBeLoading, logLoading, SUPPORTED_CHAINS } from '../../hooks/helpers';
import IdentityDetails from './IdentityDetails';
import Rights from './Rights';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function ViewIdentity({
  account,
  chainId,
  id,
  theme,
}) {
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });
  const isXs = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const idContract = getIdContractAddress(chainId);
  const rightsContract = getRightsContractAddress(chainId);
  const claimContract = getKycClaimContractAddress(chainId);
  const kycClaimContractAddress = getKycClaimContractAddress(chainId);
  const kycClaimContract = getKycClaimContract(chainId);

  const [isLoading, setLoading] = useState(false);
  const [hasKycNft, setHasKycNft] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [kycErrorMessage, setKycErrorMessage] = useState('');
  const [showBlockpassButton, setShowBlockpassButton] = useState(false);
  const claimAllowance = useTokenAllowance(
    getTokenContractAddress(chainId),
    account,
    kycClaimContractAddress,
  );

  useEffect(() => {
    if (showBlockpassButton) {
      const blockpass = new window.BlockpassKYCConnect('signata_f812a', {
        refId: id,
        elementId: `blockpass-kyc-connect-${id}`,
      });

      blockpass.startKYCConnect();

      blockpass.on('KYCConnectSuccess', () => {
        setLoading(false);
      });
    }
  }, [id, showBlockpassButton]);

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
    [id || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  const identityDestroyed = useGetSingleValue(
    '_identityDestroyed',
    [id || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  const identityLocked = useGetSingleValue(
    '_identityLocked',
    [id || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  const schemaId = useGetSingleValue('schemaId', [], kycClaimContractAddress, kycClaimContract);

  const hasBlockpassKycToken = useGetSingleValue(
    'holdsTokenOfSchema',
    [id.delegateAddress || '', schemaId],
    getRightsContractAddress(chainId),
    getRightsContract(chainId),
  );

  const kycClaimPrice = useGetSingleValue(
    'feeAmount',
    [],
    kycClaimContractAddress,
    kycClaimContract,
  );

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

  const handleClickClaimKycNft = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setKycErrorMessage('');
      const response = await axios.get(
        `https://id-api.signata.net/api/v1/requestKyc/${id}`,
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
        setKycErrorMessage(
          'No completed KYC information found for this identity. Complete KYC with a Signata-integrated provider first.',
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
      {id && (
        <IdentityDetails id={id} chainId={chainId} theme={theme} />
      )}
      {id && account && (
        <Rights id={id} chainId={chainId} account={account} />
      )}
      <Stack spacing={2} sx={{ marginTop: 1 }}>
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
              {hasBlockpassKycToken ? (
                <Stack spacing={1}>
                  <Alert severity="success">This identity holds a Blockpass KYC NFT</Alert>
                </Stack>
              ) : (
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
                    id={`blockpass-kyc-connect-${id}`}
                    sx={{ display: showBlockpassButton ? 'inline' : 'none' }}
                    disabled={isLoading}
                  >
                    Start KYC
                  </Button>
                  <Alert severity="info" variant="outlined" sx={{ textAlign: 'left' }}>
                    Once you have completed KYC with a provider, click the below button to claim
                    your KYC NFT.
                  </Alert>
                  <Button
                    fullWidth
                    onClick={handleClickApproveKycNft}
                    disabled={isLoading || claimAllowance >= 1000 * 1e18}
                  >
                    Approve
                  </Button>
                  <Button
                    fullWidth
                    onClick={handleClickClaimKycNft}
                    disabled={isLoading || claimAllowance < 1000 * 1e18}
                  >
                    Claim KYC NFT
                  </Button>
                  <LoadingState state={claimKycNftState} />
                  <LoadingState state={approveState} />
                  {kycErrorMessage && <Alert severity="error">{kycErrorMessage}</Alert>}
                </Stack>
              )}
            </AccordionDetails>
          </Accordion>
        )}
      </Stack>
    </>
  );
}

export default ViewIdentity;
