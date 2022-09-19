import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import UnsupportedChain from './app/UnsupportedChain';
import IdentityDetails from './identity/IdentityDetails';
import Rights from './identity/Rights';

function IdentityView({
  theme, account, supportedChain, SUPPORTED_CHAINS, chainId,
}) {
  const { id } = useParams();

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
            {id && <IdentityDetails id={id} chainId={chainId} theme={theme} />}
            {id && account && <Rights id={id} chainId={chainId} account={account} theme={theme} />}
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default IdentityView;
