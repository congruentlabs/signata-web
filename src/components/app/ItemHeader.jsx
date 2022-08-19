import React from 'react';
import { Paper } from '@mui/material';

function ItemHeader({ text }) {
  return (
    <Paper sx={{
      textAlign: 'center', py: 1, borderRadius: 0, borderBottom: 1, boxShadow: 'none',
    }}
    >
      <b>{text}</b>
    </Paper>
  );
}

export default ItemHeader;
