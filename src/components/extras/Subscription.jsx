import React, { useState } from 'react';
import { useEthers } from '@usedapp/core';
import {
  Grid,
  CardContent,
  Stack,
  ButtonGroup,
  Button,
  Alert,
  AlertTitle,
  Paper,
} from '@mui/material';
import ItemHeader from '../app/ItemHeader';
import ItemBox from '../app/ItemBox';
import { SUPPORTED_CHAINS } from '../../hooks/helpers';

function Subscription() {
  const { chainId } = useEthers();
  const chainName = SUPPORTED_CHAINS.find(
    (network) => network.chainId === chainId,
  )?.chainName;
  return (
    <Grid item xs={12} md={6}>
      <ItemBox>
        <ItemHeader text={`${chainName} Subscription`} />
        <CardContent>
          <Stack spacing={2}>
            <Paper>
              <ButtonGroup fullWidth variant="text" disabled>
                <Button color="secondary">Deposit SATA</Button>
              </ButtonGroup>
            </Paper>
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
