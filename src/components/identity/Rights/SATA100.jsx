import React, { useState, useEffect } from 'react';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import axios from 'axios';
import { useTokenAllowance } from '@usedapp/core';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert, Box, Button, ButtonGroup, Chip, Stack, Typography,
} from '@mui/material';
import {
  getRightsContract,
  getRightsContractAddress,
  getTokenContractAddress,
  useGetSingleValue,
  useTokenApprove,
  getSata100Contract,
  getSata100ContractAddress,
  usePurchaseSata100Nft,
} from '../../../hooks/chainHooks';
import { shouldBeLoading, logLoading } from '../../../hooks/helpers';
import LoadingState from '../LoadingState';

function SATA100({
  chainId, id, account, theme, identityExists, setLoading, isLoading,
}) {
  const sata100ContractAddress = getSata100ContractAddress(chainId);
  const sata100Contract = getSata100Contract(chainId);
  const sata100ClaimAllowance = useTokenAllowance(
    getTokenContractAddress(chainId),
    account,
    sata100ContractAddress,
  );
  const sata100SchemaId = useGetSingleValue(
    'schemaId',
    [],
    sata100ContractAddress,
    sata100Contract,
  );

  const hasSata100Token = useGetSingleValue(
    'holdsTokenOfSchema',
    [id || '', sata100SchemaId],
    getRightsContractAddress(chainId),
    getRightsContract(chainId),
  );

  const sata100Price = useGetSingleValue('feeAmount', [], sata100ContractAddress, sata100Contract);

  const {
    state: sata100State,
    send: sata100Send,
    resetState: sata100ResetState,
  } = usePurchaseSata100Nft(chainId);

  const {
    state: approveSata100State,
    send: approveSata100Send,
    resetState: approveSata100ResetState,
  } = useTokenApprove(chainId);

  const handleClickApproveSata100 = (e) => {
    e.preventDefault();
    console.log('handleClickApproveSata100');
    approveSata100ResetState();
    approveSata100Send(getSata100ContractAddress(chainId), BigNumber.from('100000000000000000000'));
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
      <div
        style={{
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
      </div>
    </Box>
  );
}

export default SATA100;
