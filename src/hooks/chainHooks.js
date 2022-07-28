/* eslint-disable prefer-template */
/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useContractFunction, useCall, useBlockNumber } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import sataContractAbi from './sataAbi.json';
import identityContractAbi from './identityAbi.json';
import rightsContractAbi from './rightsAbi.json';

const sataPriceQuery = gql`
  {
    token(id: "0x3ebb4a4e91ad83be51f8d596533818b246f4bee1") {
      totalSupply
      tradeVolumeUSD
      untrackedVolumeUSD
      totalLiquidity
      derivedETH
    }
  }
`;

const dSataPriceQuery = gql`
  {
    token(id: "0x49428f057dd9d20a8e4c6873e98afd8cd7146e3b") {
      totalSupply
      tradeVolumeUSD
      untrackedVolumeUSD
      totalLiquidity
      derivedETH
    }
  }
`;

const sataContractAddress = '0x3ebb4A4e91Ad83BE51F8d596533818b246F4bEe1';
const sataContract = new Contract(sataContractAddress, sataContractAbi);
const identityContractAddress = '0x6B47e26A52a9B5B467b98142E382c081eA97B0fc';
const identityContract = new Contract(
  identityContractAddress,
  identityContractAbi,
);
const rightsContractAddress = '0x7c8890a02abd24ff00c4eb1425258ea4b611d300';
const rightsContract = new Contract(rightsContractAddress, rightsContractAbi);

export function useUniswapSataPriceData() {
  // const { account } = useEthers();
  const { data } = useQuery(sataPriceQuery, {});
  return data;
}

export function useUniswapDSataPriceData() {
  // const { account } = useEthers();
  const { data } = useQuery(dSataPriceQuery, {});
  return data;
}

export function useCreateIdentity() {
  const {
    state, send, events, resetState,
  } = useContractFunction(
    identityContract,
    'create',
    {
      transactionName: 'Create Signata Identity',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useDeleteIdentity() {
  const {
    state, send, events, resetState,
  } = useContractFunction(
    identityContract,
    'delete',
    {
      transactionName: 'Delete Signata Identity',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useMigrateIdentity() {
  const {
    state, send, events, resetState,
  } = useContractFunction(
    identityContract,
    'migrate',
    {
      transactionName: 'Migrate Signata Identity',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useLockIdentity() {
  const {
    state, send, events, resetState,
  } = useContractFunction(
    identityContract,
    'lock',
    {
      transactionName: 'Lock Signata Identity',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useUnlockIdentity() {
  const {
    state, send, events, resetState,
  } = useContractFunction(
    identityContract,
    'unlock',
    {
      transactionName: 'Unlock Signata Identity',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useBuyCloud() {
  const {
    state, send, events, resetState,
  } = useContractFunction(
    identityContract,
    'buyCloud',
    {
      transactionName: 'Buy Cloud Subscription',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export const useGetSingleValue = (method) => {
  const { value, error } = useCall(
    identityContractAddress && {
      contract: identityContract,
      method,
      args: [],
    },
  ) ?? {};
  if (error) {
    console.error(error.message);
    return {};
  }
  return value?.[0];
};

// these cg price hooks have been copied across from usedapp, as they're using
// an incompatible version of react with what's used in this app right now

// get price from token contract
export const getCoingeckoSimpleTokenPriceUri = (
  contract,
  quoteId,
  platformId,
) => `https://api.coingecko.com/api/v3/simple/token_price/${platformId}?contract_addresses=${contract}&vs_currencies=${quoteId}`;

export const fetchCoingeckoTokenPrice = (fetchFunction) => async (contract, quote, platform) => {
  try {
    const addr = contract.toLowerCase();
    const quoteId = quote.toLowerCase();
    const platformId = platform.toLowerCase();
    const url = getCoingeckoSimpleTokenPriceUri(addr, quoteId, platformId);
    const data = await fetchFunction(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await data.json();
    const price = result[addr][quoteId];
    return price ? price + '' : undefined;
  } catch (_) {
    return undefined;
  }
};

export const getCoingeckoTokenPrice = fetchCoingeckoTokenPrice(
  typeof window !== 'undefined' && window.fetch,
);

export const getCoingeckoSimplePriceUri = (baseId, quoteId) => `https://api.coingecko.com/api/v3/simple/price?ids=${baseId}&vs_currencies=${quoteId}`;

export const fetchCoingeckoPrice = (fetchFunction) => async (base, quote) => {
  try {
    const baseId = base.toLowerCase();
    const quoteId = quote.toLowerCase();
    const url = getCoingeckoSimplePriceUri(baseId, quoteId);
    const data = await fetchFunction(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await data.json();
    const price = result[baseId][quoteId];
    return price ? price + '' : undefined;
  } catch (_) {
    return undefined;
  }
};

export const getCoingeckoPrice = fetchCoingeckoPrice(
  typeof window !== 'undefined' && window.fetch,
);

export const useCoingeckoPrice = (base, quote = 'usd') => {
  const [price, setPrice] = useState(undefined);
  const blockNo = useBlockNumber();

  useEffect(() => {
    async function getPrice() {
      const tokenPrice = await getCoingeckoPrice(base, quote);
      setPrice(tokenPrice);
    }

    getPrice();
  }, [base, quote, blockNo]);

  return price;
};

export const useCoingeckoTokenPrice = (
  contract,
  quote = 'usd',
  platform = 'ethereum',
) => {
  const [price, setPrice] = useState(undefined);
  const blockNo = useBlockNumber();

  useEffect(() => {
    async function getPrice() {
      const tokenPrice = await getCoingeckoTokenPrice(
        contract,
        quote,
        platform,
      );
      setPrice(tokenPrice);
    }

    getPrice();
  }, [contract, quote, platform, blockNo]);

  return price;
};
