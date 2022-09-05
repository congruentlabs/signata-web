import React from 'react';
import { Paper, useTheme } from '@mui/material';

function ItemHeader({ text }) {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        textAlign: 'center',
        py: 1,
        borderRadius: 0,
        borderBottom: 1,
        boxShadow: 'none',
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.contrastText,
      }}
    >
      {text}
    </Paper>
  );
}

export default ItemHeader;
