import React, { useState } from 'react';
import { useEthers, shortenIfAddress } from '@usedapp/core';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import UploadIcon from '@mui/icons-material/Upload';
import {
  Grid,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { getNanoContract, getNanoContractAddress, useGetSingleValue } from '../../hooks/chainHooks';

function NanoIdentity() {
  const { chainId, account } = useEthers();

  const nanoContract = getNanoContract(chainId);
  const identityLocked = useGetSingleValue('_identityLocked', [account], getNanoContractAddress(chainId), nanoContract);
  const identityExists = useGetSingleValue('_identityExists', [account], getNanoContractAddress(chainId), nanoContract);
  const identityDelegate = useGetSingleValue('_identityDelegate', [account], getNanoContractAddress(chainId), nanoContract);

  return (
    <Grid item xs={12}>
      <Card sx={{ p: 1 }}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6" align="left">
              Your Nano Identity
            </Typography>
            <Typography variant="body1" align="left">
              Locked:
              {' '}
              {identityLocked ? 'True' : 'False'}
            </Typography>
            <Typography variant="body1" align="left">
              Exists:
              {' '}
              {identityExists ? 'True' : 'False'}
            </Typography>
            <Typography variant="body1" align="left">
              Delegate
              {' '}
              {identityDelegate || ''}
            </Typography>
          </Stack>
        </CardContent>
        <CardActions>
          {identityExists === false && (
            <Button
              color="primary"
              variant="contained"
              startIcon={<AddIcon />}
            >
              Create Nano
            </Button>
          )}
          {identityExists === true && identityLocked === false && (
            <Button
              color="warning"
              variant="contained"
              startIcon={<LockIcon />}
            >
              Lock Nano
            </Button>
          )}
          {identityExists === true && (
            <Button
              color="secondary"
              variant="contained"
              startIcon={<EditIcon />}
            >
              Delegate Nano
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
}

export default NanoIdentity;
