import React from 'react';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Link } from 'react-router-dom';
import {
  Container,
  Chip,
  Stack,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { useGetSingleValue, getIdContractAddress, getIdContract } from '../../hooks/chainHooks';

function IdentityDetails({ chainId, id, theme }) {
  const idContract = getIdContract(chainId);

  const identityKey = useGetSingleValue(
    '_delegateKeyToIdentity',
    [id || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  const identityExists = useGetSingleValue(
    '_identityExists',
    [identityKey || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  const identityDestroyed = useGetSingleValue(
    '_identityDestroyed',
    [identityKey || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  const identityLocked = useGetSingleValue(
    '_identityLocked',
    [identityKey || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  const securityKey = useGetSingleValue(
    '_identityToSecurityKey',
    [identityKey || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  return (
    <Container maxWidth="sm">
      <Button to="/" component={Link} startIcon={<ChevronLeftIcon />}>
        Back to Identity Manager
      </Button>
      <Typography variant="h6" component="h2" gutterBottom>
        Identity Details
      </Typography>
      <Box
        sx={{
          textAlign: 'center',
          border: 1,
          p: 2,
          borderRadius: 2,
          borderColor: 'primary.light',
          backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
        }}
      >
        <Stack spacing={1}>
          {identityExists ? (
            <Chip
              size="large"
              color="primary"
              label="Identity Exists"
              icon={<FingerprintIcon />}
              sx={{ borderRadius: 0 }}
            />
          ) : (
            <Chip
              size="large"
              color="warning"
              label="Identity does not exist on this chain"
              icon={<FingerprintIcon />}
              sx={{ borderRadius: 0 }}
            />
          )}
          {identityExists && identityKey && (
            <Chip
              color="default"
              label={`Identity: ${identityKey}`}
              sx={{ fontFamily: 'Roboto Mono', borderRadius: 0 }}
            />
          )}
          {identityExists && id && (
            <Chip
              color="default"
              label={`Delegate: ${id}`}
              sx={{ fontFamily: 'Roboto Mono', borderRadius: 0 }}
            />
          )}
          {identityExists && !identityLocked && (
            <Chip
              color="primary"
              label="Identity Unlocked"
              icon={<LockOpenIcon />}
              sx={{ borderRadius: 0 }}
            />
          )}
          {identityExists && identityLocked && (
            <Chip
              color="warning"
              label="Identity Locked"
              icon={<LockIcon />}
              sx={{ borderRadius: 0 }}
            />
          )}
          {identityExists && identityDestroyed && (
            <Chip
              color="error"
              label="Identity Destroyed"
              icon={<ErrorOutlineIcon />}
              sx={{ borderRadius: 0 }}
            />
          )}
        </Stack>
      </Box>
    </Container>
  );
}

export default IdentityDetails;
