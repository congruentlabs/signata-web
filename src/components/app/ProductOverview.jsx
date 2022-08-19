import React from 'react';
import {
  Typography,
  Stack,
  Button,
  Box,
  CardContent,
  Grid,
} from '@mui/material';

function ProductOverview() {
  return (
    <Grid item xs={12} sm={10} md={8}>
      <Box
        sx={{
          minHeight: {
            md: 300,
          },
          borderRadius: 0,
          border: 1,
        }}
      >
        <CardContent>
          <Stack spacing={1}>
            <Typography textAlign="center">
              <img src="/logo.png" alt="logo" width="100" style={{ textAlign: 'center' }} />
            </Typography>
            <Typography variant="h4" textAlign="center">
              Welcome to the Signata Web3 Identity Manager
            </Typography>
            <Typography variant="body1">
              Blockchain technology is a powerful new means to build distributed
              and self-sovereign systems. Create and manage your online
              identities with Signata, and take control of your online future.
            </Typography>
            <Typography variant="h6" textAlign="center">Built on IPFS</Typography>
            <Typography variant="body1">
              Blockchain and smart contract technology provides the tools for
              self-sovereignty for online systems. No central services that can
              control or remove your access. If you can access a smart contract
              network, you can use Signata.
            </Typography>
            <Button
              target="_blank"
              href="https://docs.signata.net"
              variant="text"
              color="primary"
            >
              Read the Docs
            </Button>
            <Typography variant="h6" textAlign="center">
              Community Controlled
            </Typography>
            <Typography variant="body1">
              Signata is controlled by the Signata Decentralized Autonomous
              Organization (Signata DAO), not by Big Tech or Governments. Join the
              ecosystem to have your say and build a better online future.
            </Typography>
            <Button
              target="_blank"
              href="https://docs.signata.net/guides/dao-guide"
              variant="text"
              color="primary"
            >
              Learn More
            </Button>
          </Stack>
        </CardContent>
      </Box>
    </Grid>
  );
}

export default ProductOverview;
