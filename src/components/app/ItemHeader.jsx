import React from 'react';
import { Paper, useTheme } from '@mui/material';

function ItemHeader({ text, colored }) {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        textAlign: 'center',
        py: 1,
        borderRadius: 0,
        borderBottom: 1,
        boxShadow: 'none',
        backgroundColor: colored ? theme.palette.secondary.dark : theme.palette.grey[900],
        color: theme.palette.secondary.contrastText,
      }}
    >
      {text}
    </Paper>
  );
}

export default ItemHeader;
