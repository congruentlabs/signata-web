import React from 'react';
import { Alert, Typography, Grid, AlertTitle, Stack } from '@mui/material';
import { formatUnits } from '@ethersproject/units';

import { fNumber, fCurrency } from '../../utils/formats';

export function NetworkServices({ chainId, brokers, riskOracles }) {
  if (chainId === 1) {
    // Ethereum Mainnet
    return (
      <Stack spacing={1}>
        <Typography variant="h6" textAlign="center">
          Ethereum Network Services
        </Typography>
        {chainId === 1 && !brokers && (
          <Alert severity="warning">
            <AlertTitle>No Ethereum Network Brokers Detected</AlertTitle>
            This network does not yet host any identity brokers. You can self-manage identities but you cannot delegate
            identity changes to any brokers on this network.
          </Alert>
        )}
        {chainId === 1 && !riskOracles && (
          <Alert severity="warning">
            <AlertTitle>No Ethereum Risk Oracles Detected</AlertTitle>
            No risk oracle services have been detected for this network. Identity risk data may be unavailable.
          </Alert>
        )}
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      <Alert severity="error">
        <AlertTitle>Unknown Network</AlertTitle>
        Please connect to a Signata-connected blockchain network to view services on the network.
      </Alert>
    </Stack>
  );
}

export default NetworkServices;
