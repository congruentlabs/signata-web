import React from "react";
import { formatUnits } from '@ethersproject/units';
import { Alert, Typography, Grid, AlertTitle } from "@mui/material";

import { fNumber, fCurrency } from '../../utils/formats';

export function TokenInfo({ sataBalance, dSataBalance, chainId, sataPriceData, dSataPriceData, ethPrice }) {
  return (
    <>
      <Grid item xs={12} textAlign="left">
        <Typography variant="h5" gutterBottom>
          Your Signata Tokens
        </Typography>
        {sataBalance && sataBalance < 1 && (
          <Alert severity="warning">
            <AlertTitle>{fNumber(formatUnits(sataBalance || 0, 18))} SATA ({fCurrency(formatUnits(sataBalance || 0, 18) * sataPriceData.token.derivedETH * ethPrice)} USD)</AlertTitle>
            You don&apos;t hold any SATA tokens. You can manage your identities, but you may not be able to purchase rights to services.
          </Alert>
        )}
        {sataBalance && sataBalance > 0 && (
          <Alert severity="success">
          <AlertTitle>{fNumber(formatUnits(sataBalance || 0, 18))} SATA ({fCurrency(formatUnits(sataBalance || 0, 18) * sataPriceData.token.derivedETH * ethPrice)} USD)</AlertTitle>
            You hold SATA tokens. You can use these to purchase rights to services.
          </Alert>
        )}
      </Grid>
      {chainId === 1 && (
        <Grid item xs={12} textAlign="left">
          {dSataBalance && dSataBalance < 1 && dSataPriceData && dSataPriceData.token && (
            <Alert severity="info">
              <AlertTitle>{fNumber(formatUnits(dSataBalance || 0, 18))} dSATA ({fCurrency(formatUnits(dSataBalance || 0, 18) * dSataPriceData.token.derivedETH * ethPrice)} USD)</AlertTitle>
              You don&apos;t hold any dSATA tokens. You won&apos;t be able to vote in the Signata DAO.
            </Alert>
          )}
          {dSataBalance && dSataBalance > 0 && dSataPriceData && dSataPriceData.token && (
            <Alert severity="success">
            <AlertTitle>{fNumber(formatUnits(dSataBalance || 0, 18))} dSATA ({fCurrency(formatUnits(dSataBalance || 0, 18) * dSataPriceData.token.derivedETH * ethPrice)} USD)</AlertTitle>
              You hold dSATA tokens. You can use these to vote in the Signata DAO.
            </Alert>
          )}
        </Grid>
      )}
    </>
  );
}

export default TokenInfo;
