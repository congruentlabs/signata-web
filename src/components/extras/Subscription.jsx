import React, { useState } from 'react';
import { useEthers, DEFAULT_SUPPORTED_CHAINS } from '@usedapp/core';
import {
  Grid,
  CardContent,
  Stack,
  ButtonGroup,
  Button,
  Alert,
  AlertTitle,
} from '@mui/material';
import ItemHeader from '../app/ItemHeader';
import ItemBox from '../app/ItemBox';

function Subscription() {
  const { chainId } = useEthers();
  const chainName = DEFAULT_SUPPORTED_CHAINS.find(
    (network) => network.chainId === chainId,
  )?.chainName;
  return (
    <Grid item xs={12} md={6}>
      <ItemBox>
        <ItemHeader text={`${chainName} Subscription`} />
        <CardContent>
          <Stack spacing={2}>
            <ButtonGroup fullWidth>
              <Button color="secondary" variant="contained">Deposit SATA</Button>
            </ButtonGroup>
            <Alert severity="info">
              <AlertTitle>About Subscriptions</AlertTitle>
              Deposit SATA tokens to fund delegated modifications to identities
              and cheaper transactions for purchasing some rights.
            </Alert>
          </Stack>
        </CardContent>
      </ItemBox>
    </Grid>
  );
}

export default Subscription;
