import React from 'react';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Container,
  Chip,
  Stack,
} from '@mui/material';
import { useGetSingleValue, getIdContractAddress, getIdContract } from '../../hooks/chainHooks';

function IdentityDetails({ chainId, id }) {
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
      <Stack spacing={1}>
        {identityExists ? (
          <Chip
            size="large"
            color="primary"
            label="Identity Exists"
            icon={<FingerprintIcon />}
            sx={{ p: 2 }}
          />
        ) : (
          <Chip
            size="large"
            color="warning"
            label="Identity does not exist on this chain"
            icon={<FingerprintIcon />}
            sx={{ p: 2 }}
          />
        )}
        {identityExists && identityKey && (
          <Chip
            color="default"
            label={`Identity: ${identityKey}`}
            sx={{ p: 2, fontFamily: 'Roboto Mono' }}
          />
        )}
        {identityExists && id && (
          <Chip
            color="default"
            label={`Delegate: ${id}`}
            sx={{ p: 2, fontFamily: 'Roboto Mono' }}
          />
        )}
        {identityExists && securityKey && (
          <Chip
            color="default"
            label={`Security: ${securityKey}`}
            sx={{ p: 2, fontFamily: 'Roboto Mono' }}
          />
        )}
        {identityExists && !identityLocked && (
          <Chip color="primary" label="Identity Unlocked" icon={<LockOpenIcon />} sx={{ p: 2 }} />
        )}
        {identityExists && identityLocked && (
          <Chip color="warning" label="Identity Locked" icon={<LockIcon />} sx={{ p: 2 }} />
        )}
        {identityExists && identityDestroyed && (
          <Chip
            color="error"
            label="Identity Destroyed"
            icon={<ErrorOutlineIcon />}
            sx={{ p: 2 }}
          />
        )}
      </Stack>
    </Container>
  );
}

export default IdentityDetails;
