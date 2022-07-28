import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

function SubgraphProvider({ children }) {
  const client = new ApolloClient({
    cache: new InMemoryCache({}),
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export { SubgraphProvider, ApolloProvider };
