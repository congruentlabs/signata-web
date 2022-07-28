import React from 'react';
import { Typography, Stack } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';

import { fNumber } from '../../utils/formats';

export function NetworkServices({ services }) {
  return (
    <Stack spacing={1}>
      <Typography variant="h6" textAlign="center">
        Network Services
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Network</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Jurisdiction</TableCell>
            <TableCell align="right">Total Staked</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!services || services.length === 0) && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No Network Services Detected!
              </TableCell>
            </TableRow>
          )}
          {services
            && services.map((broker) => (
              <TableRow key={broker.id}>
                <TableCell align="left">{broker.name}</TableCell>
                <TableCell align="center">
                  <Chip label={broker.type} size="small" />
                </TableCell>
                <TableCell align="center">
                  <Chip label={broker.network} size="small" />
                </TableCell>
                <TableCell align="center">
                  <Chip label={broker.status} size="small" color={broker.status === 'Active' ? 'success' : ''} />
                </TableCell>
                <TableCell align="center">{broker.jurisdiction}</TableCell>
                {broker.type === 'Broker' ? (
                  <TableCell align="right">
                    {broker.staked && fNumber(broker.staked)}
                    {' '}
                    SATA
                  </TableCell>
                ) : (
                  <TableCell align="right">N/A</TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Stack>
  );
}

export default NetworkServices;
