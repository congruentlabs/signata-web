import React, { useState, useEffect } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import {
  getRightsContract,
  getRightsContractAddress,
  useGetSingleValue,
  useClaimModifier15X,
  useClaimModifier2X,
} from '../../hooks/chainHooks';
import LoadingState from './LoadingState';
import { shouldBeLoading, logLoading } from '../../hooks/helpers';

function Rights({
  chainId, id, account, theme, identityExists,
}) {
  const [isLoading, setLoading] = useState(false);

  const has2XToken = useGetSingleValue(
    'holdsTokenOfSchema',
    [id || '', 1], // TODO: get the schemaId from mainnet deployment
    getRightsContractAddress(chainId),
    getRightsContract(chainId),
  );

  const has15XToken = useGetSingleValue(
    'holdsTokenOfSchema',
    [id || '', 3], // TODO: get the schemaId from mainnet deployment
    getRightsContractAddress(chainId),
    getRightsContract(chainId),
  );

  const {
    state: modifier2XState,
    send: modifier2XSend,
    resetState: modifier2XResetState,
  } = useClaimModifier2X();

  const {
    state: modifier15XState,
    send: modifier15XSend,
    resetState: modifier15XResetState,
  } = useClaimModifier15X();

  useEffect(() => {
    if (modifier2XState) {
      logLoading(modifier2XState, 'modifier2X');
      setLoading(shouldBeLoading(modifier2XState.status));
    }
  }, [modifier2XState]);

  useEffect(() => {
    if (modifier15XState) {
      logLoading(modifier15XState, 'modifier15X');
      setLoading(shouldBeLoading(modifier15XState.status));
    }
  }, [modifier15XState]);

  const handleClickClaimModifier2X = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      modifier2XResetState();
      modifier2XSend(id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleClickClaimModifier15X = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      modifier15XResetState();
      modifier15XSend(id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Stack spacing={2} sx={{ pt: 2 }}>
        {has2XToken && (
          <Box
            sx={{
              textAlign: 'center',
              border: 1,
              p: 2,
              borderRadius: 2,
              borderColor: 'secondary.light',
              backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            }}
          >
            <Stack spacing={1}>
              <Box sx={{ textAlign: 'center' }}>
                <img src="dSATA.png" alt="dSATA Logo" style={{ maxWidth: 100 }} />
              </Box>
              <Typography gutterBottom variant="h5" component="div" textAlign="center">
                Signata DAO 2X Vote Multiplier
              </Typography>
              <Typography variant="body2" textAlign="center">
                This NFT Right provides a 2X multiplier on Signata DAO votes. Only eligible addresses can claim this NFT.
              </Typography>
              <Chip
                size="large"
                color="primary"
                variant="contained"
                icon={<CheckIcon />}
                label="Identity owns this NFT Right"
                sx={{ borderRadius: 0 }}
              />
            </Stack>
          </Box>
        )}
        {!has2XToken && account !== id && account && (
          <Box
            sx={{
              textAlign: 'center',
              border: 1,
              p: 2,
              borderRadius: 2,
              borderColor: 'secondary.light',
              backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            }}
          >
            <Stack spacing={1}>
              <Box sx={{ textAlign: 'center' }}>
                <img src="dSATA.png" alt="dSATA Logo" style={{ maxWidth: 100 }} />
              </Box>
              <Typography gutterBottom variant="h5" component="div" textAlign="center">
                Signata DAO 2X Vote Multiplier
              </Typography>
              <Typography variant="body2" textAlign="center">
                This NFT Right provides a 2X multiplier on Signata DAO votes. Only eligible addresses can claim this NFT.
              </Typography>
              <Chip
                size="large"
                color="default"
                variant="outlined"
                icon={<CloseIcon />}
                label="Identity does not own this NFT Right"
                sx={{ borderRadius: 0 }}
              />
            </Stack>
          </Box>
        )}
        <Box
          sx={{
            textAlign: 'center',
            border: 1,
            p: 2,
            borderRadius: 2,
            borderColor: 'secondary.light',
            backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            display: identityExists && !has2XToken && account === id && account ? '' : 'none',
          }}
        >
          <Stack spacing={1}>
            <Box sx={{ textAlign: 'center' }}>
              <img src="dSATA.png" alt="dSATA Logo" style={{ maxWidth: 100 }} />
            </Box>
            <Typography gutterBottom variant="h5" component="div" textAlign="center">
              Signata DAO 2X Vote Multiplier
            </Typography>
            <Typography variant="body2" textAlign="center">
              This NFT Right provides a 2X multiplier on Signata DAO votes. Only eligible addresses can claim this NFT.
            </Typography>
            <ButtonGroup orientation="horizontal" color="secondary" fullWidth size="large">
              <Button
                onClick={handleClickClaimModifier2X}
                variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
                disabled={isLoading}
              >
                Claim NFT
              </Button>
            </ButtonGroup>
            <LoadingState state={modifier2XState} />
          </Stack>
        </Box>

        {has15XToken && (
          <Box
            sx={{
              textAlign: 'center',
              border: 1,
              p: 2,
              borderRadius: 2,
              borderColor: 'secondary.light',
              backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            }}
          >
            <Stack spacing={1}>
              <Box sx={{ textAlign: 'center' }}>
                <img src="dSATA.png" alt="dSATA Logo" style={{ maxWidth: 100 }} />
              </Box>
              <Typography gutterBottom variant="h5" component="div" textAlign="center">
                Signata DAO 1.5X Vote Multiplier
              </Typography>
              <Typography variant="body2" textAlign="center">
                This NFT Right provides a 1.5X multiplier on Signata DAO votes. Only eligible addresses can claim this NFT.
              </Typography>
              <Chip
                size="large"
                color="primary"
                variant="contained"
                icon={<CheckIcon />}
                label="Identity owns this NFT Right"
                sx={{ borderRadius: 0 }}
              />
            </Stack>
          </Box>
        )}
        {!has15XToken && account !== id && account && (
          <Box
            sx={{
              textAlign: 'center',
              border: 1,
              p: 2,
              borderRadius: 2,
              borderColor: 'secondary.light',
              backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            }}
          >
            <Stack spacing={1}>
              <Box sx={{ textAlign: 'center' }}>
                <img src="dSATA.png" alt="dSATA Logo" style={{ maxWidth: 100 }} />
              </Box>
              <Typography gutterBottom variant="h5" component="div" textAlign="center">
                Signata DAO 1.5X Vote Multiplier
              </Typography>
              <Typography variant="body2" textAlign="center">
                This NFT Right provides a 1.5X multiplier on Signata DAO votes. Only eligible addresses can claim this NFT.
              </Typography>
              <Chip
                size="large"
                color="default"
                variant="outlined"
                icon={<CloseIcon />}
                label="Identity does not own this NFT Right"
                sx={{ borderRadius: 0 }}
              />
            </Stack>
          </Box>
        )}
        <Box
          sx={{
            textAlign: 'center',
            border: 1,
            p: 2,
            borderRadius: 2,
            borderColor: 'secondary.light',
            backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            display: identityExists && !has15XToken && account === id && account ? '' : 'none',
          }}
        >
          <Stack spacing={1}>
            <Box sx={{ textAlign: 'center' }}>
              <img src="dSATA.png" alt="dSATA Logo" style={{ maxWidth: 100 }} />
            </Box>
            <Typography gutterBottom variant="h5" component="div" textAlign="center">
              Signata DAO 1.5X Vote Multiplier
            </Typography>
            <Typography variant="body2" textAlign="center">
              This NFT Right provides a 1.5X multiplier on Signata DAO votes. Only eligible addresses can claim this NFT.
            </Typography>
            <ButtonGroup orientation="horizontal" color="secondary" fullWidth size="large">
              <Button
                onClick={handleClickClaimModifier15X}
                variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
                disabled={isLoading}
              >
                Claim NFT
              </Button>
            </ButtonGroup>
            <LoadingState state={modifier15XState} />
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}

export default Rights;
