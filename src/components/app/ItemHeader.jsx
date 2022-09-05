import React from 'react';
import {
  Avatar, Stack, Paper, useTheme, Typography,
} from '@mui/material';

function ItemHeader({ text, colored, logo }) {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        py: 1,
        borderRadius: 0,
        borderBottom: 1,
        boxShadow: 'none',
        backgroundColor: colored ? theme.palette.secondary.dark : theme.palette.grey[900],
        color: theme.palette.secondary.contrastText,
      }}
    >
      <Stack direction="row" spacing={1} justifyContent="center">
        {logo && (
          <Avatar
            src={logo}
            style={{
              height: 24, width: 24,
            }}
          />
        )}
        <Typography>{text}</Typography>
      </Stack>
    </Paper>
  );
}

export default ItemHeader;
