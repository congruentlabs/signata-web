import React from 'react';
import { Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

function ItemHeader({ text }) {
  return (
    <Typography
      variant="h6"
      align="center"
      sx={{
        background: grey[300],
        fontFamily: 'Roboto Condensed',
        borderBottom: 1,
        borderColor: grey[600],
      }}
    >
      {text}
    </Typography>
  );
}

export default ItemHeader;
