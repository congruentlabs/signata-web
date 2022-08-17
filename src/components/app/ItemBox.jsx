import React from 'react';
import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';

function ItemHeader(props) {
  const { children } = props;
  return (
    <Box
      sx={{
        minHeight: {
          md: 300,
        },
        borderRadius: 0,
        border: 1,
        borderColor: grey[600],
        backgroundColor: grey[50],
      }}
    >
      {children}
    </Box>
  );
}

export default ItemHeader;
