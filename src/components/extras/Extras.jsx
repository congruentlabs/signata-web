import React from 'react';
import { formatUnits } from '@ethersproject/units';
import { Typography, Grid, Stack, Card, CardContent, CardActions, Chip, Button, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';

import { fNumber, fCurrency } from '../../utils/formats';

export function Extras({
  sataBalance,
  dSataBalance,
  chainId,
  sataPriceData,
  dSataPriceData,
  ethPrice,
  cloudStorageActive,
  handleClickBuyCloudStorage,
  handleClickManageCloudStorage
}) {
  const theme = useTheme();
  if (chainId === 1) {
    // Ethereum mainnet
    return (
      <>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6">Your Wallet Balances</Typography>
                <Typography variant="body1">
                  {fNumber(formatUnits(sataBalance || 0, 18))} SATA (
                  {fCurrency(formatUnits(sataBalance || 0, 18) * sataPriceData.token.derivedETH * ethPrice)} USD)
                </Typography>
                <Chip
                  icon={sataBalance && sataBalance < 1 ? <ClearIcon /> : <CheckIcon />}
                  label="Can Purchase Rights"
                  variant="outlined"
                  color={sataBalance && sataBalance < 1 ? 'error' : 'success'}
                  sx={{ borderRadius: 0 }}
                />
                <Typography variant="body1">
                  {fNumber(formatUnits(dSataBalance || 0, 18))} dSATA (
                  {fCurrency(formatUnits(dSataBalance || 0, 18) * dSataPriceData.token.derivedETH * ethPrice)} USD)
                </Typography>
                <Chip
                  icon={sataBalance && sataBalance < 1 ? <ClearIcon /> : <CheckIcon />}
                  label="Can Vote in DAO"
                  variant="outlined"
                  color={dSataBalance && dSataBalance < 1 ? 'error' : 'success'}
                  sx={{ borderRadius: 0 }}
                />
              </Stack>
            </CardContent>
            <CardActions>
              <Button color="primary" variant="contained">
                Get SATA
              </Button>
              <Button color="primary" variant="contained">
                Get dSATA
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6">Cloud Backup</Typography>
                <Typography variant="body1">
                  Keep your Signata identities backed up securely on Signata servers. We store your data Zero-Knowledge,
                  meaning we cannot see any of your private information.
                </Typography>
                <Chip
                  label={cloudStorageActive ? 'Active' : 'Inactive'}
                  color={cloudStorageActive ? 'success' : 'error'}
                  variant="outlined"
                  icon={cloudStorageActive ? <CloudDoneIcon /> : <CloudOffIcon />}
                  sx={{ borderRadius: 0 }}
                />
              </Stack>
            </CardContent>
            <CardActions>
              {cloudStorageActive ? (
                <Button color="primary" onClick={handleClickManageCloudStorage}>
                  Manage
                </Button>
              ) : (
                <Button color="primary" variant="contained" onClick={handleClickBuyCloudStorage}>
                  Buy
                </Button>
              )}

              <Button color="primary">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
      </>
    );
  } else {
    return (
      <Grid item xs={12} sm={6}>
        <Card sx={{ p: 1 }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h6">Your Wallet Balances</Typography>
              <Typography variant="body1">
                {fNumber(formatUnits(sataBalance || 0, 18))} SATA (
                {fCurrency(formatUnits(sataBalance || 0, 18) * sataPriceData.token.derivedETH * ethPrice)} USD)
              </Typography>
              <Chip
                icon={sataBalance && sataBalance < 1 ? <ClearIcon /> : <CheckIcon />}
                label="Can Purchase Rights"
                variant="outlined"
                color={sataBalance && sataBalance < 1 ? 'error' : 'success'}
                sx={{ borderRadius: 0 }}
              />
            </Stack>
          </CardContent>
          <CardActions>
            <Button color="primary">Get SATA</Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }
  return '';
}

export default Extras;
