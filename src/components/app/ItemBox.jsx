import React from 'react';
import { Box } from '@mui/material';

function ItemHeader(props) {
  const { children } = props;
  return (
    <Box
      sx={{
        borderRadius: 0,
        border: 1,
      }}
    >
      {children}
    </Box>
  );
}

export default ItemHeader;
