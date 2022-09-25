import React from 'react';
import { Box, Grid } from '@mui/material';
import UnsupportedChain from './app/UnsupportedChain';
import Stats from './extras/Stats';

function StatsView({
  theme, account, supportedChain, SUPPORTED_CHAINS, chainId,
}) {
  return (
    <Box
      sx={{
        paddingTop: { xs: 1, sm: 2 },
        paddingBottom: { xs: 1, sm: 2 },
      }}
    >
      <Grid container spacing={4} direction="row" justifyContent="center" alignItems="stretch">
        {account && !supportedChain && <UnsupportedChain SUPPORTED_CHAINS={SUPPORTED_CHAINS} />}
        {account && supportedChain && (
          <Grid item xs={12} textAlign="center">
            <Stats chainId={chainId} theme={theme} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default StatsView;
