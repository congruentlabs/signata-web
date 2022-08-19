import React, { useState } from 'react';
import { useEthers, DEFAULT_SUPPORTED_CHAINS } from '@usedapp/core';
import {
  Grid,
  CardContent,
  Stack,
  Chip,
  Alert,
  AlertTitle,
} from '@mui/material';
import ItemHeader from '../app/ItemHeader';
import ItemBox from '../app/ItemBox';

function NetworkServices() {
  const { chainId } = useEthers();
  const [services, setServices] = useState([
    // { id: 1, status: 'Available', name: 'Test' },
  ]);
  const chainName = DEFAULT_SUPPORTED_CHAINS.find(
    (network) => network.chainId === chainId,
  )?.chainName;
  return (
    <Grid item xs={12} md={6}>
      <ItemBox>
        <ItemHeader text={`${chainName} Network Services`} />
        <CardContent>
          <Stack spacing={2}>
            {services && services.length < 1 && (
              <Alert severity="warning">
                No services have been detected for this network.
              </Alert>
            )}
            {services
              && services.map((service) => (
                <Chip
                  key={service.id}
                  label={`${service.name} Service: ${service.status}`}
                  color={service.status === 'Available' ? 'success' : 'warning'}
                  sx={{
                    borderRadius: 0,
                    height: 48,
                    border: 1,
                    borderColor: 'black',
                  }}
                />
              ))}
            <Alert severity="info">
              <AlertTitle>About Network Services</AlertTitle>
              Each network offers services for managing identities, sharing risk
              information, and more. If services are not available you can use
              Signata, but some features may be unavailable.
            </Alert>
          </Stack>
        </CardContent>
      </ItemBox>
    </Grid>
  );
}

export default NetworkServices;
