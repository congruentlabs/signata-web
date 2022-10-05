import React, { useState, useEffect } from 'react';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import axios from 'axios';
import { useTokenAllowance } from '@usedapp/core';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert, Box, Button, ButtonGroup, Chip, Stack, Typography, Link,
} from '@mui/material';
import {
  getAuditClaimContract,
  getAuditClaimContractAddress,
  useClaimAuditNft,
  useGetSingleValue,
  useTokenApprove,
} from '../../../hooks/chainHooks';
import { shouldBeLoading, logLoading } from '../../../hooks/helpers';
import LoadingState from '../LoadingState';

function AuditVerify({
  chainId, id, account, theme, identityExists, setLoading, isLoading, rightsContractAddress, rightsContract, tokenContractAddress,
}) {
  const [auditErrorMessage, setAuditErrorMessage] = useState('');
  const auditClaimContractAddress = getAuditClaimContractAddress(chainId);
  const auditClaimContract = getAuditClaimContract(chainId);
  const auditClaimAllowance = useTokenAllowance(
    tokenContractAddress,
    account,
    auditClaimContractAddress,
  );

  const auditRightsSchemaId = useGetSingleValue(
    'schemaId',
    [],
    auditClaimContractAddress,
    auditClaimContract,
  );

  const hasAuditToken = useGetSingleValue(
    'holdsTokenOfSchema',
    [id || '', auditRightsSchemaId],
    rightsContractAddress,
    rightsContract,
  );

  const auditClaimPrice = useGetSingleValue(
    'feeAmount',
    [],
    auditClaimContractAddress,
    auditClaimContract,
  );

  const {
    state: approveAuditClaimState,
    send: approveAuditClaimSend,
    resetState: approveAuditClaimResetState,
  } = useTokenApprove(chainId);

  const {
    state: claimAuditNftState,
    send: claimAuditNftSend,
    resetState: claimAuditNftResetState,
  } = useClaimAuditNft(chainId);

  useEffect(() => {
    if (claimAuditNftState) {
      logLoading(claimAuditNftState, 'claimAuditNft');
      setLoading(shouldBeLoading(claimAuditNftState.status));
    }
  }, [claimAuditNftState, setLoading]);

  useEffect(() => {
    if (approveAuditClaimState) {
      logLoading(approveAuditClaimState, 'approve');
      setLoading(shouldBeLoading(approveAuditClaimState.status));
    }
  }, [approveAuditClaimState, setLoading]);

  const onClickBlockpassAudit = (e) => {
    e.preventDefault();
    console.log('onClickBlockpassAudit');
  };

  const handleClickApproveAuditNft = (e) => {
    e.preventDefault();
    console.log('handleClickApproveAuditNft');
    approveAuditClaimResetState();
    approveAuditClaimSend(
      getAuditClaimContractAddress(chainId),
      BigNumber.from('100000000000000000000'),
    );
  };

  const handleClickClaimAuditNft = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setAuditErrorMessage('');
      const response = await axios.get(`https://id-api.signata.net/api/v1/requestAudit/${id}`);
      if (response && response.data && response.data.sigS) {
        // call chain
        console.log(response.data);
        claimAuditNftResetState();
        const salt = `0x${response.data.salt}`;
        console.log({
          delegateAddress: id,
          sigV: response.data.sigV,
          sigR: response.data.sigR,
          sigS: response.data.sigS,
          salt,
        });
        claimAuditNftSend(id, response.data.sigV, response.data.sigR, response.data.sigS, salt);
      } else {
        console.log(response);
        setAuditErrorMessage(
          'No completed Audit information found for this identity. Complete an Audit validation with Signata first.',
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
      {hasAuditToken && (
        <Stack>
          <Box sx={{ textAlign: 'center' }}>
            <img src="congruent.png" alt="Congruent Labs Logo" style={{ maxWidth: 200 }} />
          </Box>
          <Typography variant="body1" component="p" gutterBottom>
            Congruent Labs Audit Verification NFT
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
      )}
      {!hasAuditToken && account !== id && account && (
        <Stack spacing={1}>
          <Box sx={{ textAlign: 'center' }}>
            <img src="blockpass.png" alt="Blockpass Logo" style={{ maxWidth: 200 }} />
          </Box>
          <Typography variant="body1" component="p" gutterBottom>
            Congruent Labs Audit Verification NFT
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
      )}
      <Box
        sx={{
          textAlign: 'center',
          border: 1,
          p: 2,
          borderRadius: 2,
          borderColor: 'secondary.light',
          backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
          display: identityExists && !hasAuditToken && account === id && account ? '' : 'none',
        }}
      >
        <Stack spacing={1}>
          <Box sx={{ textAlign: 'center' }}>
            <img src="blockpass.png" alt="Blockpass Logo" style={{ maxWidth: 200 }} />
          </Box>
          <Typography gutterBottom variant="h5" component="div" textAlign="center">
            Audit Verification
            {' ('}
            {formatUnits(auditClaimPrice || 0, 18)}
            {' '}
            SATA)
          </Typography>
          <Typography variant="body2" textAlign="left">
            Verify your project audit with Congruent Labs. Once verified you can claim an NFT proof
            that represents this audited state that you can then use to prove your project is
            audited on-chain.
          </Typography>
          <Alert severity="info">
            This NFT is not a smart contract audit. It is a proof that you have completed a smart
            contract through a 3rd party. If you want a smart contract audit from Congruent Labs,
            {' '}
            <Link href="mailto:sales@signata.net" target="_blank">
              click here
            </Link>
            .
          </Alert>
          <Button
            fullWidth
            disabled={isLoading}
            size="large"
            variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
            onClick={onClickBlockpassAudit}
          >
            Request Verify Audit
          </Button>
          <Alert severity="info" variant="outlined" sx={{ textAlign: 'left' }}>
            Once you have completed an audit verification, click the below button to claim your NFT.
          </Alert>
          <ButtonGroup orientation="horizontal" color="secondary" fullWidth size="large">
            <Button
              onClick={handleClickApproveAuditNft}
              disabled={isLoading || auditClaimAllowance >= auditClaimPrice}
            >
              Approve
            </Button>
            <Button
              onClick={handleClickClaimAuditNft}
              variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
              disabled={isLoading || auditClaimAllowance < auditClaimPrice}
            >
              Claim Audit NFT
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
          <LoadingState state={approveAuditClaimState} />
          <LoadingState state={claimAuditNftState} />
          {auditErrorMessage && <Alert severity="error">{auditErrorMessage}</Alert>}
        </Stack>
      </Box>
    </Box>
  );
}

export default AuditVerify;
