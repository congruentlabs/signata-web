import React, { useState, useEffect } from 'react';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import axios from 'axios';
import { useTokenAllowance } from '@usedapp/core';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Container,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import {
  getIdContract,
  getIdContractAddress,
  getKycClaimContract,
  getKycClaimContractAddress,
  getRightsContract,
  getRightsContractAddress,
  getSata100Contract,
  getSata100ContractAddress,
  getTokenContractAddress,
  useClaimKycNft,
  useGetSingleValue,
  usePurchaseSata100Nft,
  useTokenApprove,
} from '../../hooks/chainHooks';
import LoadingState from './LoadingState';
import { shouldBeLoading, logLoading } from '../../hooks/helpers';

function Rights({
  chainId, id, account, theme,
}) {
  const idContract = getIdContract(chainId);
  const [isLoading, setLoading] = useState(false);
  const [kycErrorMessage, setKycErrorMessage] = useState('');
  const kycClaimContractAddress = getKycClaimContractAddress(chainId);
  const sata100ContractAddress = getSata100ContractAddress(chainId);
  const kycClaimContract = getKycClaimContract(chainId);
  const sata100Contract = getSata100Contract(chainId);
  const kycClaimAllowance = useTokenAllowance(
    getTokenContractAddress(chainId),
    account,
    kycClaimContractAddress,
  );
  const sata100ClaimAllowance = useTokenAllowance(
    getTokenContractAddress(chainId),
    account,
    sata100ContractAddress,
  );

  const identityKey = useGetSingleValue(
    '_delegateKeyToIdentity',
    [id || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  const kycRightsSchemaId = useGetSingleValue(
    'schemaId',
    [],
    kycClaimContractAddress,
    kycClaimContract,
  );
  const sata100SchemaId = useGetSingleValue(
    'schemaId',
    [],
    sata100ContractAddress,
    sata100Contract,
  );

  const hasBlockpassKycToken = useGetSingleValue(
    'holdsTokenOfSchema',
    [id || '', kycRightsSchemaId],
    getRightsContractAddress(chainId),
    getRightsContract(chainId),
  );

  const hasSata100Token = useGetSingleValue(
    'holdsTokenOfSchema',
    [id || '', sata100SchemaId],
    getRightsContractAddress(chainId),
    getRightsContract(chainId),
  );

  const identityExists = useGetSingleValue(
    '_identityExists',
    [identityKey || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  const kycClaimPrice = useGetSingleValue(
    'feeAmount',
    [],
    kycClaimContractAddress,
    kycClaimContract,
  );

  const sata100Price = useGetSingleValue('feeAmount', [], sata100ContractAddress, sata100Contract);

  const {
    state: claimKycNftState,
    send: claimKycNftSend,
    resetState: claimKycNftResetState,
  } = useClaimKycNft(chainId);

  const {
    state: sata100State,
    send: sata100Send,
    resetState: sata100ResetState,
  } = usePurchaseSata100Nft(chainId);

  const {
    state: approveKycClaimState,
    send: approveKycClaimSend,
    resetState: approveKycClaimResetState,
  } = useTokenApprove(chainId);

  const {
    state: approveSata100State,
    send: approveSata100Send,
    resetState: approveSata100ResetState,
  } = useTokenApprove(chainId);

  useEffect(() => {
    if (id && identityKey) {
      const blockpass = new window.BlockpassKYCConnect('signata_f812a', {
        refId: identityKey,
        elementId: 'blockpass-kyc-connect',
      });

      blockpass.startKYCConnect();
    }
  }, [id, identityKey]);

  useEffect(() => {
    if (claimKycNftState) {
      logLoading(claimKycNftState, 'claimKycNft');
      setLoading(shouldBeLoading(claimKycNftState.status));
    }
  }, [claimKycNftState]);

  useEffect(() => {
    if (approveKycClaimState) {
      logLoading(approveKycClaimState, 'approve');
      setLoading(shouldBeLoading(approveKycClaimState.status));
    }
  }, [approveKycClaimState]);

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(`https://id-api.signata.net/api/v1/requestKyc/${id}`);
  //       if (response && response.data && response.data.sigS) {
  //         console.log(response.data);

  //       } else {
  //         console.log(response);
  //         // setKycErrorMessage(
  //         //   'No completed KYC information found for this identity. Complete KYC with a Signata-integrated provider first.',
  //         // );
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   if (id) {
  //     getData();
  //   }
  // }, [id]);

  const onClickBlockpassKyc = (e) => {
    e.preventDefault();
    console.log('onClickBlockpassKyc');
  };

  const handleClickApproveKycNft = (e) => {
    e.preventDefault();
    console.log('handleClickApproveKycNft');
    approveKycClaimResetState();
    approveKycClaimSend(
      getKycClaimContractAddress(chainId),
      BigNumber.from('100000000000000000000'),
    );
  };

  const handleClickApproveSata100 = (e) => {
    e.preventDefault();
    console.log('handleClickApproveSata100');
    approveSata100ResetState();
    approveSata100Send(getSata100ContractAddress(chainId), BigNumber.from('100000000000000000000'));
  };

  const handleClickClaimKycNft = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setKycErrorMessage('');
      const response = await axios.get(`https://id-api.signata.net/api/v1/requestKyc/${id}`);
      if (response && response.data && response.data.sigS) {
        // call chain
        console.log(response.data);
        claimKycNftResetState();
        approveSata100ResetState();
        const salt = `0x${response.data.salt}`;
        console.log({
          delegateAddress: id,
          sigV: response.data.sigV,
          sigR: response.data.sigR,
          sigS: response.data.sigS,
          salt,
        });
        claimKycNftSend(id, response.data.sigV, response.data.sigR, response.data.sigS, salt);
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

  const handleClickPurchaseSata100 = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      sata100ResetState();
      approveSata100ResetState();
      sata100Send(id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Stack spacing={2} sx={{ pt: 2 }}>
        <Typography variant="h6" component="h2">
          Decentralized Rights Exchange
        </Typography>
        {hasBlockpassKycToken && (
          <Box
            sx={{
              textAlign: 'center',
              border: 1,
              p: 2,
              borderRadius: 2,
              borderColor: 'secondary.light',
              backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            }}
          >
            <Stack>
              <Box sx={{ textAlign: 'center' }}>
                <img src="blockpass.png" alt="Blockpass Logo" style={{ maxWidth: 200 }} />
              </Box>
              <Typography variant="body1" component="p" gutterBottom>
                Congruent Labs Australia Blockpass KYC NFT
              </Typography>
              <Chip
                size="large"
                color="primary"
                variant="contained"
                icon={<CheckIcon />}
                label="Identity owns this NFT Right"
                sx={{ borderRadius: 0 }}
              />
            </Stack>
          </Box>
        )}
        {!hasBlockpassKycToken && account !== id && account && (
          <Box
            sx={{
              textAlign: 'center',
              border: 1,
              p: 2,
              borderRadius: 2,
              borderColor: 'secondary.light',
              backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            }}
          >
            <Stack spacing={1}>
              <Box sx={{ textAlign: 'center' }}>
                <img src="blockpass.png" alt="Blockpass Logo" style={{ maxWidth: 200 }} />
              </Box>
              <Typography variant="body1" component="p" gutterBottom>
                Congruent Labs Australia Blockpass KYC NFT
              </Typography>
              <Chip
                size="large"
                color="default"
                variant="outlined"
                icon={<CloseIcon />}
                label="Identity does not own this NFT Right"
                sx={{ borderRadius: 0 }}
              />
            </Stack>
          </Box>
        )}
        <Box
          sx={{
            textAlign: 'center',
            border: 1,
            p: 2,
            borderRadius: 2,
            borderColor: 'secondary.light',
            backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            display:
              identityExists && !hasBlockpassKycToken && account === id && account ? '' : 'none',
          }}
        >
          <Stack spacing={1}>
            <Box sx={{ textAlign: 'center' }}>
              <img src="blockpass.png" alt="Blockpass Logo" style={{ maxWidth: 200 }} />
            </Box>
            <Typography gutterBottom variant="h5" component="div" textAlign="center">
              Blockpass KYC
              {' ('}
              {formatUnits(kycClaimPrice || 0, 18)}
              {' '}
              SATA)
            </Typography>
            <Typography variant="body2" textAlign="left">
              KYC with Congruent Labs (Australia) verifying your identity using Blockpass. Excluding
              residents of the following sanctioned countries: Central African Republic, Democratic
              Republic of the Congo, Eritrea, Lebanon, Libya, Myanmar, Russia, Somalia, Sudan,
              Yemen, Zimbabwe, Crimea and Sevastopol, Iran, Syria, and North Korea.
            </Typography>
            <Typography variant="body2" textAlign="left">
              Addresses sanctioned by OFEC will be not be permitted to purchase this NFT.
              {' '}
              <Link
                href="https://home.treasury.gov/policy-issues/office-of-foreign-assets-control-sanctions-programs-and-information"
                target="_blank"
                rel="noreferrer"
                color="secondary"
              >
                Learn more about OFEC.
              </Link>
            </Typography>
            <Button
              fullWidth
              id="blockpass-kyc-connect"
              disabled={isLoading}
              size="large"
              variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
              onClick={onClickBlockpassKyc}
            >
              Start KYC
            </Button>
            <Alert severity="info" variant="outlined" sx={{ textAlign: 'left' }}>
              Once you have completed KYC with blockpass, click the below button to claim your KYC
              NFT.
            </Alert>
            <ButtonGroup orientation="horizontal" color="secondary" fullWidth size="large">
              <Button
                onClick={handleClickApproveKycNft}
                disabled={isLoading || kycClaimAllowance >= kycClaimPrice}
              >
                Approve
              </Button>
              <Button
                onClick={handleClickClaimKycNft}
                variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
                disabled={isLoading || kycClaimAllowance < kycClaimPrice}
              >
                Claim KYC NFT
              </Button>
            </ButtonGroup>
            <Typography variant="body2" textAlign="left" color="text.secondary">
              If you experience any issues with the claim process contact support by clicking the
              button below or reaching out to us on Discord.
            </Typography>
            <Button
              fullWidth
              color="inherit"
              size="small"
              variant="outlined"
              target="_blank"
              href="https://congruentlabs.atlassian.net/servicedesk/customer/portal/5"
            >
              Contact Support
            </Button>
            <LoadingState state={approveKycClaimState} />
            <LoadingState state={claimKycNftState} />
            {kycErrorMessage && <Alert severity="error">{kycErrorMessage}</Alert>}
          </Stack>
        </Box>
        {hasSata100Token && (
          <Box
            sx={{
              textAlign: 'center',
              border: 1,
              p: 2,
              borderRadius: 2,
              borderColor: 'secondary.light',
              backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            }}
          >
            <Stack spacing={1}>
              <Box sx={{ textAlign: 'center' }}>
                <img src="sata-100.png" alt="SATA 100 Logo" style={{ maxWidth: 200 }} />
              </Box>
              <Typography variant="body2" textAlign="center">
                This NFT Right represents the SATA 100 Membership. This right does not do anything,
                it just shows how you can make your own rights and sell them to Signata Identities.
              </Typography>
              <Chip
                size="large"
                color="primary"
                variant="contained"
                icon={<CheckIcon />}
                label="Identity owns this NFT Right"
                sx={{ borderRadius: 0 }}
              />
            </Stack>
          </Box>
        )}
        {!hasSata100Token && account !== id && account && (
          <Box
            sx={{
              textAlign: 'center',
              border: 1,
              p: 2,
              borderRadius: 2,
              borderColor: 'secondary.light',
              backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            }}
          >
            <Stack spacing={1}>
              <Box sx={{ textAlign: 'center' }}>
                <img src="sata-100.png" alt="SATA 100 Logo" style={{ maxWidth: 200 }} />
              </Box>
              <Typography variant="body2" textAlign="center">
                This NFT Right represents the SATA 100 Membership. This right does not do anything,
                it just shows how you can make your own rights and sell them to Signata Identities.
              </Typography>
              <Chip
                size="large"
                color="default"
                variant="outlined"
                icon={<CloseIcon />}
                label="Identity does not own this NFT Right"
                sx={{ borderRadius: 0 }}
              />
            </Stack>
          </Box>
        )}
        <Box
          sx={{
            textAlign: 'center',
            border: 1,
            p: 2,
            borderRadius: 2,
            borderColor: 'secondary.light',
            backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            display: identityExists && !hasSata100Token && account === id && account ? '' : 'none',
          }}
        >
          <Stack spacing={1}>
            <Box sx={{ textAlign: 'center' }}>
              <img src="sata-100.png" alt="SATA 100 Logo" style={{ maxWidth: 200 }} />
            </Box>
            <Typography gutterBottom variant="h5" component="div" textAlign="center">
              SATA 100 Membership
              {' ('}
              {formatUnits(sata100Price || 0, 18)}
              {' '}
              SATA)
            </Typography>
            <Typography variant="body2" textAlign="center">
              This NFT Right represents the SATA 100 Membership. This right does not do anything, it
              just shows how you can make your own rights and sell them to Signata Identities.
            </Typography>
            <ButtonGroup orientation="horizontal" color="secondary" fullWidth size="large">
              <Button
                onClick={handleClickApproveSata100}
                disabled={isLoading || sata100ClaimAllowance >= sata100Price}
              >
                Approve
              </Button>
              <Button
                onClick={handleClickPurchaseSata100}
                variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
                disabled={isLoading || sata100ClaimAllowance < sata100Price}
              >
                Purchase NFT
              </Button>
            </ButtonGroup>
            <LoadingState state={approveSata100State} />
            <LoadingState state={sata100State} />
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}

export default Rights;
