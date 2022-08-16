import React, { useState } from 'react';
import { grey } from '@mui/material/colors';
import {
  Grid,
  Box,
  CardContent,
  Stack,
  Typography,
  Chip,
  Alert,
  AlertTitle,
} from '@mui/material';

export function NetworkServices() {
  const [services, setServices] = useState([
    // { id: 1, status: 'Available', name: 'Test' },
  ]);
  return (
    <Grid item xs={12} md={6}>
      <Box
        sx={{
          minHeight: {
            md: 350,
          },
          borderRadius: 0,
          border: 1,
          borderColor: grey[600],
          backgroundColor: grey[50],
        }}
      >
        <CardContent>
          <Stack spacing={1}>
            <Typography
              variant="h6"
              align="center"
              sx={{
                background: grey[300], fontFamily: 'Roboto Condensed', border: 1, borderColor: 'black',
              }}
            >
              Network Services
            </Typography>
            {services && services.length < 1 && (
              <Alert severity="warning">
                <AlertTitle>No Services</AlertTitle>
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
      </Box>
    </Grid>
  );
}

export default NetworkServices;
