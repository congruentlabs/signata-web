import React from 'react';
import { Typography, Alert, AlertTitle, Stack, Button } from '@mui/material';

export function NetworkServices() {
  return (
    <Stack spacing={1} paddingTop={4}>
      <Typography variant="h4">Welcome to Signata, the future of Online Identity</Typography>
      <Typography variant="body1">
        Blockchain technology is a powerful new means to build distributed and self-sovereign systems. Create and manage
        your online identities with Signata, and take control of your online life.
      </Typography>
      <Typography variant="h6">Built on Web3</Typography>
      <Typography variant="body1">
        Blockchain and smart contract technology provides the tools for self-sovereignty for online systems. No central
        services that can control or remove your access. If you can access a smart contract network, you can use
        Signata.
      </Typography>
      <Button
        target="_blank"
        href="https://sata.technology/sata-whitepaper-2021-03-24.pdf"
        variant="text"
        color="secondary"
      >
        Read the Whitepaper
      </Button>
      <Typography variant="h6">A Platform to Build On</Typography>
      <Typography variant="body1">
        An identity is only as valuable as the services it can be used within. Start integrating Signata identities into
        your products and services today.
      </Typography>
      <Button target="_blank" href="https://docs.signata.net" variant="text" color="secondary">
        Read the Docs
      </Button>
      <Typography variant="h6">Decentralized Governance for a Decentralized Solution</Typography>
      <Typography variant="body1">
        Signata is controlled by the Signata Decentralized Autonomous Organization (DAO), not by Big Tech or
        Governments. Join the ecosystem to have your say and build a better online future.
      </Typography>
      <Button target="_blank" href="https://sata.technology/vote" variant="text" color="secondary">
        Learn More
      </Button>
    </Stack>
  );
}

export default NetworkServices;
