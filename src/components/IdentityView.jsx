import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { Box, Grid } from '@mui/material';
import UnsupportedChain from './app/UnsupportedChain';
import { SUPPORTED_CHAINS } from '../hooks/helpers';
import ViewIdentity from './identity/ViewIdentity';
// import ProductOverview from './app/ProductOverview';
import NoConnectionWarning from './connection/NoConnectionWarning';

// const dSataContractAddress = '0x49428f057dd9d20a8e4c6873e98afd8cd7146e3b';

function IdentityView({ theme, account }) {
  const { id } = useParams();
  const { chainId } = useEthers();
  const [supportedChain, setSupportedChain] = useState(false);

  useEffect(() => {
    const chainName = SUPPORTED_CHAINS.find((network) => network.chainId === chainId)?.chainName;
    if (chainName) {
      setSupportedChain(true);
    } else {
      setSupportedChain(false);
    }
  }, [chainId]);

  return (
    <Box
      sx={{
        minHeight: '80vh',
        paddingTop: { xs: 1, sm: 2 },
        paddingBottom: { xs: 1, sm: 2 },
      }}
    >
      <Grid container spacing={4} direction="row" justifyContent="center" alignItems="stretch">
        {/* {!account && <ProductOverview />} */}
        {!account && <NoConnectionWarning />}
        {account && !supportedChain && <UnsupportedChain SUPPORTED_CHAINS={SUPPORTED_CHAINS} />}
        {account && supportedChain && (
          <Grid item xs={12} textAlign="center">
            <ViewIdentity id={id} theme={theme} account={account} chainId={chainId} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default IdentityView;
