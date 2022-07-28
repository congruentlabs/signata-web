import React from 'react';
import { formatUnits } from '@ethersproject/units';
import {
  Alert, Typography, Grid, AlertTitle, Stack,
} from '@mui/material';

import { fNumber, fCurrency } from '../../utils/formats';

export function TokenInfo({
  sataBalance, dSataBalance, chainId, sataPriceData, dSataPriceData, ethPrice,
}) {
  if (chainId === 1) {
    // Ethereum mainnet
    return (
      <Stack spacing={1}>
        <Typography variant="h6" textAlign="center">
          Your Ethereum SATA Holdings
        </Typography>
        {sataBalance && sataBalance < 1 && (
          <Alert severity="warning">
            <AlertTitle>
              {fNumber(formatUnits(sataBalance || 0, 18))}
              {' '}
              SATA (
              {fCurrency(formatUnits(sataBalance || 0, 18) * sataPriceData.token.derivedETH * ethPrice)}
              {' '}
              USD)
            </AlertTitle>
            You don&apos;t hold any SATA tokens. You can manage your identities, but you may not be able to purchase
            rights to services or interact with identity brokers.
          </Alert>
        )}
        {sataBalance && sataBalance > 0 && (
          <Alert severity="success">
            <AlertTitle>
              {fNumber(formatUnits(sataBalance || 0, 18))}
              {' '}
              SATA (
              {fCurrency(formatUnits(sataBalance || 0, 18) * sataPriceData.token.derivedETH * ethPrice)}
              {' '}
              USD)
            </AlertTitle>
            You hold SATA tokens. You can use these to purchase rights to services.
          </Alert>
        )}
        {dSataBalance && dSataBalance < 1 && dSataPriceData && dSataPriceData.token && (
          <Alert severity="info">
            <AlertTitle>
              {fNumber(formatUnits(dSataBalance || 0, 18))}
              {' '}
              dSATA (
              {fCurrency(formatUnits(dSataBalance || 0, 18) * dSataPriceData.token.derivedETH * ethPrice)}
              {' '}
              USD)
            </AlertTitle>
            You don&apos;t hold any dSATA tokens. You won&apos;t be able to vote in the Signata DAO.
          </Alert>
        )}
        {dSataBalance && dSataBalance > 0 && dSataPriceData && dSataPriceData.token && (
          <Alert severity="success">
            <AlertTitle>
              {fNumber(formatUnits(dSataBalance || 0, 18))}
              {' '}
              dSATA (
              {fCurrency(formatUnits(dSataBalance || 0, 18) * dSataPriceData.token.derivedETH * ethPrice)}
              {' '}
              USD)
            </AlertTitle>
            You hold dSATA tokens. You can use these to vote in the Signata DAO.
          </Alert>
        )}
      </Stack>
    );
  }

  if (chainId === 56) {
    // Binance Smart Chain mainnet
    return (
      <Stack spacing={1}>
        <Typography variant="h6" textAlign="center">
          Your BSC SATA Holdings
        </Typography>
        {sataBalance && sataBalance < 1 && (
          <Alert severity="warning">
            <AlertTitle>
              {fNumber(formatUnits(sataBalance || 0, 18))}
              {' '}
              SATA (
              {fCurrency(formatUnits(sataBalance || 0, 18) * sataPriceData.token.derivedETH * ethPrice)}
              {' '}
              USD)
            </AlertTitle>
            You don&apos;t hold any SATA tokens. You can manage your identities, but you may not be able to purchase
            rights to services or interact with identity brokers.
          </Alert>
        )}
        {sataBalance && sataBalance > 0 && (
          <Alert severity="success">
            <AlertTitle>
              {fNumber(formatUnits(sataBalance || 0, 18))}
              {' '}
              SATA (
              {fCurrency(formatUnits(sataBalance || 0, 18) * sataPriceData.token.derivedETH * ethPrice)}
              {' '}
              USD)
            </AlertTitle>
            You hold SATA tokens. You can use these to purchase rights to services.
          </Alert>
        )}
      </Stack>
    );
  }

  if (chainId === 43114) {
    // Avalance C-Chain mainnet
    return (
      <Stack spacing={1}>
        <Typography variant="h6" textAlign="center">
          Your AVAX SATA Holdings
        </Typography>
        {sataBalance && sataBalance < 1 && (
          <Alert severity="warning">
            <AlertTitle>
              {fNumber(formatUnits(sataBalance || 0, 18))}
              {' '}
              SATA (
              {fCurrency(formatUnits(sataBalance || 0, 18) * sataPriceData.token.derivedETH * ethPrice)}
              {' '}
              USD)
            </AlertTitle>
            You don&apos;t hold any SATA tokens. You can manage your identities, but you may not be able to purchase
            rights to services or interact with identity brokers.
          </Alert>
        )}
        {sataBalance && sataBalance > 0 && (
          <Alert severity="success">
            <AlertTitle>
              {fNumber(formatUnits(sataBalance || 0, 18))}
              {' '}
              SATA (
              {fCurrency(formatUnits(sataBalance || 0, 18) * sataPriceData.token.derivedETH * ethPrice)}
              {' '}
              USD)
            </AlertTitle>
            You hold SATA tokens. You can use these to purchase rights to services.
          </Alert>
        )}
      </Stack>
    );
  }

  if (chainId === 1088) {
    // Metis Andromeda mainnet
    return (
      <Stack spacing={1}>
        <Typography variant="h6" textAlign="center">
          Your Metis SATA Holdings
        </Typography>
        {sataBalance && sataBalance < 1 && (
          <Alert severity="warning">
            <AlertTitle>
              {fNumber(formatUnits(sataBalance || 0, 18))}
              {' '}
              SATA (
              {fCurrency(formatUnits(sataBalance || 0, 18) * sataPriceData.token.derivedETH * ethPrice)}
              {' '}
              USD)
            </AlertTitle>
            You don&apos;t hold any SATA tokens. You can manage your identities, but you may not be able to purchase
            rights to services or interact with identity brokers.
          </Alert>
        )}
        {sataBalance && sataBalance > 0 && (
          <Alert severity="success">
            <AlertTitle>
              {fNumber(formatUnits(sataBalance || 0, 18))}
              {' '}
              SATA (
              {fCurrency(formatUnits(sataBalance || 0, 18) * sataPriceData.token.derivedETH * ethPrice)}
              {' '}
              USD)
            </AlertTitle>
            You hold SATA tokens. You can use these to purchase rights to services.
          </Alert>
        )}
      </Stack>
    );
  }

  if (chainId === 250) {
    // Fantom Opera mainnet
    return (
      <Stack spacing={1}>
        <Typography variant="h6" textAlign="center">
          Your Fantom SATA Holdings
        </Typography>
        {sataBalance && sataBalance < 1 && (
          <Alert severity="warning">
            <AlertTitle>
              {fNumber(formatUnits(sataBalance || 0, 18))}
              {' '}
              SATA (
              {fCurrency(formatUnits(sataBalance || 0, 18) * sataPriceData.token.derivedETH * ethPrice)}
              {' '}
              USD)
            </AlertTitle>
            You don&apos;t hold any SATA tokens. You can manage your identities, but you may not be able to purchase
            rights to services or interact with identity brokers.
          </Alert>
        )}
        {sataBalance && sataBalance > 0 && (
          <Alert severity="success">
            <AlertTitle>
              {fNumber(formatUnits(sataBalance || 0, 18))}
              {' '}
              SATA (
              {fCurrency(formatUnits(sataBalance || 0, 18) * sataPriceData.token.derivedETH * ethPrice)}
              {' '}
              USD)
            </AlertTitle>
            You hold SATA tokens. You can use these to purchase rights to services.
          </Alert>
        )}
      </Stack>
    );
  }

  return '';
}

export default TokenInfo;
