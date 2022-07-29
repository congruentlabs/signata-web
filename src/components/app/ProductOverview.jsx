import React from 'react';
import {
  Typography,
  Stack,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

function ProductOverview() {
  return (
    <Grid item xs={12} sm={8}>
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography textAlign="center">
              <img src="/logo.png" alt="logo" width="100" style={{ textAlign: 'center' }} />
            </Typography>
            <Typography variant="h4">
              Welcome to Signata, your Web3 Identity Manager
            </Typography>
            <Typography variant="body1">
              Blockchain technology is a powerful new means to build distributed
              and self-sovereign systems. Create and manage your online
              identities with Signata, and take control of your online future.
            </Typography>
            <Typography variant="h6">Built on IPFS</Typography>
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
              color="secondary"
            >
              Read the Docs
            </Button>
            <Typography variant="h6">
              Decentralized Governance for a Decentralized Solution
            </Typography>
            <Typography variant="body1">
              Signata is controlled by the Signata Decentralized Autonomous
              Organization (DAO), not by Big Tech or Governments. Join the
              ecosystem to have your say and build a better online future.
            </Typography>
            <Button
              target="_blank"
              href="https://sata.technology/vote"
              variant="text"
              color="secondary"
            >
              Learn More
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default ProductOverview;
