import React, { useState, useEffect } from 'react';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import axios from 'axios';
import { useTokenAllowance } from '@usedapp/core';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  Container,
  Chip,
  Stack,
  CardContent,
  Card,
  Typography,
  Divider,
  Box,
  Button,
  Alert,
  ButtonGroup,
} from '@mui/material';
import {
  useGetSingleValue,
  getIdContractAddress,
  getIdContract,
  getKycClaimContractAddress,
  getKycClaimContract,
  getRightsContractAddress,
  getRightsContract,
  getTokenContractAddress,
  useClaimKycNft,
  useTokenApprove,
} from '../../hooks/chainHooks';
import LoadingState from './LoadingState';
import { shouldBeLoading, logLoading } from '../../hooks/helpers';

function Rights({ chainId, id, account }) {
  const idContract = getIdContract(chainId);
  const [isLoading, setLoading] = useState(false);
  const [kycErrorMessage, setKycErrorMessage] = useState('');
  const kycClaimContractAddress = getKycClaimContractAddress(chainId);
  const kycClaimContract = getKycClaimContract(chainId);
  const claimAllowance = useTokenAllowance(
    getTokenContractAddress(chainId),
    account,
    kycClaimContractAddress,
  );

  const identityKey = useGetSingleValue(
    '_delegateKeyToIdentity',
    [id || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  const schemaId = useGetSingleValue('schemaId', [], kycClaimContractAddress, kycClaimContract);

  const hasBlockpassKycToken = useGetSingleValue(
    'holdsTokenOfSchema',
    [id || '', schemaId],
    getRightsContractAddress(chainId),
    getRightsContract(chainId),
  );

  const kycClaimPrice = useGetSingleValue(
    'feeAmount',
    [],
    kycClaimContractAddress,
    kycClaimContract,
  );

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
    if (approveState) {
      logLoading(approveState, 'approve');
      setLoading(shouldBeLoading(approveState.status));
    }
  }, [approveState]);

  const onClickBlockpassKyc = (e) => {
    e.preventDefault();
    console.log('onClickBlockpassKyc');
  };

  const handleClickApproveKycNft = (e) => {
    e.preventDefault();
    console.log('handleClickApproveKycNft');
    approveResetState();
    approveSend(getKycClaimContractAddress(chainId), BigNumber.from('100000000000000000000'));
  };

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
          delegateAddress: id,
          sigV: response.data.sigV,
          sigR: response.data.sigR,
          sigS: response.data.sigS,
          salt,
        });
        claimKycNftSend(
          id,
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

  return (
    <Container maxWidth="sm">
      <Stack spacing={1}>
        <Divider />
        <Typography variant="h5" component="h2" gutterBottom>
          NFT Rights
        </Typography>
        {hasBlockpassKycToken && (
          <Card sx={{ textAlign: 'center' }}>
            <CardContent>
              <img src="blockpass.png" alt="Blockpass Logo" style={{ maxWidth: 200 }} />
              <Typography variant="body1" component="p" gutterBottom>
                Congruent Labs Australia Blockpass KYC NFT
              </Typography>
              <div>
                <Chip
                  size="large"
                  color="primary"
                  variant="outlined"
                  icon={<CheckIcon />}
                  label="Identity owns this NFT Right"
                  sx={{ p: 1 }}
                />
              </div>
            </CardContent>
          </Card>
        )}
        {!hasBlockpassKycToken && account !== id && account && (
          <Card sx={{ textAlign: 'center' }}>
            <CardContent>
              <img src="blockpass.png" alt="Blockpass Logo" style={{ maxWidth: 200 }} />
              <Typography variant="body1" component="p" gutterBottom>
                Congruent Labs Australia Blockpass KYC NFT
              </Typography>
              <div>
                <Chip
                  size="large"
                  color="default"
                  variant="outlined"
                  icon={<CloseIcon />}
                  label="Identity does not own this NFT Right"
                  sx={{ p: 1 }}
                />
              </div>
            </CardContent>
          </Card>
        )}
        <Card sx={{ display: !hasBlockpassKycToken && account === id && account ? '' : 'none' }}>
          <CardContent>
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
              <Typography variant="body2" textAlign="center">
                KYC with Congruent Labs (Australia) verifying your identity using Blockpass.
                Excluding residents of the following sanctioned countries: Central African
                Republic, Democratic Republic of the Congo, Eritrea, Lebanon, Libya, Myanmar,
                Russia, Somalia, Sudan, Yemen, Zimbabwe, Crimea and Sevastopol, Iran, Syria, and
                North Korea.
              </Typography>
              <Button
                fullWidth
                id="blockpass-kyc-connect"
                disabled={isLoading}
                size="large"
                variant="outlined"
                onClick={onClickBlockpassKyc}
              >
                Start KYC
              </Button>
              <Alert severity="info" variant="outlined" sx={{ textAlign: 'left' }}>
                Once you have completed KYC with blockpass, click the below button to claim
                your KYC NFT.
              </Alert>
              <ButtonGroup orientation="horizontal" color="secondary" fullWidth size="large">
                <Button
                  onClick={handleClickApproveKycNft}
                  disabled={isLoading || claimAllowance >= (100 * 1e18)}
                >
                  Approve
                </Button>
                <Button
                  onClick={handleClickClaimKycNft}
                  disabled={isLoading || claimAllowance < (100 * 1e18)}
                >
                  Claim KYC NFT
                </Button>
              </ButtonGroup>
              <LoadingState state={claimKycNftState} />
              <LoadingState state={approveState} />
              {kycErrorMessage && <Alert severity="error">{kycErrorMessage}</Alert>}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

export default Rights;
