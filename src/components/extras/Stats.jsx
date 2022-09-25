import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Paper,
} from '@mui/material';
import { useTokenBalance } from '@usedapp/core';
import axios from 'axios';
import { formatUnits } from '@ethersproject/units';
import {
  getKycClaimContractAddress,
  getRightsContract,
  getRightsContractAddress,
  getSata100ContractAddress,
  getTokenContractAddress,
  useGetSingleValue,
} from '../../hooks/chainHooks';
import { fNumber } from '../../hooks/helpers';

function Stats({ chainId }) {
  const [totalRightsStr, setTotalRightsStr] = useState('Loading...');
  const [totalSchemasStr, setTotalSchemasStr] = useState('Loading...');
  const [totalKycNftsStr, setTotalKycNftsStr] = useState('Loading...');
  const [total100NftsStr, setTotal100NftsStr] = useState('Loading...');
  const [kycSchemaData, setKycSchemaData] = useState(undefined);
  const rightsContractAddress = getRightsContractAddress(chainId);
  const rightsContract = getRightsContract(chainId);
  const claimKycContractAddress = getKycClaimContractAddress(chainId);
  const sata100ContractAddress = getSata100ContractAddress(chainId);
  const tokenAddress = getTokenContractAddress(chainId);
  const claimKycBalance = useTokenBalance(tokenAddress, claimKycContractAddress);
  const claim100Balance = useTokenBalance(tokenAddress, sata100ContractAddress);

  const totalRights = useGetSingleValue('totalSupply', [], rightsContractAddress, rightsContract);
  const totalSchemas = useGetSingleValue('totalSchemas', [], rightsContractAddress, rightsContract);
  const kycNftURI = useGetSingleValue('tokenURI', [3], rightsContractAddress, rightsContract);
  const totalKycNfts = useGetSingleValue(
    'totalMintedFor',
    [2],
    rightsContractAddress,
    rightsContract,
  );
  const total100Nfts = useGetSingleValue(
    'totalMintedFor',
    [3],
    rightsContractAddress,
    rightsContract,
  );

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const response = await axios.get(kycNftURI);
        const { data } = response;
        console.log(data);
        setKycSchemaData(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (kycNftURI) {
      fetchKyc();
    }
  }, [kycNftURI]);

  useEffect(() => {
    if (totalRights) {
      setTotalRightsStr(totalRights.toString());
    }
  }, [totalRights]);

  useEffect(() => {
    if (totalSchemas) {
      setTotalSchemasStr(totalSchemas.toString());
    }
  }, [totalSchemas]);

  useEffect(() => {
    if (totalKycNfts) {
      setTotalKycNftsStr(totalKycNfts.toString());
    }
  }, [totalKycNfts]);

  useEffect(() => {
    if (total100Nfts) {
      setTotal100NftsStr(total100Nfts.toString());
    }
  }, [total100Nfts]);

  return (
    <Container maxWidth="sm">
      <Stack spacing={2} sx={{ pt: 2 }}>
        <Typography variant="h3" component="i" color="primary.main">
          Signata Statistics
        </Typography>
        <Typography variant="subtitle" color="text.secondary">
          Data shown is only for the network you are currently connected to
        </Typography>
        <Paper
          sx={{
            p: 1,
          }}
        >
          <Typography variant="h6" component="h3">
            Total NFT Rights Minted on this Network
          </Typography>
          <Typography variant="h1" component="i" color="primary.main">
            {totalRightsStr}
          </Typography>
        </Paper>
        <Paper
          sx={{
            p: 1,
          }}
        >
          <Typography variant="h6" component="h3">
            Total NFT Schemas Minted on this Network
          </Typography>
          <Typography variant="h1" component="i" color="primary.main">
            {totalSchemasStr}
          </Typography>
        </Paper>
        {kycSchemaData && (
          <Card
            sx={{
              display: 'flex',
              textAlign: 'left',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h5">
                  NFT Schema:
                  {' '}
                  {kycSchemaData.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                  {kycSchemaData.description}
                </Typography>
                <Typography variant="h4" component="i" color="primary.main">
                  Total Minted:
                  {' '}
                  {totalKycNftsStr}
                </Typography>
              </CardContent>
            </Box>
            <CardMedia
              component="img"
              sx={{
                width: { xs: 100, sm: 150 },
                height: { xs: 100, sm: 150 },
                p: { xs: 1, sm: 1 },
              }}
              image={kycSchemaData.image}
              alt="KYC NFT Image"
            />
          </Card>
        )}
        {claimKycBalance && (
          <Paper
            sx={{
              p: 1,
            }}
          >
            <Typography variant="h6" component="h3">
              Total Fees Collected for KYC NFTs
            </Typography>
            <Typography variant="h5" component="i" color="primary.main">
              {fNumber(formatUnits(claimKycBalance, 18))}
              {' '}
              SATA
            </Typography>
          </Paper>
        )}
        {total100Nfts && (
          <Card
            sx={{
              display: 'flex',
              textAlign: 'left',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h5">
                  NFT Schema: SATA 100 Membership
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                  SATA 100 Membership NFT issued by Congruent Labs Pty Ltd. This right does not do
                  anything, it is only used for showcasing.
                </Typography>
                <Typography variant="h4" component="i" color="primary.main">
                  Total Minted:
                  {' '}
                  {total100NftsStr}
                </Typography>
              </CardContent>
            </Box>
            <CardMedia
              component="img"
              sx={{
                width: { xs: 100, sm: 150 },
                height: { xs: 100, sm: 150 },
                p: { xs: 1, sm: 1 },
              }}
              image="sata-100.png"
              alt="KYC NFT Image"
            />
          </Card>
        )}
        {claim100Balance && (
          <Paper
            sx={{
              p: 1,
            }}
          >
            <Typography variant="h6" component="h3">
              Total Fees Collected for SATA 100 NFTs
            </Typography>
            <Typography variant="h5" component="i" color="primary.main">
              {fNumber(formatUnits(claim100Balance, 18))}
              {' '}
              SATA
            </Typography>
          </Paper>
        )}
        <Box sx={{ pt: 10 }}>
          <Box sx={{ textAlign: 'center' }}>
            <img
              src="hoodie.jpg"
              alt="SATA 100 Merch"
              style={{
                maxWidth: 300,
                borderRadius: 8,
                border: 2,
                borderColor: 'primary.light',
              }}
            />
          </Box>
          <Button
            href="https://store.signata.net/"
            target="_blank"
            variant="contained"
            color="primary"
          >
            Get SATA 100 Merch
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}

export default Stats;
